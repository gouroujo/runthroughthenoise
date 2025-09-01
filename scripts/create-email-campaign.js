#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const Mailjet = require('node-mailjet')
const { remark } = require('remark')
const remarkHtml = require('remark-html').default

// Configuration
const NEWSLETTERS_DIR = path.join(process.cwd(), 'newsletters')
const BASE_URL = 'https://runthroughthenoise.com'
const CONTACTS_LIST_ID = process.env.MAILJET_CONTACTS_LIST_ID || 10557171 // Set your Mailjet contacts list ID here

// Mailjet configuration - only validate when creating campaigns
let mailjet = null
if (process.env.MAILJET_API_KEY && process.env.MAILJET_API_SECRET) {
  mailjet = new Mailjet({
    apiKey: process.env.MAILJET_API_KEY,
    apiSecret: process.env.MAILJET_API_SECRET
  })
}

function convertMarkdownToHtml(markdown) {
  try {
    const result = remark()
      .use(remarkHtml)
      .processSync(markdown)
    
    return result.toString()
  } catch (error) {
    console.error('Error converting markdown to HTML:', error.message)
    throw error
  }
}

function createEmailHtmlTemplate(htmlContent, title) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .email-container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
            margin-bottom: 30px;
        }
        h2 {
            color: #2c3e50;
            margin-top: 30px;
            margin-bottom: 15px;
        }
        h3 {
            color: #34495e;
            margin-top: 25px;
            margin-bottom: 10px;
        }
        h4 {
            color: #34495e;
            margin-top: 20px;
            margin-bottom: 10px;
        }
        a {
            color: #3498db;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        .read-more {
            display: inline-block;
            background-color: #3498db;
            color: white !important;
            padding: 8px 16px;
            border-radius: 4px;
            text-decoration: none;
            margin-top: 10px;
            font-weight: 500;
        }
        .read-more:hover {
            background-color: #2980b9;
            text-decoration: none;
        }
        hr {
            border: none;
            height: 1px;
            background-color: #e0e0e0;
            margin: 25px 0;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            font-size: 14px;
            color: #666;
        }
        .newsletter-meta {
            font-style: italic;
            color: #666;
            margin-bottom: 20px;
        }
        blockquote {
            border-left: 4px solid #3498db;
            margin: 20px 0;
            padding-left: 20px;
            color: #555;
        }
        .content-section {
            margin-bottom: 30px;
        }
        .travel-emoji {
            font-size: 1.2em;
            margin: 0 4px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        ${htmlContent}
        <div class="footer">
            <p>Thanks for reading Run Through The Noise!</p>
            <p>Follow our journey: <a href="${BASE_URL}">runthroughthenoise.com</a></p>
        </div>
    </div>
</body>
</html>`
}

async function createMailjetCampaignDraft(newsletterFile) {
  if (!mailjet) {
    throw new Error('Mailjet API credentials not configured. Please set MAILJET_API_KEY and MAILJET_API_SECRET environment variables.')
  }
  
  try {
    console.log(`📧 Processing newsletter: ${newsletterFile}`)
    
    // Read the newsletter markdown file
    const newsletterPath = path.join(NEWSLETTERS_DIR, newsletterFile)
    if (!fs.existsSync(newsletterPath)) {
      throw new Error(`Newsletter file not found: ${newsletterPath}`)
    }
    
    const markdownContent = fs.readFileSync(newsletterPath, 'utf-8')
    
    // Extract title from the first line (assuming it starts with # )
    const titleMatch = markdownContent.match(/^#\s+(.+)$/m)
    const title = titleMatch ? titleMatch[1] : `Newsletter ${newsletterFile.replace('.md', '')}`
    
    // Convert markdown to HTML
    console.log('🔄 Converting markdown to HTML...')
    let htmlContent = convertMarkdownToHtml(markdownContent)
    
    // Enhance HTML with better styling for email
    htmlContent = htmlContent
      .replace(/\[Read more →\]\(([^)]+)\)/g, '<a href="$1" class="read-more">Read more →</a>')
      .replace(/<a href="([^"]+)"([^>]*)>([^<]+)<\/a>/g, '<a href="$1" style="color: #3498db; text-decoration: none;">$3</a>')
    
    // Create full HTML email template
    const fullHtmlContent = createEmailHtmlTemplate(htmlContent, title)
    
    // Extract date from filename for subject
    const dateMatch = newsletterFile.match(/(\d{4})(\d{2})(\d{2})\.md/)
    let subjectDate = ''
    if (dateMatch) {
      const year = dateMatch[1]
      const month = new Date(2000, parseInt(dateMatch[2]) - 1, 1).toLocaleDateString('en-US', { month: 'long' })
      subjectDate = ` - ${month} ${year}`
    }
    
    const subject = `${title}${subjectDate}`
    
    console.log('📨 Creating Mailjet campaign draft...')
    
    // Create campaign draft using Mailjet API
    const campaignData = {
      Locale: 'en_US',
      Sender: 'Run Through The Noise',
      SenderEmail: 'hello@runthroughthenoise.com', // Update with your actual sender email
      Subject: subject,
      ContactsListID: CONTACTS_LIST_ID,
      Title: `${title} Campaign Draft`
    }
    
    const campaign = await mailjet
      .post('campaigndraft')
      .request(campaignData)
    
    const campaignId = campaign.body.Data[0].ID
    console.log(`✅ Campaign draft created with ID: ${campaignId}`)
    
    // Set the HTML content
    await mailjet
      .post('campaigndraft')
      .id(campaignId)
      .action("detailcontent")
      .request({
        "Headers":"object",
        'Html-part': fullHtmlContent,
        "MJMLContent":"",
        'Text-part': markdownContent.replace(/[#*_\\[\\]()]/g, ''), // Simple text version
      })
    
    console.log('✅ Campaign content updated successfully!')
    
    // Output campaign details
    console.log('\\n📋 Campaign Details:')
    console.log(`   • Campaign ID: ${campaignId}`)
    console.log(`   • Subject: ${subject}`)
    console.log(`   • Title: ${campaignData.Title}`)
    console.log('\\n🚀 Next steps:')
    console.log('   1. Log in to your Mailjet dashboard')
    console.log('   2. Navigate to Campaigns > Draft campaigns')
    console.log(`   3. Find campaign ID ${campaignId}`)
    console.log('   4. Set the contact list')
    console.log('   5. Review and send the campaign')
    
    return {
      campaignId,
      subject,
      title: campaignData.Title
    }
    
  } catch (error) {
    console.error('❌ Error creating Mailjet campaign:', error.message)
    if (error.response) {
      console.error('Response data:', JSON.stringify(error.response.body, null, 2))
    }
    throw error
  }
}

async function main() {
  try {
    const newsletterFile = process.env.NEWSLETTER_FILE
    
    if (!newsletterFile) {
      console.error('❌ NEWSLETTER_FILE environment variable is required')
      process.exit(1)
    }
    
    console.log('🚀 Starting email campaign creation...')
    
    const result = await createMailjetCampaignDraft(newsletterFile)
    
    console.log('\\n🎉 Email campaign draft created successfully!')
    
  } catch (error) {
    console.error('💥 Failed to create email campaign:', error.message)
    process.exit(1)
  }
}

// Run the script
if (require.main === module) {
  main()
}

module.exports = {
  createMailjetCampaignDraft,
  convertMarkdownToHtml
}