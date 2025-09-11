const roleSearch = require('../meilisearch/role.search');
const Role = require('../models/role.model')

class RoleService {
    static async findAll(options = {}) {
        const { offset, limit } = options;

        const queryOptions = {
            order: [['createdAt', 'ASC']]
        };

        if (offset !== undefined && limit !== undefined) {
            queryOptions.offset = offset;
            queryOptions.limit = limit;
        }

        const roles = await Role.findAndCountAll(queryOptions);
        return roles;
    }

    static async create(data) {
        const role = await Role.create(data)
        await roleSearch.add(data)
        return role
    }

    static async update(id, data) {
        const role = await Role.findOne({ where: { id } })
        if (!role) throw new Error('Không tìm thấy role');
        
        const updated = await role.update(data);
        await roleSearch.update(updated)
        return updated;
    }

    static async delete(id) {
        const role = await Role.findOne({ where: { id } });
        if (!role) throw new Error('role không tồn tại');

        await Role.destroy({ where: { id } });
        await roleSearch.delete(id);
        return true;
    }
}

module.exports = RoleService;
