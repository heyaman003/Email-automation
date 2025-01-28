const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
dotenv.config();

const SMTP_SERVER = {}; // Cache for transporters

// Function to get or create a transporter
const getOrCreateTransporter = async (credinitals) => {
    console.log("------------------The credinitals is--------------------",credinitals);
    if (SMTP_SERVER[credinitals.email]) {
        // Return existing transporter if available
        console.log(`Reusing transporter for ${credinitals.email}`);
        return SMTP_SERVER[credinitals.email];
    }

    console.log(`Creating new transporter for ${credinitals.email}`);
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: 'smtp.gmail.com',
        port: 587,
        secure: true,
        auth: {
            user: credinitals.email,
            pass: credinitals.password,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    // Verify the transporter and cache it
    await transporter.verify();
    console.log(`Transporter verified and cached for ${credinitals.email}`);
    SMTP_SERVER[credinitals.email] = transporter;

    return transporter;
};

// Function to send email verification
const sendEmailVerification = async (recipient, subject, content, attachments, credinitals) => {
    // Get or create the transporter
    const transporter = await getOrCreateTransporter(credinitals);

    // Email configurations
    const mailConfigurations = {
        from: credinitals.email,
        to: recipient.email,
        subject: subject[0],
        html: content[0].replace("[RecipientName]", recipient.name),
        attachments: attachments
    };

    try {
        // Send email using the transporter
        const info = await transporter.sendMail(mailConfigurations);
        console.log(`Email sent successfully to ${recipient.email}`);
    } catch (error) {
        console.error(`Error sending email to ${recipient.email}:`, error);

        // Specific error handling
        if (error.responseCode === 550) {
            console.error('Address not found or unable to receive mail.');
        } else {
            console.error('An unexpected error occurred while sending the email.');
        }
        throw new Error(`Failed to send email to ${recipient.email}`);
    }
};

module.exports = {sendEmailVerification,getOrCreateTransporter};
