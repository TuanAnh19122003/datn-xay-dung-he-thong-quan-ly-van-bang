const User = require('../models/user.model');
const BaseSearchSyncService = require('./base.search.service');
const Role = require('../models/role.model');

const userSearch = new BaseSearchSyncService(
    User,
    'users',
    [
        'image',
        'lastname',
        'firstname',
        'email',
        'phone',
        'password',
        'is_active'
    ],
    'id',
    [
        { model: Role, as: 'role' }
    ]
);

module.exports = userSearch;
