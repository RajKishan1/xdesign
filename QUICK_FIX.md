# Quick Fix for Web Design Generation

## The Problem
The new `generateWebScreens` function hasn't been registered with the running Inngest dev server.

## Solution - Follow These Steps:

### Step 1: Stop Inngest Dev Server
1. Find the terminal where `npx inngest-cli@latest dev` is running
2. Press `Ctrl + C` to stop it

### Step 2: Restart Inngest Dev Server
```bash
npx inngest-cli@latest dev
```

### Step 3: Restart Next.js Dev Server (if needed)
1. Find the terminal where `npm run dev` is running
2. Press `Ctrl + C` to stop it
3. Run:
```bash
npm run dev
```

### Step 4: Test Web Design Generation
1. Go to http://localhost:3000
2. Enter a prompt
3. Click "Design"
4. Select "Web Design"
5. Wait for generation

---

## Alternative: If Inngest is Not Running

If you don't have Inngest dev server running, start it:

```bash
npx inngest-cli@latest dev
```

Then in another terminal:

```bash
npm run dev
```

---

## What Was Added

The system now has a new Inngest function called `generateWebScreens` that:
- Generates 10-15 desktop screens (1440px width)
- Uses web-specific prompts and layouts
- Creates sidebar navigation instead of bottom navigation
- Optimizes for desktop viewing

---

## Expected Behavior

When you select "Web Design":
1. Modal closes
2. Project is created
3. Analysis starts (planning screens)
4. Generation starts (creating HTML for each screen)
5. Screens appear one by one in canvas at 1440px width

---

## Troubleshooting

### If generation is still stuck:

1. **Check Inngest Dashboard**: Go to http://localhost:8288
   - You should see the `generate-web-screens` function listed
   - Check for any errors in the runs

2. **Check Browser Console**:
   - Open DevTools (F12)
   - Look for any JavaScript errors
   - Check Network tab for failed API calls

3. **Check Next.js Terminal**:
   - Look for any error messages
   - Verify the POST /api/project request succeeded

4. **Verify Database**:
   - Go to http://localhost:5555 (Prisma Studio)
   - Check if project was created with `deviceType: "web"`

### Common Issues:

**Issue**: Function not found
- **Solution**: Restart Inngest dev server

**Issue**: Database field error
- **Solution**: The `deviceType` field should already be in the schema
- The database push was successful

**Issue**: Import errors
- **Solution**: Check that `lib/openrouter.ts` exists
- Run `npm install` if needed

---

## Quick Test Command

After restarting, test if the function is registered:

```bash
curl http://localhost:8288/v1/functions
```

You should see both:
- `generate-ui-screens` (mobile)
- `generate-web-screens` (web)
