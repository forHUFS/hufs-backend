const Sequelize = require('sequelize');

module.exports = class StoreSubCategory extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            name: {
                type: Sequelize.STRING(16),
                allowNull: false,
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'StoreSubCategory',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });


    }
    static associate(db){
        db.StoreSubCategory.belongsTo(db.StoreCategory,{ foreignKey:'storeCategoryId', targetKey: 'id' });
        db.StoreSubCategory.hasMany(db.Store, { foreignKey: 'storeSubCategoryId', sourceKey: 'id' });
    }
}