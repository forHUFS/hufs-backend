const Sequelize = require('sequelize');

module.exports = class LikeRecordOfReply extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
        }, {
            sequelize,
            timestamps: false,
            underscored: true,
            modelName: 'LikeRecordOfReply',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });


    }
    static associate(db) {
        db.LikeRecordOfReply.belongsTo(db.User, { onDelete: 'CASCADE', foreignKey: 'userId', targetKey: 'id' });
        db.LikeRecordOfReply.belongsTo(db.Reply, { onDelete: 'CASCADE', foreignKey: 'replyId', targetKey: 'id' });

    }

}