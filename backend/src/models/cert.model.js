const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cert = sequelize.define('Cert', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    majorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('BA', 'MA', 'PhD', 'CERT'),
        allowNull: false,
    },
    number: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    gradDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    issuer: {
        type: DataTypes.STRING(100),
        defaultValue: 'ĐH Điện lực',
    },
    status: {
        type: DataTypes.ENUM('draft', 'issued', 'revoked'),
        defaultValue: 'draft',
    },
    fileUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
    }
}, {
    timestamps: true,
    tableName: 'certs'
});

module.exports = Cert;
