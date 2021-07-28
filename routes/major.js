const express = require('express');

const { majorController } = require('../controller/major');


const router = express.Router();

router.post('', majorController.createMajor);
router.get('', majorController.getMajors);


module.exports = router;