const Log = require('../models/log.model');
const User = require('../models/user.model');
const BaseSearchSyncService = require('./base.search.service');

const logSearch = new BaseSearchSyncService(
    Log,
    'logs',
    ['action', 'targetId', 'targetType', 'ip', 'createdAt'],
    'id',
    [
        { model: User, as: 'user' }
    ]
);

module.exports = logSearch;
