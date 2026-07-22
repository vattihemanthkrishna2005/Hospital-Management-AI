const { allQuery, getQuery, runQuery } = require('../config/db');

// Default Person Gray Placeholder Avatar Data URL
const DEFAULT_GRAY_AVATAR = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="%239ca3af" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="background:%231f2937;"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';

// Get all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const { specialization, search } = req.query;
    let sql = 'SELECT * FROM doctors WHERE 1=1';
    const params = [];

    if (specialization && specialization !== 'All') {
      sql += ' AND specialization_name = ?';
      params.push(specialization);
    }

    if (search) {
      sql += ' AND (name LIKE ? OR specialization_name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY id DESC';

    const doctors = await allQuery(sql, params);

    // Apply default gray placeholder avatar if avatar is missing or empty
    const sanitizedDoctors = doctors.map(doc => ({
      ...doc,
      avatar: (doc.avatar && doc.avatar.trim().length > 0) ? doc.avatar : DEFAULT_GRAY_AVATAR
    }));

    res.json(sanitizedDoctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single doctor details
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await getQuery('SELECT * FROM doctors WHERE id = ?', [req.params.id]);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found.' });
    }

    doctor.avatar = (doctor.avatar && doctor.avatar.trim().length > 0) ? doctor.avatar : DEFAULT_GRAY_AVATAR;
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get specializations
exports.getSpecializations = async (req, res) => {
  try {
    const specs = await allQuery('SELECT * FROM specializations ORDER BY name ASC');
    res.json(specs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: Add new doctor separately
exports.createDoctor = async (req, res) => {
  try {
    const { name, specialization_name, experience, rating, fee, avatar, available_days, available_hours } = req.body;
    
    if (!name || !specialization_name) {
      return res.status(400).json({ error: 'Doctor name and specialization are required.' });
    }

    // Use provided avatar or fallback to person gray placeholder
    const finalAvatar = (avatar && avatar.trim().length > 0) ? avatar.trim() : DEFAULT_GRAY_AVATAR;

    const result = await runQuery(
      `INSERT INTO doctors (name, specialization_name, experience, rating, fee, avatar, available_days, available_hours)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        specialization_name,
        experience ? parseInt(experience) : 5,
        rating ? parseFloat(rating) : 4.8,
        fee ? parseFloat(fee) : 500,
        finalAvatar,
        available_days || 'Mon, Wed, Fri',
        available_hours || '09:00 AM - 05:00 PM'
      ]
    );

    const newDoctor = await getQuery('SELECT * FROM doctors WHERE id = ?', [result.id]);
    res.status(201).json({ message: 'Doctor profile created successfully', doctor: newDoctor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: Delete doctor
exports.deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    await runQuery('DELETE FROM doctors WHERE id = ?', [id]);
    res.json({ message: 'Doctor profile removed.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
