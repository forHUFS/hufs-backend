const Post  = require('../models/posts');
const Reply = require('../models/replies');


const returnPass = async(req, res, next) => {
    return res.status(200).json({data: '', message: ''});
}


const ownerCheck = async(req, res) => {
    type = req.query.type
    id   = req.query.id

    if (!type) {
        return res.status(422).json({data: '', message: 'QUERY_TYPE'});
    } else if (!id) {
        return res.status(422).json({data: '', message: 'QUERY_ID'});
    } else if (type === 'post') {
        var data = await Post.findOne({where: {id: id}})
    } else if (type === 'reply') {
        var data = await Reply.findOne({where: {id: id}})
    } else {
        return res.status(422).json({data: '', message: 'QUERY'});
    }

    if (data.userId === req.user.id) {
        return res.status(200).json({data: '', message: ''});
    } else {
        return res.status(403).json({data: '', message: 'FORBIDDEN'});
    }
}

module.exports = { returnPass, ownerCheck };