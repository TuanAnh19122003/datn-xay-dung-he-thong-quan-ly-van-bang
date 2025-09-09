const studentSearch = require('./student.search');
const certSearch = require('./cert.search');

async function initMeilisearch() {
    try {
        await studentSearch.init();
        await certSearch.init();
        console.log('Meilisearch index đã được khởi tạo và đồng bộ.');
    } catch (err) {
        console.error('Khởi tạo Meilisearch thất bại:');
        throw err;
    }
}

module.exports = { initMeilisearch };
