const Sequelize = require('sequelize');


module.exports = class MainMajor extends Sequelize.Model{
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
            modelName: 'MainMajor',
            tableName: 'main_majors',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db){
        db.MainMajor.hasMany(db.User, { foreignKey: 'mainMajorId', sourceKey: 'id'});
    }
}