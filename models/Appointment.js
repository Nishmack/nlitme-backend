const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true
    },
    email: {
      type: String,
      trim: true
    },
    date: {
      type: Date,
      required: [true, 'Date is required']
    },
    time: {
      type: String,
      required: [true, 'Time is required']
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service'
    },
    notes: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;

