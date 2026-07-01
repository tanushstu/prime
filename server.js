const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

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

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpUser || !smtpPass || smtpUser.includes('your_email@gmail.com')) {
        console.error('SMTP credentials are not configured in the .env file.');
        return res.status(500).json({
            success: false,
            message: 'Email server is currently not configured. Please check SMTP_USER in the backend .env file.'
        });
    }

    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: smtpUser,
                pass: smtpPass
            }
        });

        // Build email HTML with premium PRIME branding
        let orderItemsHtml = '';
        cart.forEach(item => {
            orderItemsHtml += `
                <tr style="border-bottom: 1px solid #e0e0e0;">
                    <td style="padding: 12px 0; font-family: 'Arial Black', Gadget, sans-serif; font-size: 14px; color: #000000; text-transform: uppercase;">
                        ${item.name}
                        <div style="font-family: Arial, sans-serif; font-size: 11px; color: #757575; font-weight: normal; margin-top: 4px;">
                            QTY: ${item.quantity} × $${item.price.toFixed(2)}
                        </div>
                    </td>
                    <td style="padding: 12px 0; text-align: right; font-family: 'Arial Black', Gadget, sans-serif; font-size: 14px; color: #000000;">
                        $${(item.price * item.quantity).toFixed(2)}
                    </td>
                </tr>
            `;
        });

        const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>PRIME Order Confirmed</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f4; -webkit-text-size-adjust: none; text-size-adjust: none;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4; padding: 20px 0;">
                <tr>
                    <td align="center">
                        <!-- Main Card Container -->
                        <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border: 3px solid #000000; border-radius: 0px; overflow: hidden; box-shadow: 8px 8px 0px #000000;">
                            
                            <!-- Header Block -->
                            <tr>
                                <td style="background-color: #000000; padding: 40px 30px; text-align: center;">
                                    <h1 style="margin: 0; font-family: 'Arial Black', Gadget, sans-serif; font-size: 38px; letter-spacing: -2px; color: #ffffff; text-transform: uppercase; line-height: 1;">PRIME</h1>
                                    <p style="margin: 10px 0 0 0; font-family: Arial, sans-serif; font-weight: bold; font-size: 12px; color: #ff0055; letter-spacing: 2px; text-transform: uppercase;">ORDER CONFIRMED</p>
                                </td>
                            </tr>
                            
                            <!-- Welcome Banner -->
                            <tr>
                                <td style="padding: 40px 30px 20px 30px; text-align: center;">
                                    <h2 style="margin: 0 0 10px 0; font-family: 'Arial Black', Gadget, sans-serif; font-size: 22px; color: #000000; text-transform: uppercase;">DRINK UP, CHAMP!</h2>
                                    <p style="margin: 0; font-family: Arial, sans-serif; font-size: 14px; color: #555555; line-height: 1.6;">
                                        Thank you for your purchase. Logan and KSI are packing your energy fuel right now. Here is your receipt and order summary:
                                    </p>
                                </td>
                            </tr>
                            
                            <!-- Order Summary Table -->
                            <tr>
                                <td style="padding: 20px 30px 40px 30px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                                        <thead>
                                            <tr style="border-bottom: 2px solid #000000;">
                                                <th align="left" style="padding-bottom: 10px; font-family: Arial, sans-serif; font-size: 11px; font-weight: bold; color: #757575; text-transform: uppercase; letter-spacing: 1px;">Product</th>
                                                <th align="right" style="padding-bottom: 10px; font-family: Arial, sans-serif; font-size: 11px; font-weight: bold; color: #757575; text-transform: uppercase; letter-spacing: 1px;">Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${orderItemsHtml}
                                            <!-- Total row -->
                                            <tr>
                                                <td style="padding: 20px 0 0 0; font-family: 'Arial Black', Gadget, sans-serif; font-size: 16px; color: #000000; text-transform: uppercase;">
                                                    TOTAL PAID
                                                </td>
                                                <td style="padding: 20px 0 0 0; text-align: right; font-family: 'Arial Black', Gadget, sans-serif; font-size: 18px; color: #ff0055;">
                                                    $${total.toFixed(2)}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            
                            <!-- Footer Info -->
                            <tr>
                                <td style="background-color: #f9f9f9; border-top: 1px solid #e0e0e0; padding: 30px; text-align: center;">
                                    <p style="margin: 0; font-family: Arial, sans-serif; font-size: 11px; color: #757575; line-height: 1.5; text-transform: uppercase;">
                                        If you have any questions, reply directly to this email or visit our store locator for retail locations.<br>
                                        © 2026 PRIME Hydration LLC. All rights reserved.
                                    </p>
                                </td>
                            </tr>
                            
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `;

        const mailOptions = {
            from: `"PRIME Hydration" <${smtpUser}>`,
            to: email,
            subject: 'PRIME Hydration - Order Confirmation',
            html: emailHtml
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Confirmation email sent successfully: %s', info.messageId);

        return res.status(200).json({ success: true, message: 'Confirmation email sent!' });
    } catch (error) {
        console.error('Error sending confirmation email via Gmail SMTP:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to send confirmation email. Check your SMTP configuration and Gmail settings.'
        });
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
