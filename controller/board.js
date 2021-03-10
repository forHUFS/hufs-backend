const Post = require('../models/posts');
const Board = require('../models/boards');
const { Op } = require('sequelize');
const { paging } = require('../controller/main');

exports.readPosts = async (req,res,next)=>{
    try {
        let num = req.query.page || 1;
        num = isNaN(num)||num<1?1:num;
        let offset = (num - 1) * 10;

        const post = await Post.findAndCountAll({
            where: { boardId: req.params.id, isBlocked: false },
            offset: offset,
            limit: 10,
            order:  [['createdAt', 'DESC']]
        });
        res.status(200).json(paging(post,num));
    } catch (err) {
        console.error(err);
        next(err);
    }
}

exports.searchPostsInBoard = async (req, res, next)=>{
    try {
            let keyword = req.query.keyword;
            keyword = keyword.trim();
            if (keyword.length < 2) {
                return res.status(400).json({message: "두 글자 이상을 검색해 주세요"});
            }
            keyword = keyword.replace(/\s\s+/gi, ' ');
            let num = req.query.page || 1;
            num = isNaN(num) || num < 1 ? 1 : num;
            let offset = (num - 1) * 10;

            let key = [];
            keyword.split(' ').map(k => {
                key.push({[Op.regexp]: k});
            });
            if (req.query.option === 'titleandcontent') {

                const post = await Post.findAndCountAll({
                    where: {
                        [Op.or]: [
                            {title: {[Op.and]: key}},
                            {content: {[Op.and]: key}}],
                        boardId: req.params.id,
                        isBlocked: false,
                    },
                    offset: offset,
                    limit: 10,
                    order: [['createdAt', 'DESC']]

                });

                if (post.rows.length) {
                    res.status(200).json(paging(post, num));
                } else {
                    res.status(400).json({message: "검색 결과가 존재하지 않습니다"});
                }
            } else if (req.query.option === 'title') {

                const post = await Post.findAndCountAll({
                    where: { title: {[Op.and]: key}, boardId: req.params.id, isBlocked: false },
                    offset: offset,
                    limit: 10,
                    order: [['createdAt', 'DESC']]

                });

                if (post.rows.length) {
                    res.status(200).json(paging(post, num));
                } else {
                    res.status(400).json({message: "검색 결과가 존재하지 않습니다"});
                }

            } else if (req.query.option === 'content') {
                const post = await Post.findAndCountAll({
                    where: { content: {[Op.and]: key}, boardId: req.params.id, isBlocked: false },
                    offset: offset,
                    limit: 10,
                    order: [['createdAt', 'DESC']]

                });

                if (post.rows.length) {
                    res.status(200).json(paging(post, num));
                } else {
                    res.status(400).json({message: "검색 결과가 존재하지 않습니다"});
                }

            } else {
                res.status(400).json({message: "잘못된 요청입니다"});
            }

        } catch (err) {
        console.error(err);
        next(err);

    }

}
