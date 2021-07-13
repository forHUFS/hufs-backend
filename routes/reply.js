const express = require('express');
const { addReply, deleteReply, modifyReply } = require('../controller/reply');
const { authUtil } = require('../middlewares/auth');

const router = express.Router();

router.post('/', authUtil.isSignedIn, authUtil.isAuthorized, addReply);

router.put('/:id', authUtil.isSignedIn, authUtil.isAuthorized, modifyReply);
router.delete('/:id', authUtil.isSignedIn, authUtil.isAuthorized, deleteReply);



module.exports = router;