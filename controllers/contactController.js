const { sendEmail } = require('../notifications/emailSender');

const sendContactMessage = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !message) {
    res.status(400);
    throw new Error('Name and message are required');
  }

  const salesEmail = process.env.SALES_EMAIL || 'nishmack99@gmail.com';

  const text = [
    'New contact inquiry from nlit.me',
    '',
    `Name: ${name}`,
    email ? `Email: ${email}` : null,
    '',
    'Message:',
    message
  ]
    .filter(Boolean)
    .join('\n');

  await sendEmail({
    to: salesEmail,
    subject: 'New Contact Inquiry - nlit.me',
    text
  });

  res.status(200).json({ success: true });
};

module.exports = {
  sendContactMessage
};

