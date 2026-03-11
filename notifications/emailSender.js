const nodemailer = require('nodemailer');

let cachedTransporter;

const getTransporter = () => {
  if (cachedTransporter) return cachedTransporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn('Email configuration missing. Emails will not be sent.');
    return null;
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });

  return cachedTransporter;
};

const sendEmail = async ({ to, subject, text }) => {
  const transporter = getTransporter();

  if (!transporter) {
    console.log('Intended email (not sent due to missing config):');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Body:\n', text);
    return;
  }

  const fromAddress =
    process.env.EMAIL_FROM_NAME && process.env.EMAIL_FROM
      ? `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`
      : process.env.EMAIL_FROM || process.env.SMTP_USER;

  await transporter.sendMail({
    from: fromAddress,
    to,
    subject,
    text
  });
};

module.exports = {
  sendEmail
};

