# Newsletter Generation Script

This script automatically generates monthly newsletters summarizing new content from your blog using Outstatic CMS metadata.

## How it works

1. **Content Detection**: Uses `outstatic/content/metadata.json` to find published content since the last newsletter
2. **Content Filtering**: Only includes content with `status: "published"` from collections: posts, albums, projects
3. **Content Loading**: Uses `__outstatic.path` to load actual content files for summary extraction
4. **AI Summarization**: Uses GitHub Models API to generate engaging summaries of the new content
5. **Newsletter Creation**: Creates a markdown file in `newsletters/` with format `YYYYMMDD.md`

## Manual Usage

To generate a newsletter manually:

```bash
node scripts/generate-newsletter.js
```

## Automated Usage

The GitHub Action `.github/workflows/monthly-newsletter.yml` runs:
- Monthly on the 1st of each month at midnight UTC
- Can be triggered manually from the GitHub Actions tab

## Configuration

- **Base URL**: Update `BASE_URL` in the script to match your domain
- **Content Types**: Modify `CONTENT_TYPES` to add/remove content categories
- **AI Model**: Currently uses `gpt-4o-mini` from GitHub Models

## Output

Generated newsletters include:
- AI-generated summary of new content
- Detailed list of each new post/album/project with links
- Publish dates and excerpts
- Links back to your website

## Requirements

- Node.js runtime
- GitHub repository with Actions enabled
- GitHub Models API access (automatic with GitHub Actions)