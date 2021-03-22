const express  = require('express');
const passport = require('passport');

const { emailAuth, userAuth, socialAuth, userInfo, scrapDirectory, postScrap } = require('../controller/user');
const { authUtil } = require('../middlewares/auth');

const router = express.Router();


router.get('', emailAuth.checkEmail, authUtil.isSignedIn, userInfo.getUser);
router.put('', authUtil.isSignedIn, userInfo.updateUser);
router.delete('', authUtil.isSignedIn, userInfo.deleteUser);

router.post('/sign-up', userAuth.signUp);
router.post('/sign-out', authUtil.isSignedIn, userAuth.signOut);

router.get('/sign-in/google', socialAuth.google);
router.get('/google/callback', socialAuth.googleCallBack);

router.get('/sign-in/kakao', socialAuth.kakao);
router.get('/kakao/callback', socialAuth.kakaoCallBack);

router.get('/directory', authUtil.isSignedIn, authUtil.isAuthorized, scrapDirectory.read);
router.post('/directory', authUtil.isSignedIn, authUtil.isAuthorized, scrapDirectory.create);
router.put('/directory', authUtil.isSignedIn, authUtil.isAuthorized, scrapDirectory.update);
router.delete('/directory', authUtil.isSignedIn, authUtil.isAuthorized, scrapDirectory.delete);

router.get('/scrap', authUtil.isSignedIn, authUtil.isAuthorized, postScrap.read);
router.post('/scrap', authUtil.isSignedIn, authUtil.isAuthorized, postScrap.create);
router.put('/scrap', authUtil.isSignedIn, authUtil.isAuthorized, postScrap.update);
router.delete('/scrap', authUtil.isSignedIn, authUtil.isAuthorized, postScrap.delete);

module.exports = router;