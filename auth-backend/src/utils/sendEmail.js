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

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html: message
  });

};

export default sendEmail;