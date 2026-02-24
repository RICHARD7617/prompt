⚠️ CRITICAL: Why Your Website CANNOT Accept Real M-Pesa Payments (Yet)

This document explains the legal and technical issues, and how to fix them.

---

## ❌ THE PROBLEM

Your current website:
- Collects user phone numbers (good ✓)
- Shows a fake "payment successful" message (bad ✗)
- Does NOT actually send money to anyone
- JavaScript browser code CANNOT access M-Pesa

### Why This Is Dangerous

1. **Users might think money was sent when it wasn't**
2. **Asking for M-Pesa PINs on a website is illegal** (fraud/phishing)
3. **Safaricom can block your line**
4. **You can face criminal charges**

---

## ✅ THE SOLUTION

To accept REAL M-Pesa payments legally and securely:

### Step 1: Set Up a Backend Server

You MUST have a backend that:
- Receives payment requests from your website
- Communi­cates with Safaricom's M-Pesa API (Daraja API)
- Initiates an STK push to the user's phone
- Handles payment confirmation

### Step 2: Use Safaricom's Daraja API

**What is Daraja API?**
- Safaricom's official payment gateway
- Push money to users securely
- User enters PIN only in official Safaricom STK popup
- Your website NEVER sees the PIN

**STK Push Flow:**
```
User's Phone Number (from website)
    ↓
Your Backend Server
    ↓
Safaricom Daraja API
    ↓
STK Popup appears on user's phone
    ↓
User enters M-Pesa PIN (in official popup, NOT on website)
    ↓
Payment sent to 254746630940
    ↓
Confirmation sent to your backend
```

---

## 🛠️ HOW TO IMPLEMENT

### Option 1: Use a Payment Service (Easiest)

Services that handle Daraja API for you:

**1. Pesapal** (Recommended)
   - Website: https://www.pesapal.com/
   - Handles all M-Pesa integration
   - Easy API
   - Support for multiple payment methods

**2. Intasend**
   - Website: https://intasend.com/
   - M-Pesa STK integration
   - Webhooks for confirmations
   - Good documentation

**3. Flutterwave**
   - Website: https://flutterwave.com/
   - Multiple payment methods
   - Easy integration
   - Production-ready

### Option 2: Direct Daraja API (Most Control)

If you want to use Safaricom's API directly:

**Setup Steps:**

1. **Register for M-Pesa Developer Account**
   - Go to: https://developer.safaricom.co.ke/
   - Create account
   - Create app
   - Get credentials

2. **Get M-Pesa Credentials:**
   - Consumer Key
   - Consumer Secret
   - Business Short Code (till number)
   - Passkey

3. **Create a Backend (Node.js Example)**

