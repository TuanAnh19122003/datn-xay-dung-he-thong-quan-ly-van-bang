const templateSearch = require('../meilisearch/template.search');
const Template = require('../models/template.model');

class TemplateService {
    static async findAll(options = {}) {
        const { offset, limit } = options;

        const queryOptions = {
            order: [['createdAt', 'ASC']]
        };

        if (offset !== undefined && limit !== undefined) {
            queryOptions.offset = offset;
            queryOptions.limit = limit;
        }

        const templates = await Template.findAndCountAll(queryOptions);
        return templates;
    }

    static async create(data) {
        const template = await Template.create(data);
        await templateSearch.add(template);
        return template;
    }

    static async update(id, data) {
        const template = await Template.findOne({ where: { id: id } })
        if(!template) throw new Error('Không tìm thấy template');

        const updated = await template.update(data);
        await templateSearch.update(updated)
        return updated;
    }
    
    static async delete(id) {
        const template = await Template.findOne({ where: { id } });
        if (!template) throw new Error('template không tồn tại');

        await Template.destroy({ where: { id } });
        await templateSearch.delete(id);
        return true;
    }
}

module.exports = TemplateService;