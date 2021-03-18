
const Sequelize = require('sequelize');

module.exports = class ReportOfPost extends Sequelize.Model{
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
            modelName: 'ReportOfPost',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });


    }
    static associate(db){
        db.ReportOfPost.belongsTo(db.User, { onDelete: 'CASCADE', foreignKey: 'userId', targetKey: 'id' });
        db.ReportOfPost.belongsTo(db.Post, { onDelete: 'CASCADE', foreignKey: 'postId', targetKey: 'id' });

    }
}
