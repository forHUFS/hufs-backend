const Sequelize = require('sequelize');

module.exports = class Category extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            title: {
                type: Sequelize.STRING(16),
                allowNull: false,
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'Category',
            tableName: 'categories',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });


}
    static associate(db){
        db.Category.hasMany(db.Board, { foreignKey: 'categoryId', sourceKey: 'id'});
    }
}