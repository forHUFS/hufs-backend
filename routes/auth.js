const express      = require('express');

const { authUtil } = require('../middlewares/auth');


const router     = express.Router();
const returnPass = async(req, res, next) => {
    return res.status(200).json({data: '', message: ''});
}

router.get('/signed-in', authUtil.isSignedIn, returnPass);
router.get('/authorized', authUtil.isSignedIn, authUtil.isAuthorized, returnPass);
router.get('/admin', authUtil.isSignedIn, authUtil.isAdmin, returnPass);
router.get('/graduated', authUtil.isSignedIn, authUtil.isGraduated, returnPass);

module.exports = router;