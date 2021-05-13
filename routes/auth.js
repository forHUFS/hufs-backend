const express      = require('express');

const { authUtil }               = require('../middlewares/auth');
const { returnPass, ownerCheck } = require('../controller/auth');


const router     = express.Router();

router.get('/signed-in', authUtil.isSignedIn, returnPass);
router.get('/authorized', authUtil.isSignedIn, authUtil.isAuthorized, returnPass);
router.get('/admin', authUtil.isSignedIn, authUtil.isAdmin, returnPass);
router.get('/graduated', authUtil.isSignedIn, authUtil.isGraduated, returnPass);
router.get('/owner', authUtil.isSignedIn, ownerCheck);

module.exports = router;