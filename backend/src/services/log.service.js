const Log = require('../models/log.model');

class LogService {
    static async findAll(limit = 100) {
        return await Log.findAll({
            order: [['createdAt', 'DESC']],
            limit
        });
    }

    static async create(data) {
        return await Log.create(data);
    }

    
}

module.exports = LogService;
