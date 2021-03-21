const StoreReview = require('../models/storeReviews');
const ReviewImage = require('../models/reviewImage');
const User = require('../models/users');
const Store = require('../models/stores');
const { deleteImg } = require('../uploads/upload');
const sequelize = require('../models').sequelize;

exports.addReview = async(req,res,next) => {
    try {
        await sequelize.transaction(async (t)=> {
        const review = await StoreReview.create({
            title: req.body.title,
            content: req.body.content,
            score: req.body.score,
            storeId: req.params.id,
            userId: req.user.id
        },{
            transaction: t
        });

        const url = req.files;

        if (url && url.length) {
            const img = await Promise.all(
                url.map(i => {
                    return ReviewImage.create({
                        url: i.location,
                        storeReviewId: req.params.id
                    },{
                        transaction: t
                    })
                })
            );
            console.log(img);
        }

        res.status(200).json({
            data: "",
            message: ""
        });
        });
    } catch (err) {
        console.error(err);
        next(err);
    }

}

exports.readReview = async(req,res,next) => {
    try {
        const review = await StoreReview.findOne({
            where: { id: req.params.id },
            include: [{ model: ReviewImage }, { model: User, attributes: ['nickname'] }]
        });
        if (review) {
            res.status(200).json({
                data: review,
                message: ""
            });
        } else {
            res.status(404).json({
                data: "",
                message: "RESOURCE_NOT_FOUND"
            })
        }

    } catch (err) {
        console.error(err);
        next(err);
    }
}
exports.readReviews = async(req,res,next) => {
    try {
        const review = await StoreReview.findAll({
            where: { storeId: req.params.id },
            include: [{ model: ReviewImage }, { model: User, attributes: ['nickname']}]
        });

        res.status(200).json({
            data: review,
            message: ""
        });

    } catch (err) {
        console.error(err);
        next(err);
    }
}
exports.readAllReviews = async (req,res,next) => {
    try {
        const reviews = await StoreReview.findAll({
            include: [{ model: ReviewImage },
                     { model: User , attributes: ['nickname']},
                     { model: Store, attributes: ['name']}]
        });
        res.status(200).json({
            data: reviews,
            message: ""
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
}
exports.modifyReview = async (req,res,next) => {
    try {
        await sequelize.transaction(async (t)=> {
        const review = await StoreReview.update({
            title: req.body.title,
            content: req.body.content,
            score: req.body.score
        }, {
            where: {
                id: req.params.id,
                userId: req.user.id
            },
            transaction: t
        });
        if (review[0] === 0) {

            res.status(403).json({
                data: "",
                message: "FORBIDDEN"
            });

        } else {

            const url = req.files;

            if (url && url.length) {
                const img = await Promise.all(
                    url.map(i => {
                        return ReviewImage.create({
                            url: i.location,
                            storeReviewId: req.params.id
                        }, {
                            transaction: t
                        })
                    })
                );
                console.log(img);
            }
            const img = req.body.url;

            if (img && img.length) {

                await deleteImg(img);

                const result = await Promise.all(
                    img.map(i => {
                        return ReviewImage.destroy({
                            where: { url: i },
                            transaction: t
                        })
                    })
                );
                console.log(result);
            }

            res.status(200).json({
                data: "",
                message: ""
            });
        }
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
}

exports.deleteReview = async (req,res,next) => {
    try {
        await sequelize.transaction(async(t)=> {
            const review = await StoreReview.findOne({
                where: {id: req.params.id}
            });
            if (review.userId === req.user.id || req.user.type === 'admin') {

                const img = await ReviewImage.findAll({
                    where: {storeReviewId: review.id}
                });
                let url = []
                img.map(i => {
                    url.push(i.url);
                })
                await deleteImg(url);

                await StoreReview.destroy({
                    where: {id: req.params.id}
                });

                res.status(200).json({
                    data: "",
                    message: ""
                });

            } else {
                res.status(403).json({
                    data: "",
                    message: "FORBIDDEN"
                });
            }

        });
    } catch (err) {
        console.error(err);
        next(err);
    }

}