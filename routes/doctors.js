const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/doctorController');

router.get('/',    ctrl.getAllDoctors);
router.get('/:id', ctrl.getDoctorById);

module.exports = router;
