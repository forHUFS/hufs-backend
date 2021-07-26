const express = require('express');
const { readPosts, addPost } = require('../controller/board');
const { authUtil } = require('../middlewares/auth');

const router = express.Router();




// router.post('/4/post', authUtil.isSignedIn, authUtil.isGraduated, addPost); // 졸업생 게시판 글쓰기
// router.post('/:id/post', authUtil.isSignedIn, authUtil.isAuthorized, addPost); // 일반 게시판 글쓰기

router.get('/:title', authUtil.isSignedIn, authUtil.isAuthorized, readPosts );
router.post('/:title', authUtil.isSignedIn, authUtil.isAuthorized, addPost );

module.exports = router;