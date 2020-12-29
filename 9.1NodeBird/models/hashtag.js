const { DataTypes } = require("sequelize/types");
const { sequelize } = require(".");

module.exports = ( sequelize, DataTypes ) => {
    sequelize.define('hashTag', {
        title: {
            type: DataTypes.STRING( 15 ),
            allowNull: false,
            unique: true,
        },
    }, {
        timestamp: true,
        paranoid: true,
    })
}