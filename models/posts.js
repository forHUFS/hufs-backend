const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            title: {
                type: Sequelize.STRING(32),
                allowNull: false,
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            like: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                defaultValue: 0,
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'Post',
            tableName: 'posts',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });


    }
    static associate(db)    {
            db.Post.belongsTo(db.Board, { foreignKey: 'boardId', targetKey: 'id'});
        db.Post.hasMany(db.Reply, { foreignKey: 'postId', sourceKey: 'id'});
        db.Post.hasMany(db.Image, { foreignKey: 'postId', sourceKey: 'id'});
    }
}