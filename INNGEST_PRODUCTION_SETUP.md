# Inngest Production Setup Guide

This guide will help you configure Inngest to work in production environments (Vercel, Railway, Render, etc.).

## 📋 Prerequisites

1. **Inngest Cloud Account** - Sign up at https://www.inngest.com (free tier available)
2. **Deployed Next.js Application** - Your app should be deployed and accessible via HTTPS

## 🔑 Step 1: Get Your Inngest Keys

1. **Sign up/Login** to [Inngest Dashboard](https://app.inngest.com)
2. **Create a new App** (or use existing)
3. **Navigate to Settings → Keys**
4. **Copy the following keys:**
   - **Signing Key** (for webhook verification)
   - **Event Key** (optional, for sending events)

## 🔧 Step 2: Configure Environment Variables

Add these environment variables to your production platform:

### Required for Production:

```bash
# Inngest Signing Key (REQUIRED for production)
INNGEST_SIGNING_KEY=signkey_prod_xxxxxxxxxxxxx

# Your application's public URL (REQUIRED)
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Optional (for advanced use cases):

```bash
# Event Key (optional - only needed if you want to send events from external sources)
INNGEST_EVENT_KEY=xxxxxxxxxxxxx

# Inngest Base URL (optional - defaults to https://api.inngest.com)
INNGEST_BASE_URL=https://api.inngest.com
```

### Platform-Specific Setup:

#### **Vercel:**
1. Go to your project → Settings → Environment Variables
2. Add the variables above
3. Select environment (Production, Preview, Development)
4. Redeploy your application

#### **Railway:**
1. Go to your project → Variables
2. Add the variables
3. The app will automatically redeploy

#### **Render:**
1. Go to your service → Environment
2. Add the variables
3. Save and redeploy

#### **Other Platforms:**
Add environment variables through your platform's dashboard/CLI

## 🚀 Step 3: Sync Your Functions

After deploying, you need to sync your functions with Inngest Cloud:

### Option A: Automatic Sync (Recommended)

The `serve()` function in `app/api/inngest/route.ts` automatically registers functions when:
- Your app is deployed to production
- The `/api/inngest` endpoint is accessible
- `INNGEST_SIGNING_KEY` is set

**How it works:**
- Inngest Cloud will discover your app via the `/api/inngest` endpoint
- Functions are automatically registered when the endpoint is accessed

### Option B: Manual Sync via Dashboard

1. Go to [Inngest Dashboard](https://app.inngest.com)
2. Navigate to **Apps** → Your App
3. Click **Sync** or **Discover Functions**
4. Enter your app URL: `https://your-domain.com/api/inngest`
5. Click **Sync**

### Option C: Using Inngest CLI

```bash
# Install Inngest CLI globally
npm install -g inngest-cli

# Sync your functions
inngest-cli sync \
  --url https://your-domain.com/api/inngest \
  --env production
```

## ✅ Step 4: Verify Setup

1. **Check Function Registration:**
   - Go to Inngest Dashboard → Functions
   - You should see:
     - `generate-ui-screens`
     - `regenerate-frame`
     - `hello-world`

2. **Test Event Sending:**
   - Create a new project in your app
   - Check Inngest Dashboard → Events
   - You should see `ui/generate.screens` events

3. **Check Function Execution:**
   - Go to Inngest Dashboard → Runs
   - Functions should execute and show status

## 🔍 Troubleshooting

### Issue: Functions not registering

**Solutions:**
- Verify `INNGEST_SIGNING_KEY` is set correctly
- Check that `/api/inngest` endpoint is accessible (no auth blocking)
- Ensure your app URL in Inngest dashboard matches your actual URL
- Check application logs for Inngest-related errors

### Issue: Events not triggering functions

**Solutions:**
- Verify `inngest.send()` calls are executing (check server logs)
- Check Inngest Dashboard → Events to see if events are received
- Verify function IDs match event names
- Check function logs in Inngest Dashboard → Runs

### Issue: Webhook verification failing

**Solutions:**
- Double-check `INNGEST_SIGNING_KEY` matches the one in dashboard
- Ensure no extra spaces or quotes in environment variable
- Verify the key is set in the correct environment (Production vs Preview)

### Issue: Realtime updates not working

**Solutions:**
- Verify `fetchRealtimeSubscriptionToken()` is working (check browser console)
- Check that `getSubscriptionToken` from `@inngest/realtime` is correctly configured
- Ensure user authentication is working (Kinde session)

## 🌐 Development vs Production

### Development (Local):
```bash
# Run Inngest dev server
npx inngest-cli dev

# No environment variables needed
# Functions run locally via dev server
```

### Production:
```bash
# No dev server needed
# Set INNGEST_SIGNING_KEY environment variable
# Functions run in Inngest Cloud
```

## 📊 Monitoring

### Inngest Dashboard Features:
- **Functions**: View all registered functions
- **Events**: Monitor incoming events
- **Runs**: Track function execution status
- **Logs**: View function execution logs
- **Metrics**: Performance and error rates

### Best Practices:
1. Monitor function execution times
2. Set up alerts for failed runs
3. Review logs regularly for errors
4. Use the Replay feature to retry failed functions

## 🔒 Security Notes

1. **Never commit** `INNGEST_SIGNING_KEY` to git
2. Use different keys for development/staging/production
3. Rotate keys periodically through Inngest Dashboard
4. The signing key is used to verify webhook requests from Inngest Cloud

## 📝 Current Configuration

Your app is configured with:
- **App ID**: `xdesign-app`
- **Endpoint**: `/api/inngest`
- **Functions**:
  - `generate-ui-screens` (handles `ui/generate.screens` events)
  - `regenerate-frame` (handles `ui/regenerate.frame` events)
  - `hello-world` (handles `test/hello.world` events)

## 🎯 Quick Checklist

- [ ] Created Inngest Cloud account
- [ ] Copied `INNGEST_SIGNING_KEY` from dashboard
- [ ] Added `INNGEST_SIGNING_KEY` to production environment variables
- [ ] Added `NEXT_PUBLIC_APP_URL` to production environment variables
- [ ] Deployed application to production
- [ ] Synced functions with Inngest Cloud (automatic or manual)
- [ ] Verified functions appear in Inngest Dashboard
- [ ] Tested creating a project and verified function execution
- [ ] Checked Inngest Dashboard → Runs for successful executions

## 🆘 Need Help?

- [Inngest Documentation](https://www.inngest.com/docs)
- [Inngest Discord Community](https://www.inngest.com/discord)
- [Inngest Support](https://www.inngest.com/support)




