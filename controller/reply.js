const Reply = require('../models/replies');
const sequelize = require('../models').sequelize;



exports.addReply = async(req,res,next)=> {
    try {
        if (!req.body.parentId) {
            const reply = await Reply.create({
                content: req.body.content,
                postId: req.body.postId,
                userId: req.user.id
            });
        } else if (req.body.parentId) {
            const reply = await Reply.create({
                content: req.body.content,
                parentId: req.body.parentId,
                postId: req.body.postId,
                userId: req.user.id
            });
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

exports.deleteReply = async(req,res,next) => {
    try {
        const reply = await Reply.findOne({
            where: { id: req.params.id }
        });

        if (reply.userId === req.user.id || req.user.type === 'admin') {
            await Reply.destroy({
                where: {id: req.params.id}
            });
            res.status(200).json({
                data: "",
                message: ""
            });
        } else {
            res.status(403).json({
                data: "",
                message: "FORBIDDEN"
            })
        }

    } catch (err) {
        console.error(err);
        next(err);
    }
}
exports.modifyReply = async(req,res,next) => {
    try {
        const reply = await Reply.update({
            content: req.body.content,
        }, {
            where: {
                id: req.params.id,
                userId: req.user.id
            }

        });
        if (reply[0]===0) {
            res.status(403).json({
                data: "",
                message: "FORBIDDEN"
            });
        } else {
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
