const express = require('express');
const { addLike, delLike, modifyPost, readPost, deletePost, cancelPost, cancelEdit, report } = require('../controller/post');
const { uploadImg } = require('../uploads/upload');
const { upload } = require('../uploads/upload');
const { authUtil } = require('../middlewares/auth');
const Post = require('../models/posts');

const router = express.Router();

router.post('/back', cancelPost);

router.post('/img', upload.array('img',10), uploadImg);


router.get('/:id/addlike', authUtil.isSignedIn, authUtil.isAuthorized, addLike);
router.get('/:id/dellike', authUtil.isSignedIn, authUtil.isAuthorized, delLike);

router.post('/:id/report', authUtil.isSignedIn, authUtil.isAuthorized, report);

router.get('/:id', authUtil.isSignedIn, authUtil.isAuthorized, readPost);
router.put('/:id', authUtil.isSignedIn, authUtil.isAuthorized, modifyPost);
router.delete('/:id', authUtil.isSignedIn, authUtil.isAuthorized, deletePost); 



module.exports = router;