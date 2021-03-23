const Sequelize = require('sequelize');

module.exports = class Store extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            long: {
                type: Sequelize.DOUBLE,
                allowNull: false,
            },
            lat: {
                type: Sequelize.DOUBLE,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING(32),
                allowNull: false,
            },
            tel: {
                type: Sequelize.STRING(16),
                allowNull: true,
            },
            numAddress: {
                type: Sequelize.STRING,
                allowNull: true
            },
            roadAddress: {
                type: Sequelize.STRING,
                allowNull: true
            },
            campus: {
                type: Sequelize.TINYINT,
                allowNull: false
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: true,
            modelName: 'Store',
            tableName: 'stores',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });


    }
    static associate(db){
        db.Store.belongsTo(db.StoreSubCategory, {foreignKey: 'storeSubCategoryId', targetKey: 'id'});
        db.Store.hasMany(db.StoreReview, { foreignKey: 'storeId', sourceKey: 'id'});
    }
}