const Post = require('../models/posts');
const Board = require('../models/boards');
const User = require('../models/users');
const { Op } = require('sequelize');

exports.searchPosts = async (req, res, next)=>{
    try {
        let keyword = req.query.keyword;
        keyword = keyword.trim();
        if (keyword.length < 2) {
            return res.status(400).json({
                code: 400,
                message: "두 글자 이상을 검색해 주세요"
            });
        }
        keyword = keyword.replace(/\s\s+/gi, ' ');

        let key = [];
        keyword.split(' ').map(k => {
            if (k.length > 1) {
                key.push({[Op.regexp]: k});
            }
        });
        if (req.query.option === 'titleAndContent') {

            var post = await Post.findAll({
                where: {
                    [Op.or]: [
                        {title: {[Op.and]: key}},
                        {content: {[Op.and]: key}}],
                },
                include: [{model: Board, attributes: ['title']},
                          {model: User, attributes: ['nickname']}]
            });

        } else if (req.query.option === 'title') {

            var post = await Post.findAll({
                where: { title: {[Op.and]: key} },
                include: [{model: Board, attributes: ['title']},
                          {model: User, attributes: ['nickname']}]
            });


        } else if (req.query.option === 'content') {
            var post = await Post.findAll({
                where: { content: {[Op.and]: key}},
                include: [{model: Board, attributes: ['title']},
                          {model: User, attributes: ['nickname']}]
            });

        } else if (req.query.option === 'nick') {
            const user = await User.findOne({
                where: {nickname: {[Op.and]: key}}
            });
            var post = await Post.findAll({
                where: {userId: user.id, boardId: req.params.id},
                include: [{model: User, attributes: ['nickname']}]
            });
        } else {
            res.status(400).json({
                code: 400,
                message: "잘못된 요청입니다"
            });
        }
        if (post.length) {
            res.status(200).json({
                code: 200,
                post
            });
        } else {
            res.status(202).json({
                code: 202,
                message: "검색 결과가 존재하지 않습니다"
            });
        }


    } catch (err) {
        console.error(err);
        next(err);

    }

}
