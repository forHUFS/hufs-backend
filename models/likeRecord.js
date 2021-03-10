const Sequelize = require('sequelize');

module.exports = class LikeRecord extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            targetId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            targetObject: {
                type: Sequelize.TINYINT,
                allowNull: false,
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'LikeRecord',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });


    }
    static associate(db) {
        db.LikeRecord.belongsTo(db.User, { onDelete: 'CASCADE', foreignKey: 'userId', targetKey: 'id' });

    }

}