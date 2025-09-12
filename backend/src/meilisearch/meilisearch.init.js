const studentSearch = require('./student.search');
const certSearch = require('./cert.search');
const roleSearch = require('./role.search');
const userSearch = require('./user.search');
const departmentSearch = require('./department.search');

async function initMeilisearch() {
    try {
        await studentSearch.init();
        await certSearch.init();
        await roleSearch.init();
        await userSearch.init();
        await departmentSearch.init();
        console.log('Meilisearch index đã được khởi tạo và đồng bộ.');
    } catch (err) {
        console.error('Khởi tạo Meilisearch thất bại:');
        throw err;
    }
}

module.exports = { initMeilisearch };
