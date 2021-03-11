const express       = require('express');
const jwt           = require('jsonwebtoken');
const passport      = require('passport');

const { verifyToken } = require('../modules/auth');
const { emailAuth, res, signUp }   = require('../controller/user');

const router        = express.Router();

router.get('', emailAuth.checkEmail);

router.post('/sign-up', signUp.createUser);

router.get(
    '/google',
    res.google
);

router.get(
    '/google/callback',
    res.googleCallBack
);

router.get(
    '/kakao',
    passport.authenticate('kakao')
);

router.get(
    '/kakao/callback',
    passport.authenticate('kakao'), async(req, res) => {
        res.redirect('/')
    }
)

router.get(
    '/logout', async(req, res) => {
    req.logout()
    res.redirect('/') 
});


module.exports = router;