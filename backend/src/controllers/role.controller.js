const roleSearch = require('../meilisearch/role.search');
const RoleService = require('../services/role.service');

class RoleController {
    async findAll(req, res) {
        try {
            const page = parseInt(req.query.page);
            const pageSize = parseInt(req.query.pageSize);

            let result;

            if (!page || !pageSize) {
                // Không phân trang
                result = await RoleService.findAll();
                return res.status(200).json({
                    success: true,
                    message: 'Lấy tất cả vai trò thành công',
                    data: result.rows,
                    total: result.count
                });
            }

            const offset = (page - 1) * pageSize;
            result = await RoleService.findAll({ offset, limit: pageSize });

            res.status(200).json({
                success: true,
                message: 'Lấy danh sách vai trò thành công',
                data: result.rows,
                total: result.count,
                page,
                pageSize
            });
        } catch (error) {
            console.error('Lỗi:', error);
            res.status(500).json({
                success: false,
                message: 'Đã xảy ra lỗi khi lấy danh sách vai trò',
                error: error.message
            });
        }
    }

    async create(req, res) {
        try {
            const data = await RoleService.create(req.body);
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
            const data = await RoleService.update(req.params.id, req.body);
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
            const deletedCount = await RoleService.delete(req.params.id);

            if (deletedCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy role để xóa'
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
                results = await roleSearch.search('', {
                    filter: `code = "${q}"`,
                    limit: pageSize,
                    offset: (page - 1) * pageSize
                });
            } else {
                results = await roleSearch.search(q, {
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

module.exports = new RoleController();
