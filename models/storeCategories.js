const Sequelize = require('sequelize');

module.exports = class StoreCategory extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            name: {
                type: Sequelize.STRING(32),
                allowNull: false,
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'StoreCategory',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });


    }
    static associate(db){
        db.StoreCategory.hasMany(db.StoreSubCategory, { foreignKey: 'storecategory_id', sourceKey: 'id'});
    }
}