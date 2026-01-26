# Contact Form Setup Guide

## Current Status

The contact form is now functional! It will:
- ✅ Validate form inputs
- ✅ Send emails via Resend API (if configured)
- ✅ Log submissions (if email service not configured)
- ✅ Show success/error messages to users

## Email Service Setup (Recommended)

To enable email delivery, configure Resend:

### Step 1: Create Resend Account

1. Go to [resend.com](https://resend.com) and sign up
2. Verify your email address

### Step 2: Get API Key

1. Go to [Resend Dashboard > API Keys](https://resend.com/api-keys)
2. Click "Create API Key"
3. Give it a name: `vaibhavsrivastava-contact-form`
4. Copy the API key (starts with `re_`)

### Step 3: Verify Domain (Optional but Recommended)

For production, you should verify your domain:

1. Go to [Resend Dashboard > Domains](https://resend.com/domains)
2. Click "Add Domain"
3. Enter: `vaibhavsrivastava.com`
4. Add the DNS records provided by Resend to your domain registrar
5. Wait for verification (usually a few minutes)

### Step 4: Configure Environment Variables

#### For Local Development

Add to `.env.local`:

```bash
CONTACT_EMAIL=vaibhav.srivastava@iiml.org
RESEND_API_KEY=re_your-api-key-here
RESEND_FROM_EMAIL=Contact Form <noreply@vaibhavsrivastava.com>
```

#### For Vercel Production

1. Go to Vercel Dashboard > Your Project > Settings > Environment Variables
2. Add the following:

| Variable | Value | Environment |
|----------|-------|-------------|
| `CONTACT_EMAIL` | `vaibhav.srivastava@iiml.org` | Production, Preview, Development |
| `RESEND_API_KEY` | `re_your-api-key-here` | Production, Preview, Development |
| `RESEND_FROM_EMAIL` | `Contact Form <noreply@vaibhavsrivastava.com>` | Production, Preview, Development |

3. **Redeploy** your application

## How It Works

1. **User submits form** → Form data is validated
2. **API route processes** → `/api/contact` receives the submission
3. **Email sent** → If `RESEND_API_KEY` is configured, email is sent via Resend
4. **Fallback** → If not configured, submission is logged to console (for debugging)

## Email Format

The email sent will include:
- **From**: The address you configure in `RESEND_FROM_EMAIL`
- **To**: The address in `CONTACT_EMAIL`
- **Reply-To**: The submitter's email address (so you can reply directly)
- **Subject**: `Contact Form: [User's Subject]`
- **Body**: Formatted HTML and plain text with all form fields

## Testing

1. **Without Email Service**: Form will show success message, but email won't be sent (check console logs)
2. **With Email Service**: Form will send actual email to your configured address

## Alternative Email Services

If you prefer a different email service, you can modify `app/api/contact/route.ts` to use:
- **SendGrid**: Similar API, good free tier
- **Mailgun**: Popular choice for transactional emails
- **AWS SES**: If you're already using AWS
- **Nodemailer + SMTP**: For custom SMTP servers

## Troubleshooting

### Emails Not Sending

1. Check that `RESEND_API_KEY` is set correctly
2. Verify the API key is active in Resend dashboard
3. Check Vercel function logs for errors
4. Ensure domain is verified (if using custom domain)

### Form Shows Error

1. Check browser console for errors
2. Check Vercel function logs
3. Verify all required fields are filled
4. Check email format is valid

### Rate Limits

Resend free tier includes:
- 3,000 emails/month
- 100 emails/day

For higher limits, upgrade your Resend plan.

## Security Notes

- Form validation happens server-side
- Email addresses are validated
- No spam protection built-in (consider adding reCAPTCHA if needed)
- API key is stored securely in environment variables
