const Sequelize = require('sequelize');

module.exports = class LikeRecordOfPost extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
        }, {
            sequelize,
            timestamps: false,
            underscored: true,
            modelName: 'LikeRecordOfPost',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });


    }
    static associate(db) {
        db.LikeRecordOfPost.belongsTo(db.User, { onDelete: 'CASCADE', foreignKey: 'userId', targetKey: 'id' });
        db.LikeRecordOfPost.belongsTo(db.Post, { onDelete: 'CASCADE', foreignKey: 'postId', targetKey: 'id' });

    }

}