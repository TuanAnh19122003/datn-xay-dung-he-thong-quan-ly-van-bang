const StudentService = require('../services/student.service');
const studentSearch = require('../meilisearch/student.search');

class StudentController {
async findAll(req, res) {
        try {
            const page = parseInt(req.query.page);
            const pageSize = parseInt(req.query.pageSize);

            let result;

            if (!page || !pageSize) {
                // Không phân trang
                result = await StudentService.findAll();
                return res.status(200).json({
                    success: true,
                    message: 'Lấy danh sách thành công',
                    data: result.rows,
                    total: result.count
                });
            }

            const offset = (page - 1) * pageSize;
            result = await StudentService.findAll({ offset, limit: pageSize });

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
            const data = await StudentService.create(req.body, req.file);

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
            const data = await StudentService.update(req.params.id, req.body, req.file);

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
            const deletedCount = await StudentService.delete(id);

            if (deletedCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy sinh viên để xóa'
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

    async getCertsByStudent(req, res) {
        try {
            const studentId = req.params.id;
            const certs = await StudentService.getCertsByStudent(studentId);

            return res.status(200).json({
                success: true,
                message: 'Lấy danh sách văn bằng thành công',
                data: certs
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: 'Không thể lấy danh sách văn bằng',
                error: err.message
            });
        }
    }

    async search(req, res) {
        try {
            const q = req.query.q || '';
            let results;

            if (/^\d+$/.test(q)) {
                results = await studentSearch.search('', {
                    filter: `code = "${q}"`,
                    limit: 1
                });
            } else {
                results = await studentSearch.search(q, { limit: 50 });
            }

            res.status(200).json({ success: true, data: results.hits });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }


}

module.exports = new StudentController();