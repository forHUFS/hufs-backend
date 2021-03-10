const Sequelize = require('sequelize');

module.exports = class Report extends Sequelize.Model{
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
            targetId: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            targetObject: {
                type: Sequelize.TINYINT,
                allowNull: false
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'Report',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });


    }
    static associate(db){
        db.Report.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'id' });
        // 신고를 한 사람의 아이디
        // 신고를 당한 사람의 아이디는 post를 타고 확인할 수 있으므로 추가 X
    }
}