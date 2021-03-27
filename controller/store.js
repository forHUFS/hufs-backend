const StoreReview = require('../models/storeReviews');
const User = require('../models/users');
const Store = require('../models/stores');
const StoreSubCategory = require('../models/storeSubCategories');
const { deleteImg } = require('../uploads/upload');
const sequelize = require('../models').sequelize;

exports.addReview = async(req,res,next) => {
    try {
        await StoreReview.create({
            title: req.body.title,
            content: req.body.content,
            score: req.body.score,
            storeId: req.params.id,
            userId: 5 // req.user.id
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
        const reviews = await StoreReview.findAll({
            include: [{ model: User , attributes: ['nickname']},
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
        const review = await StoreReview.update({
            title: req.body.title,
            content: req.body.content,
        },{
            where : {
                id: req.params.id,
                userId: 5 // req.user.id
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
        if (review.userId == 5) {// req.user.id || req.user.type === 'admin') {
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

exports.readStoresOfSeoul = async(req,res,next) => {
    try {
        const store = await Store.findAll({
            where: { campus: 1 },
            include: [{model: StoreSubCategory, attributes: ['name']}]
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

exports.readStoresOfGlobal = async(req,res,next) => {
    try {
        const review = await Store.findAll({
            where: { campus: 2 },
            include: [{model: StoreSubCategory, attributes: ['name']}]
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