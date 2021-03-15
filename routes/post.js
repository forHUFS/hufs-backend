const express = require('express');
const { addLike, delLike, addPost, modifyPost, readPost, deletePost } = require('../controller/post');
const { uploadImg, deleteImg } = require('../uploads/upload');
const { upload } = require('../uploads/upload');

const authUtil = require('../modules/auth');


const router = express.Router();


router.post('/', addPost);
router.put('/', modifyPost);


router.post('/img', upload.array('img',5), uploadImg);
router.post('/deleteimg', deleteImg );

router.get('/:id/addlike', addLike);
router.get('/:id/dellike', delLike);


router.get('/:id', authUtil.checkToken, readPost);
router.delete('/:id', deletePost);

module.exports = router;