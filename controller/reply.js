const Reply = require('../models/replies');
const LikeRecordOfReply = require('../models/likeRecordOfReply');
const ReportOfReply = require('../models/reportOfReply');
const sequelize = require('../models').sequelize;



exports.addReply = async(req,res,next)=> {
    try {
        const reply = await Reply.create({
            content: req.body.content,
            postId: req.body.postId,
            userId: req.user.id
        });

        res.status(201).json({
            code: 201,
            message: "댓글 작성 성공"
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
        res.status(201).json({message: "대댓글 작성 완료", reply});
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
                where: { id: req.params.id }
            });
            res.status(200).json({
                code: 200,
                message: "삭제 완료"
            });
        } else {
            res.status(400).json({
                code: 400,
                message: "본인의 댓글만 삭제할 수 있습니다"
            })
        }

    } catch (err) {
        console.error(err);
        next(err);
    }
}
exports.modifyReply = async(req,res,next) => {
    try {
        await Reply.update({
            content: req.body.content,
        }, {
            where: {
                id: req.body.id,
                userId: req.user.id
            }

        });
        res.status(200).json({
            code: 200,
            message: "댓글 수정 완료"

        });

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
                    code: 200,
                    message: "좋아요 완료"
                });
            });
        } else {
            res.status(400).json({
                code: 400,
                message: "이미 추천한 댓글입니다"
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
                code: 200,
                message: "좋아요 취소 완료"
            });
            });
        } else {
            res.status(400).json({
                code: 400,
                message: "추천한 댓글에 대해서만 추천을 취소할 수 있습니다"
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
            userId: req.user.id
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
                    where: { id: replyId }
                });
                console.log(reply);
                console.log(reply.report);
                if (reply.report >= 5) {

                    // 유저 신고 카운트 +1
                }

                res.status(200).json({
                    code: 200,
                    message: "댓글 신고 완료"
                });

            });
        } else {
            res.status(400).json({
                code: 400,
                message: "이미 신고한 댓글입니다"
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