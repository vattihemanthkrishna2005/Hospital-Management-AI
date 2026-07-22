const { allQuery, getQuery, runQuery } = require('../config/db');

// Generate unique reference code e.g. MCH-948210
function generateRefCode() {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `MCH-${num}`;
}

// Book appointment
exports.bookAppointment = async (req, res) => {
  try {
    const {
      patient_id,
      patient_name,
      patient_email,
      patient_phone,
      doctor_id,
      doctor_name,
      specialization,
      appointment_date,
      appointment_time,
      symptoms
    } = req.body;

    if (!patient_name || !patient_email || !doctor_name || !appointment_date || !appointment_time) {
      return res.status(400).json({ error: 'Please provide all required appointment details.' });
    }

    const reference_code = generateRefCode();

    const result = await runQuery(
      `INSERT INTO appointments 
      (reference_code, patient_id, patient_name, patient_email, patient_phone, doctor_id, doctor_name, specialization, appointment_date, appointment_time, symptoms, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        reference_code,
        patient_id || null,
        patient_name,
        patient_email,
        patient_phone || '',
        doctor_id || 1,
        doctor_name,
        specialization || 'General Medicine',
        appointment_date,
        appointment_time,
        symptoms || '',
        'Scheduled'
      ]
    );

    const newAppointment = await getQuery('SELECT * FROM appointments WHERE id = ?', [result.id]);

    res.status(201).json({
      message: 'Appointment successfully booked!',
      appointment: newAppointment
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get appointments for specific patient by email or user ID
exports.getPatientAppointments = async (req, res) => {
  try {
    const { email } = req.params;
    const appointments = await allQuery(
      'SELECT * FROM appointments WHERE patient_email = ? OR patient_id = ? ORDER BY appointment_date DESC, appointment_time DESC',
      [email, req.user ? req.user.id : 0]
    );
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await allQuery('SELECT * FROM appointments ORDER BY id DESC');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: Update appointment status (Scheduled, Checked-in, In Consultation, Completed, Cancelled)
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Scheduled', 'Checked-in', 'In Consultation', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value.' });
    }

    await runQuery('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);
    const updated = await getQuery('SELECT * FROM appointments WHERE id = ?', [id]);

    res.json({ message: 'Appointment status updated', appointment: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
