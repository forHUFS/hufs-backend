const Sequelize = require('sequelize');

module.exports = class Token extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            emailToken: {
                type     : Sequelize.STRING(64),
                allowNull: true,
                unique   : true
            },
            isEmailAuthenticated: {
                type     : Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            emailExpirationTime: {
                type     : Sequelize.DATE,
                allowNull: true
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: true,
            modelName: 'Token',
            tableName: 'tokens',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });

    }
    static associate(db){
        db.Token.belongsTo(db.User, {foreignKey: 'userId', targetKey: 'id'});
    }
}