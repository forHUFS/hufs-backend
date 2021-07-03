const Post = require('../models/posts');
const Reply = require('../models/replies');
const LikeRecordOfPost = require('../models/likeRecordOfPost');
const LikeRecordOfReply = require('../models/likeRecordOfReply');
const sequelize = require('../models').sequelize;

exports.like = async (req,res,next) => {
    try {
        if (req.body.postId) {
            const postId = req.body.postId;
            const userId = req.user.id;
            if (!await checkLikeRecordOfPost(postId, userId)) {
                await sequelize.transaction(async (t) => {
                    await Post.update({
                        like: sequelize.literal('`like`+1')
                    }, {
                        where: {id: postId},
                        transaction: t
                    });
                    await LikeRecordOfPost.create({
                        postId: postId,
                        userId: userId,
                    }, {
                        transaction: t
                    });
                });
            } else {
                await sequelize.transaction(async (t) => {
                    await Post.update({
                        like: sequelize.literal('`like`-1')
                    }, {
                        where: {id: postId},
                        transaction: t
                    });
                    await LikeRecordOfPost.destroy({
                        where: {
                            postId: postId,
                            userId: userId
                        },
                        transaction: t
                    });
                });
            }
            res.status(200).json({
                data: "",
                message: ""
            });

        } else if (req.body.replyId) {
            const replyId = req.body.replyId;
            const userId = req.user.id;
            if (!await checkLikeRecordOfReply(replyId, userId)) {
                await sequelize.transaction(async (t)=> {
                    await Reply.update({
                        like: sequelize.literal('`like`+1')
                    }, {
                        where: { id: replyId },
                        transaction: t
                    });
                    await LikeRecordOfReply.create({
                        replyId: replyId,
                        userId: userId
                    }, {
                        transaction: t
                    });

                });
            } else {
                await sequelize.transaction(async (t)=> {
                    await Reply.update({
                        like: sequelize.literal('`like`-1')
                    }, {
                        where: { id: replyId },
                        transaction: t
                    });
                    await LikeRecordOfReply.destroy({
                        where: {
                            replyId: replyId,
                            userId: userId,
                        },
                        transaction: t
                    });
                });
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

async function checkLikeRecordOfPost (postId, userId) {
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
async function checkLikeRecordOfReply (replyId, userId) {
    try {
        const record = await LikeRecordOfReply.findOne({
            where: {
                replyId: replyId,
                userId: userId,
            }
        });
        return !!record;
    } catch (err) {
        console.error(err);
        return false;
    }

}