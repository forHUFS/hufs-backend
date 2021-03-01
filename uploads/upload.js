const path = require('path');
const upload = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

exports.s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY_ID,
    region: 'ap-northeast-2',
})

exports.upload = upload({
    storage: multerS3({
        s3: this.s3,
        bucket: 'hufsweb',
        key(req, file, cb){
            cb(null, `original/${Date.now()}${path.basename(file.originalname)}`);
        }
    }),
    limits: { fileSize: 5*1024*1024 }
});

exports.uploadImg = (req,res)=>{
    console.log(req.files);
    const location = req.files.map(img => img.location);
    res.status(200).json({ url: location });
}
exports.deleteImg = async (req,res,next)=> {
    try {
        console.log(req.body);
        const url = req.body.url.split('/').slice(-2);
        const img = url.join('/');
        const params = {
            Bucket: 'hufsweb',
            Key: img
        };
        await this.s3.deleteObject(params).promise()
            .then(data => {
                console.log("이미지 삭제 완료", data);
                res.status(200).json({message: "이미지 삭제 완료"});
            })
            .catch(err => {
                console.error("이미지 삭제 오류", err);
                res.status(400).json({message: "이미지 삭제 오류"});
            });
    } catch (err){
        console.error(err);
        next(err);
    }
}