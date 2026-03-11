const notifyNewAppointment = async (appointment) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@nlit.me';

  console.log('--- New Appointment Booking ---');
  console.log(`Admin: ${adminEmail}`);
  console.log(`Name: ${appointment.name}`);
  console.log(`Phone: ${appointment.phone}`);
  console.log(`Email: ${appointment.email || 'N/A'}`);
  console.log(`Date: ${appointment.date.toISOString().split('T')[0]}`);
  console.log(`Time: ${appointment.time}`);
  console.log(`Service: ${appointment.service?.name || appointment.service}`);
  console.log(`Notes: ${appointment.notes || 'N/A'}`);
  console.log('--------------------------------');
};

module.exports = {
  notifyNewAppointment
};

