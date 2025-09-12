const majorSearch = require('../meilisearch/major.search');
const Major = require('../models/major.model')

class MajorService {
    static async findAll(options = {}) {
        const { offset, limit } = options;

        const queryOptions = {
            order: [['createdAt', 'ASC']]
        };

        if (offset !== undefined && limit !== undefined) {
            queryOptions.offset = offset;
            queryOptions.limit = limit;
        }

        const data = await Major.findAndCountAll({
            ...queryOptions,
            include: [
                {
                    model: require('../models/department.model'),
                    as: 'department',
                    attributes: ['id','name']
                }
            ]
        });
        
        return data
    }

    static async create(data) {
        const major = await Major.create(data);
        await majorSearch.add(major);
        return major;
    }

    static async update(id, data) {
        const major = await Major.findOne({ where: { id: id } })
        if (!major) throw new Error('Không tìm thấy major');

        const updated = await major.update(data);
        await majorSearch.update(updated)
        return updated;
    }

    static async delete(id) {
        const major = await Major.findOne({ where: { id } });
        if (!major) throw new Error('major không tồn tại');

        await Major.destroy({ where: { id } });
        await majorSearch.delete(id);
        return true;
    }
}

module.exports = MajorService;