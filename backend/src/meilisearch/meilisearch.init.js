const student = require('./student.search');

async function initMeilisearch() {
    try {
        await student.init();
        console.log('Meilisearch index for certificates initialized & synced.');

    } catch (err) {
        console.error('Meilisearch initialization failed:', err);
        throw err;
    }
}

module.exports = { initMeilisearch };
