const Major = require('../models/major.model');
const BaseSearchSyncService = require('./base.search.service');
const Department = require('../models/department.model');

const majorSearch = new BaseSearchSyncService(
    Major,
    'majors',
    [
        'code',
        'name',
    ],
    'id',
    [
        { model: Department, as: 'department' }
    ]
);

module.exports = majorSearch;
