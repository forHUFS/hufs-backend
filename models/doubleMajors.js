const Sequelize = require('sequelize');


module.exports = class DoubleMajor extends Sequelize.Model{
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
            modelName: 'DoubleMajor',
            tableName: 'double_majors',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });


    }
    static associate(db){
        db.DoubleMajor.hasMany(db.User, { foreignKey: 'doubleMajorId', sourceKey: 'id'});
    }
}