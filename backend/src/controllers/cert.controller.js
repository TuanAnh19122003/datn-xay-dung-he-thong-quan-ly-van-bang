const CertService = require('../services/cert.service');
const certSearch = require('../meilisearch/cert.search');

class CertController {
    async findAll(req, res) {
        try {
            const data = await CertService.findAll();
            res.status(200).json({
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
            const data = await CertService.create(req.body);
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

}

module.exports = new CertController;