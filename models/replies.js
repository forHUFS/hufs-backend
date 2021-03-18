const Sequelize = require('sequelize');

module.exports = class Reply extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            content: {
                type: Sequelize.STRING,
                allowNull: false
            },
            like: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                defaultValue: 0
            },
            report: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                defaultValue: 0
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'Reply',
            tableName: 'replies',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });

    }
    static associate(db){
        db.Reply.belongsTo(db.Post, { onDelete: 'CASCADE', foreignKey: 'postId', targetKey: 'id' });
        db.Reply.belongsTo(db.Reply, { as: 'ReReply', foreignKey: 'parentId'});
        db.Reply.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'id'});
        db.Reply.hasMany(db.LikeRecordOfReply, { foreignKey: 'replyId', sourceKey: 'id' });
        db.Reply.hasMany(db.ReportOfReply, { foreignKey: 'replyId', sourceKey: 'id' });
        // Post 연결 관계 설정할 때만 delete CASCADE가 적용이 안 되는 문제 발생
        // mysql에서 수동으로 ON DELETE CASCADE 설정해 줌
    }
}