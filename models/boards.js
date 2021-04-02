const Sequelize = require('sequelize');

module.exports = class Board extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            title: {
                type: Sequelize.STRING(16),
                allowNull: false,
            },
            admin: {
                type: Sequelize.BOOLEAN,
                allowNull: false
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'Board',
            tableName: 'boards',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });


    }
    static associate(db){
        db.Board.hasMany(db.Post, { foreignKey: 'boardId', sourceKey: 'id'});
        db.Board.belongsTo(db.Category, { foreignKey: 'categoryId', targetKey: 'id'});
    }
}