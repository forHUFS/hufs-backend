const Sequelize = require('sequelize');

module.exports = class Store extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            longitude: {
                type: Sequelize.DOUBLE,
                allowNull: false,
            },
            latitude: {
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
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'Store',
            tableName: 'stores',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });


    }
    static associate(db){
        db.Store.belongsTo(db.StoreSubCategory, {foreignKey: 'storesubcategory_id', targetKey: 'id'});
        db.Store.hasMany(db.StoreReview, { foreignKey: 'store_id', sourceKey: 'id'});
    }
}