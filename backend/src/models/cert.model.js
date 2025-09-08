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
    templateId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    type: {
        type: DataTypes.ENUM('BA', 'MA', 'PhD', 'CERT'),
        allowNull: false,
    },
    number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    gradDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    issuer: {
        type: DataTypes.STRING,
        defaultValue: 'ĐH Điện lực',
    },
    status: {
        type: DataTypes.ENUM('draft', 'issued', 'revoked'),
        defaultValue: 'draft',
    },
    fileUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
    tableName: 'certs'
});

module.exports = Cert;
