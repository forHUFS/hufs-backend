const Sequelize = require('sequelize');


module.exports = class Campus extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            name: {
                type: Sequelize.STRING(4),
                allowNull: false
            }
        }, {
            sequelize, 
            timestamps: false,
            underscored: true,
            modelName: 'Campus',
            tableName: 'campuses',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }
    static associate(db) {
        db.Campus.hasMany(db.MainMajor, {foreignKey: 'campusId', sourceKey: 'id'});
        db.Campus.hasMany(db.DoubleMajor, {foreignKey: 'campusId', sourceKey: 'id'});
    }
}