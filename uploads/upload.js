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
            cb(null, `post/${Date.now()}${path.basename(file.originalname)}`);
        }
    }),
    limits: { fileSize: 5*1024*1024 }
});

exports.uploadImg = (req,res)=>{
    console.log(req.files);
    const location = req.files.map(img => img.location);
    res.status(200).json({
        code: 200,
        url: location
    });
}
exports.deleteImg = async (url)=> {
    try {
        let obj = [];
        url.map(i => {
            const tmp = i.split('/').slice(-2);
            const url = tmp.join('/');
            obj.push({Key: url});
        });
        await this.s3.deleteObjects({Bucket: 'hufsweb', Delete: { Objects: obj }}).promise()
            .then(data => {
                console.log("이미지 삭제 완료", data);
                return data;
            })
            .catch(err => {
                console.error("이미지 삭제 오류", err);
                return err;
            });
    } catch (err){
        console.error(err);
        return err;
    }
}