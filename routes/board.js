const express = require('express');
const { readPosts, addPost, searchPostsInBoard } = require('../controller/board');
const { authUtil } = require('../middlewares/auth');

const router = express.Router();




router.post('/2/post', addPost); // 졸업생 게시판 글쓰기 // authUtil.isSignedIn, authUtil.isGraduated

router.post('/:id/post', addPost); // 일반 게시판 글쓰기 // authUtil.isSignedIn, authUtil.isAuthorized

router.get('/:id/search', searchPostsInBoard ); //  authUtil.isSignedIn, authUtil.isAuthorized

router.get('/:id', readPosts );  // authUtil.isSignedIn, authUtil.isAuthorized

module.exports = router;