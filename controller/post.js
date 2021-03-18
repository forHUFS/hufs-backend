const Post = require('../models/posts');
const Reply = require('../models/replies');
const ReportOfPost = require('../models/reportOfPost');
const User = require('../models/users');
const LikeRecordOfPost = require('../models/likeRecordOfPost');
const { deleteImg }= require('../uploads/upload');
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
            res.status(200).json({
                code: 200,
                message: "좋아요 완료"
            });
            });
        } else {
            res.status(400).json({
                code: 400,
                message: "이미 추천한 게시글입니다"
            });
        }

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
                    postId: postId,
                    userId: userId,
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
                message: "추천한 게시글에 대해서만 추천을 취소할 수 있습니다"
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
            code: 200,
            message: "글 작성 취소: 이미지 삭제 완료"
        });

    } catch (err) {
        console.error(err);
        next(err);
    }
}

exports.modifyPost = async(req,res,next)=> {
    try {
         await Post.update({
            title: req.body.title,
            content: req.body.content,
        },{
            where : {
                id: req.params.id,
                userId: req.user.id
            }
        });

        const url = req.body.url;
        if (url && url.length){
            await deleteImg(url);
        }
        res.status(200).json({
            code: 200,
            message: "게시글 수정 완료"

        });

    } catch (err) {
        console.error(err);
        next(err);
    }

}
exports.cancelEdit = async (req,res,next)=> {
    try {
        const url = req.body.url;
        await deleteImg(url);
        res.status(200).json({
            code: 200,
            message: "글 수정 취소: 이미지 삭제 완료"
        });

    } catch (err) {
        console.error(err);
        next(err);
    }
}
exports.readPost = async(req,res,next)=>{
    try {
        const post = await Post.findOne({
            where: { id: req.params.id, report: { [Op.lt]: 5 } },
            include: [{ model: Reply }, { model: User , attributes: ['nickname'] }]
        });
        if (post) {
            res.status(200).json({
                code: 200,
                post: post,
            });
        } else {
            res.status(400).json({message: "게시글이 존재하지 않습니다"});
        }
    } catch (err) {
        console.error(err);
        next(err)
    }


}
exports.deletePost = async(req,res,next)=>{
    try {
        const post = await Post.findOne({
            where: { id: req.params.id }
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
                where: { id: req.params.id },
            });

            res.status(200).json({
                code: 200,
                message: "삭제 완료"
            });
        } else {
            res.status(400).json({
                code: 400,
                message: "본인이 게시한 글만 삭제할 수 있습니다"
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

                // 유저 신고 카운트 +1 -> 5 ->
                }

                res.status(200).json({
                    code: 200,
                    message: "신고 완료"
                });

            });
        } else {
            res.status(400).json({
                code: 400,
                message: "이미 신고한 게시글입니다"
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