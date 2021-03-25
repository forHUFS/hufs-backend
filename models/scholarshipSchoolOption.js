const Sequelize = require('sequelize');


module.exports = class ScholarshipSchoolOption extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            name: {
                type     : Sequelize.STRING(8),
                allowNull: false,
                unique   : true
            }

        }, {
            sequelize,
            timestamps: false,
            underscored: true,
            modelName: 'ScholarshipSchoolOption',
            tableName: 'scholarship_school_options',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });


    }
    static associate(db)    {
        db.ScholarshipSchoolOption.hasMany(db.Scholarship, { foreignKey: 'scholarshipSchoolOptionId', sourceKey: 'id'});
    }
}