require('dotenv').config();
const { sendConfirmationEmail } = require('../lib/mailer');

// Vercel serverless function — handles POST /api/send-email in production.
module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ success: false, message: 'Method not allowed.' });
    }

    const { email, cart, total } = req.body || {};

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
            ? 'Email server is currently not configured. Please check SMTP_USER/SMTP_PASS in the Vercel project environment variables.'
            : 'Failed to send confirmation email. Check your SMTP configuration and Gmail settings.';
        return res.status(500).json({ success: false, message });
    }
};
