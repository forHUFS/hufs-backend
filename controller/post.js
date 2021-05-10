const Post = require('../models/posts');
const Reply = require('../models/replies');
const ReportOfPost = require('../models/reportOfPost');
const User = require('../models/users');
const LikeRecordOfPost = require('../models/likeRecordOfPost');
const { deleteImg } = require('../middlewares/upload');
const { userReport } = require('../middlewares/reports');
const { Op } = require('sequelize');

const sequelize = require('../models').sequelize;

exports.addLike = async (req,res,next) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;
        if (!await checkLikeRecord(postId, userId)) {
            await sequelize.transaction(async (t)=> {
            await Post.update({
                like: sequelize.literal('`like`+1')
            }, {
                where: { id: postId },
                transaction: t
            });
            await LikeRecordOfPost.create({
                postId: postId,
                userId: userId,
            },{
                transaction: t
            });
            });
        } else {
            await sequelize.transaction(async (t)=> {
                await Post.update({
                    like: sequelize.literal('`like`-1')
                }, {
                    where: { id: postId },
                    transaction: t
                });
                await LikeRecordOfPost.destroy({
                    where: {
                    postId: postId,
                    userId: userId },
                    transaction: t
                });
            });
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
exports.delLike = async (req,res,next)=> {
    try {
        const postId = req.params.id;
        const userId = req.user.id;
        if (await checkLikeRecord(postId, userId)) {
            await sequelize.transaction(async (t)=> {
                await Post.update({
                    like: sequelize.literal('`like`-1')
                }, {
                    where: { id: postId },
                    transaction: t
                });
                await LikeRecordOfPost.destroy({
                    where: { postId: postId,
                             userId: userId
                    },
                    transaction: t
                });
                res.status(200).json({
                    data: "",
                    message: ""
                });
            });
        } else {
            res.status(409).json({
                data: "",
                message: "CONFLICT"
            });
        }

    } catch (err) {
        console.error(err);
        next(err);
    }
}


exports.cancelPost = async (req,res,next)=> {
    try {

        const url = req.body.url;
        await deleteImg(url);
        res.status(200).json({
            data: "",
            message: ""
        });

    } catch (err) {
        console.error(err);
        next(err);
    }
}

exports.modifyPost = async(req,res,next)=> {
    try {
         const post = await Post.update({
            title: req.body.title,
            content: req.body.content,
        },{
            where : {
                id: req.params.id,
                userId: req.user.id
            }
        });
         console.log(post);
         if (post[0] === 0) {
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

exports.readPost = async(req,res,next)=>{
    try {
        const post = await Post.findOne({
            where: { id: req.params.id, report: { [Op.lt]: 5 } },
            include: [{ model: Reply, include: [{model: User, attributes: ['nickname']}] },
                      { model: User , attributes: ['nickname'] }]
        });
        if (post) {
            res.status(200).json({
                data: post,
                message: ""
            });
        } else {
            res.status(404).json({
                data: "",
                message: "RESOURCE_NOT_FOUND"
            });
        }
    } catch (err) {
        console.error(err);
        next(err)
    }


}
exports.deletePost = async(req,res,next)=> {
    try {
        const post = await Post.findOne({
            where: {id: req.params.id}
        });
        console.log(post);
        if (post.userId === req.user.id || req.user.type === 'admin') {
            let m;
            let img = [];
            let reg = /<img[^>]*src=[\"']?([^>\"']+)[\"']?[^>]*>/g
            while (m = await reg.exec(post.content)) {
                img.push(m[1]);
            }
            if (img.length) {
                await deleteImg(img);
            }

            await Post.destroy({
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

exports.report = async(req,res,next) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;
        const record = await ReportOfPost.findOne({
            where: {
                postId: postId,
                userId: req.user.id
            }
        });
        if (!record) {
            await sequelize.transaction(async (t)=> {
                await ReportOfPost.create({
                    content: req.body.content,
                    detail: req.body.detail,
                    postId: postId,
                    userId: userId
                }, {
                    transaction: t
                });
                await Post.update({
                    report: sequelize.literal('`report`+1')
                },{
                    where: { id: postId },
                    transaction: t,
                });
                const post = await Post.findOne({
                    where: { id: postId },
                    transaction: t,
                });
                console.log(post);
                console.log(post.report);

                if (post.report >= 5) {
                    req.userId = post.userId;
                    userReport(req,res,next);
                } else {
                    res.status(200).json({
                        data: "",
                        message: ""
                    });
                }

            });
        } else {
            res.status(409).json({
                data: "",
                message: "CONFLICT"
            });
        }

    } catch (err) {
        console.error(err);
        next(err);
    }
}
async function checkLikeRecord (postId, userId) {
    try {
        const record = await LikeRecordOfPost.findOne({
            where: {
                postId: postId,
                userId: userId,
            }
        });
        return !!record;
    } catch (err) {
        console.error(err);
        return false;
    }

}