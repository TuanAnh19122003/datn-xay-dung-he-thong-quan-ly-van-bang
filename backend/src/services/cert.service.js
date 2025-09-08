const Cert = require('../models/cert.model');

class CertService {
    static async findAll() {
        const data = await Cert.findAll({
            include: [
                {
                    model: require('../models/student.model'),
                    as: 'student',
                    attributes: ['lastname', 'firstname']
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
        const cert = await Cert.create(data)
        return cert
    }

    static async update(id, data) {
        const cert = await Cert.findOne({ where: { id: id } })
        if (!cert) throw new Error('Không tìm thấy cert');
        return await cert.update(data)
    }

    static async delete(id) {
        return await Cert.destroy({ where: { id: id } })
    }
}

module.exports = CertService