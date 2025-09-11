const User = require('../models/user.model');
const hashPassword = require('../utils/hashPassword');
const path = require('path');
const fs = require('fs');
const userSearch = require('../meilisearch/user.search');

class UserService {
    static async findAll(options = {}) {
        const { offset, limit } = options;

        const queryOptions = {
            order: [['createdAt', 'ASC']]
        };

        if (offset !== undefined && limit !== undefined) {
            queryOptions.offset = offset;
            queryOptions.limit = limit;
        }

        const data = User.findAndCountAll({
            ...queryOptions,
            include: [
                {
                    model: require('../models/role.model'),
                    as: 'role',
                    attributes: ['id', 'name']
                }
            ]
        });

        return data;
    }

    static async create(data, file) {
        if (data.password) {
            data.password = await hashPassword(data.password);
        }
        if (file) {
            data.image = `uploads/${file.filename}`;
        }

        const user = await User.create(data);
        await userSearch.add(user)
        return user;
    }

    static async update(id, data, file) {
        const user = await User.findOne({ where: { id: id } });
        if (!user) throw new Error('User không tồn tại');

        if (data && data.password) {
            if (data.password !== user.password) {
                data.password = await hashPassword(data.password);
            } else {
                delete data.password;
            }
        }

        if (file) {
            if (user.image) {
                const oldImagePath = path.join(__dirname, '..', user.image);

                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            data.image = `uploads/${file.filename}`;
        }

        const updated = await user.update(data);
        await userSearch.update(updated)
        return updated;
    }

    static async delete(id) {
        const user = await User.findByPk(id);
        if (!user) return 0;

        if (user.image) {
            const imagePath = path.join(__dirname, '..', user.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await User.destroy({ where: { id } });
        await userSearch.delete(id);
        return true;
    }

}

module.exports = UserService;