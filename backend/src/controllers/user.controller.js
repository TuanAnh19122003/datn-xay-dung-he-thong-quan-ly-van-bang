const userSearch = require('../meilisearch/user.search');
const UserService = require('../services/user.service');

class UserController {
    async findAll(req, res) {
        try {
            const page = parseInt(req.query.page);
            const pageSize = parseInt(req.query.pageSize);

            let result;

            if (!page || !pageSize) {
                // Không phân trang
                result = await UserService.findAll();
                return res.status(200).json({
                    success: true,
                    message: 'Lấy danh sách thành công',
                    data: result.rows,
                    total: result.count
                });
            }

            const offset = (page - 1) * pageSize;
            result = await UserService.findAll({ offset, limit: pageSize });

            res.status(200).json({
                success: true,
                message: 'Lấy danh sách người dùng thành công',
                data: result.rows,
                total: result.count,
                page,
                pageSize
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Đã xảy ra lỗi khi lấy danh sách người dùng',
                error: error.message
            });
        }
    }
    async create(req, res) {
        try {
            const data = await UserService.create(req.body, req.file);

            res.status(200).json({
                success: true,
                message: 'Thêm thành công',
                data
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            })
        }
    }

    async update(req, res) {
        try {
            const data = await UserService.update(req.params.id, req.body, req.file);

            res.status(201).json({
                success: true,
                message: 'Cập nhật thành công',
                data
            })
        } catch (error) {
            console.log('Lỗi: ', error);
            res.status(401).json({
                success: false,
                message: error.message
            })
        }
    }

    async delete(req, res) {
        try {
            const id = req.params.id;
            const deletedCount = await UserService.delete(id);

            if (deletedCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy người dùng để xóa'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Xóa thành công'
            });
        } catch (error) {
            res.status(401).json({
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
                results = await userSearch.search('', {
                    filter: `code = "${q}"`,
                    limit: pageSize,
                    offset: (page - 1) * pageSize
                });
            } else {
                results = await userSearch.search(q, {
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

module.exports = new UserController();