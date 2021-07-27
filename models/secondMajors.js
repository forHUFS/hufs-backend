const Sequelize = require('sequelize');


module.exports = class SecondMajor extends Sequelize.Model{
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
            modelName: 'SecondMajor',
            tableName: 'second_majors',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db){
        db.SecondMajor.hasMany(db.User, { foreignKey: 'secondMajorId', sourceKey: 'id'});
        db.SecondMajor.belongsTo(db.Campus, { foreignKey: 'campusId', targetKey: 'id' });
        db.SecondMajor.belongsTo(db.MajorCategory, { foreignKey: 'majorCategoryId', targetKey: 'id' });
    }
}