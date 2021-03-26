const express  = require('express');
const passport = require('passport');

const { emailAuth, userAuth, socialAuth, userInfo, scrapDirectory, postScrap } = require('../controller/user');
const { authUtil } = require('../middlewares/auth');

const router = express.Router();


router.get('', userInfo.getUser); // authUtil.isSignedIn
router.put('', userInfo.updateUser); // authUtil.isSignedIn
router.delete('', userInfo.deleteUser); // authUtil.isSignedIn

router.post('/sign-up', userAuth.signUp, emailAuth.sendEmail);
router.post('/sign-out', userAuth.signOut); // authUtil.isSignedIn

router.get('/sign-in/google', socialAuth.google);
router.get('/google/callback', socialAuth.googleCallBack);

router.get('/sign-in/kakao', socialAuth.kakao);
router.get('/kakao/callback', socialAuth.kakaoCallBack);

router.get('/email', emailAuth.checkEmail);
router.post('/email', emailAuth.sendEmail);

router.get('/directory', scrapDirectory.read); // authUtil.isSignedIn, authUtil.isAuthorized
router.post('/directory', scrapDirectory.create); // authUtil.isSignedIn, authUtil.isAuthorized
router.put('/directory', scrapDirectory.update); // authUtil.isSignedIn, authUtil.isAuthorized
router.delete('/directory', scrapDirectory.delete); // authUtil.isSignedIn, authUtil.isAuthorized

router.get('/scrap', postScrap.read); // authUtil.isSignedIn, authUtil.isAuthorized
router.post('/scrap', postScrap.create); // authUtil.isSignedIn, authUtil.isAuthorized
router.put('/scrap', postScrap.update); // authUtil.isSignedIn, authUtil.isAuthorized
router.delete('/scrap', postScrap.delete); // authUtil.isSignedIn, authUtil.isAuthorized

module.exports = router;