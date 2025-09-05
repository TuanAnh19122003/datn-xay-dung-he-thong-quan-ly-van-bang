const Template = require('../models/template.model');

class TemplateService {
    static async findAll() {
        const data = await Template.findAll();
        return data
    }

    static async create(data) {
        const template = await Template.create(data)
        return template
    }

    static async update(id, data) {
        const template = await Template.findOne({ where: { id: id } })
        if(!template) throw new Error('Không tìm thấy template');
        return await template.update(data)
    }
    
    static async delete(id) {
        return await Template.destroy({ where: { id: id } })
    }
}

module.exports = TemplateService;