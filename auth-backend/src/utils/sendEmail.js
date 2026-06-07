import { Resend } from 'resend';

const sendEmail = async (email, subject, message) => {
  // Initialize Resend with the API key from environment variables
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { data, error } = await resend.emails.send({
      // For testing without a custom domain, Resend requires you to use onboarding@resend.dev
      from: process.env.RESEND_FROM_EMAIL || 'ACM JIT <onboarding@resend.dev>', 
      to: email,
      subject: subject,
      html: message
    });

    if (error) {
      console.error("━━━ RESEND EMAIL FAILED ━━━");
      console.error(error);
      throw error;
    }

    console.log(`✓ Email sent via Resend to ${email} (messageId: ${data.id})`);
    return data;
  } catch (err) {
    console.error("━━━ EMAIL SEND EXCEPTION ━━━");
    console.error(err);
    throw err;
  }
};

export default sendEmail;