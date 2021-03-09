const express = require('express');
const { readPosts, searchPostsInBoard } = require('../controller/board');
const router = express.Router();
const Image = require('../models/image');

router.get('/:id/search', searchPostsInBoard );
router.get('/:id', readPosts );

module.exports =router;