const express = require('express');
const { searchPosts } = require('../controller/main');
const { authUtil } = require('../middlewares/auth');

const router = express.Router();

router.get('/search', authUtil.isSignedIn, authUtil.isAuthorized, searchPosts );

module.exports = router;