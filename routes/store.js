const express = require('express');
const { authUtil } = require('../middlewares/auth');
const { addReview, readReview, readReviews, readAllReviews, modifyReview, deleteReview, readStoresOfSeoul, readStoresOfGlobal } = require('../controller/store');
const { uploadForReview } = require('../uploads/upload');
const router = express.Router();


//router.get('/review', authUtil.isSignedIn, readAllReviews);
// 모든 상점의 모든 리뷰들 조회
// router.get('/seoul', readStoresOfSeoul);
// router.get('/global', readStoresOfGlobal);

router.get('/review/:id', authUtil.isSignedIn, authUtil.isAuthorized, readReview);
// 특정 리뷰 조회

router.put('/review/:id', authUtil.isSignedIn, authUtil.isAuthorized, modifyReview);
// 리뷰 수정

router.delete('/review/:id', authUtil.isSignedIn, authUtil.isAuthorized, deleteReview);
// 리뷰 삭제

router.post('/:id/review',  authUtil.isSignedIn, authUtil.isAuthorized,, addReview);
// 특정 상점에 리뷰 작성

router.get('/:id/review',  authUtil.isSignedIn, authUtil.isAuthorized,, readReviews);
// 특정 상점의 리뷰들 조회

module.exports = router;

