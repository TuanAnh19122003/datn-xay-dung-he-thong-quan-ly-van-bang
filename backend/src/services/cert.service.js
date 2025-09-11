const Cert = require('../models/cert.model');
const certSearch = require('../meilisearch/cert.search');

class CertService {
    static async findAll() {
        const data = await Cert.findAll({
            include: [
                {
                    model: require('../models/student.model'),
                    as: 'student',
                    attributes: ['lastname', 'firstname', 'code']
                },
                {
                    model: require('../models/template.model'),
                    as: 'template',
                    attributes: ['name']
                }
            ]
        });
        return data
    }

    static async create(data) {
        const cert = await Cert.create(data);
        await certSearch.add(cert)
        return cert
    }

    static async update(id, data) {
        const cert = await Cert.findOne({ where: { id: id } })
        if (!cert) throw new Error('Không tìm thấy cert');

        const updated = await cert.update(data);
        await certSearch.update(updated)
        return updated;
    }

    static async delete(id) {
        const cert = await Cert.findOne({ where: { id } });
        if (!cert) throw new Error('cert không tồn tại');

        await Cert.destroy({ where: { id } });
        await certSearch.delete(id);
        return true;
    }
}

module.exports = CertService