const Student = require('../models/student.model');
const Major = require('../models/major.model');
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
    ],
    'id',
    [
        { model: Major, as: 'major' } // join Major để lấy tên
    ]
);

module.exports = studentSearch;
