const express = require('express');
const { authUtil } = require('../middlewares/auth');
const { addReview, readReview, readReviews, readAllReviews, modifyReview, deleteReview, readStoresOfSeoul, readStoresOfGlobal } = require('../controller/store');
const { uploadForReview } = require('../middlewares/upload');
const router = express.Router();


//router.get('/review', authUtil.isSignedIn, readAllReviews);
// 모든 상점의 모든 리뷰들 조회
// router.get('/seoul', readStoresOfSeoul);
// router.get('/global', readStoresOfGlobal);

router.get('/review/:id', readReview); // authUtil.isSignedIn, authUtil.isAuthorized,
// 특정 리뷰 조회

router.put('/review/:id', modifyReview); // authUtil.isSignedIn, authUtil.isAuthorized,
// 리뷰 수정

router.delete('/review/:id', deleteReview); // authUtil.isSignedIn, authUtil.isAuthorized,
// 리뷰 삭제

router.post('/:id/review', addReview); // authUtil.isSignedIn, authUtil.isAuthorized,
// 특정 상점에 리뷰 작성

router.get('/:id/review', readReviews); // authUtil.isSignedIn, authUtil.isAuthorized,
// 특정 상점의 리뷰들 조회

module.exports = router;

