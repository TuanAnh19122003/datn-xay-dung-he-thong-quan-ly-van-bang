const sequelize = require('../config/database');
const Role = require('./role.model');
const db = {
    Role
}

sequelize.sync({ force: false })
    .then(() => {
        console.log('Connection successful');
    })
    .catch((error) => {
        console.error('Connection error:', error);
        throw error;
    });

module.exports = db;