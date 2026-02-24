🚀 PESAPAL QUICK START

Your payment system is ready. Here's what to do NOW:

═══════════════════════════════════════════════════════════

STEP 1: CREATE PESAPAL ACCOUNT (5 minutes)

Go to: https://pesapal.com
Click: "Sign Up" or "Get Started"
Fill: Business info
Done: You'll get a dashboard

═══════════════════════════════════════════════════════════

STEP 2: GET API CREDENTIALS (2 minutes)

In Pesapal Dashboard:
1. Settings → API Keys
2. Copy: Consumer Key
3. Copy: Consumer Secret

Keep these safe! 🔐

═══════════════════════════════════════════════════════════

STEP 3: DEPLOY BACKEND TO RAILWAY (5 minutes)

Go to: https://railway.app
Click: "New Project"
Select: "Deploy from GitHub"
Choose: RICHARD7617/prompt (your repo)
Wait: Deployment completes (auto-detected Node.js ✓)

Railway gives you a URL like:
https://project-production-xxxx.railway.app

Copy this URL!

═══════════════════════════════════════════════════════════

STEP 4: SET ENVIRONMENT VARIABLES (2 minutes)

On Railway dashboard:
1. Settings → Variables
2. Add:

   PESAPAL_CONSUMER_KEY=your_key_from_step_2
   PESAPAL_CONSUMER_SECRET=your_secret_from_step_2
   CALLBACK_URL=https://project-production-xxxx.railway.app/api/pesapal/callback

3. Save
4. Railway redeploys automatically

═══════════════════════════════════════════════════════════

STEP 5: CONFIGURE PESAPAL WEBHOOK (2 minutes)

In Pesapal Dashboard:
1. Settings → Webhooks / Notifications / IPN
2. Set URL to:
   https://project-production-xxxx.railway.app/api/pesapal/callback
3. Save

═══════════════════════════════════════════════════════════

STEP 6: TEST IT! (5 minutes)

Option A: Test on your phone
1. Go to https://prompt-xxxxx.vercel.app
2. Enter your phone: 254712345678
3. Click "Confirm Payment"
4. You'll be redirected to Pesapal
5. Complete a test payment

Option B: Test with curl
```
curl -X POST https://project-production-xxxx.railway.app/api/pesapal/initiate \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"254712345678","amount":30}'
```

═══════════════════════════════════════════════════════════

SUMMARY

✅ Frontend: Already deployed on Vercel
✅ Backend: Deployed on Railway
✅ Payment: Pesapal handles it all
✅ Legal: Using official Safaricom STK popup
✅ Secure: Users never enter PIN on your site

Money flows like this:
User Phone → Pesapal → M-Pesa → Your Account (254746630940)

═══════════════════════════════════════════════════════════

FILES YOU NEED

✓ PESAPAL_SETUP.md      - Detailed guide (read if you hit issues)
✓ backend/README.md     - Backend documentation
✓ IMPLEMENTATION.md     - Educational (skip, you're using Pesapal)

═══════════════════════════════════════════════════════════

COMMON MISTAKES

❌ Wrong Consumer Key/Secret
❌ IPN URL doesn't match backend URL  
❌ Backend environment variables not set
❌ Using localhost URL in production
❌ Forgetting to deploy backend first

═══════════════════════════════════════════════════════════

YOU'RE READY! 🎉

1. Pesapal account: https://pesapal.com
2. Railway: https://railway.app
3. Your frontend: https://prompt-xxxxx.vercel.app

Go live and start accepting payments!

═══════════════════════════════════════════════════════════

Need help? See PESAPAL_SETUP.md for detailed instructions
