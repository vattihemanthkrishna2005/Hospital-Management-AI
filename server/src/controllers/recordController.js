const { allQuery, getQuery, runQuery } = require('../config/db');

// Get patient medical records
exports.getPatientRecords = async (req, res) => {
  try {
    const { email } = req.params;

    // First try finding user ID by email
    const user = await getQuery('SELECT id FROM users WHERE email = ?', [email]);
    const patientId = user ? user.id : 1; // default to demo patient ID if email matches demo

    const records = await allQuery(
      'SELECT * FROM medical_records WHERE patient_id = ? ORDER BY visit_date DESC',
      [patientId]
    );

    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: Add medical record for patient
exports.createRecord = async (req, res) => {
  try {
    const { patient_id, appointment_id, doctor_name, specialization, visit_date, diagnosis, prescription, lab_notes, follow_up_date } = req.body;

    if (!patient_id || !doctor_name || !diagnosis || !prescription) {
      return res.status(400).json({ error: 'Patient ID, doctor name, diagnosis, and prescription are required.' });
    }

    const result = await runQuery(
      `INSERT INTO medical_records (patient_id, appointment_id, doctor_name, specialization, visit_date, diagnosis, prescription, lab_notes, follow_up_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        patient_id,
        appointment_id || null,
        doctor_name,
        specialization || 'General Medicine',
        visit_date || new Date().toISOString().split('T')[0],
        diagnosis,
        prescription,
        lab_notes || '',
        follow_up_date || ''
      ]
    );

    res.status(201).json({ message: 'Medical record created', recordId: result.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
