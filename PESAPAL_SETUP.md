# Pesapal Integration - Complete Setup Guide

This is the EASIEST way to accept M-Pesa payments. You don't need to integrate with Safaricom directly.

---

## What is Pesapal?

**Pesapal** is a payment aggregator that:
- ✅ Handles M-Pesa, credit cards, bank transfers, etc.
- ✅ Takes care of all security and compliance
- ✅ Redirects users to their payment portal
- ✅ Sends confirmation back to your server
- ✅ No complex backend needed initially

**Cost:** 1-5% per transaction (check their website for current rates)

---

## Step 1: Create Pesapal Account

1. Go to https://pesapal.com
2. Click **"Business Signup"** or **"Get Started"**
3. Fill in your details:
   - Business name
   - Email
   - Phone
   - Country (Kenya)
4. Verify email
5. Log in to dashboard

---

## Step 2: Get Your API Credentials

1. Go to **Pesapal Dashboard**
2. Navigate to **Settings → API Keys** or **Integrations**
3. You'll see:
   - **Consumer Key** (copy this)
   - **Consumer Secret** (copy this)

Example credentials format:
```
Consumer Key: abc123xyz789
Consumer Secret: secret456def012
```

⚠️ **NEVER share these credentials publicly!**

---

## Step 3: Deploy Backend to Railway (Easy & Free)

Railway is like Heroku but better and still free.

### 3A. Create GitHub Repository (Already Done ✓)

Your code is already on GitHub at:
```
https://github.com/RICHARD7617/prompt
```

### 3B. Deploy to Railway

1. Go to https://railway.app
2. Click **"New Project"**
3. Select **"Deploy from GitHub"**
4. Authorize Railway to access GitHub
5. Select **RICHARD7617/prompt** repository
6. Click **"Deploy"**

Railway will automatically detect your Node.js backend.

### 3C. Set Environment Variables on Railway

1. After deployment, go to **Settings**
2. Click **"Variables"**
3. Add your Pesapal credentials:

```
PESAPAL_CONSUMER_KEY=your_consumer_key_here
PESAPAL_CONSUMER_SECRET=your_consumer_secret_here
```

4. For CALLBACK_URL, Railway will give you a domain. Use it:
```
CALLBACK_URL=https://your-railway-app.railway.app/api/pesapal/callback
```

Railway will auto-generate your domain like: `https://project-production-xxxx.railway.app`

---

## Step 4: Update Pesapal Settings

1. Go to **Pesapal Dashboard**
2. Go to **Settings → Webhooks** or **Notifications**
3. Set **IPN URL** (Instant Payment Notification) to:
```
https://your-railway-app.railway.app/api/pesapal/callback
```

This is where Pesapal sends payment confirmation.

---

## Step 5: Test Everything

### Local Testing (Optional)

If you want to test locally first:

```bash
# Install dependencies
cd backend
npm install

# Create .env file with your credentials
cp .env.example .env
# Edit .env with your actual credentials

# Start server
npm start
```

Server runs on http://localhost:3000

### Testing with Pesapal

Pesapal has a **Sandbox/Demo environment**:

1. Go to Pesapal dashboard settings
2. Find **Sandbox/Demo credentials** if available
3. Or use test mode option
4. Test with test phone numbers

---

## Step 6: Production Checklist

Before going live:

- [ ] Pesapal account created and verified
- [ ] API credentials obtained
- [ ] Backend deployed to Railway
- [ ] Environment variables set on Railway
- [ ] IPN URL configured in Pesapal
- [ ] Pesapal callback URL matches Railway URL
- [ ] Tested payment flow end-to-end
- [ ] Checked that payments arrive at 254746630940
- [ ] Set up email notifications for payments

---

## Payment Flow (Step by Step)

```
1. User enters phone: 254712345678
   ↓
2. Click "Confirm Payment"
   ↓
3. Frontend calls: /api/pesapal/initiate
   ↓
4. Backend initiates with Pesapal API
   ↓
5. Pesapal returns payment URL
   ↓
6. User redirected to Pesapal payment page
   ↓
7. User selects M-Pesa
   ↓
8. STK popup appears on user's phone
   ↓
9. User enters M-Pesa PIN (in official Safaricom popup)
   ↓
10. Payment sent to 254746630940
    ↓
11. Pesapal sends confirmation to your backend (IPN)
    ↓
12. Backend logs transaction
    ↓
13. User redirected back to your site (optional)
```

---

## File Structure

```
prompt/
├── index.html           # Frontend (on Vercel)
├── style.css
├── script.js
├── backend/             # Backend (on Railway)
│   ├── pesapal-server.js
│   ├── package.json
│   └── .env.example
└── vercel.json
```

---

## Environment Variables Summary

### Frontend (Vercel)
No changes needed - frontend is already deployed ✓

### Backend (Railway)

```env
PESAPAL_CONSUMER_KEY=your_key
PESAPAL_CONSUMER_SECRET=your_secret
CALLBACK_URL=https://your-railway-app.railway.app/api/pesapal/callback
PORT=3000
```

---

## Troubleshooting

### "Payment endpoint not responding"
- Check Railway deployment logs
- Verify environment variables are set
- Make sure callback URL is correct

### "Invalid credentials"
- Double-check Consumer Key and Secret
- Make sure they match your Pesapal account
- No extra spaces or typos

### "Callback not received"
- Verify IPN URL in Pesapal dashboard
- Check backend logs for incoming requests
- Make sure CALLBACK_URL env variable is correct

### "Payment not arriving"
- Check Pesapal dashboard for transaction status
- Verify recipient number (254746630940) is correct
- Check with Pesapal support

---

## Support & Resources

**Pesapal:**
- Website: https://pesapal.com
- Docs: https://developer.pesapal.com
- Support: support@pesapal.com

**Railway:**
- Website: https://railway.app
- Docs: https://docs.railway.app

**Your GitHub Repo:**
- https://github.com/RICHARD7617/prompt

---

## Next Steps

1. ✅ Frontend deployed on Vercel (DONE)
2. 🔧 Create Pesapal account (DO THIS FIRST)
3. 🔧 Get API credentials
4. 🔧 Deploy backend to Railway
5. 🔧 Set environment variables
6. 🔧 Configure IPN Webhook
7. ✅ Test end-to-end
8. ✅ Go live!

---

## Security Notes

✅ **This setup is safe because:**
- Users never enter PIN on your website
- Only phone number collected
- Pesapal handles security
- Payment happens on Pesapal's platform
- Backend has no sensitive data in code
- Credentials stored in environment variables

---

## Questions?

If something doesn't work:

1. Check Railway deployment logs
2. Verify environment variables
3. Test with `curl` or Postman:
```bash
curl -X POST http://localhost:3000/api/pesapal/initiate \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"254712345678","amount":30}'
```

4. Check Pesapal dashboard for API errors
5. Contact Pesapal support with error message

---

**You're all set to accept real M-Pesa payments! 🚀**
