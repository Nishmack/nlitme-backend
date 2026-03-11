const sendWhatsAppMessage = async (to, body) => {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!to) {
    console.log('WhatsApp: missing recipient number');
    return;
  }

  if (!token || !phoneNumberId) {
    console.log('WhatsApp configuration missing. Message not sent via API.');
    console.log('Intended recipient:', to);
    console.log('Message body:', body);
    return;
  }

  const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: {
      preview_url: false,
      body
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error('WhatsApp API error:', response.status, errorText);
    }
  } catch (err) {
    console.error('WhatsApp API request failed:', err);
  }
};

module.exports = {
  sendWhatsAppMessage
};

