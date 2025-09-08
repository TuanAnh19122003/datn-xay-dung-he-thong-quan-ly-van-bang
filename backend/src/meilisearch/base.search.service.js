const SearchService = require('./search.service');

class BaseSearchSyncService {
    constructor(model, indexName, fields, primaryKey = 'id', include = []) {
        this.model = model;
        this.indexName = indexName;
        this.fields = fields;
        this.primaryKey = primaryKey;
        this.include = include;
        this.searchService = new SearchService(indexName, primaryKey);
    }

    async init() {
        const allFields = [...this.fields];
        this.include.forEach(rel => allFields.push(rel.as + 'Name'));
        await this.searchService.createIndex(allFields);

        const all = await this.model.findAll({ include: this.include });
        await this.sync(all);
    }

    async sync(instances) {
        const docs = instances.map(i => {
            const obj = { id: i[this.primaryKey] };
            this.fields.forEach(f => obj[f] = i[f]);

            this.include.forEach(rel => {
                if (i[rel.as]) {
                    if (rel.as === 'student') {
                        obj[rel.as + 'Name'] = `${i[rel.as].lastname} ${i[rel.as].firstname}`;
                    } else {
                        obj[rel.as + 'Name'] = i[rel.as].name;
                    }
                }
            });


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
