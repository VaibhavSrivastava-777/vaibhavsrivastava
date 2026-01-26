# Deployment Guide

## Vercel Deployment (Recommended)

### Step 1: Prepare Your Repository
1. Initialize git repository (if not already done):
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Push to GitHub:
```bash
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings
5. Click "Deploy"

### Step 3: Configure Custom Domain
1. In your Vercel project dashboard, go to "Settings" > "Domains"
2. Add your domain: `vaibhavsrivastava.com`
3. Follow Vercel's DNS configuration instructions:
   - Add a CNAME record pointing to `cname.vercel-dns.com`
   - Or add A records as specified by Vercel
4. Wait for DNS propagation (can take up to 48 hours, usually much faster)
5. SSL certificate will be automatically provisioned by Vercel

### Step 4: Environment Variables (if needed)
If you add any environment variables later, configure them in:
- Vercel Dashboard > Settings > Environment Variables

## Alternative: Netlify Deployment

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "Add new site" > "Import an existing project"
3. Connect your GitHub repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Click "Deploy site"
6. Configure custom domain in Site settings > Domain management

## Pre-Deployment Checklist

- [ ] Update `content/resume.json` with your actual resume data
- [ ] Update `content/portfolio.json` with your actual projects
- [ ] Update `content/speaking.json` with your speaking engagements
- [ ] Add your actual blog posts to `content/blog/`
- [ ] Replace `public/resume.pdf` with your actual resume PDF
- [ ] Update email addresses in contact page and footer
- [ ] Update LinkedIn URL if different
- [ ] Review and update all metadata in `app/layout.tsx`
- [ ] Test the build locally: `npm run build && npm start`
- [ ] Test all pages and links

## Post-Deployment

1. Test all pages on the live site
2. Verify sitemap: `https://vaibhavsrivastava.com/sitemap.xml`
3. Verify robots.txt: `https://vaibhavsrivastava.com/robots.txt`
4. Submit sitemap to Google Search Console
5. Set up analytics (optional): Google Analytics or Plausible

## Continuous Deployment

Once connected to Vercel/Netlify, every push to your main branch will automatically trigger a new deployment.
