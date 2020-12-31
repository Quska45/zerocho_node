module.exports = ( sequelize, DataTypes ) => {
    let hashTag = sequelize.define('hashTag', {
        title: {
            type: DataTypes.STRING( 15 ),
            allowNull: false,
            unique: true,
        },
    }, {
        timestamp: true,
        paranoid: true,
    });

    return hashTag;
}