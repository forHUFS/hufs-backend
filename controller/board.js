const sequelize = require('sequelize');
const Post = require('../models/posts');
const User = require('../models/users');
const Reply = require('../models/replies');
const { deleteImg } = require('../middlewares/upload');
const { Op, QueryTypes } = require('sequelize');


exports.readPosts = async (req,res,next)=>{
    try {
        const posts = await Post.sequelize.query(
            `
                SELECT posts.id AS "id",
                posts.title AS "title",
                posts.like AS "like",
                posts.report AS "report",
                posts.admin AS "admin",
                posts.created_at AS "createdAt",
                posts.updated_at AS "updatedAt",
                posts.board_id AS "boardId",
                users.id AS "userId",
                users.nickname AS "userNickname",
                replies.post_id AS "postId",
                COUNT(CASE WHEN 0 THEN 0 ELSE replies.id END) AS "repliesCount"
                FROM posts
                LEFT OUTER JOIN users ON posts.user_id = users.id
                LEFT OUTER JOIN replies ON posts.id = replies.post_id
                WHERE posts.board_id = ${req.params.id}
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
        if (req.user.type === 'user') {
            await Post.create({
                title: req.body.title,
                content: req.body.content,
                boardId: req.params.id,
                userId: req.user.id
            });
        } else if (req.user.type === 'admin') {
            await Post.create({
                title: req.body.title,
                content: req.body.content,
                boardId: req.params.id,
                userId: req.user.id,
                admin: true
            });
        }
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

