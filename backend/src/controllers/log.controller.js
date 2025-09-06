const LogService = require('../services/log.service');

class LogController {
    async findAll(req, res) {
        try {
            const { limit } = req.query;
            const data = await LogService.findAll(limit ? parseInt(limit) : 100);

            res.status(200).json({
                success: true,
                message: 'Lấy danh sách log thành công',
                data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async create(req, res) {
        try {
            const data = await LogService.create(req.body);

            res.status(201).json({
                success: true,
                message: 'Ghi log thành công',
                data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new LogController();
