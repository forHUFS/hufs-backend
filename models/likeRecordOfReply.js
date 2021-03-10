const Sequelize = require('sequelize');

module.exports = class LikeRecordOfReply extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'LikeRecordOfReply',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });


    }
    static associate(db){
        db.LikeRecordOfReply.belongsTo(db.Post, { onDelete: 'CASCADE', foreignKey: 'postId', targetKey: 'id'});
        db.LikeRecordOfReply.belongsTo(db.User,{ onDelete: 'CASCADE', foreignKey: 'userId', targetKey: 'id'});
    }
}