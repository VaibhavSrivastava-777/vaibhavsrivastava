# GitHub API Setup Guide

This guide explains how to configure GitHub API integration for the admin panel to work in production.

## Why GitHub API?

On Vercel (and similar serverless platforms), the file system is read-only in production. The GitHub API integration allows the admin panel to commit changes directly to your repository, which then triggers automatic deployments.

## Step 1: Create a GitHub Personal Access Token

1. Go to [GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)](https://github.com/settings/tokens)
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a descriptive name: `vaibhavsrivastava-admin-panel`
4. Set expiration (recommended: 90 days or custom)
5. Select the following scope:
   - ✅ **`repo`** (Full control of private repositories)
     - This includes: `repo:status`, `repo_deployment`, `public_repo`, `repo:invite`, `security_events`
6. Click "Generate token"
7. **IMPORTANT**: Copy the token immediately - you won't be able to see it again!

## Step 2: Configure Environment Variables

### For Local Development

Add to `.env.local`:

```bash
GITHUB_OWNER=VaibhavSrivastava-777
GITHUB_REPO=vaibhavsrivastava
GITHUB_TOKEN=your-github-personal-access-token-here
```

### For Vercel Production

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `GITHUB_OWNER` | `VaibhavSrivastava-777` | Production, Preview, Development |
| `GITHUB_REPO` | `vaibhavsrivastava` | Production, Preview, Development |
| `GITHUB_TOKEN` | `your-token-here` | Production, Preview, Development |

4. Click "Save"
5. **Redeploy** your application for the changes to take effect

## Step 3: Verify Configuration

1. After deploying, try making a change in the admin panel
2. Check your GitHub repository - you should see a new commit
3. Vercel will automatically detect the commit and redeploy

## How It Works

1. **Development Mode**: Uses local file system (fast, no API calls)
2. **Production Mode**: 
   - Detects read-only filesystem
   - Automatically uses GitHub API to commit changes
   - Changes are committed to the `main` branch
   - Vercel detects the commit and redeploys automatically

## Security Notes

- **Never commit** `.env.local` or your GitHub token to the repository
- The token has `repo` scope - it can modify your repository
- Keep your token secure and rotate it periodically
- If your token is compromised, revoke it immediately in GitHub settings

## Troubleshooting

### "GitHub API not configured" Error

- Check that all three environment variables are set: `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_TOKEN`
- Verify the token has the `repo` scope
- Ensure you've redeployed after adding environment variables

### "Failed to commit file" Error

- Verify the token is valid and not expired
- Check that the repository name and owner are correct
- Ensure the token has write access to the repository

### Changes Not Appearing

- GitHub API commits are asynchronous - wait a few seconds
- Check your GitHub repository for the new commit
- Vercel deployment may take 1-2 minutes after the commit

## Token Rotation

If you need to rotate your token:

1. Generate a new token in GitHub
2. Update `GITHUB_TOKEN` in Vercel environment variables
3. Update `.env.local` for local development
4. Redeploy the application

## Alternative: Fine-Grained Tokens (Beta)

GitHub also offers fine-grained personal access tokens with more granular permissions:

1. Go to [GitHub Settings > Developer settings > Personal access tokens > Fine-grained tokens](https://github.com/settings/tokens?type=beta)
2. Create a token with:
   - Repository access: Only select repositories → `vaibhavsrivastava`
   - Repository permissions:
     - Contents: Read and write
     - Metadata: Read-only (automatic)

This provides better security by limiting access to only the specific repository.
