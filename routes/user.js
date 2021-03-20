const express  = require('express');
const passport = require('passport');

const { emailAuth, userAuth, socialAuth, userInfo, scrapDirectory, postScrap } = require('../controller/user');
const { authUtil } = require('../middlewares/auth');

const router = express.Router();


router.get('', emailAuth.checkEmail, authUtil.isSignedIn, userInfo.getUser);
router.put('', authUtil.isSignedIn, userInfo.updateUser);
router.delete('', authUtil.isSignedIn, userInfo.deleteUser);

router.post('/sign-up', userAuth.signUp);
router.get('/sign-out', userAuth.signOut); // REST post로 변경 예정, 테스트를 위해 get

router.get('/sign-in/google', socialAuth.google);
router.get('/google/callback', socialAuth.googleCallBack);

router.get('/sign-in/kakao', socialAuth.kakao);
router.get('/kakao/callback', socialAuth.kakaoCallBack);

router.get('/directory', authUtil.isSignedIn, scrapDirectory.read);
router.post('/directory', authUtil.isSignedIn, scrapDirectory.create);
router.put('/directory', authUtil.isSignedIn, scrapDirectory.update);
router.delete('/directory', authUtil.isSignedIn, scrapDirectory.delete);

router.get('/scrap', authUtil.isSignedIn, postScrap.read);
router.post('/scrap', authUtil.isSignedIn, postScrap.create);
router.put('/scrap', authUtil.isSignedIn, postScrap.update);
router.delete('/scrap', authUtil.isSignedIn, postScrap.delete);

module.exports = router;