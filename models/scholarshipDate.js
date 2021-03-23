const Sequelize = require('sequelize');


module.exports = class ScholarshipDate extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            date: {
                type     : Sequelize.DATE,
                allowNull: false,
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: true,
            modelName: 'ScholarshipDate',
            tableName: 'scholarship_dates',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });


    }
    static associate(db)    {
        db.ScholarshipDate.hasMany(db.Scholarship, { foreignKey: 'scholarshipDateId', sourceKey: 'id'});
    }
}