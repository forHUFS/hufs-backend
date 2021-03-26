const express = require('express');
const { addReply, addReReply, deleteReply, modifyReply, addReplyLike, cancelReplyLike, report } = require('../controller/reply');
const { authUtil } = require('../middlewares/auth');

const router = express.Router();

router.post('/add', addReply); // authUtil.isSignedIn, authUtil.isAuthorized
router.post('/add/re', addReReply); // authUtil.isSignedIn, authUtil.isAuthorized


router.get('/:id/addlike', addReplyLike); // authUtil.isSignedIn, authUtil.isAuthorized
router.get('/:id/dellike', cancelReplyLike); // authUtil.isSignedIn, authUtil.isAuthorized

router.post('/:id/report', report); // authUtil.isSignedIn, authUtil.isAuthorized

router.put('/:id', modifyReply); // authUtil.isSignedIn, authUtil.isAuthorized
router.delete('/:id', deleteReply); // authUtil.isSignedIn, authUtil.isAuthorized



module.exports = router;