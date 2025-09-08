const studentSearch = require('./student.search');
const certSearch = require('./cert.search');

async function initMeilisearch() {
    try {
        await studentSearch.init();
        await certSearch.init();
        console.log('Meilisearch index cho Student đã được khởi tạo và đồng bộ.');
    } catch (err) {
        console.error('Khởi tạo Meilisearch thất bại:', err);
        throw err;
    }
}

module.exports = { initMeilisearch };
