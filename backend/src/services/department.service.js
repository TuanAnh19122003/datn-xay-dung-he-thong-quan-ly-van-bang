const Department = require('../models/department.model')

class DepartmentService {
    static async findAll() {
        const data = await Department.findAll();
        return data
    }

    static async create(data) {
        const department = await Department.create(data)
        return department
    }

    static async update(id, data) {
        const department = await Department.findOne({ where: { id: id } })
        if (!department) throw new Error('Không tìm thấy khoa');
        return await department.update(data)
    }

    static async delete(id) {
        return await Department.destroy({ where: { id: id } })
    }
}

module.exports = DepartmentService;