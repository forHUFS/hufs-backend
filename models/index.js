const Sequelize         = require('sequelize');
const env               = process.env.NODE_ENV || 'test';
const config            = require('../config/database.json')[env];
const Board             = require('./boards');
const Category          = require('./categories');
const Directory         = require('./directories');
const LikeRecordOfPost  = require('./likeRecordOfPost');
const LikeRecordOfReply = require('./likeRecordOfReply');
const Post              = require('./posts');
const Reply             = require('./replies');
const ReportOfPost      = require('./reportOfPost');
const ReportOfReply     = require('./reportOfReply');
const Scrap             = require('./scraps');
const StoreCategory     = require('./storeCategories');
const StoreReview       = require('./storeReviews');
const Store             = require('./stores');
const StoreSubCategory  = require('./storeSubCategories');
const User              = require("./users");
const Token             = require("./tokens");
const MainMajor         = require('./mainMajors');
const DoubleMajor       = require('./doubleMajors');


const db = {};
const sequelize = new Sequelize(
    config.database, config.username, config.password, config
);

db.Board             = Board;
db.Category          = Category;
db.Directory         = Directory;
db.LikeRecordOfPost  = LikeRecordOfPost;
db.LikeRecordOfReply = LikeRecordOfReply;
db.Post              = Post;
db.Reply             = Reply;
db.ReportOfPost      = ReportOfPost;
db.ReportOfReply     = ReportOfReply;
db.Scrap             = Scrap;
db.StoreCategory     = StoreCategory;
db.StoreReview       = StoreReview;
db.Store             = Store;
db.StoreSubCategory  = StoreSubCategory;
db.User              = User;
db.Token             = Token;
db.MainMajor         = MainMajor;
db.DoubleMajor       = DoubleMajor;


Object.keys(db).forEach(modelName => {
        db[modelName].init(sequelize);
});
Object.keys(db).forEach(modelName=> {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;

module.exports = db;