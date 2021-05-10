const express = require('express');
const { searchPosts } = require('../controller/search');
const { authUtil } = require('../middlewares/auth');

const router = express.Router();

router.get('/', authUtil.isSignedIn, authUtil.isAuthorized, searchPosts );

module.exports = router;