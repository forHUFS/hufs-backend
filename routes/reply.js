const express = require('express');
const { addReply, addReReply, deleteReply, modifyReply, addReplyLike, cancelReplyLike } = require('../controller/reply');

const router = express.Router();

router.post('/add', addReply);
router.post('/add/re', addReReply);
router.put('/', modifyReply);
router.delete('/:id', deleteReply);

router.get('/:id/addlike', addReplyLike);
router.get('/:id/dellike', cancelReplyLike);

module.exports = router;