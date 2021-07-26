const Post = require('../models/posts');
const Board = require('../models/boards');
const User = require('../models/users');
const Reply = require('../models/replies');
const Category = require('../models/categories');
const { Op } = require('sequelize');
const { sequelize } = require('../models/index');

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
                if (k.length >= 1) {
                    key.push({[Op.regexp]: k});
                }
            });
            if (!req.query.board) {
                if (option === 'titleAndContent') {
                    var post = await Post.findAll({
                        where: {
                            [Op.or]: [
                                {title: {[Op.and]: key}},
                                {content: {[Op.and]: key}}],
                        },
                        include: [
                            {model: User , attributes: ['nickname']},
                            {model: Board, attributes: ['title']},
                            {model: Reply, attributes: ['id']}
                           ],
                    });

                } else if (option === 'title') {

                    var post = await Post.findAll({
                        where: {title: {[Op.and]: key}},
                        include: [
                            {model: Board, attributes: ['title']},
                            {model: User, attributes: ['nickname']},
                            {model: Reply, attributes: ['id']}
                            ]
                    });

                } else if (option === 'content') {
                    var post = await Post.findAll({
                        where: {content: {[Op.and]: key}},
                        include: [
                            {model: Board, attributes: ['title']},
                            {model: User, attributes: ['nickname']},
                            {model: Reply, attributes: ['id']}
                            ]
                    });

                } else if (option === 'nick') {
                    const user = await User.findOne({
                        where: {nickname: {[Op.and]: key}}
                    });
                    if (user) {
                        var post = await Post.findAll({
                            where: {userId: user.id},
                            include: [
                                {model: Board, attributes: ['title']},
                                {model: User, attributes: ['nickname']},
                                {model: Reply, attributes: ['id']}
                                ]
                        });
                    }
                } else {
                    return res.status(422).json({
                        data: "",
                        message: "QUERY_OPTION"
                    });
                }

            } else {  // req.query.board가 있을 때

                const board = await Board.findOne({
                    where: {title: req.query.board},
                    include: {model: Category, attributes: ['title']}
                });
                if (!board) {
                    return res.status(404).json({
                        data: "",
                        message: "BOARD_NOT_FOUND"
                    });
                }
                const boardNumber = board.id;

                if (option === 'titleAndContent') {
                    var post = await Post.findAll({
                        where: {
                            [Op.or]: [
                                {title: {[Op.and]: key}},
                                {content: {[Op.and]: key}}],
                            boardId: boardNumber,
                        },
                        include: [
                            {model: User, attributes: ['nickname']},
                            {model: Reply, attributes: ['id']}
                            ]
                    });

                } else if (option === 'title') {

                    var post = await Post.findAll({
                        where: {title: {[Op.and]: key}, boardId: boardNumber},
                        include: [
                            {model: User, attributes: ['nickname']},
                            {model: Reply, attributes: ['id']}
                            ]
                    });


                } else if (req.query.option === 'content') {
                    var post = await Post.findAll({
                        where: {content: {[Op.and]: key}, boardId: boardNumber},
                        include: [
                            {model: User, attributes: ['nickname']},
                            {model: Reply, attributes: ['id']}
                            ]
                    });

                } else if (option === 'nick') {
                    const user = await User.findOne({
                        where: {nickname: {[Op.and]: key}}
                    });
                    if (user) {
                        var post = await Post.findAll({
                            where: {userId: user.id, boardId: boardNumber},
                            include: [
                                {model: User, attributes: ['nickname']},
                                {model: Reply, attributes: ['id']}
                                ]
                        });
                    }
                } else {
                    return res.status(422).json({
                        data: "",
                        message: "QUERY_OPTION"
                    });
                }

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
