const Cert = require('../models/cert.model');
const Student = require('../models/student.model');
const Template = require('../models/template.model');
const BaseSearchSyncService = require('./base.search.service');

const certSearch = new BaseSearchSyncService(
    Cert,
    'certs',
    [
        'type',
        'number',
        'gradDate',
        'issuer',
        'status',
        'fileUrl'
    ],
    'id',
    [
        { model: Student, as: 'student' },
        { model: Template, as: 'template' }
    ]
);

module.exports = certSearch;
