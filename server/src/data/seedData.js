const bcrypt = require('bcryptjs');
const { runQuery, getQuery, allQuery } = require('../config/db');

async function seedInitialData() {
  try {
    // Check if admin user exists with pass123!
    const adminUser = await getQuery("SELECT id FROM users WHERE email = 'admin@medicare.com' OR email = 'admin'");
    const hashedAdminPassword = await bcrypt.hash('pass123!', 10);
    const hashedPatientPassword = await bcrypt.hash('patient123', 10);

    if (!adminUser) {
      await runQuery(
        'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
        ['System Admin', 'admin', hashedAdminPassword, 'ADMIN', '+1 (555) 019-2831']
      );
      await runQuery(
        'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
        ['Hospital Admin', 'admin@medicare.com', hashedAdminPassword, 'ADMIN', '+1 (555) 019-2831']
      );
    } else {
      // Update admin password to pass123!
      await runQuery("UPDATE users SET password = ? WHERE email = 'admin' OR email = 'admin@medicare.com'", [hashedAdminPassword]);
    }

    // Check if doctors table has data
    const doctorCount = await getQuery('SELECT COUNT(*) as count FROM doctors');
    if (doctorCount.count > 0) {
      console.log('ℹ️ Database already contains doctor data.');
      return;
    }

    console.log('🌱 Seeding initial database records...');

    // 1. Seed Specializations
    const specs = [
      { name: 'Cardiology', icon: 'HeartPulse', description: 'Heart care, ECG, hypertension & vascular health' },
      { name: 'Neurology', icon: 'Brain', description: 'Brain, spinal cord & nervous system specialists' },
      { name: 'Pediatrics', icon: 'Baby', description: 'Comprehensive healthcare for infants, kids & teens' },
      { name: 'Orthopedics', icon: 'Bone', description: 'Bone, joint, muscle & spinal care' },
      { name: 'Dermatology', icon: 'Sparkles', description: 'Skin, hair, allergy & cosmetic treatments' },
      { name: 'General Medicine', icon: 'Stethoscope', description: 'General health checkups & routine consultations' }
    ];

    for (const spec of specs) {
      await runQuery('INSERT INTO specializations (name, icon, description) VALUES (?, ?, ?)', [
        spec.name, spec.icon, spec.description
      ]);
    }

    // 2. Seed Patient
    const patientRes = await runQuery(
      'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
      ['Rahul Sharma', 'rahul@example.com', hashedPatientPassword, 'PATIENT', '+91 98765 43210']
    );

    const patientId = patientRes.id;

    // 3. Seed Doctors
    const doctors = [
      {
        name: 'Dr. Sarah Jenkins',
        specialization_id: 1,
        specialization_name: 'Cardiology',
        experience: 14,
        rating: 4.9,
        fee: 800,
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
        available_days: 'Mon, Wed, Fri',
        available_hours: '09:00 AM - 02:00 PM'
      },
      {
        name: 'Dr. Rajesh Patel',
        specialization_id: 2,
        specialization_name: 'Neurology',
        experience: 18,
        rating: 4.9,
        fee: 1000,
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
        available_days: 'Tue, Thu, Sat',
        available_hours: '10:00 AM - 04:00 PM'
      },
      {
        name: 'Dr. Emily Chen',
        specialization_id: 3,
        specialization_name: 'Pediatrics',
        experience: 9,
        rating: 4.8,
        fee: 600,
        avatar: 'https://images.unsplash.com/photo-1594824813566-7885a3964472?w=300&auto=format&fit=crop&q=80',
        available_days: 'Mon, Tue, Wed, Thu, Fri',
        available_hours: '08:30 AM - 01:30 PM'
      },
      {
        name: 'Dr. Marcus Vance',
        specialization_id: 4,
        specialization_name: 'Orthopedics',
        experience: 12,
        rating: 4.7,
        fee: 750,
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80',
        available_days: 'Mon, Wed, Sat',
        available_hours: '11:00 AM - 05:00 PM'
      },
      {
        name: 'Dr. Priya Nair',
        specialization_id: 5,
        specialization_name: 'Dermatology',
        experience: 11,
        rating: 4.9,
        fee: 650,
        avatar: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=300&auto=format&fit=crop&q=80',
        available_days: 'Wed, Thu, Fri, Sat',
        available_hours: '02:00 PM - 07:00 PM'
      },
      {
        name: 'Dr. David Miller',
        specialization_id: 6,
        specialization_name: 'General Medicine',
        experience: 15,
        rating: 4.8,
        fee: 500,
        avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&auto=format&fit=crop&q=80',
        available_days: 'Mon, Tue, Wed, Thu, Fri, Sat',
        available_hours: '09:00 AM - 06:00 PM'
      }
    ];

    for (const doc of doctors) {
      await runQuery(
        `INSERT INTO doctors 
        (name, specialization_id, specialization_name, experience, rating, fee, avatar, available_days, available_hours) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          doc.name,
          doc.specialization_id,
          doc.specialization_name,
          doc.experience,
          doc.rating,
          doc.fee,
          doc.avatar,
          doc.available_days,
          doc.available_hours
        ]
      );
    }

    console.log('✅ Initial database records successfully seeded with Admin pass123! credentials!');
  } catch (err) {
    console.error('❌ Error during data seeding:', err);
  }
}

module.exports = { seedInitialData };
