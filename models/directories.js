const Sequelize = require('sequelize');

module.exports = class Directory extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            name: {
                type: Sequelize.STRING(16),
                allowNull: false,
                defaultValue: '기타'
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'Directory',
            tableName: 'directories',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });


    }

    static associate(db) {
        db.Directory.belongsTo(db.User, { onDelete: 'CASCADE', foreignKey: "userId", targetKey: "id" });
        db.Directory.hasMany(db.Scrap, { onDelete: 'CASCADE', foreignKey: "directoryId", sourceKey: "id" });
    }
}


