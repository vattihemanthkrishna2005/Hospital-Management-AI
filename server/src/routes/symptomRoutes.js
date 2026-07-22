const express = require('express');
const router = express.Router();
const symptomController = require('../controllers/symptomController');

router.post('/match', symptomController.matchSymptoms);

module.exports = router;
