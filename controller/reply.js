const Reply = require('../models/replies');
const LikeRecordOfReply = require('../models/likeRecordOfReply');
const ReportOfReply = require('../models/reportOfReply');
const { userReport } = require('../middlewares/reports');
const sequelize = require('../models').sequelize;



exports.addReply = async(req,res,next)=> {
    try {
        const reply = await Reply.create({
            content: req.body.content,
            postId: req.body.postId,
            userId: req.user.id
        });

        res.status(200).json({
            data: "",
            message: ""
        });


    } catch (err) {
        console.error(err);
        next(err);
    }
}
exports.addReReply = async(req,res,next)=>{
    try {
        const reply = await Reply.create({
            content: req.body.content,
            parentId: req.body.parentId,
            postId: req.body.postId,
            userId: req.user.id
        });
        res.status(200).json({
            data: "",
            message: ""
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
}
exports.deleteReply = async(req,res,next) => {
    try {
        const reply = await Reply.findOne({
            where: { id: req.params.id }
        });

        if (reply.userId === req.user.id || req.user.type === 'admin') {
            await Reply.destroy({
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
            })
        }

    } catch (err) {
        console.error(err);
        next(err);
    }
}
exports.modifyReply = async(req,res,next) => {
    try {
        const reply = await Reply.update({
            content: req.body.content,
        }, {
            where: {
                id: req.params.id,
                userId: req.user.id
            }

        });
        if (reply[0]===0) {
            res.status(403).json({
                data: "",
                message: "FORBIDDEN"
            });
        } else {
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
exports.addReplyLike = async (req,res,next) => {
    try {
        const replyId = req.params.id;
        const userId = req.user.id;
        if (!await this.checkLikeRecordOfReply(replyId, userId)) {
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
exports.cancelReplyLike = async (req,res,next)=> {
    try {
        const replyId = req.params.id;
        const userId = req.user.id;
        if (await this.checkLikeRecordOfReply(replyId, userId)) {
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

exports.report = async(req,res,next) => {
    try {
        const replyId = req.params.id;
        const userId = req.user.id;
        const record = await ReportOfReply.findOne({
            replyId: replyId,
            userId: req.user.id;
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
                console.log(reply);
                console.log(reply.report);
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

    } catch (err) {
        console.error(err);
        next(err);
    }
}

exports.checkLikeRecordOfReply = async (replyId, userId) => {
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