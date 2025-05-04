const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();

// Configure Brevo API key
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;  // 🔐 Load from .env

// Create an instance of Brevo transactional email API
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Function to send email
const sendEmail = async (to, subject, text, html) => {
    try {
        const emailData = {
            to: [{ email: to }],
            sender: {
                name: "Your Service's Name",
                email: process.env.BREVO_EMAIL_USER // ✅ Verified sender
            },
            subject: subject,
            htmlContent: html || `<p>${text}</p>`  // Fallback to plain text if HTML not provided
        };

        const response = await apiInstance.sendTransacEmail(emailData);
        console.log('✅ Email sent successfully:', response.messageId || response);
    } catch (error) {
        console.error('❌ Error sending email:', error.response?.body || error);
    }
};

module.exports = sendEmail;
