const express = require('express');
const { searchPosts } = require('../controller/search');
const { authUtil } = require('../middlewares/auth');

const router = express.Router();

router.get('/',  searchPosts ); //authUtil.isSignedIn, authUtil.isAuthorized

module.exports = router;