# Troubleshooting Admin Panel

## Common Issues

### "Server error" or "Authentication configuration error"

**Problem**: The `ADMIN_PASSWORD` environment variable is not set or not loaded.

**Solution**:
1. Create a `.env.local` file in the project root
2. Add: `ADMIN_PASSWORD=your-password-here`
3. **Restart your development server** (stop with Ctrl+C and run `npm run dev` again)
4. Environment variables are only loaded when the server starts

### "Invalid password" but password is correct

**Possible causes**:
1. Environment variable not loaded - restart the dev server
2. Typo in password - check for extra spaces
3. Different password in `.env.local` vs what you're entering

**Solution**:
- Verify the password in `.env.local` matches what you're typing
- Restart the dev server
- Clear browser cookies and try again

### Can't access admin routes after login

**Problem**: Cookie not being set or middleware blocking access.

**Solution**:
1. Check browser console for errors
2. Clear browser cookies for the site
3. Try logging in again
4. Check that middleware is working (should redirect to `/admin/login` if not authenticated)

### Changes not saving

**Problem**: File permissions or path issues.

**Solution**:
1. Check that `content/blog/` and `content/portfolio.json` exist
2. Verify file permissions allow writing
3. Check server console for error messages

### Build errors in production

**Problem**: Environment variable not set in Vercel.

**Solution**:
1. Go to Vercel Dashboard > Your Project > Settings > Environment Variables
2. Add `ADMIN_PASSWORD` with your password
3. Redeploy the project

## Debug Steps

1. **Check environment variable is loaded**:
   - Add a console.log in `lib/admin/auth.ts` (temporary, remove after debugging)
   - Check server console output

2. **Check API response**:
   - Open browser DevTools > Network tab
   - Try logging in
   - Check the `/api/admin/auth` request/response

3. **Check cookies**:
   - Open browser DevTools > Application > Cookies
   - After login, verify `admin-auth` cookie exists

4. **Check server logs**:
   - Look for error messages in the terminal running `npm run dev`

## Getting Help

If issues persist:
1. Check the browser console for client-side errors
2. Check the server console for server-side errors
3. Verify `.env.local` file exists and has correct format
4. Ensure dev server was restarted after creating `.env.local`
