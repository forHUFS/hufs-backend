const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            name: {
                type: Sequelize.STRING(8),
                allowNull: false,
            },
            email: {
                type    : Sequelize.STRING(64),
                allowNull: false,
                unique   : true,
            },
            webMail: {
                type     : Sequelize.STRING(64),
                allowNull: true,
                unique   : true
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
                type: Sequelize.ENUM('before', 'user', 'suspension', 'graduated', 'admin'),
                allowNull: false,
                defaultValue: 'before',
            },
            mainMajor: {
                type: Sequelize.STRING(16),
                allowNull: true,
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
            modelName: 'User',
            tableName: 'users',
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });


    }
    static associate(db){
        db.User.hasOne(db.Token, { foreignKey: 'userId', sourceKey: 'id'});
        db.User.hasMany(db.Directory, { foreignKey: "userId", sourceKey: "id" });
        db.User.hasMany(db.Post, { foreignKey: "userId", sourceKey: "id" });
        db.User.hasMany(db.Reply, { foreignKey: "userId", sourceKey: "id" });
        db.User.hasMany(db.StoreReview, { foreignKey: "userId", sourceKey: "id"});
        db.User.hasMany(db.LikeRecordOfPost, { foreignKey: "userId", sourceKey: "id" });
        db.User.hasMany(db.LikeRecordOfReply, { foreignKey: "userId", sourceKey: "id" });
        db.User.hasMany(db.ReportOfPost, { foreignKey: "userId", sourceKey: "id" });
        db.User.hasMany(db.ReportOfReply, { foreignKey: "userId", sourceKey: "id" });

    }
}