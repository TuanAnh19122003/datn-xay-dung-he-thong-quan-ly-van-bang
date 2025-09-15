const CertService = require('../services/cert.service');
const certSearch = require('../meilisearch/cert.search');

class CertController {
    async findAll(req, res) {
        try {
            const page = parseInt(req.query.page);
            const pageSize = parseInt(req.query.pageSize);

            let result;

            if (!page || !pageSize) {
                // Không phân trang
                result = await CertService.findAll();
                return res.status(200).json({
                    success: true,
                    message: 'Lấy danh sách thành công',
                    data: result.rows,
                    total: result.count
                });
            }

            const offset = (page - 1) * pageSize;
            result = await CertService.findAll({ offset, limit: pageSize });

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
                message: 'Đã xảy ra lỗi khi lấy danh sách người dùng',
                error: error.message
            });
        }
    }

    async create(req, res) {
        try {
            const data = await CertService.create(req.body);
            res.status(201).json({
                success: true,
                message: 'Thêm thành công',
                data
            })
        } catch (error) {
            console.error('❌ Lỗi khi thêm chứng chỉ:', error);
            res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }

    async update(req, res) {
        try {
            const data = await CertService.update(req.params.id, req.body);
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
            const deletedCount = await CertService.delete(req.params.id);

            if (deletedCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy văn bằng để xóa'
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
            let results;

            if (/^\d+$/.test(q)) {
                results = await certSearch.search('', {
                    filter: `studentCode = "${q}"`,
                    limit: 50
                });
            } else if (/^CERT\d+$/i.test(q)) {
                results = await certSearch.search('', {
                    filter: `number = "${q}"`,
                    limit: 1
                });
            } else {
                results = await certSearch.search(q, { limit: 50 });
            }

            res.status(200).json({ success: true, data: results.hits });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }

    async print(req, res) {
        try {
            const html = await CertService.print(req.params.id);
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.send(html);
        } catch (error) {
            console.error("❌ Lỗi khi in chứng chỉ:", error);
            res.status(500).json({ success: false, message: error.message });
        }
    }

}

module.exports = new CertController;