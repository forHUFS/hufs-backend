const express = require('express');
const { authUtil } = require('../middlewares/auth');
const { report } = require('../controller/report');
const router = express.Router();

router.post('/', authUtil.isSignedIn, authUtil.isAuthorized, report);

module.exports = router;