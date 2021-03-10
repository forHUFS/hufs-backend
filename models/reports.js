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

}