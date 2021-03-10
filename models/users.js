const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            name: {
                type: Sequelize.STRING(8),
                allowNull: false,
            },
            email: {
                type    : Sequelize.STRING(16),
                allowNull: false,
                unique   : true,
            },
            nickname: {
                type     : Sequelize.STRING(32),
                allowNull: false,
                unique   : true,
            },
            phone: {
                type     : Sequelize.STRING(16),
                allowNull: true,
                unique   : true,
            },
            birth: {
                type: Sequelize.DATE(),
                allowNull: true,
            },
            type: {
                type: Sequelize.ENUM("before", "user", "block-user", "graduated-user" ,"admin"),
                allowNull: false,
                defaultValue: "before",
            },
            mainMajor: {
                type: Sequelize.STRING(16),
                allowNull: false,
            },
            secondMajor: {
                type: Sequelize.STRING(16),
                allowNull: true,
            },
            reportCount: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: true,
            },
            suspensionCount: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: true,
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: "User",
            tableName: "users",
            paranoid: true,
            charset: "utf8mb4",
            collate: "utf8mb4_general_ci",
        });


    }
    static associate(db){
        db.User.hasOne(db.Token, { foreignKey: "userId", sourceKey: "id"});
        // db.User.hasMany(db.creditScore, { foreignKey: "creditScoreId", sourceKey: "id"});
        // db.User.hasMany(db.timeTable, { foreignKey: "timeTableId", sourceKey: "id"});
        db.User.hasMany(db.Directory, { foreignKey: "userId", sourceKey: "id" });
        db.User.hasMany(db.Post, { foreignKey: "userId", sourceKey: "id" });
        db.User.hasMany(db.Reply, { foreignKey: "userId", sourceKey: "id" });
        db.User.hasMany(db.LikeRecord, { foreignKey: "userId", sourceKey: "id" });

    }
}