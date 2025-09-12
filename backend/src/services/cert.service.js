const Cert = require('../models/cert.model');
const certSearch = require('../meilisearch/cert.search');

class CertService {
    static async findAll(options = {}) {
        const { offset, limit } = options;

        const queryOptions = {
            order: [['createdAt', 'ASC']]
        };

        if (offset !== undefined && limit !== undefined) {
            queryOptions.offset = offset;
            queryOptions.limit = limit;
        }
        const data = await Cert.findAndCountAll({
            ...queryOptions,
            include: [
                {
                    model: require('../models/student.model'),
                    as: 'student',
                    attributes: ['id','lastname', 'firstname', 'code']
                },
                {
                    model: require('../models/template.model'),
                    as: 'template',
                    attributes: ['id','name']
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