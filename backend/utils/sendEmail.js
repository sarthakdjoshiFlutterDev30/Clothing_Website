const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const port = Number(process.env.SMTP_PORT) || 587;
  const isSecure = port === 465; // true for 465, false for 587/25

  // Create transporter (correct API: createTransport)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port,
    secure: isSecure,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    }
  });

  // Define email options with safe fallbacks
  const fromEmail = process.env.FROM_EMAIL || process.env.SMTP_EMAIL;
  const fromName = process.env.FROM_NAME || 'Goodluck Fashion';

  const mailOptions = {
    from: `${fromName} <${fromEmail}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html
  };

  // Send email
  const info = await transporter.sendMail(mailOptions);
  console.log('Message sent: %s', info.messageId);
  return info;
};

module.exports = sendEmail;
