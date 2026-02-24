# Backend Server - Pesapal Integration

This is the Node.js backend server that handles M-Pesa payments via Pesapal.

**Status:** Ready to deploy 🚀

---

## What This Backend Does

1. **Receives payment requests** from your frontend (Vercel)
2. **Calls Pesapal API** to initiate payment
3. **Returns payment URL** to redirect users
4. **Receives payment confirmation** via webhooks (IPN)
5. **Logs transactions** for your records

---

## Prerequisites

- Node.js 18.x or higher
- Pesapal account (get from https://pesapal.com)
- Pesapal API credentials (Consumer Key + Secret)

---

## Local Setup

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `express` - Web server
- `axios` - HTTP requests to Pesapal
- `dotenv` - Environment variables
- `cors` - Allow cross-origin requests from Vercel

### 2. Create Environment File

```bash
cp .env.example .env
```

Edit `.env` with your Pesapal credentials:

```env
PESAPAL_CONSUMER_KEY=abc123xyz789
PESAPAL_CONSUMER_SECRET=secret456def012
CALLBACK_URL=http://localhost:3000/api/pesapal/callback
PORT=3000
```

### 3. Start Server

```bash
npm start
```

Server will run on `http://localhost:3000`

For development with auto-reload:
```bash
npm install -g nodemon
npm run dev
```

---

## Deployment

### Option 1: Railway (Recommended) ⭐

Railway is the easiest option.

#### Steps:

1. Go to https://railway.app
2. Create new project
3. Select **"Deploy from GitHub"**
4. Choose **RICHARD7617/prompt**
5. Let Railway auto-detect Node.js configuration
6. Go to **Variables** and add:

```env
PESAPAL_CONSUMER_KEY=your_key
PESAPAL_CONSUMER_SECRET=your_secret
CALLBACK_URL=https://your-railway-domain.railway.app/api/pesapal/callback
```

7. Deploy completes automatically
8. Your backend URL: `https://your-railway-domain.railway.app`

### Option 2: Heroku (Legacy)

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set PESAPAL_CONSUMER_KEY=your_key
heroku config:set PESAPAL_CONSUMER_SECRET=your_secret
heroku config:set CALLBACK_URL=https://your-app-name.herokuapp.com/api/pesapal/callback

# Deploy
git push heroku main
```

### Option 3: AWS Lambda

Use AWS Lambda + API Gateway for serverless deployment.

---

## API Endpoints

### POST `/api/pesapal/initiate`

Initiate a payment request.

**Request:**
```json
{
  "phoneNumber": "254712345678",
  "amount": 30,
  "currency": "KSH",
  "recipientNumber": "254746630940"
}
```

**Response (Success):**
```json
{
  "success": true,
  "reference": "KSH30-1708876543210",
  "paymentUrl": "https://pesapal.com/payment/abc123xyz",
  "message": "Redirecting to payment..."
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Invalid phone number"
}
```

### POST `/api/pesapal/callback`

Receives payment confirmation from Pesapal (webhook).

Pesapal sends this automatically when payment completes.

**Request (from Pesapal):**
```json
{
  "OrderTrackingId": "..."
  "OrderStatus": "COMPLETED",
  "OrderAmount": 30,
  "OrderReference": "KSH30-1708876543210"
}
```

### GET `/api/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

---

## Configuration

### Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `PESAPAL_CONSUMER_KEY` | Pesapal API key | Yes | abc123xyz789 |
| `PESAPAL_CONSUMER_SECRET` | Pesapal API secret | Yes | secret456def |
| `CALLBACK_URL` | Where Pesapal sends confirmations | Yes | https://app.railway.app/api/pesapal/callback |
| `PORT` | Server port | No | 3000 |

### Pesapal Settings

1. Go to Pesapal Dashboard
2. Settings → Webhooks/Notifications
3. Set **IPN URL** to your callback URL:
```
https://your-backend-domain.com/api/pesapal/callback
```

---

## File Structure

```
backend/
├── pesapal-server.js    # Main server file
├── package.json         # Dependencies
├── package-lock.json    # Locked versions
├── .env.example         # Template variables
├── .env                 # Your actual variables (git ignored)
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

---

## Troubleshooting

### "Cannot find module 'express'"

```bash
npm install
```

### "PESAPAL_CONSUMER_KEY is undefined"

Check that `.env` file exists and has correct values:
```bash
cat .env
```

### "Connection refused"

Server not running. Start it:
```bash
npm start
```

### "Invalid token"

Your Pesapal credentials are wrong. Double-check:
- Consumer Key
- Consumer Secret
- No extra spaces or typos

### "Callback not working"

1. Verify IPN URL in Pesapal dashboard
2. Check it matches your backend domain
3. Make sure backend is running
4. Check server logs for incoming POST requests

---

## Production Deployment Checklist

- [ ] Create Pesapal account
- [ ] Get Consumer Key and Secret
- [ ] Deploy to Railway/Heroku/AWS
- [ ] Add environment variables
- [ ] Test payment endpoint with curl
- [ ] Configure IPN/Webhook URL in Pesapal
- [ ] Test end-to-end payment flow
- [ ] Check payment arrives at 254746630940
- [ ] Enable payment notifications
- [ ] Set up payment logging/database

---

## Security

✅ **Best Practices:**
- Never commit `.env` file to git
- Use strong credentials
- Enable HTTPS (automatic on Railway/Heroku)
- Validate all inputs
- Log all transactions
- Monitor for fraud

❌ **Never:**
- Hardcode credentials
- Send credentials in requests
- Store credentials in frontend
- Log sensitive data

---

## Monitoring & Logs

### Local
```bash
npm start
# Watch for console output
```

### Railway
1. Go to project dashboard
2. Click "Logs"
3. View real-time server output

### Heroku
```bash
heroku logs --tail
```

---

## Testing

### Test Endpoint

```bash
curl -X POST http://localhost:3000/api/pesapal/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "254712345678",
    "amount": 30
  }'
```

### Test Health Check

```bash
curl http://localhost:3000/api/health
```

---

## Next Steps

1. Get Pesapal credentials
2. Create `.env` file with credentials
3. Test locally: `npm start`
4. Deploy to Railway/Heroku
5. Configure IPN URL
6. Update frontend with backend URL
7. Test end-to-end
8. Go live!

See **PESAPAL_SETUP.md** for detailed setup instructions.

---

## Support

- **Pesapal Docs:** https://developer.pesapal.com
- **Railway Docs:** https://docs.railway.app
- **Node.js Docs:** https://nodejs.org/docs

---

**Ready to accept real payments! 🚀**
