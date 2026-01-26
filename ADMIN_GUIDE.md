# Admin Panel Guide

## Overview

The admin panel provides a user-friendly web interface to manage blog posts and portfolio items without editing files directly.

## Access

1. Navigate to `/admin/login` on your website
2. Enter the admin password (set in `ADMIN_PASSWORD` environment variable)
3. You'll be redirected to the admin dashboard

## Setting Up Password

1. Create a `.env.local` file in the project root (copy from `.env.local.example`)
2. Set your password:
   ```
   ADMIN_PASSWORD=your-secure-password-here
   ```
3. **IMPORTANT**: Restart your development server after creating/updating `.env.local`:
   ```bash
   # Stop the server (Ctrl+C) and restart:
   npm run dev
   ```
4. For Vercel deployment, add this as an environment variable in your Vercel project settings:
   - Go to Vercel Dashboard > Your Project > Settings > Environment Variables
   - Add `ADMIN_PASSWORD` with your password value
   - Redeploy the project

## Features

### Blog Management

- **List Posts**: View all blog posts in a table
- **Create Post**: Add new blog posts with:
  - Title
  - Date
  - Category (Product Strategy, AI Adoption, Growth Leadership)
  - Excerpt
  - Content (Markdown editor with preview)
- **Edit Post**: Update existing posts
- **Delete Post**: Remove posts (with confirmation)
- **Preview**: View post on live site

### Portfolio Management

- **List Projects**: View all portfolio projects
- **Create Project**: Add new projects with:
  - Project Name
  - Impact description
  - Category
  - Date
  - Description
  - Tech Stack (comma-separated)
  - GitHub URL (optional)
  - STAR Format (Situation, Task, Action, Result)
- **Edit Project**: Update existing projects
- **Delete Project**: Remove projects (with confirmation)
- **Preview**: View project on live site

## Usage Tips

1. **Slug Generation**: Slugs are auto-generated from titles/names. They're URL-friendly and unique.
2. **Markdown Editor**: Use the preview toggle to see how your content will render
3. **Tech Stack**: Enter technologies separated by commas (e.g., "Python, React, AWS")
4. **Date Format**: Use the date picker for consistent formatting
5. **Validation**: All required fields are validated before saving

## Security

- Password-protected access
- Session-based authentication (24-hour cookies)
- Server-side validation
- Protected API routes
- Excluded from search engines (robots.txt)

## Troubleshooting

**Can't log in?**
- Check that `ADMIN_PASSWORD` is set in environment variables
- Clear browser cookies and try again
- Check browser console for errors

**Changes not appearing?**
- Changes are saved to files immediately
- For Vercel: Push changes to GitHub to trigger deployment
- For local: Restart dev server if needed

**Build errors?**
- Ensure all required fields are filled
- Check that slugs are valid (alphanumeric and hyphens only)
- Verify JSON structure for portfolio items

## File Locations

- Blog posts: `content/blog/*.md`
- Portfolio: `content/portfolio.json`

Changes made through the admin panel directly modify these files.
