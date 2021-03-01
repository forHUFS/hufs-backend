const express = require('express');
const { searchPosts } = require('../controller/main');

const router = express.Router();

router.get('/search', searchPosts );

module.exports = router;