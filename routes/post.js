const express = require('express');
const { addLike, delLike, modifyPost, readPost, deletePost, cancelPost, cancelEdit, report } = require('../controller/post');
const { uploadImg } = require('../uploads/upload');
const { upload } = require('../uploads/upload');
const { authUtil } = require('../middlewares/auth');
const Post = require('../models/posts');

const router = express.Router();

router.post('/back', cancelPost);

router.post('/img', upload.array('img',5), uploadImg);


router.get('/:id/addlike', addLike); // authUtil.isSignedIn, authUtil.isAuthorized
router.get('/:id/dellike', delLike); // authUtil.isSignedIn, authUtil.isAuthorized

router.post('/:id/report', report); // authUtil.isSignedIn, authUtil.isAuthorized

router.get('/:id', readPost); // authUtil.isSignedIn, authUtil.isAuthorized
router.put('/:id', modifyPost); // authUtil.isSignedIn, authUtil.isAuthorized
router.delete('/:id', deletePost); // authUtil.isSignedIn, authUtil.isAuthorized



module.exports = router;