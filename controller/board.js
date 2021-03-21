const Post = require('../models/posts');
const User = require('../models/users');
const { deleteImg } = require('../uploads/upload');
const { Op } = require('sequelize');

exports.readPosts = async (req,res,next)=>{
    try {
        const post = await Post.findAll({
            where: { boardId: req.params.id },
            include: [{model: User, attributes: ['nickname'] }]
        });
        res.status(200).json({
            data: post,
            message: ""
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
}
exports.addPost = async (req,res,next)=> {
    try {
        await Post.create({
            title: req.body.title,
            content: req.body.content,
            boardId: req.params.id,
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

exports.searchPostsInBoard = async (req, res, next)=>{
    try {
            let keyword = req.query.keyword;
            let option = req.query.option;
            if (!keyword || !option) {
                res.status(400).json({
                    data: "",
                    message: "QUERY"
                });
            } else {
            keyword = keyword.trim();
            if (keyword.length < 2) {
                return res.status(412).json({
                    data: "",
                    message: "INVALID"
                });
            }
            keyword = keyword.replace(/\s\s+/gi, ' ');

            let key = [];
            keyword.split(' ').map(k => {
                if (k.length > 1) {
                    key.push({[Op.regexp]: k});
                }
            });
            if (option === 'titleAndContent') {

                var post = await Post.findAll({
                    where: {
                        [Op.or]: [
                            {title: {[Op.and]: key}},
                            {content: {[Op.and]: key}}],
                        boardId: req.params.id,
                    },
                    include: [{model: User, attributes: ['nickname']}]
                });

            } else if (option === 'title') {

                var post = await Post.findAll({
                    where: { title: {[Op.and]: key}, boardId: req.params.id },
                    order: [['createAt', 'DESC']],
                    include: [{model: User, attributes: ['nickname']}]
                });


            } else if (req.query.option === 'content') {
                var post = await Post.findAll({
                    where: { content: {[Op.and]: key}, boardId: req.params.id },
                    include: [{model: User, attributes: ['nickname']}]
                });

            } else if (option === 'nick') {
                const user = await User.findOne({
                    where: { nickname: {[Op.and]: key}}
                });
                if (user) {
                    var post = await Post.findAll({
                        where: {userId: user.id, boardId: req.params.id},
                        include: [{model: User, attributes: ['nickname']}]
                    });
                }
            } else {
                res.status(421).json({
                    data: "",
                    message: "INVALID"
                });
            }
        if (post && post.length) {
            res.status(200).json({
                data: post,
                message: ""
            });
        } else {
            res.status(204).json({
                data: "",
                message: ""
            });
        }
            }

    } catch (err) {
        console.error(err);
        next(err);

    }

}
