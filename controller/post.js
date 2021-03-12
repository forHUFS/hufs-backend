const Post = require('../models/posts');
const Image = require('../models/image');
const Reply = require('../models/replies');
const Report = require('../models/reports');
const User = require('../models/users');
const { s3 }= require('../uploads/upload');
const sequelize = require('../models').sequelize;


exports.addLike = async (req,res,next) => {
    try {
        await Post.update({
            like: sequelize.literal('`like`+1')
        }, {
            where: { id: req.params.id }
        });
        res.status(200).json({
            code: 200,
            message: "좋아요 완료"
        });

    } catch (err) {
        console.error(err);
        next(err);
    }
}
exports.delLike = async (req,res,next)=> {
    try {
       await Post.update({
           like: sequelize.literal('`like`-1')
       }, {
           where: { id: req.params.id }
       });
       res.status(200).json({
           code: 200,
           message: "좋아요 취소 완료"
       });

    } catch (err) {
        console.error(err);
        next(err);
    }
}

exports.addPost = async (req,res,next)=> {
    try {
        await sequelize.transaction(async (t)=>{
        const post = await Post.create({
            title: req.body.title,
            content: req.body.content,
            boardId: req.body.boardId,
        }, {
            transaction: t,
        });
        const url = req.body.url;
        console.log(url);

        if (url && Array.isArray(url)) {
                const image = await Promise.all(
                    url.map(img => {
                        return Image.create({
                            url: img,
                            postId: post.id
                        }, {
                            transaction: t,
                        })
                    })
                );

        } else if (url && typeof url === 'string') {
            await Image.create( {
                url: url,
                postId: post.id
            }, {
                transaction: t,
            });
        }
        res.status(201).json({
            code: 201,
            message: "게시글 작성 완료"
        });
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
}
exports.modifyPost = async(req,res,next)=> {
    try {
        await sequelize.transaction( async (t)=> {
        await Post.update({
            title: req.body.title,
            content: req.body.content,
        }, {
            where: {id: req.body.id},
            transaction: t,
        });
        await Image.destroy({
            where: { postId: req.body.id },
            transaction: t,
        });
        const url = req.body.url
        console.log("url: ", url);
        if (url && Array.isArray(url)) {
                const image = await Promise.all(
                    url.map(img => {
                        return Image.create({
                            url: img,
                            postId: req.body.id
                        }, {
                            transaction: t
                        })
                    })
                );
        } else if (url && typeof url === 'string') {
            await Image.create({
                url: url,
                postId: req.body.id
            }, {
                transaction: t
            });
        }
        res.status(200).json({
            code: 200,
            message: "수정 완료"
        });
        });
    } catch (err) {
        console.error(err);
        next(err);
    }

}
exports.readPost = async(req,res,next)=>{
    try {
        console.log(req.params);
        const post = await Post.findOne({
            where: { id: req.params.id, isBlocked: false },
            include: [{model: Reply}, {model: Image , attributes: ['id','url']}]
        });
        console.log(post);
        if (post) {
            res.status(200).json({
                code: 200,
                post
            });
        } else {
            res.status(400).json({
                code: 400,
                message: "게시글이 존재하지 않습니다"
            });
        }
    } catch (err) {
        console.error(err);
        next(err)
    }


}
exports.deletePost = async(req,res,next)=>{
    try {
            const img = await Image.findAll({
                where: { postId: req.params.id, },
            });
            if (img.length) {
                console.log(img);
                const obj = [];
                img.map(i => {
                    const tmp = i.dataValues.url.split('/').slice(-2);
                    const url = tmp.join('/');
                    obj.push({Key: url});
                });
                await s3.deleteObjects({Bucket: 'hufsweb', Delete: { Objects: obj }}).promise()
                    .then(data => {
                        console.log("이미지 삭제 완료", data);
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).json({
                            code: 500,
                            message: "이미지 삭제 오류"
                        });
                    });


            }
            await Post.destroy({
            where: { id: req.params.id },
        });
        res.status(200).json({
            code: 200,
            message: "삭제 완료"
        });

    } catch (err){
        console.error(err);
        next(err);
    }
}

