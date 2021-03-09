const Sequelize = require('sequelize');

module.exports = class Token extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            token: {
                type     : Sequelize.STRING(64),
                allowNull: false,
                unique   : true
            },
            isMaintained: {
                type     : Sequelize.BOOLEAN(),
                allowNull: false,
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

// 1. User Database, auth middleware(JWT), swagger -> merge 하고 말씀드리기
// 2. AWS rds / ec2 test server (수요일) -> 
// 3. 

    }
    static associate(db){
        db.Token.belongsTo(db.User, {foreignKey: 'userId', targetKey: 'id'});
    }
}