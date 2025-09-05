const RoleService = require('../services/role.service');

class RoleController {
    async findAll(req, res) {
        try {
            const data = await RoleService.findAll();
            res.status(201).json({
                success: true,
                message: 'Lấy dữ liệu thành công',
                data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            })
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

}

module.exports = new RoleController();