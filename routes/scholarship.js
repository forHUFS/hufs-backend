const express = require('express');

const { authUtil }              = require('../middlewares/auth')
const { scholarshipController } = require('../controller/scholarship');

// authUtil.isSignedIn, authUtil.isAuthorized,

const router = express.Router();

router.get('', scholarshipController.getScholarship); // authUtil.isSignedIn, authUtil.isAuthorized
router.get('/date',  scholarshipController.getShoclarshipDate);
router.get('/option',  scholarshipController.getScholarshipOption);
router.get('/campus',  scholarshipController.getShoclarshipSchoolOPtion);


module.exports = router;