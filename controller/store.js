const StoreReview = require('../models/storeReviews');
const User = require('../models/users');
const Store = require('../models/stores');
const StoreSubCategory = require('../models/storeSubCategories');
const { deleteImg } = require('../middlewares/upload');
const { fn, col } = require('sequelize');

exports.addReview = async(req,res,next) => {
    try {
        console.log(req.body)
        await StoreReview.create({
            title: req.body.title,
            content: req.body.content,
            score: req.body.score,
            storeId: req.params.id,
            userId: req.user.id
        });
        const url = req.body.url;
        if (url && url.length) {
            await deleteImg(url);
        }
        res.status(200).json({
            data: "",
            message: ""
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
            include: [{ model: User, attributes: ['nickname'] }]
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
            include: [{ model: User, attributes: ['nickname']}]
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
        const campusId = parseInt(req.params.campusId);
        if (campusId !== 1 && campusId !== 2) {
            return res.status(404).json({
                data: "",
                message: "RESOURCE_NOT_FOUND"
            });
        }
        const reviews = await StoreReview.findAll({
            include: [{ model: User , attributes: ['nickname']},
                      { model: Store, attributes: ['name'], where: { campus: campusId }}]
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
        const review = await StoreReview.update({
            title: req.body.title,
            content: req.body.content,
        },{
            where : {
                id: req.params.id,
                userId: req.user.id
            }
        });
        console.log(review);
        if (review[0] === 0) {
            res.status(403).json({
                data: "",
                message: "FORBIDDEN"
            });
        } else {
            const url = req.body.url;
            if (url && url.length) {
                await deleteImg(url);
            }
            res.status(200).json({
                data: "",
                message: ""
            });
        }
    } catch (err) {
        console.error(err);
        next(err);
    }

}

exports.deleteReview = async (req,res,next) => {
    try {
        const review = await StoreReview.findOne({
            where: {id: req.params.id}
        });
        console.log(review);
        if (req.user.id === review.userId || req.user.type === 'admin') {
            let m;
            let img = [];
            let reg = /<img[^>]*src=[\"']?([^>\"']+)[\"']?[^>]*>/g
            while (m = await reg.exec(review.content)) {
                img.push(m[1]);
            }
            if (img.length) {
                await deleteImg(img);
            }

            await StoreReview.destroy({
                where: {id: req.params.id},
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

    } catch (err){
        console.error(err);
        next(err);
    }
}

exports.readDetail = async (req,res,next) => {
    try {
        const store = await StoreReview.findAll({
            where: { storeId: req.params.id },
            attributes: [
                [fn('COUNT','id'), 'count'],
                [fn('ROUND', fn('AVG', col('score')),1), 'average']
            ]
        });
        res.status(200).json({
            data: store,
            message: ""
        });
    } catch (err) {
        console.error(err);
        next(err);
    }

}

exports.readStores = async(req,res,next) => {
    try {
        const store = await Store.sequelize.query(
            `
            SELECT Store.id, Store.long, Store.lat, Store.name, Store.tel, Store.num_address AS numAddress,
            Store.road_address AS roadAddress, StoreSubCategory.name AS StoreSubCategory,
            COUNT(StoreReviews.id) AS reviewCount, ROUND(AVG(score), 1) AS reviewAverage
            FROM stores AS Store LEFT OUTER JOIN store_sub_categories AS StoreSubCategory
            ON Store.store_sub_category_id = StoreSubCategory.id AND (StoreSubCategory.deleted_at IS NULL)
            LEFT OUTER JOIN store_reviews AS StoreReviews ON Store.id = StoreReviews.store_id
            WHERE Store.campus = ${req.params.campusId} GROUP BY Store.id;
            `
        )
        res.status(200).json({
            data: store[0],
            message: ""
        });

    } catch (err) {
        console.error(err);
        next(err);
    }
}