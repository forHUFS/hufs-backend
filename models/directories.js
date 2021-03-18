const Sequelize = require('sequelize');

module.exports = class Directory extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            name: {
                type: Sequelize.STRING(16),
                allowNull: false,
                defaultValue: '기타'
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'Directory',
            tableName: 'directories',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });


    }

    static associate(db) {
    }
}


