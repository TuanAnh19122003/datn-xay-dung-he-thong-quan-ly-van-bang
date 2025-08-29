const Role = require('../models/role.model');

class RoleService{
    static async findAll(){
        const data = Role.findAll();
        return data
    }

}

module.exports = RoleService();