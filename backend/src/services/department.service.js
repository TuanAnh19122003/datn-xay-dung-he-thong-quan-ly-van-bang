const departmentSearch = require('../meilisearch/department.search');
const Department = require('../models/department.model')

class DepartmentService {
    static async findAll(options = {}) {
        const { offset, limit } = options;

        const queryOptions = {
            order: [['createdAt', 'ASC']]
        };

        if (offset !== undefined && limit !== undefined) {
            queryOptions.offset = offset;
            queryOptions.limit = limit;
        }

        const departments = await Department.findAndCountAll(queryOptions);
        return departments;
    }

    static async create(data) {
        const department = await Department.create(data);
        await departmentSearch.add(department);
        return department;
    }

    static async update(id, data) {
        const department = await Department.findOne({ where: { id: id } })
        if (!department) throw new Error('Không tìm thấy khoa');
        
        const updated = await department.update(data);
        await departmentSearch.update(updated)
        return updated;
    }

    static async delete(id) {
        const department = await Department.findOne({ where: { id } });
        if (!department) throw new Error('department không tồn tại');

        await department.destroy({ where: { id } });
        await departmentSearch.delete(id);
        return true;
    }
}

module.exports = DepartmentService;