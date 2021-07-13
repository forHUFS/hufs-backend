const express = require('express');
const { modifyPost, readPost, deletePost, cancelPost } = require('../controller/post');
const { uploadImg } = require('../middlewares/upload');
const { upload } = require('../middlewares/upload');
const { authUtil } = require('../middlewares/auth');

const router = express.Router();

router.post('/back', cancelPost);

router.post('/image', upload.array('img',10), uploadImg);

router.get('/:id', authUtil.isSignedIn, authUtil.isAuthorized, readPost);
router.put('/:id', authUtil.isSignedIn, authUtil.isAuthorized, modifyPost);
router.delete('/:id', authUtil.isSignedIn, authUtil.isAuthorized, deletePost); 



module.exports = router;