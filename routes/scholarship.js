const express = require('express');


const { scholarshipController } = require('../controller/scholarship');

const router = express.Router();

router.get('', scholarshipController.getScholarship);


module.exports = router;