const express = require('express');
const { addReply, addReReply, deleteReply, modifyReply, addReplyLike, cancelReplyLike, report } = require('../controller/reply');
const { authUtil } = require('../middlewares/auth');

const router = express.Router();

router.post('/add', authUtil.isSignedIn, authUtil.isAuthorized, addReply);
router.post('/add/re', authUtil.isSignedIn, authUtil.isAuthorized, addReReply);


router.get('/:id/addlike', authUtil.isSignedIn, authUtil.isAuthorized, addReplyLike);
router.get('/:id/dellike', authUtil.isSignedIn, authUtil.isAuthorized, cancelReplyLike);

router.post('/:id/report', authUtil.isSignedIn, authUtil.isAuthorized, report);

router.put('/:id', authUtil.isSignedIn, authUtil.isAuthorized, modifyReply);
router.delete('/:id', authUtil.isSignedIn, authUtil.isAuthorized, deleteReply);



module.exports = router;