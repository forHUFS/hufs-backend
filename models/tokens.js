const Sequelize = require('sequelize');

module.exports = class Token extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            emailToken: {
                type     : Sequelize.STRING(64),
                allowNull: true,
                unique   : true
            },
            accessToken : {
                type     : Sequelize.STRING(64),
                allowNull: true,
                unique   : true
            },
            isMaintained: {
                type        : Sequelize.BOOLEAN(),
                allowNull   : false,
                defaultValue: false,
            },

        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'Token',
            tableName: 'tokens',
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });

    }
    static associate(db){
        db.Token.belongsTo(db.User, {foreignKey: 'userId', targetKey: 'id'});
    }
}