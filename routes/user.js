const express = require('express');

const { emailAuth, userAuth, userInfo, scrapDirectory, postScrap } = require('../controller/user');
const { authUtil } = require('../middlewares/auth');


const router = express.Router();

router.get('', authUtil.isSignedIn , userInfo.getUser);
router.put('', authUtil.isSignedIn, userInfo.updateUser);
router.delete('', authUtil.isSignedIn, userInfo.deleteUser);

router.post('/sign-in', userAuth.signIn);
router.post('/sign-up', userAuth.signUp, emailAuth.sendEmail);
router.post('/sign-out', authUtil.isSignedIn, userAuth.signOut);

router.get('/email', emailAuth.checkEmail);
router.post('/email', emailAuth.sendEmail);

router.get('/directory', authUtil.isSignedIn, authUtil.isAuthorized, scrapDirectory.read);
router.post('/directory', authUtil.isSignedIn, authUtil.isAuthorized, scrapDirectory.create);
router.put('/directory', authUtil.isSignedIn, authUtil.isAuthorized, scrapDirectory.update);
router.delete('/directory', authUtil.isSignedIn, authUtil.isAuthorized, scrapDirectory.delete);

router.get('/scrap', authUtil.isSignedIn, authUtil.isAuthorized, postScrap.read);
router.post('/scrap', authUtil.isSignedIn, authUtil.isAuthorized, postScrap.create);
router.put('/scrap', authUtil.isSignedIn, authUtil.isAuthorized, postScrap.update);
router.delete('/scrap', authUtil.isSignedIn, authUtil.isAuthorized, postScrap.delete);

module.exports = router;