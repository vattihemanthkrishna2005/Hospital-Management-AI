const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticateToken, authorizeRoles } = require('../controllers/authController');

router.post('/book', appointmentController.bookAppointment);
router.get('/patient/:email', authenticateToken, appointmentController.getPatientAppointments);

// Admin-only appointment management endpoints
router.get('/all', authenticateToken, authorizeRoles('ADMIN'), appointmentController.getAllAppointments);
router.put('/:id/status', authenticateToken, authorizeRoles('ADMIN'), appointmentController.updateAppointmentStatus);

module.exports = router;
