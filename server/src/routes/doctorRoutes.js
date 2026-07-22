const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { authenticateToken, authorizeRoles } = require('../controllers/authController');

router.get('/', doctorController.getAllDoctors);
router.get('/specializations', doctorController.getSpecializations);
router.get('/:id', doctorController.getDoctorById);

// Admin-only doctor management endpoints
router.post('/', authenticateToken, authorizeRoles('ADMIN'), doctorController.createDoctor);
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN'), doctorController.deleteDoctor);

module.exports = router;
