// backend/utils/mailer.js
const sgMail = require("@sendgrid/mail");

// Set SendGrid API key from environment variable
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send an email
 * @param {{ to: string, subject: string, html: string, replyTo?: string }} options
 */
const sendEmail = async ({ to, subject, html, replyTo }) => {
  try {
    const msg = {
      to,
      from: `"Hostel Help Desk" <elmago6225@gmail.com>`, // verified sender
      subject,
      html,
    };

    // Optional replyTo
    if (replyTo) {
      msg.replyTo = replyTo;
    }

    const info = await sgMail.send(msg);
    console.log("✅ Email sent:", info);
    return info;
  } catch (error) {
    // Log detailed error from SendGrid response if available
    console.error("❌ Failed to send email:", error.response?.body || error.message);
    throw new Error("Failed to send email");
  }
};

/**
 * Optional: test SendGrid connection by sending a test email
 */
const verifyConnection = async () => {
  try {
    const testMsg = {
      to: "elmago6225@gmail.com",
      from: `"Hostel Help Desk" <elmago6225@gmail.com>`,
      subject: "Test Connection",
      html: "<p>SendGrid connection verified.</p>",
    };
    await sgMail.send(testMsg);
    console.log("✅ SendGrid connection is ready to take messages");
  } catch (err) {
    console.error("❌ SendGrid connection error:", err.response?.body || err.message);
  }
};

// Uncomment this line to run a one-time test on server startup
// verifyConnection();

module.exports = { sendEmail };