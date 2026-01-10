# 🚀 Inngest Production Quick Start

## Quick Setup (5 minutes)

### 1. Create Inngest Account
- Visit: https://www.inngest.com
- Sign up (free tier available)
- Create a new app

### 2. Get Your Signing Key
- Dashboard → Settings → Keys
- Copy **Signing Key** (starts with `signkey_prod_...`)

### 3. Add to Production Environment Variables

```bash
# Required for Production
INNGEST_SIGNING_KEY=signkey_prod_your_key_here
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Optional (for image search)
UNSPLASH_ACCESS_KEY=your_unsplash_key_here
```

### 4. Deploy Your App
- Deploy to Vercel/Railway/Render/etc.
- Make sure environment variables are set
- Wait for deployment to complete

### 5. Sync Functions
- Go to Inngest Dashboard → Apps
- Click "Sync" or "Discover Functions"
- Enter: `https://your-domain.com/api/inngest`
- Click "Sync"

✅ **Done!** Your functions should now appear in the dashboard.

## How It Works

### Development (Local)
```bash
# Terminal 1: Run Inngest Dev Server
npx inngest-cli dev

# Terminal 2: Run Next.js
npm run dev
```
- No environment variables needed
- Functions run locally

### Production (Deployed)
- No dev server needed
- Inngest Cloud handles execution
- Requires `INNGEST_SIGNING_KEY` env var
- Functions auto-register via `/api/inngest` endpoint

## Verification Checklist

- [ ] Functions appear in Inngest Dashboard → Functions
- [ ] Can create a project in your app
- [ ] Events show in Dashboard → Events
- [ ] Function runs appear in Dashboard → Runs
- [ ] Designs generate successfully

## Troubleshooting

**Functions not showing?**
- Check `/api/inngest` endpoint is accessible
- Verify `INNGEST_SIGNING_KEY` is correct
- Manually sync in dashboard

**Events not triggering?**
- Check server logs for `inngest.send()` errors
- Verify events appear in Dashboard → Events
- Check function logs in Dashboard → Runs

## Need More Details?

See `INNGEST_PRODUCTION_SETUP.md` for comprehensive guide.




