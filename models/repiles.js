const Sequelize = require('sequelize');

module.exports = class Reply extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            content: {
                type: Sequelize.STRING,
                allowNull: false
            },
            like: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                defaultValue: 0
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'Reply',
            tableName: 'replies',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });


    }
    static associate(db){
        db.Reply.belongsTo(db.Post, { onDelete: 'CASCADE', foreignKey: 'post_id', targetKey: 'id' });
    }
}