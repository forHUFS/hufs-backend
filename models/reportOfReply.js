const Sequelize = require('sequelize');

module.exports = class ReportOfReply extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            content: {
                type: Sequelize.ENUM('1','2','3','4','5','6'), //임시
                allowNull: false
            },
            detail: {
                type: Sequelize.STRING(300),
                allowNull: true
            },

        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'ReportOfReply',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });


    }
    static associate(db){
        db.ReportOfReply.belongsTo(db.User, { onDelete: 'CASCADE', foreignKey: 'userId', targetKey: 'id' });
        db.ReportOfReply.belongsTo(db.Post, { onDelete: 'CASCADE', foreignKey: 'replyId', targetKey: 'id' });

    }
}