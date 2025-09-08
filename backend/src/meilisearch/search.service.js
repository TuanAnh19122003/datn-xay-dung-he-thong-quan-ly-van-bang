const client = require('../config/meilisearch');

class SearchService {
    constructor(indexName, primaryKey = 'id') {
        this.indexName = indexName;
        this.primaryKey = primaryKey;
        this.index = client.index(this.indexName);
    }

    async createIndex(fields = []) {
        try {
            await client.createIndex(this.indexName, { primaryKey: this.primaryKey });
        } catch (err) {
            if (!err.message.includes('already exists')) {
                throw err;
            }
        }

        if (fields.length > 0) {
            await this.index.updateSearchableAttributes(fields);
            await this.index.updateDisplayedAttributes(fields);
        }
    }

    async addOrUpdateDocuments(docs) {
        return await this.index.addDocuments(docs);
    }

    async deleteDocument(id) {
        return await this.index.deleteDocument(id);
    }

    async search(query, options = {}) {
        return await this.index.search(query, options);
    }
}

module.exports = SearchService;
