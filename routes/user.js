const express  = require('express');
const passport = require('passport');

const { emailAuth, userAuth, socialAuth, } = require('../controller/user');

const router = express.Router();

router.get('', emailAuth.checkEmail);

router.post('/sign-up', userAuth.signUp);
router.get('/sign-out', userAuth.signOut); // REST post로 변경 예정, 테스트를 위해 get


router.get('/google', socialAuth.google);
router.get('/google/callback', socialAuth.googleCallBack);

router.get('/kakao', socialAuth.kakao);
router.get('/kakao/callback', socialAuth.kakaoCallBack);


module.exports = router;