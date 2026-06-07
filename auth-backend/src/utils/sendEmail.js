import nodemailer from "nodemailer";

const sendEmail = async (email, subject, message) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },

    // Prevent hanging if SMTP is slow/blocked
    connectionTimeout: 10000,  // 10s to establish connection
    greetingTimeout: 10000,    // 10s for server greeting
    socketTimeout: 15000       // 15s for socket inactivity
  });

  // Pre-check: verify SMTP credentials are valid before attempting to send
  try {
    await transporter.verify();
  } catch (verifyErr) {
    console.error("━━━ EMAIL AUTH VERIFICATION FAILED ━━━");
    console.error("EMAIL_USER:", process.env.EMAIL_USER || "(not set)");
    console.error("EMAIL_PASS:", process.env.EMAIL_PASS ? `set (${process.env.EMAIL_PASS.length} chars)` : "(not set)");
    console.error("Error code:", verifyErr.code);
    console.error("Error response:", verifyErr.response);
    console.error("Error message:", verifyErr.message);
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    throw verifyErr;
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html: message
    });
    console.log(`✓ Email sent to ${email} (messageId: ${info.messageId})`);
  } catch (sendErr) {
    console.error("━━━ EMAIL SEND FAILED ━━━");
    console.error("To:", email);
    console.error("Subject:", subject);
    console.error("Error code:", sendErr.code);
    console.error("Error response:", sendErr.response);
    console.error("Error responseCode:", sendErr.responseCode);
    console.error("Error command:", sendErr.command);
    console.error("Error message:", sendErr.message);
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━");
    throw sendErr;
  }

};

export default sendEmail;