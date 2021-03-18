const Sequelize = require('sequelize');

module.exports = class ReviewImage extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            url: {
                type: Sequelize.STRING(300),
                allowNull: false
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'ReviewImage',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });

    }
    static associate(db){
        db.ReviewImage.belongsTo(db.StoreReview, { onDelete: 'CASCADE', foreignKey: 'storeId', targetKey: 'id' });
    }
}