const express = require('express');
const router = express.Router();
const recordController = require('../controllers/recordController');

router.get('/patient/:email', recordController.getPatientRecords);
router.post('/', recordController.createRecord);

module.exports = router;
