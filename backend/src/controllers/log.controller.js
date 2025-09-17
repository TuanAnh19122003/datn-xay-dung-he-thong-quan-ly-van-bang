const logSearch = require('../meilisearch/log.search');
const LogService = require('../services/log.service');

class LogController {
    async findAll(req, res) {
        try {
            const page = parseInt(req.query.page);
            const pageSize = parseInt(req.query.pageSize);

            let result;

            if (!page || !pageSize) {
                // Không phân trang
                result = await LogService.findAll();
                return res.status(200).json({
                    success: true,
                    message: 'Lấy danh sách thành công',
                    data: result.rows,
                    total: result.count
                });
            }

            const offset = (page - 1) * pageSize;
            result = await LogService.findAll({ offset, limit: pageSize });

            res.status(200).json({
                success: true,
                message: 'Lấy danh sách thành công',
                data: result.rows,
                total: result.count,
                page,
                pageSize
            });
        } catch (error) {
            console.error('Lỗi:', error);
            res.status(500).json({
                success: false,
                message: 'Đã xảy ra lỗi khi lấy danh sách',
                error: error.message
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

    async search(req, res) {
        try {
            const q = req.query.q || '';
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 5;

            let results;
            if (/^\d+$/.test(q)) {
                results = await logSearch.search('', {
                    filter: `code = "${q}"`,
                    limit: pageSize,
                    offset: (page - 1) * pageSize
                });
            } else {
                results = await logSearch.search(q, {
                    limit: pageSize,
                    offset: (page - 1) * pageSize
                });
            }

            res.status(200).json({
                success: true,
                data: results.hits,
                total: results.estimatedTotalHits,
                page,
                pageSize
            });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
}

module.exports = new LogController();
