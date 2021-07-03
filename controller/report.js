const Post = require('../models/posts');
const Reply = require('../models/replies');
const ReportOfPost = require('../models/reportOfPost');
const ReportOfReply = require('../models/reportOfReply');
const { userReport } = require('../middlewares/reports');
const sequelize = require('../models').sequelize;

exports.report = async(req,res,next) => {
    try {
        if (req.body.postId) {  // 게시글 신고
            const postId = req.body.postId;
            const userId = req.user.id;
            const record = await ReportOfPost.findOne({
                where: {
                    postId: postId,
                    userId: userId
                }
            });
            if (!record) {
                await sequelize.transaction(async (t) => {
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
                    }, {
                        where: { id: postId },
                        transaction: t,
                    });
                    const post = await Post.findOne({
                        where: { id: postId },
                        transaction: t,
                    });

                    if (post.report >= 5) {
                        req.userId = post.userId;
                        userReport(req, res, next);
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
        } else if (req.body.replyId) {  // 댓글 신고
            const replyId = req.body.replyId;
            const userId = req.user.id;
            const record = await ReportOfReply.findOne({
                replyId: replyId,
                userId: userId
            });
            if (!record) {
                await sequelize.transaction(async (t)=> {
                    await ReportOfReply.create({
                        content: req.body.content,
                        detail: req.body.detail,
                        replyId: replyId,
                        userId: userId
                    }, {
                        transaction: t
                    });
                    await Reply.update({
                        report: sequelize.literal('`report`+1')
                    },{
                        where: { id: replyId },
                        transaction: t,
                    });
                    const reply = await Reply.findOne({
                        where: { id: replyId },
                        transaction: t
                    });

                    if (reply.report >= 5) {
                        req.userId = reply.userId;
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
        }

    } catch (err) {
        console.error(err);
        next(err);
    }
}