```javascript
// backend/mpesa-payment.js
const axios = require('axios');

// Get M-Pesa access token
async function getMpesaToken() {
    const auth = Buffer.from(
        `${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`
    ).toString('base64');

    const response = await axios.get(
        'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
        {
            headers: { Authorization: `Basic ${auth}` }
        }
    );
    
    return response.data.access_token;
}

// Initiate STK Push
async function initiateStkPush(phoneNumber, amount, accountRef) {
    const token = await getMpesaToken();
    
    const timestamp = new Date().toISOString()
        .replace(/[^0-9]/g, '')
        .slice(0, -3);
    
    const password = Buffer.from(
        `${process.env.BUSINESS_SHORT_CODE}${process.env.PASSKEY}${timestamp}`
    ).toString('base64');

    const response = await axios.post(
        'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
        {
            BusinessShortCode: process.env.BUSINESS_SHORT_CODE,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: amount,
            PartyA: phoneNumber,
            PartyB: process.env.BUSINESS_SHORT_CODE,
            PhoneNumber: phoneNumber,
            CallBackURL: `${process.env.CALLBACK_URL}/mpesa/callback`,
            AccountReference: accountRef,
            TransactionDesc: 'Support donation'
        },
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );

    return response.data;
}

module.exports = { initiateStkPush };
```

4. **Create an Express Endpoint**

```javascript
// server.js
const express = require('express');
const { initiateStkPush } = require('./mpesa-payment');

const app = express();
app.use(express.json());

app.post('/api/mpesa/initiate', async (req, res) => {
    try {
        const { phoneNumber, amount, recipientNumber } = req.body;

        // Validate input
        if (!phoneNumber || !amount) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        // Initiate M-Pesa payment
        const result = await initiateStkPush(
            phoneNumber,
            amount,
            'KSH-30-DONATION'
        );

        if (result.ResponseCode === '0') {
            return res.json({
                success: true,
                reference: result.CheckoutRequestID,
                message: 'STK push sent to your phone'
            });
        } else {
            return res.json({
                success: false,
                error: result.ResponseDescription
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Handle M-Pesa callback
app.post('/mpesa/callback', (req, res) => {
    console.log('M-Pesa Callback:', req.body);
    
    // Process payment confirmation
    // Log to database
    // Send receipt email
    // etc.
    
    res.json({ success: true });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
```

---

## 🚀 DEPLOYMENT WITH BACKEND

### Option A: Vercel + Heroku

**Frontend:** Vercel (already done ✓)
**Backend:** Heroku (free tier available)

```bash
# Deploy backend to Heroku
heroku login
heroku create your-backend-name
git push heroku main
```

### Option B: Railway

**Deploy both frontend and backend:**
- Go to railway.app
- Connect your GitHub repo
- Configure environment variables
- Deploy in one click

### Option C: AWS/Azure

More complex but more scalable

---

## 📋 CHECKLIST

Before going live:

- [ ] Choose payment service (Pesapal recommended)
- [ ] Create business account
- [ ] Get API credentials
- [ ] Build backend server
- [ ] Test in sandbox/demo mode
- [ ] Get M-Pesa till number
- [ ] Deploy backend
- [ ] Update frontend with backend URL
- [ ] Test end-to-end
- [ ] Submit for Safaricom approval (if needed)
- [ ] Go live

---

## 🔐 SECURITY BEST PRACTICES

1. **Never expose credentials**
   ```
   Use environment variables:
   CONSUMER_KEY=xxxxx
   CONSUMER_SECRET=xxxxx
   BUSINESS_SHORT_CODE=xxxxx
   PASSKEY=xxxxx
   ```

2. **Validate all inputs**
   - Phone number format
   - Amount limits
   - Request authenticity

3. **Store transactions securely**
   - Log all payments
   - Verify callbacks
   - Match amounts

4. **Use HTTPS only**
   - All API calls HTTPS
   - All website HTTPS

5. **Rate limiting**
   - Prevent duplicate payments
   - Limit requests per user

---

## 📚 HELPFUL RESOURCES

**Safaricom Daraja API:**
- https://developer.safaricom.co.ke/

**Payment Services:**
- Pesapal: https://www.pesapal.com/
- Intasend: https://intasend.com/
- Flutterwave: https://flutterwave.com/

**M-Pesa Documentation:**
- https://developer.safaricom.co.ke/docs

**Node.js M-Pesa Libraries:**
- https://www.npmjs.com/package/safaricom-daraja

---

## ❓ FREQUENTLY ASKED QUESTIONS

**Q: Can I use this without a backend?**
A: No. M-Pesa requires secure backend communication.

**Q: Is it legal to collect phone numbers?**
A: Yes, but you must use them only for payment.

**Q: What about security?**
A: Your backend communicates with Safaricom. Users only see the official STK popup.

**Q: How much does this cost?**
A: M-Pesa charges ~1-5% per transaction (varies by amount).

**Q: Can I test without paying real money?**
A: Yes, Safaricom provides a sandbox/demo environment.

---

## ✅ CURRENT STATUS

Your website now:
- ✅ Collects phone numbers securely
- ✅ Ready for backend integration
- ✅ Proper form validation
- ✅ Professional UI
- ✅ Deployed on Vercel

Next steps:
1. Choose a payment service
2. Build backend
3. Connect frontend to backend
4. Test thoroughly
5. Go live

---

**Need help?** Follow the implementation guides above. Start with Pesapal (easiest) or Daraja API (most control).

**NEVER collect M-Pesa PINs on your website.** It's illegal and dangerous.
