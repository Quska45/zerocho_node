module.exports = ( sequelize, DataTypes ) => {
    let user = sequelize.define('user', {
        email: {
            type: DataTypes.STRING( 40 ),
            allowNull: true,
            unique: true,
        },
        nick: {
            type: DataTypes.STRING( 15 ),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING( 100 ),
            allowNull: true,
        },
        provider: {
            type: DataTypes.STRING( 10 ),
            allowNull: false,
            defaultValue: 'local',
        },
        snsId: {
            type: DataTypes.STRING( 30 ),
            allowNull: true,
        }
    }, {
        timestamps: true, // createdAt, updatedAt 추가
        paranoid: true, // deletedAt 추가
    });
    console.log('*********************ㅗㅓㅓㅏ');
    console.log(user);
    console.log(Object.keys(user));
    return user;
}