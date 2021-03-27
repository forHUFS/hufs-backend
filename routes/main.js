const express = require('express');
const { searchPosts } = require('../controller/main');
const { authUtil } = require('../middlewares/auth');

const router = express.Router();

router.get('/search', searchPosts );  // authUtil.isSignedIn, authUtil.isAuthorized

module.exports = router;