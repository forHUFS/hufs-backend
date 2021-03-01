const Reply = require('../models/repiles');
const sequelize = require('../models').sequelize;


exports.addReply = async(req,res,next)=> {
    try {
        await Reply.create({
            content: req.body.content,
            post_id: req.body.postid,
        });
        res.status(201).json({message: "댓글 작성 성공"});

    } catch (err) {
        console.error(err);
        next(err);
    }
}
exports.deleteReply = async(req,res,next) => {
    try {
        await Reply.destroy({
            where: { id: req.params.id }
        });
        res.status(200).json({message: "삭제 완료"});

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
            where: { id: req.body.id }
        });
        res.status(200).json({message: "댓글 수정 완료"});
    } catch (err) {

    }
}
exports.addReplyLike = async (req,res,next) => {
    try {
        await Reply.update({
            like: sequelize.literal('`like`+1')
        }, {
            where: { id: req.params.id }
        });
        res.status(200).json({message: "좋아요 완료"});

    } catch (err) {
        console.error(err);
        next(err);
    }
}
exports.cancelReplyLike = async (req,res,next)=> {
    try {
        await Reply.update({
            like: sequelize.literal('`like`-1')
        }, {
            where: { id: req.params.id }
        });
        res.status(200).json({message: "좋아요 취소 완료"});

    } catch (err) {
        console.error(err);
        next(err);
    }
}