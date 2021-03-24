const express = require('express');

const { majorController } = require('../controller/major');


const router = express.Router();

router.get('', majorController.getMajor);


module.exports = router;