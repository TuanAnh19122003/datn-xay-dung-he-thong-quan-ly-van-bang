const Template = require('../models/template.model');
const BaseSearchSyncService = require('./base.search.service');

const templateSearch = new BaseSearchSyncService(
    Template,
    'templates',
    [
        'name',
        'desc',
        'fileUrl'
    ],
);

module.exports = templateSearch;
