const majorSearch = require('../meilisearch/major.search');
const MajorService = require('../services/major.service');

class MajorController {
    async findAll(req, res) {
        try {
            const page = parseInt(req.query.page);
            const pageSize = parseInt(req.query.pageSize);

            let result;

            if (!page || !pageSize) {
                // Không phân trang
                result = await MajorService.findAll();
                return res.status(200).json({
                    success: true,
                    message: 'Lấy danh sách thành công',
                    data: result.rows,
                    total: result.count
                });
            }

            const offset = (page - 1) * pageSize;
            result = await MajorService.findAll({ offset, limit: pageSize });

            res.status(200).json({
                success: true,
                message: 'Lấy danh sách thành công',
                data: result.rows,
                total: result.count,
                page,
                pageSize
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Đã xảy ra lỗi khi lấy danh sách',
                error: error.message
            });
        }
    }

    async create(req, res) {
        try {
            const data = await MajorService.create(req.body);
            res.status(201).json({
                success: true,
                message: 'Thêm thành công',
                data
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }

    async update(req, res) {
        try {
            const data = await MajorService.update(req.params.id, req.body);
            res.status(201).json({
                success: true,
                message: 'Cập nhật thành công',
                data
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }

    async delete(req, res) {
        try {
            const deletedCount = await MajorService.delete(req.params.id);

            if (deletedCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy chuyên ngành để xóa'
                });
            }

            res.status(201).json({
                success: true,
                message: 'Xóa thành công'
            });
        } catch (error) {
            console.error('Lỗi:', error);
            res.status(500).json({
                success: false,
                message: "Đã xảy ra lỗi khi xóa",
                error: error.message
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
                results = await majorSearch.search('', {
                    filter: `code = "${q}"`,
                    limit: pageSize,
                    offset: (page - 1) * pageSize
                });
            } else {
                results = await majorSearch.search(q, {
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

module.exports = new MajorController();