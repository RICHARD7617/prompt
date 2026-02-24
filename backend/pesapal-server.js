const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors({
    origin: '*',
    credentials: true
}));

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Pesapal credentials from environment variables
const PESAPAL_CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY;
const PESAPAL_CONSUMER_SECRET = process.env.PESAPAL_CONSUMER_SECRET;
const PESAPAL_API_URL = 'https://pay.pesapal.com/api'; // Production
const CALLBACK_URL = process.env.CALLBACK_URL;

// Validate environment variables on startup
if (!PESAPAL_CONSUMER_KEY || !PESAPAL_CONSUMER_SECRET) {
    console.warn('⚠️  WARNING: Pesapal credentials not set in environment variables');
    console.warn('Set PESAPAL_CONSUMER_KEY and PESAPAL_CONSUMER_SECRET');
}

if (!CALLBACK_URL) {
    console.warn('⚠️  WARNING: CALLBACK_URL not set in environment variables');
}

// Get Pesapal auth token
async function getPesapalToken() {
    try {
        const response = await axios.post(`${PESAPAL_API_URL}/Auth/RequestToken`, {
            consumer_key: PESAPAL_CONSUMER_KEY,
            consumer_secret: PESAPAL_CONSUMER_SECRET
        });
        return response.data.token;
    } catch (error) {
        console.error('Pesapal token error:', error.response?.data || error.message);
        throw error;
    }
}

// Submit order to Pesapal
async function submitOrderToPesapal(token, orderData) {
    try {
        const response = await axios.post(
            `${PESAPAL_API_URL}/Transactions/SubmitOrderDetails`,
            {
                order_details: {
                    order_type: 'MERCHANT',
                    order_ts: Math.floor(Date.now() / 1000),
                    order_amount: orderData.amount,
                    order_currency: 'KES',
                    order_description: orderData.description,
                    order_reference: orderData.reference,
                    billing_address: {
                        phone_number: orderData.phoneNumber,
                        country_code: 'KE'
                    },
                    subscriber_email: orderData.email || 'donor@example.com'
                },
                redirect_mode: 'REDIRECT',
                ipn_notifications_url: CALLBACK_URL
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Pesapal order error:', error.response?.data || error.message);
        throw error;
    }
}

// API endpoint to initiate payment
app.post('/api/pesapal/initiate', async (req, res) => {
    try {
        const { phoneNumber, amount, recipientNumber } = req.body;

        // Validate input
        if (!phoneNumber || !amount) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        // Get Pesapal token
        const token = await getPesapalToken();

        // Generate unique reference
        const reference = 'KSH30-' + Date.now();

        // Prepare order data
        const orderData = {
            amount: amount,
            description: 'Support donation',
            reference: reference,
            phoneNumber: phoneNumber,
            email: `${phoneNumber}@pesapal.local` // Pesapal requires email
        };

        // Submit order to Pesapal
        const pesapalResponse = await submitOrderToPesapal(token, orderData);

        // Pesapal returns a payment URL
        const paymentUrl = pesapalResponse.redirect_url || pesapalResponse.payment_url;

        if (!paymentUrl) {
            return res.status(500).json({
                success: false,
                error: 'Failed to get payment URL from Pesapal'
            });
        }

        res.json({
            success: true,
            reference: reference,
            paymentUrl: paymentUrl, // Redirect user to this URL
            message: 'Redirecting to payment...'
        });

    } catch (error) {
        console.error('Initiate payment error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Payment initiation failed'
        });
    }
});

// Receive payment confirmation from Pesapal
app.post('/api/pesapal/callback', (req, res) => {
    try {
        console.log('Pesapal Callback Received:', req.body);

        // Verify payment status
        const { OrderTrackingId, OrderStatus, OrderAmount, OrderReference } = req.body;

        if (OrderStatus === 'COMPLETED') {
            console.log(`✅ Payment successful: ${OrderReference} - KES ${OrderAmount}`);
            
            // TODO: Update your database
            // - Mark order as paid
            // - Send receipt email
            // - Log transaction
        } else if (OrderStatus === 'FAILED') {
            console.log(`❌ Payment failed: ${OrderReference}`);
            // TODO: Handle failed payment
        } else if (OrderStatus === 'PENDING') {
            console.log(`⏳ Payment pending: ${OrderReference}`);
            // TODO: Handle pending payment
        }

        // Always respond with 200 to confirm receipt
        res.json({ success: true });

    } catch (error) {
        console.error('Callback error:', error);
        res.status(200).json({ success: true }); // Still return 200 to Pesapal
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'production'
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'Pesapal Payment Backend',
        version: '1.0.0',
        endpoints: [
            'POST /api/pesapal/initiate',
            'POST /api/pesapal/callback',
            'GET /api/health'
        ]
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        error: err.message || 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        path: req.path
    });
});

// Start server
const server = app.listen(PORT, () => {
    console.log('════════════════════════════════════════');
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log('════════════════════════════════════════');
    console.log(`📍 Health: http://localhost:${PORT}/api/health`);
    console.log(`📍 Callback: http://localhost:${PORT}/api/pesapal/callback`);
    console.log('════════════════════════════════════════');
    
    if (CALLBACK_URL) {
        console.log(`✅ CALLBACK_URL configured: ${CALLBACK_URL}`);
    } else {
        console.warn('⚠️  CALLBACK_URL not configured');
    }
    
    if (PESAPAL_CONSUMER_KEY && PESAPAL_CONSUMER_SECRET) {
        console.log('✅ Pesapal credentials configured');
    } else {
        console.warn('⚠️  Pesapal credentials NOT configured');
    }
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

module.exports = app;
