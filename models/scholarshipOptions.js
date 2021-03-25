const Sequelize = require('sequelize');


module.exports = class ScholarshipOption extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            name: {
                type     : Sequelize.STRING(8),
                unique   : true,
                allowNull: false,
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: true,
            modelName: 'ScholarshipOption',
            tableName: 'scholarship_options',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });


    }
    static associate(db)    {
        db.ScholarshipOption.hasMany(db.Scholarship, { foreignKey: 'scholarshipOptionId', sourceKey: 'id'});
    }
}