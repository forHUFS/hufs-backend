const Sequelize = require('sequelize');


module.exports = class Scholarship extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            id: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                autoIncrement: false,
                primaryKey: true
            },
            title: {
                type: Sequelize.STRING(64),
                allowNull: false,
            },
            link: {
                type: Sequelize.STRING(512),
                allowNull: false,
                defaultValue: 0,
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: true,
            modelName: 'Scholarship',
            tableName: 'scholarships',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });


    }
    static associate(db)    {
        db.Scholarship.belongsTo(db.ScholarshipDate, { foreignKey: 'scholarshipDateId', targetKey: 'id'});
        db.Scholarship.belongsTo(db.ScholarshipOption, { foreignKey: 'scholarshipOptionId', targetKey: 'id'});
        db.Scholarship.belongsTo(db.ScholarshipSchoolOption, { foreignKey: 'scholarshipSchoolOptionId', targetKey: 'id'});
    }
}