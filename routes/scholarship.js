const express = require('express');

const { authUtil }              = require('../middlewares/auth')
const { scholarshipController } = require('../controller/scholarship');

const router = express.Router();

router.get('', scholarshipController.getScholarship);
router.get('/date',  scholarshipController.getShoclarshipDate);
router.get('/option',  scholarshipController.getScholarshipOption);
router.get('/campus',  scholarshipController.getShoclarshipSchoolOPtion);


module.exports = router;