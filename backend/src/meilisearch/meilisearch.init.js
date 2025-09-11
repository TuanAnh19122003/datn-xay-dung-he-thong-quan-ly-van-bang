const studentSearch = require('./student.search');
const certSearch = require('./cert.search');
const roleSearch = require('./role.search');

async function initMeilisearch() {
    try {
        await studentSearch.init();
        await certSearch.init();
        await roleSearch.init();
        console.log('Meilisearch index đã được khởi tạo và đồng bộ.');
    } catch (err) {
        console.error('Khởi tạo Meilisearch thất bại:');
        throw err;
    }
}

module.exports = { initMeilisearch };
