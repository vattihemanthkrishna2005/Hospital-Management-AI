const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DB_PATH || path.join(__dirname, '../../data/hospital.db');

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Connected to local database engine (SQLite/Azure SQL Ready):', dbPath);
  }
});

// Helper function to run SQL queries as Promises
function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function getQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function allQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Initialize tables with Multi-Tenant & RBAC columns
async function initDb() {
  await runQuery(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tenant_id TEXT NOT NULL DEFAULT 'tenant_central_medicare',
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'PATIENT',
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await runQuery(`
    CREATE TABLE IF NOT EXISTS specializations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      icon TEXT,
      description TEXT
    )
  `);

  await runQuery(`
    CREATE TABLE IF NOT EXISTS doctors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tenant_id TEXT NOT NULL DEFAULT 'tenant_central_medicare',
      name TEXT NOT NULL,
      specialization_id INTEGER,
      specialization_name TEXT,
      experience INTEGER,
      rating REAL DEFAULT 4.8,
      fee REAL DEFAULT 500,
      avatar TEXT,
      hospital_branch TEXT DEFAULT 'Central Medicare Hub',
      available_days TEXT,
      available_hours TEXT,
      FOREIGN KEY (specialization_id) REFERENCES specializations (id)
    )
  `);

  await runQuery(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tenant_id TEXT NOT NULL DEFAULT 'tenant_central_medicare',
      reference_code TEXT UNIQUE NOT NULL,
      patient_id INTEGER,
      patient_name TEXT NOT NULL,
      patient_email TEXT NOT NULL,
      patient_phone TEXT NOT NULL,
      doctor_id INTEGER NOT NULL,
      doctor_name TEXT NOT NULL,
      specialization TEXT NOT NULL,
      appointment_date TEXT NOT NULL,
      appointment_time TEXT NOT NULL,
      symptoms TEXT,
      status TEXT DEFAULT 'Scheduled',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES users (id),
      FOREIGN KEY (doctor_id) REFERENCES doctors (id)
    )
  `);

  await runQuery(`
    CREATE TABLE IF NOT EXISTS medical_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tenant_id TEXT NOT NULL DEFAULT 'tenant_central_medicare',
      patient_id INTEGER NOT NULL,
      appointment_id INTEGER,
      doctor_name TEXT NOT NULL,
      specialization TEXT NOT NULL,
      visit_date TEXT NOT NULL,
      diagnosis TEXT NOT NULL,
      prescription TEXT NOT NULL,
      lab_notes TEXT,
      follow_up_date TEXT,
      FOREIGN KEY (patient_id) REFERENCES users (id)
    )
  `);

  console.log('✅ Database Schema verified with Multi-Tenant & RBAC columns.');
}

module.exports = {
  db,
  runQuery,
  getQuery,
  allQuery,
  initDb
};
