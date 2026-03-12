const mongoose = require('mongoose');
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
    // Make sure this is a *real* MongoDB ObjectId (24-char hex string)
    const isRealObjectId =
      typeof serviceId === 'string' &&
      /^[0-9a-fA-F]{24}$/.test(serviceId) &&
      mongoose.Types.ObjectId.isValid(serviceId);

    if (isRealObjectId) {
      service = await Service.findById(serviceId);
      if (!service) {
        res.status(400);
        throw new Error('Invalid service ID');
      }
    } else {
      // Non-ObjectId values like "anxiety" from service slug – ignore for DB relation
      service = null;
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
    let serviceLabel = null;
    if (populated.service && populated.service.name) {
      serviceLabel = populated.service.name;
    } else if (typeof serviceId === 'string') {
      serviceLabel = serviceId;
    }

    const textLinesRaw = [
      'New appointment request from nlit.me',
      '',
      `Name: ${name}`,
      `Phone: ${phone}`,
      email ? `Email: ${email}` : null,
      `Date: ${new Date(date).toISOString().split('T')[0]}`,
      `Time: ${time}`,
      serviceLabel ? `Service: ${serviceLabel}` : null,
      '',
      'Notes:',
      notes || '(none)'
    ];

    const textLines = textLinesRaw.filter(Boolean);

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
