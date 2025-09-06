const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Log = sequelize.define('Log', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    targetId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    targetType: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ip: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: false,
    tableName: 'logs'
});

module.exports = Log;
