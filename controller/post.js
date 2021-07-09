const Post = require('../models/posts');
const Reply = require('../models/replies');
const User = require('../models/users');
const { deleteImg } = require('../middlewares/upload');
const { Op } = require('sequelize');
const sequelize = require('../models').sequelize;

exports.cancelPost = async (req,res,next)=> {
    try {
        const url = req.body.url;
        await deleteImg(url);
        res.status(200).json({
            data: "",
            message: ""
        });

    } catch (err) {
        console.error(err);
        next(err);
    }
}

exports.modifyPost = async(req,res,next)=> {
    try {
         const post = await Post.update({
            title: req.body.title,
            content: req.body.content,
            header: req.body.header
        },{
            where : {
                id: req.params.id,
                userId: req.user.id
            }
        });
         console.log(post);
         if (post[0] === 0) {
             res.status(403).json({
                 data: "",
                 message: "FORBIDDEN"
             });
         } else {
             const url = req.body.url;
             if (url && url.length) {
                 await deleteImg(url);
             }
             res.status(200).json({
                 data: "",
                 message: ""
             });
         }
    } catch (err) {
        console.error(err);
        next(err);
    }

}

exports.readPost = async(req,res,next)=>{
    try {
        const post = await Post.findOne({
            where: { id: req.params.id, report: { [Op.lt]: 5 } },
            include: [{ model: Reply, paranoid: false, include: [{model: User, attributes: ['nickname']}] },
                      { model: User , attributes: ['nickname'] }]
        });
        if (post) {
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
    } catch (err) {
        console.error(err);
        next(err)
    }


}
exports.deletePost = async(req,res,next)=> {
    try {
        const post = await Post.findOne({
            where: {id: req.params.id}
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
                where: {id: req.params.id},
            });

            res.status(200).json({
                data: "",
                message: ""
            });
        } else {
            res.status(403).json({
                data: "",
                message: "FORBIDDEN"
            });
        }

    } catch (err){
        console.error(err);
        next(err);
    }
}

