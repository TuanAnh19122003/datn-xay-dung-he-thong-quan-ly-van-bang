const sequelize = require('../config/database');

// Import models
const Role = require('./role.model');
const User = require('./user.model');
const Department = require('./department.model');
const Major = require('./major.model');
const Student = require('./student.model');
const Cert = require('./cert.model');
const Template = require('./template.model');
const Log = require('./log.model');

const db = {
    sequelize,
    Role,
    User,
    Department,
    Major,
    Student,
    Cert,
    Template,
    Log
};

require('./initRelationships')(db);

sequelize.sync({ force: false })
    .then(() => {
        console.log('Connection successful');
    })
    .catch((error) => {
        console.error('Connection error:', error);
        throw error;
    });

module.exports = db;
