const Sequelize = require('sequelize');

module.exports = class TimeTable extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            name: {
                type: Sequelize.STRING(16),
                allowNull: false,
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: "TimeTalbe",
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });

// 1. User Database, auth middleware(JWT), swagger -> merge 하고 말씀드리기
// 2. AWS rds / ec2 test server (수요일) -> 
// 3. 

    }
    static associate(db){
        db.Token.belongsTo(db.User, {onDelete: "CASCADE", foreignKey: 'userId', targetKey: 'id'});
    }
}