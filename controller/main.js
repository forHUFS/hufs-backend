const Post = require('../models/posts');
const Board = require('../models/boards');
const User = require('../models/users');
const { Op } = require('sequelize');

exports.searchPosts = async (req, res, next) => {
    try {
        let keyword = req.query.keyword;
        let option = req.query.option;
        if (!keyword || !option) {
            res.status(422).json({
                data: "",
                message: "QUERY"
            });
        } else {
        keyword = keyword.trim();
        if (keyword.length < 2) {
            return res.status(422).json({
                data: "",
                message: "QUERY_KEYWORD"
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
                },
                include: [{model: Board, attributes: ['title']},
                          {model: User, attributes: ['nickname']}]
            });

        } else if (option === 'title') {

            var post = await Post.findAll({
                where: { title: {[Op.and]: key} },
                include: [{model: Board, attributes: ['title']},
                          {model: User, attributes: ['nickname']}]
            });


        } else if (option === 'content') {
            var post = await Post.findAll({
                where: { content: {[Op.and]: key}},
                include: [{model: Board, attributes: ['title']},
                          {model: User, attributes: ['nickname']}]
            });

        } else if (option === 'nick') {
            const user = await User.findOne({
                where: {nickname: {[Op.and]: key}}
            });
            if (user) {
                var post = await Post.findAll({
                    where: { userId: user.id, boardId: req.params.id},
                    include: [{model: Board, attributes: ['title']},
                              {model: User, attributes: ['nickname']}]
                });
            }
        } else {
            res.status(421).json({
                data: "",
                message: "QUERY_OPTION"
            });
        }
        if (post && post.length) {
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
        }

    } catch (err) {
        console.error(err);
        next(err);

    }

}
