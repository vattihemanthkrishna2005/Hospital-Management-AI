const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');

router.get('/appointment/:id', pdfController.generateAppointmentPDF);

module.exports = router;
