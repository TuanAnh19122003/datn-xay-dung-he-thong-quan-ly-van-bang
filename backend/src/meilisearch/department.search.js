const Department = require('../models/department.model');
const BaseSearchSyncService = require('./base.search.service');

const departmentSearch = new BaseSearchSyncService(
    Department,
    'departments',
    [
        'code',
        'name',
    ],
);

module.exports = departmentSearch;
