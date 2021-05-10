const Sequelize = require('sequelize');

module.exports = class Provider extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            name: {
                type: Sequelize.ENUM('google', 'kakao'),
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING(32),
                allowNull: false
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: true,
            modelName: 'Provider',
            tableName: 'providers',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });


    }
    static associate(db){
        db.Provider.belongsTo(db.User, { foreignKey: "userId", targetKey: "id" })
    }
}