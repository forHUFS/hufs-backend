const express = require('express');


const { scholarshipController } = require('../controller/scholarship');

const router = express.Router();

router.post('', scholarshipController.getScholarship);
router.get('/date',  scholarshipController.getShoclarshipDate);
router.get('/option',  scholarshipController.getScholarshipOption);
router.get('/campus',  scholarshipController.getShoclarshipSchoolOPtion);


module.exports = router;