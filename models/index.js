const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const Board = require('./boards');
const Category = require('./categories');
const Directory = require('./directories');
const Image = require('./image');
const Post = require('./posts');
const Reply = require('./repiles');
const Report = require('./reports');
const Scrap = require('./scraps');
const StoreCategory = require('./storeCategories');
const StoreReview = require('./storeReviews');
const Store = require('./stores');
const StoreSubCategory = require('./storeSubCategories');

const db = {};
const sequelize = new Sequelize(
    config.database, config.username, config.password, config
);


db.Board = Board;
db.Category = Category;
db.Directory = Directory;
db.Image = Image;
db.Post = Post;
db.Reply = Reply;
//db.Report = Report;
db.Scrap = Scrap;
db.StoreCategory = StoreCategory;
db.StoreReview = StoreReview;
db.Store = Store;
db.StoreSubCategory = StoreSubCategory;

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