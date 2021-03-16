const express  = require('express');
const passport = require('passport');

const { emailAuth, userAuth, socialAuth, } = require('../controller/user');

const router = express.Router();

router.get('', emailAuth.checkEmail);

router.post('/sign-up', userAuth.signUp);

router.get('/sign-out', async(req, res) => {
    req.logout()
    res.redirect('/') 
});


router.get('/google', socialAuth.google);
router.get('/google/callback', socialAuth.googleCallBack);

router.get('/kakao', socialAuth.kakao);
router.get('/kakao/callback', socialAuth.kakaoCallBack);


module.exports = router;