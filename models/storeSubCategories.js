const Sequelize = require('sequelize');

module.exports = class StoreSubCategory extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            name: {
                type: Sequelize.STRING(16),
                allowNull: false,
                defaultValue: '기타'
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
        db.StoreSubCategory.belongsTo(db.StoreCategory,{foreignKey:'storecategory_id', targetKey: 'id'});
        db.StoreSubCategory.hasMany(db.Store, {foreignKey: 'storesubcategory_id', sourceKey: 'id'});
    }
}