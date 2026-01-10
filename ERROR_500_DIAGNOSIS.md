# 500 Error Diagnosis for POST /project/[id]

## 🔍 Error Location
**Route**: `POST /project/69629efdb1459c5544813774`  
**File**: `app/api/project/[id]/route.ts`

## 🐛 Most Common Causes

### 1. **Inngest Dev Server Not Running** (Most Likely in Development)
**Symptom**: Error occurs when `inngest.send()` is called  
**Fix**:
```bash
# In a separate terminal, run:
npx inngest-cli dev
```
**Why**: In development mode, Inngest requires a local dev server to receive events. Without it, `inngest.send()` will fail.

**Check**: Look in your server console for:
```
Failed to send Inngest event: [error details]
⚠️  Inngest dev server may not be running. Start it with: npx inngest-cli dev
```

### 2. **Invalid Request Body**
**Symptom**: Error occurs when parsing `request.json()`  
**Fix**: Ensure the request includes a valid JSON body with `prompt` field:
```json
{
  "prompt": "your prompt text here"
}
```

### 3. **Authentication Failure**
**Symptom**: Error occurs when getting user session  
**Check**: 
- User is logged in
- Kinde session is valid
- Check browser console for auth errors

### 4. **Database Connection Issue**
**Symptom**: Error occurs when querying Prisma  
**Fix**: 
- Verify `DATABASE_URL` is correct
- Check MongoDB connection
- Ensure database is accessible

### 5. **Project Not Found**
**Symptom**: Project doesn't exist or user doesn't have access  
**Check**: 
- Project ID is valid
- User owns the project
- Project exists in database

### 6. **Inngest Configuration Issue** (Production)
**Symptom**: `inngest.send()` fails in production  
**Fix**: 
- Set `INNGEST_SIGNING_KEY` environment variable
- Verify Inngest Cloud account is set up
- Check function registration in Inngest Dashboard

## 🔧 How to Debug

### Step 1: Check Server Console Logs
Look for detailed error messages that now include:
- Error message
- Stack trace
- Operation that failed

### Step 2: Check Which Operation Failed
The improved error handling will show you exactly where it failed:
- Request parsing
- Authentication
- Database query
- Inngest event sending

### Step 3: Verify Environment

**Development:**
```bash
# Check if Inngest dev server is running
# It should show: "Inngest dev server running on http://localhost:8288"

# Check environment variables
echo $DATABASE_URL
# Should show your MongoDB connection string
```

**Production:**
```bash
# Verify environment variables are set:
- INNGEST_SIGNING_KEY (if using Inngest Cloud)
- DATABASE_URL
- OPENROUTER_API_KEY
```

### Step 4: Test Each Component

1. **Test Database Connection:**
   ```bash
   npx prisma db pull
   # Should succeed without errors
   ```

2. **Test Inngest Connection (Development):**
   ```bash
   npx inngest-cli dev
   # Should start successfully
   ```

3. **Test Request Format:**
   ```bash
   # Use curl or Postman to test:
   curl -X POST http://localhost:3000/api/project/YOUR_PROJECT_ID \
     -H "Content-Type: application/json" \
     -d '{"prompt": "test prompt"}'
   ```

## 🎯 Quick Fixes

### If Inngest is the Issue (Most Common):

**Development:**
```bash
# Terminal 1:
npx inngest-cli dev

# Terminal 2:
npm run dev
```

**Production:**
1. Go to https://www.inngest.com
2. Create account and app
3. Get `INNGEST_SIGNING_KEY` from dashboard
4. Add to production environment variables
5. Redeploy

### If Request Body is the Issue:

Ensure your frontend is sending:
```typescript
await axios.post(`/api/project/${projectId}`, {
  prompt: "your prompt here"
});
```

### If Database is the Issue:

```bash
# Test connection
npx prisma studio
# Should open Prisma Studio successfully

# Check if project exists
# Query your database directly
```

## 📋 Updated Error Handling

The route now has improved error handling that:
- ✅ Validates request body properly
- ✅ Returns specific error codes (400, 401, 404, 500)
- ✅ Logs detailed error information
- ✅ Continues even if Inngest fails (logs warning)
- ✅ Shows helpful messages in development mode

## 🔍 What the Logs Will Tell You

After the fix, your console will show:

**If Inngest fails:**
```
Failed to send Inngest event: [error]
⚠️  Inngest dev server may not be running. Start it with: npx inngest-cli dev
Inngest event sent successfully for project: [id]  // if it succeeds
```

**If other errors occur:**
```
POST /project/[id] Error: [error message]
Error details: {
  message: "...",
  stack: "...",
  name: "..."
}
```

## ✅ Expected Behavior

When everything works:
1. Request received
2. Prompt validated
3. User authenticated
4. Project found
5. Inngest event sent (or logged if failed)
6. Returns `{ success: true }`

The request should **succeed even if Inngest fails** (it just logs a warning).

## 🆘 Still Getting 500?

1. **Check the exact error in server console** - the improved logging will show you
2. **Verify each step**:
   - ✅ Is request body valid JSON with `prompt`?
   - ✅ Is user logged in?
   - ✅ Does project exist and belong to user?
   - ✅ Is database accessible?
   - ✅ Is Inngest configured/running?

3. **Share the console error** - it will now have detailed information about what failed

