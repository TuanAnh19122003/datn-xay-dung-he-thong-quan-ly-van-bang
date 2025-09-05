const UserService = require('../services/user.service');

class UserController {
    async findAll(req, res) {
        try {
            const data = await UserService.findAll();
            res.status(201).json({
                success: true,
                message: 'Lấy dữ liệu thành công',
                data
            })
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
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
}

module.exports = new UserController();