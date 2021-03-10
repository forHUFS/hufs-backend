const Sequelize = require('sequelize');

module.exports = class StoreReview extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            title: {
                type: Sequelize.STRING(32),
                allowNull: false,
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            image: {
                type: Sequelize.STRING(300),
                allowNull: true,
            },
            score: {
                type: Sequelize.DECIMAL(2,1),
                allowNull: false,
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'StoreReview',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });


    }
    static associate(db){
        db.StoreReview.belongsTo(db.Store, { foreignKey: 'storeId', targetKey:'id'});
        db.StoreReview.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'id'});
    }
}