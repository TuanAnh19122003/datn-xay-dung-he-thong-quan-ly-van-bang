const Role = require('../models/role.model');
const BaseSearchSyncService = require('./base.search.service');

const roleSearch = new BaseSearchSyncService(
    Role,
    'roles',
    [
        'code',
        'name',
        'desc'
    ],
);

module.exports = roleSearch;
