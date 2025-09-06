const Log = require('../models/log.model');

class LogService {
    static async findAll(limit = 100) {
        return await Log.findAll({
            order: [['createdAt', 'DESC']],
            limit
        });
    }

    static async create({ userId, action, targetId, targetType, ip }) {
        return await Log.create({
            userId,
            action,
            targetId,
            targetType,
            ip
        });
    }
}

module.exports = LogService;
