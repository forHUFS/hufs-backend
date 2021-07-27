const Sequelize = require('sequelize');


module.exports = class FirstMajor extends Sequelize.Model{
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
            modelName: 'FirstMajor',
            tableName: 'first_majors',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db){
        db.FirstMajor.hasMany(db.User, { foreignKey: 'firstMajorId', sourceKey: 'id'});
        db.FirstMajor.belongsTo(db.Campus, { foreignKey: 'campusId', targetKey: 'id' });
        db.FirstMajor.belongsTo(db.MajorCategory, { foreignKey: 'majorCategoryId', targetKey: 'id' });
    }
}