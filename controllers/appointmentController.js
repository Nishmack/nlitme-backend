const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const { notifyNewAppointment } = require('../notifications/adminNotifier');
const { sendEmail } = require('../notifications/emailSender');

const createAppointment = async (req, res) => {
  const { name, phone, email, date, time, serviceId, notes } = req.body;

  if (!name || !phone || !date || !time) {
    res.status(400);
    throw new Error('Name, phone, date, and time are required');
  }

  let service = null;

  if (serviceId) {
    service = await Service.findById(serviceId);
    if (!service) {
      res.status(400);
      throw new Error('Invalid service ID');
    }
  }

  const appointment = await Appointment.create({
    name,
    phone,
    email,
    date,
    time,
    service: service ? service._id : undefined,
    notes,
    createdBy: req.user ? req.user.id : undefined
  });

  const populated = await Appointment.findById(appointment._id).populate('service', 'name');

  await notifyNewAppointment({
    ...populated.toObject(),
    service: populated.service
  });

  const salesEmail = process.env.SALES_EMAIL || process.env.ADMIN_EMAIL;
  if (salesEmail) {
    const textLines = [
      'New appointment request from nlit.me',
      '',
      `Name: ${name}`,
      `Phone: ${phone}`,
      email ? `Email: ${email}` : null,
      `Date: ${new Date(date).toISOString().split('T')[0]}`,
      `Time: ${time}`,
      populated.service ? `Service: ${populated.service.name}` : null,
      '',
      'Notes:',
      notes || '(none)'
    ].filter(Boolean);

    await sendEmail({
      to: salesEmail,
      subject: 'New Appointment Request - nlit.me',
      text: textLines.join('\n')
    });
  }

  res.status(201).json(populated);
};

const getAppointments = async (req, res) => {
  const appointments = await Appointment.find()
    .populate('service', 'name')
    .sort({ createdAt: -1 });

  res.json(appointments);
};

module.exports = {
  createAppointment,
  getAppointments
};

