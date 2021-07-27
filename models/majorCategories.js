const Sequelize = require('sequelize');


module.exports = class MajorCategory extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            name: {
                type: Sequelize.STRING(16),
                allowNull: false,
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: true,
            modelName: 'MajorCategory',
            tableName: 'major_categories',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db){
        db.MajorCategory.hasMany(db.FirstMajor, { foreignKey: 'majorCategoryId', sourceKey: 'id'});
        db.MajorCategory.hasMany(db.SecondMajor, { foreignKey: 'majorCategoryId', sourceKey: 'id'});
    }
}