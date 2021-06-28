const express = require('express');
const { authUtil } = require('../middlewares/auth');
const { readStores, addReview, readReview, readReviews, modifyReview, deleteReview, readDetail } = require('../controller/store');
const { uploadForReview } = require('../middlewares/upload');
const router = express.Router();


//router.get('/review', authUtil.isSignedIn, readAllReviews);


router.get('/review/:id', authUtil.isSignedIn, authUtil.isAuthorized, readReview);
// 특정 리뷰 조회

router.put('/review/:id', authUtil.isSignedIn, authUtil.isAuthorized, modifyReview);
// 리뷰 수정

router.delete('/review/:id', authUtil.isSignedIn, authUtil.isAuthorized, deleteReview);
// 리뷰 삭제

router.post('/:id/review', authUtil.isSignedIn, authUtil.isAuthorized, addReview);
// 특정 상점에 리뷰 작성

router.get('/:id/review', authUtil.isSignedIn, authUtil.isAuthorized, readReviews);
// 특정 상점의 리뷰들 조회

router.get('/:id/detail', authUtil.isSignedIn, authUtil.isAuthorized, readDetail);
// 상점 상세보기 페이지

router.get('/:campusId', readStores);
module.exports = router;

