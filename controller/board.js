const Post = require('../models/posts');
const Board = require('../models/boards');
const Category = require('../models/categories');
const { deleteImg } = require('../middlewares/upload');
const { QueryTypes } = require('sequelize');
const { authUtil } = require('../middlewares/auth');


exports.readPosts = async (req,res,next)=>{
    try {
        const posts = await Post.sequelize.query(
            `
                SELECT posts.id AS "id",
                posts.title AS "title",
                posts.like AS "like",
                posts.report AS "report",
                posts.admin AS "admin",
                posts.header AS "header",
                posts.created_at AS "createdAt",
                posts.updated_at AS "updatedAt",
                posts.board_id AS "boardId",
                (SELECT id FROM users WHERE id = posts.user_id) AS "userId",
                (SELECT type FROM users WHERE id = posts.user_id) AS "type",
                (SELECT nickname FROM users WHERE id = posts.user_id) AS "nickname",
                COUNT(CASE WHEN replies.id = null THEN 0 ELSE replies.id END) AS "repliesCount"
                FROM posts
                LEFT OUTER JOIN replies ON replies.post_id = posts.id
                LEFT OUTER JOIN boards ON boards.id = posts.board_id
                WHERE boards.title = '${req.params.title}'
                GROUP BY posts.id
            `,
            {type: QueryTypes.SELECT}
        );
        res.status(200).json({
            data: posts,
            message: ""
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
}
exports.addPost = async (req,res,next)=> {
    try {

        const board = await Board.findOne({
            where: { title: req.params.title },
            include: { model: Category, attributes: ['title']}
        });
        if (!board) {
            return res.status(404).json({
                data: "",
                message: "RESOURCE_NOT_FOUND"
            })
        }
        if (board.Category.title === '학교떠난Boo' && board.title !== '취창업공간-질문') {
            return await authUtil.isGraduated(req,res,next);
        }

        let admin = false
        if (req.user.type === 'admin') {
            admin = true
        }
            await Post.create({
                title: req.body.title,
                content: req.body.content,
                header: req.body.header,
                boardId: board.id,
                userId: req.user.id,
                admin: admin
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
