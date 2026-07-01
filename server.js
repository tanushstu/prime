const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { sendConfirmationEmail } = require('./lib/mailer');

const app = express();
const PORT = process.env.PORT || 8080;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Serve static assets from this directory
app.use(express.static(__dirname));

// API Endpoint to send checkout email
app.post('/api/send-email', async (req, res) => {
    const { email, cart, total } = req.body;

    if (!email || !cart || !Array.isArray(cart) || cart.length === 0) {
        return res.status(400).json({ success: false, message: 'Missing email or cart details.' });
    }

    try {
        const info = await sendConfirmationEmail(email, cart, total);
        console.log('Confirmation email sent successfully: %s', info.messageId);
        return res.status(200).json({ success: true, message: 'Confirmation email sent!' });
    } catch (error) {
        console.error('Error sending confirmation email via Gmail SMTP:', error);
        const message = error.message.includes('SMTP credentials')
            ? 'Email server is currently not configured. Please check SMTP_USER in the backend .env file.'
            : 'Failed to send confirmation email. Check your SMTP configuration and Gmail settings.';
        return res.status(500).json({ success: false, message });
    }
});

// Fallback: serve index.html for undefined UI routes (enables cleaner navigation)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`PRIME Server running on http://localhost:${PORT}`);
});
