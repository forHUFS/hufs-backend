const express = require('express');
const { authUtil } = require('../middlewares/auth');
const { like } = require('../controller/like');
const router = express.Router();

router.post('/', authUtil.isSignedIn, authUtil.isAuthorized, like);

module.exports = router;