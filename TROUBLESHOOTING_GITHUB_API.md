# Troubleshooting GitHub API 404 Errors

## Common Causes of 404 Errors

### 1. Repository Not Found

**Symptoms**: `404 {"message":"Not Found"}`

**Possible causes**:
- `GITHUB_OWNER` is incorrect
- `GITHUB_REPO` is incorrect
- Repository doesn't exist or is private and token doesn't have access

**Solution**:
1. Verify your repository URL: `https://github.com/YOUR_OWNER/YOUR_REPO`
2. Check environment variables in Vercel:
   - `GITHUB_OWNER` should be your GitHub username (e.g., `VaibhavSrivastava-777`)
   - `GITHUB_REPO` should be the repository name (e.g., `vaibhavsrivastava`)
3. Ensure the repository exists and is accessible

### 2. Token Doesn't Have Access

**Symptoms**: `404 {"message":"Not Found"}` or `403 Forbidden`

**Possible causes**:
- Token doesn't have `repo` scope
- Token is expired
- Token was revoked

**Solution**:
1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Check if your token exists and is not expired
3. Verify it has the `repo` scope checked
4. If needed, create a new token with `repo` scope
5. Update `GITHUB_TOKEN` in Vercel environment variables
6. Redeploy your application

### 3. Branch Doesn't Exist

**Symptoms**: `404 {"message":"Not Found"}` when trying to commit

**Possible causes**:
- Default branch is not `main` (might be `master` or another name)
- Branch was deleted

**Solution**:
1. Check your repository's default branch:
   - Go to your repository on GitHub
   - Check the branch dropdown (usually shows "main" or "master")
2. If your default branch is not `main`, you can either:
   - Rename your branch to `main` in GitHub settings
   - Or update the code to use your branch name (requires code change)

### 4. File Path Issues

**Symptoms**: `404 {"message":"Not Found"}` for specific files

**Possible causes**:
- File path contains special characters
- Directory doesn't exist in repository

**Solution**:
- The code now handles path encoding automatically
- Ensure the file structure matches: `content/blog/`, `content/portfolio.json`, etc.

## Verification Steps

1. **Check Environment Variables**:
   ```bash
   # In Vercel Dashboard > Settings > Environment Variables
   GITHUB_OWNER=VaibhavSrivastava-777
   GITHUB_REPO=vaibhavsrivastava
   GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
   ```

2. **Test Repository Access**:
   - Visit: `https://github.com/VaibhavSrivastava-777/vaibhavsrivastava`
   - Ensure the repository is accessible
   - Check the default branch name

3. **Test Token**:
   ```bash
   # Using curl (replace with your values)
   curl -H "Authorization: Bearer YOUR_TOKEN" \
        https://api.github.com/repos/VaibhavSrivastava-777/vaibhavsrivastava
   ```
   - Should return repository information (not 404)

4. **Check Logs**:
   - In Vercel Dashboard > Deployments > Select deployment > Functions
   - Look for console logs showing:
     - `GitHub API configured for: owner/repo`
     - `Committing file: path/to/file.md`
     - Any error messages

## Quick Fix Checklist

- [ ] `GITHUB_OWNER` matches your GitHub username exactly
- [ ] `GITHUB_REPO` matches your repository name exactly
- [ ] `GITHUB_TOKEN` is valid and not expired
- [ ] Token has `repo` scope enabled
- [ ] Repository exists and is accessible
- [ ] Default branch is `main` (or update code if different)
- [ ] Environment variables are set in Vercel (not just `.env.local`)
- [ ] Application has been redeployed after setting environment variables

## Still Having Issues?

1. Check the error message in the admin panel - it now includes diagnostic information
2. Check Vercel function logs for detailed error messages
3. Verify your token works by testing the GitHub API directly:
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
        https://api.github.com/user
   ```
   Should return your user information

4. If the token works but repository access fails, ensure:
   - The repository is not archived
   - You have write access to the repository
   - The token has the correct scopes
