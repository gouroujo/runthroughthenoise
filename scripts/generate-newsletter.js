#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Configuration
const CONTENT_DIR = path.join(process.cwd(), 'outstatic', 'content')
const METADATA_PATH = path.join(CONTENT_DIR, 'metadata.json')
const NEWSLETTERS_DIR = path.join(process.cwd(), 'newsletters')
const BASE_URL = 'https://runthroughthenoise.com'

// Content type configurations - only include collections we want in newsletters
const CONTENT_TYPES = {
  posts: {
    collection: 'posts',
    urlPath: 'posts',
    title: 'Blog Posts'
  },
  albums: {
    collection: 'albums', 
    urlPath: 'albums',
    title: 'Albums'
  },
  projects: {
    collection: 'projects',
    urlPath: 'projects', 
    title: 'Projects'
  }
}

async function getLastRunDate() {
  try {
    const newsletters = fs.readdirSync(NEWSLETTERS_DIR)
      .filter(file => file.endsWith('.md'))
      .sort()
      .reverse()
    
    if (newsletters.length === 0) {
      // If no previous newsletters, get content from last 30 days
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return thirtyDaysAgo
    }
    
    // Parse date from filename (YYYYMMDD.md)
    const lastNewsletter = newsletters[0]
    const dateStr = lastNewsletter.replace('.md', '')
    const year = parseInt(dateStr.substring(0, 4))
    const month = parseInt(dateStr.substring(4, 6)) - 1 // JS months are 0-indexed
    const day = parseInt(dateStr.substring(6, 8))
    
    return new Date(year, month, day)
  } catch (error) {
    console.log('No previous newsletters found, checking last 30 days')
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return thirtyDaysAgo
  }
}

function loadMetadata() {
  try {
    const metadataContent = fs.readFileSync(METADATA_PATH, 'utf-8')
    const metadata = JSON.parse(metadataContent)
    return metadata.metadata || []
  } catch (error) {
    console.error('Error loading metadata.json:', error.message)
    return []
  }
}

function extractContentSummary(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    
    // Parse frontmatter and content
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
    const match = content.match(frontmatterRegex)
    
    if (!match) {
      return content.substring(0, 200).trim() + (content.length > 200 ? '...' : '')
    }
    
    const bodyContent = match[2]
    
    // Extract first paragraph for summary
    const paragraphs = bodyContent.trim().split('\n\n')
    let summary = paragraphs[0] || ''
    
    // Clean up summary (remove markdown, limit length)
    summary = summary
      .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Convert links to text
      .replace(/[#*_]/g, '') // Remove basic markdown
      .trim()
    
    if (summary.length > 200) {
      summary = summary.substring(0, 1000) + '...'
    }
    
    return summary
  } catch (error) {
    console.error(`Error extracting summary from ${filePath}:`, error.message)
    return 'Unable to extract content summary.'
  }
}

function getContentSince(lastRunDate) {
  const newContent = {}
  
  // Initialize content arrays
  for (const type of Object.keys(CONTENT_TYPES)) {
    newContent[type] = []
  }
  
  // Load metadata
  const allMetadata = loadMetadata()
  
  for (const item of allMetadata) {
    // Skip if not published
    if (item.status !== 'published') {
      continue
    }
    
    // Skip if not in our tracked content types
    if (!item.collection || !CONTENT_TYPES[item.collection]) {
      continue
    }
    
    // Check if published since last run date
    const publishedDate = new Date(item.publishedAt)
    if (publishedDate <= lastRunDate) {
      continue
    }
    
    const config = CONTENT_TYPES[item.collection]
    const filePath = path.join(process.cwd(), item.__outstatic.path)
    
    try {
      // Extract summary from the actual content file
      const summary = extractContentSummary(filePath)
      
      const url = `${BASE_URL}/${config.urlPath}/${item.slug}`
      
      newContent[item.collection].push({
        title: item.title,
        slug: item.slug,
        url,
        summary,
        publishedAt: item.publishedAt,
        description: item.description || '',
        coverImage: item.coverImage || '',
        author: item.author?.name || 'Anonymous'
      })
    } catch (error) {
      console.error(`Error processing content item ${item.slug}:`, error.message)
    }
  }
  
  // Sort each type by published date (newest first)
  for (const type of Object.keys(CONTENT_TYPES)) {
    newContent[type].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
  }
  
  return newContent
}

async function generateSummaryWithAI(newContent) {
  try {
    // Prepare content for AI summarization
    const contentSummary = Object.entries(newContent)
      .filter(([type, items]) => items.length > 0)
      .map(([type, items]) => {
        const config = CONTENT_TYPES[type]
        return `## ${config.title}\n` + 
          items.map(item => `- **${item.title}**: ${item.summary}\n(${item.url})`).join('\n')
      }).join('\n\n')
    
    if (!contentSummary.trim()) {
      return 'No new content was published since the last newsletter.'
    }
    
    const prompt = `Please create a friendly, engaging newsletter summary of the following new content from a travel blog called "Run Through The Noise". The content includes new blog posts, albums, and projects. Write it in a conversational tone as if you're personally recommending these to readers. Focus on what makes each piece interesting and worth reading:

${contentSummary}

Please provide a brief introduction and then summarize each piece of content in an engaging way. Invite readers to check out the full articles by including the link to the content. Keep it concise and friendly.`
    
    const response = await fetch('https://models.github.ai/inference/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })
    })
    
    if (!response.ok) {
      throw new Error(`GitHub Models API error: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error('Error generating AI summary:', error.message)
    return 'Failed to generate AI summary. Please see the content list below.'
  }
}

async function generateNewsletter(newContent, lastRunDate) {
  const today = new Date()
  const filename = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}.md`
  
  // Check if any new content exists
  const hasNewContent = Object.values(newContent).some(items => items.length > 0)
  
  if (!hasNewContent) {
    console.log('No new content found since last run. Skipping newsletter generation.')
    return
  }
  
  // Generate AI summary
  console.log('Generating AI summary...')
  const aiSummary = await generateSummaryWithAI(newContent)
  
  let newsletter = `# Newsletter - ${today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\n\n`
  newsletter += `*Content published since ${lastRunDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}*\n\n`
  
  // Add AI summary
  newsletter += `${aiSummary}\n\n`
  
  // Add footer
  newsletter += `---\n\n`
  newsletter += `*This newsletter was automatically generated on ${today.toISOString().split('T')[0]}*\n`
  
  // Ensure newsletters directory exists
  if (!fs.existsSync(NEWSLETTERS_DIR)) {
    fs.mkdirSync(NEWSLETTERS_DIR, { recursive: true })
  }
  
  const newsletterPath = path.join(NEWSLETTERS_DIR, filename)
  fs.writeFileSync(newsletterPath, newsletter)
  
  console.log(`Newsletter generated: ${filename}`)
  console.log(`Total items: ${Object.values(newContent).reduce((sum, items) => sum + items.length, 0)}`)
}

async function main() {
  try {
    console.log('Starting newsletter generation...')
    
    const lastRunDate = await getLastRunDate()
    console.log(`Checking for content since: ${lastRunDate.toISOString()}`)
    
    const newContent = getContentSince(lastRunDate)
    
    await generateNewsletter(newContent, lastRunDate)
    
    console.log('Newsletter generation completed!')
  } catch (error) {
    console.error('Error generating newsletter:', error)
    process.exit(1)
  }
}

main()