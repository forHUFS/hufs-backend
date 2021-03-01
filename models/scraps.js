const Sequelize = require('sequelize');

module.exports = class Scrap extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'Scrap',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });


    }
    static associate(db){
        db.Scrap.belongsTo(db.Directory, { onDelete: 'CASCADE', foreignKey:'directory_id', targetKey: 'id'});
        db.Scrap.belongsTo(db.Post,{ onDelete: 'CASCADE', foreignKey: 'post_id', targetKey: 'id'});
    }
}