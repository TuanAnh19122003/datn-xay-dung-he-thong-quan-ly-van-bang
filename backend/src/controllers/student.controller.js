const StudentService = require('../services/student.service');
const { Cert, Student, Major, Template } = require('../models');
const studentSearch = require('../meilisearch/student.search');
const certSearch = require('../meilisearch/cert.search');

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

    async getCertsByStudentCode(req, res) {
        try {
            const studentCode = req.params.code;

            const certs = await Cert.findAll({
                include: [
                    {
                        model: Student,
                        as: 'student',
                        attributes: ['id', 'code', 'lastname', 'firstname'],
                        where: { code: studentCode },
                        include: [
                            {
                                model: Major,
                                as: 'major',
                                attributes: ['id', 'name']
                            }
                        ]
                    },
                    {
                        model: Template,
                        as: 'template',
                        attributes: ['id', 'name']
                    }
                ]
            });

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
            let results = [];

            if (/^\d+$/.test(q)) {
                const studentRes = await studentSearch.search('', {
                    filter: `code = "${q}"`,
                    limit: 1
                });
                results = studentRes.hits.map(s => ({ ...s, type: 'student' }));
            } else if (q.trim() !== '') {
                const studentRes = await studentSearch.search(q, { limit: 50 });
                const certRes = await certSearch.search(q, { limit: 50 });

                const students = studentRes.hits.map(s => ({ ...s, type: 'student' }));
                const certs = certRes.hits.map(c => ({ ...c, type: 'certs' }));

                results = [...students, ...certs];
            }

            res.status(200).json({ success: true, data: results });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: err.message });
        }
    }

    async count(req, res) {
        try {
            const total = await StudentService.count();
            res.status(200).json({
                success: true,
                total
            })
        } catch (error) {
            res.status(500).json({ success: false, message: err.message });
        }
    }

    async statsByMajor(req, res) {
        try {
            const data = await StudentService.statsByMajor();
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
}

module.exports = new StudentController();