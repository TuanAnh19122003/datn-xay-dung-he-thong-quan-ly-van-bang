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

        this.include.forEach(rel => {
            if (rel.as === 'student') {
                allFields.push('studentName', 'studentCode');
            } else {
                allFields.push(`${rel.as}Name`, `${rel.as}Code`);
            }
        });


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
                    // Nếu là student thì map riêng
                    if (rel.as === 'student') {
                        obj['studentName'] = `${i[rel.as].lastname} ${i[rel.as].firstname}`;
                        obj['studentCode'] = i[rel.as].code;
                    } else {
                        // Prefix rõ theo tên quan hệ
                        obj[`${rel.as}Name`] = i[rel.as].name;
                        obj[`${rel.as}Code`] = i[rel.as].code;
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
