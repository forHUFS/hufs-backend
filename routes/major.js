const express = require('express');

const { majorController } = require('../controller/major');


const router = express.Router();

router.post('', majorController.createMajor);
router.get('/main-major', majorController.getMainMajor);
router.get('/double-major', majorController.getDoubleMajor);


module.exports = router;