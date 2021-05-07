const express = require('express');

const { campusController } = require('../controller/campus');


const router = express.Router();

router.get('', campusController.getCampus);


module.exports = router;