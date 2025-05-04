const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a reusable transporter using SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service provider
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS  // Your email password or app password
    }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender address
            to,                           // Receiver's email address
            subject,                      // Subject line
            text,                           // Plain text body
            html, // HTML content                          
        };

        const info = await transporter.sendMail(mailOptions); // Use the defined transporter here
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};



module.exports = sendEmail;