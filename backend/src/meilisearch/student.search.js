const Student = require('../models/student.model');
const BaseSearchSyncService = require('./base.search.service');

const studentSearch = new BaseSearchSyncService(
    Student,
    'students',
    [
        'code',
        'image',
        'lastname',
        'firstname',
        'email',
        'phone',
        'address'
    ]
);

module.exports = studentSearch;
