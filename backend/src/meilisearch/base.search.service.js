class BaseSearchSyncService {
    constructor(model, indexName, fields, primaryKey = 'id') {
        this.model = model;
        this.indexName = indexName;
        this.fields = fields;
        this.primaryKey = primaryKey;
        this.searchService = new (require('./search.service'))(indexName, primaryKey);
    }

    async init() {
        await this.searchService.createIndex(this.fields);
        const all = await this.model.findAll();
        await this.sync(all);
    }

    async sync(instances) {
        const docs = instances.map(i => {
            const obj = { id: i[this.primaryKey] };
            this.fields.forEach(f => obj[f] = i[f]);
            return obj;
        });
        return this.searchService.addOrUpdateDocuments(docs);
    }

    async add(instance) {
        return this.sync([instance]);
    }

    async update(instance) {
        return this.sync([instance]);
    }

    async delete(id) {
        return this.searchService.deleteDocument(id);
    }

    async search(q, options = {}) {
        return this.searchService.search(q, options);
    }
}

module.exports = BaseSearchSyncService;
