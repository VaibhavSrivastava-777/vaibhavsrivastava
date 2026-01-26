# Vaibhav Srivastava - Personal Brand Website

A professional, minimalistic personal brand website built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Homepage**: Professional tagline, introduction, and call-to-action buttons
- **Resume**: Executive summary, experience timeline, and skills by category
- **Portfolio**: Project showcase with STAR format case studies
- **Blog**: Thought leadership articles on Product Strategy, AI Adoption, and Growth Leadership
- **Speaking & Mentoring**: Speaking engagements, testimonials, and mentoring opportunities
- **Contact**: Contact form and social links

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Content**: JSON for structured data, Markdown for blog posts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd VaibhavSrivastava
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── resume/            # Resume page
│   ├── portfolio/         # Portfolio pages
│   ├── blog/              # Blog pages
│   ├── speaking/          # Speaking & mentoring page
│   └── contact/           # Contact page
├── components/            # React components
├── content/              # Content files (JSON, Markdown)
├── lib/                  # Utility functions
└── public/               # Static assets
```

## Content Management

### Resume Data
Edit `content/resume.json` to update resume information.

### Portfolio Projects
Add or modify projects in `content/portfolio.json`. Each project should include:
- slug, name, impact, techStack, category, date
- STAR format case study (situation, task, action, result)

### Blog Posts
Create markdown files in `content/blog/` with frontmatter:
```markdown
---
title: "Post Title"
date: "2024-01-15"
category: "Product Strategy"
excerpt: "Brief excerpt..."
---
```

### Speaking Engagements
Update `content/speaking.json` with speaking engagements and testimonials.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Configure custom domain: `vaibhavsrivastava.com`
4. Deploy!

Vercel will automatically:
- Build and deploy on every push
- Provide SSL certificates
- Optimize performance

### Alternative: Netlify

1. Push your code to GitHub
2. Import the repository in [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Configure custom domain

## Customization

### Colors
Edit `tailwind.config.ts` to customize the color palette.

### Fonts
Update `app/globals.css` to change fonts.

### Metadata
Update SEO metadata in `app/layout.tsx` and individual page files.

## License

Private - All rights reserved
