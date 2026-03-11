const express = require('express');
const { createAppointment, getAppointments } = require('../controllers/appointmentController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.post('/', createAppointment);
router.get('/', protect, admin, getAppointments);

module.exports = router;

