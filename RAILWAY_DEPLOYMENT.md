🚀 RAILWAY DEPLOYMENT GUIDE

Your backend is now fully Railway-compatible!

═══════════════════════════════════════════════════════════

WHAT CHANGED:

✅ Procfile - Tells Railway how to start the server
✅ railway.json - Railway configuration
✅ Better error handling and logging
✅ Proper PORT environment variable handling
✅ Health check endpoints

═══════════════════════════════════════════════════════════

STEP 1: PUSH CHANGES TO GITHUB

Open terminal in your project folder:

```bash
git add .
git commit -m "Make backend Railway-compatible"
git push origin main
```

Wait for push to complete ✓

═══════════════════════════════════════════════════════════

STEP 2: DEPLOY ON RAILWAY

1. Go to https://railway.app

2. Click "New Project"

3. Select "Deploy from GitHub"

4. If asked to authorize:
   - Click "Connect GitHub"
   - Select RICHARD7617/prompt repository
   - Click "Authorize"

5. Railway auto-detects the project

6. Click on the project

7. Go to "Variables" tab

8. Add your Pesapal credentials:

   PESAPAL_CONSUMER_KEY=abc123xyz789
   PESAPAL_CONSUMER_SECRET=secret456def012
   CALLBACK_URL=https://YOUR-RAILWAY-DOMAIN/api/pesapal/callback

**Replace "YOUR-RAILWAY-DOMAIN" with your actual Railway domain:**
- Look at the "Domain" section
- Should look like: project-production-xxxx.railway.app

9. Click "Save"

10. Railway redeploys automatically (1-2 minutes)

11. When deployment is green ✓, copy your domain URL

═══════════════════════════════════════════════════════════

STEP 3: TEST YOUR BACKEND

### Test 1: Health Check

In your browser or terminal:

```bash
curl https://your-railway-domain.railway.app/api/health
```

You should see:
```json
{
  "status": "ok",
  "timestamp": "2026-02-25...",
  "environment": "production"
}
```

### Test 2: Root Endpoint

```bash
curl https://your-railway-domain.railway.app
```

You should see available endpoints ✓

### Test 3: Full Payment Flow

1. Go to your frontend: https://prompt-xxxxx.vercel.app
2. Enter phone: 254712345678
3. Click "Confirm Payment"
4. You should be redirected to Pesapal

═══════════════════════════════════════════════════════════

STEP 4: VIEW LOGS

1. Go to Railway dashboard
2. Open your project
3. Click on "Logs" tab
4. Watch real-time server output

Or use Railway CLI:
```bash
railroad log --follow
```

═══════════════════════════════════════════════════════════

TROUBLESHOOTING

### "Deployment failed"

Go to Logs → find the error message

Common issues:
- Wrong port (should auto-use Railway PORT)
- Missing dependencies (run `npm install`)
- Syntax error in code (check pesapal-server.js)

### "Cannot GET /"

That's OK if you haven't configured root. Test:
```bash
curl https://your-domain.railway.app/api/health
```

### "Environment variables not found"

1. Go to Variables tab
2. Make sure you added PESAPAL_CONSUMER_KEY and PESAPAL_CONSUMER_SECRET
3. Make sure you copied them correctly (no spaces)
4. Save and wait for redeploy

### "Callback not working"

1. Get your Railway domain: https://project-production-xxxx.railway.app
2. Set CALLBACK_URL to: https://project-production-xxxx.railway.app/api/pesapal/callback
3. Set this same URL in Pesapal dashboard
4. The URLs must match exactly!

═══════════════════════════════════════════════════════════

RAILWAY DOMAIN EXAMPLES

Your Railway domain looks like:
- https://project-production-abc123.railway.app

CALLBACK_URL should be:
- https://project-production-abc123.railway.app/api/pesapal/callback

Make sure:
✓ No extra slashes
✓ Exact spelling
✓ Match in Pesapal too

═══════════════════════════════════════════════════════════

NEXT STEPS

1. Push changes to GitHub
2. Deploy on Railway
3. Get Railway domain URL
4. Add environment variables
5. Test health endpoint
6. Test payment flow
7. Configure Pesapal IPN
8. Go live!

═══════════════════════════════════════════════════════════

CHECKLIST

- [ ] git push completed
- [ ] Railway deployment is green ✓
- [ ] Environment variables added
- [ ] Health check works
- [ ] Backend responds to requests
- [ ] Pesapal IPN URL configured
- [ ] Payment flow tested

═══════════════════════════════════════════════════════════

FILE CHANGES MADE FOR RAILWAY

✅ Procfile - Added (tells Railway what to run)
✅ railway.json - Added (Railway config)
✅ pesapal-server.js - Updated (better logging/errors)
✅ .env.example - Updated (clearer variables)
✅ package.json - Already correct

═══════════════════════════════════════════════════════════

Once backend is deployed:

Tell me:
1. Your Railway domain URL
2. Pesapal Consumer Key
3. Pesapal Consumer Secret

Then I can help verify everything works!

═══════════════════════════════════════════════════════════
