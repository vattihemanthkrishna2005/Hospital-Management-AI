require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDb } = require('./config/db');
const { seedInitialData } = require('./data/seedData');

const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const recordRoutes = require('./routes/recordRoutes');
const symptomRoutes = require('./routes/symptomRoutes');
const pdfRoutes = require('./routes/pdfRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS & JSON Parsing
app.use(cors());
app.use(express.json());

// Health Check Route (Used by Azure Container Apps readiness probe)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'MediCare Hub API',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/symptoms', symptomRoutes);
app.use('/api/pdf', pdfRoutes);

// Initialize Database & Start Server
async function startServer() {
  await initDb();
  await seedInitialData();

  app.listen(PORT, () => {
    console.log(`🚀 MediCare Hub Server running on http://localhost:${PORT}`);
    console.log(`🏥 Health Probe available at http://localhost:${PORT}/api/health`);
  });
}

startServer();
