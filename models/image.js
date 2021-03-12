const Sequelize = require('sequelize');

module.exports = class Image extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            url: {
                type: Sequelize.STRING(300),
                allowNull: false,
            },
            isDeleted: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'Image',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });


    }
    static associate(db){
        db.Image.belongsTo(db.Post, { onDelete: 'CASCADE', foreignKey: 'postId', targetKey: 'id' });
    }
}