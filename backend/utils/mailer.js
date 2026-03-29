const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send an email via Resend (works on Render free tier)
 * @param {{ to: string, subject: string, html: string }} options
 */
const sendEmail = async ({ to, subject, html }) => {
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || "Hostel Help Desk <onboarding@resend.dev>",
    to,
    subject,
    html,
  });

  if (error) {
    console.error("❌ Failed to send email:", error);
    throw new Error(error.message);
  }
};

module.exports = { sendEmail };
