module.exports = ( sequelize, DataTypes ) => {
    let post = sequelize.define('post', {
        content: {
            type: DataTypes.STRING( 140 ),
            allowNull: false,
        },
        img: {
            type: DataTypes.STRING( 200 ),
            allowNull: true,
        },
    }, {
        timestamps: true,
        paranoid: true,
    })

    return post;
}