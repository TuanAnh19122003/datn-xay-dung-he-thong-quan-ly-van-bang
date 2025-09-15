const Cert = require('../models/cert.model');
const certSearch = require('../meilisearch/cert.search');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const { getClassification } = require('../utils/classification');
const Student = require('../models/student.model');
const Template = require('../models/template.model');
const normalizeFileName = require('../utils/normalizeName');
const { Sequelize } = require('sequelize');

class CertService {
    static async findAll(options = {}) {
        const { offset, limit, sort } = options;

        const queryOptions = {
            order: [['createdAt', sort === 'desc' ? 'DESC' : 'ASC']]
        };

        if (offset !== undefined && limit !== undefined) {
            queryOptions.offset = offset;
            queryOptions.limit = limit;
        }
        const data = await Cert.findAndCountAll({
            ...queryOptions,
            include: [
                {
                    model: require('../models/student.model'),
                    as: 'student',
                    attributes: ['id', 'lastname', 'firstname', 'code']
                },
                {
                    model: require('../models/template.model'),
                    as: 'template',
                    attributes: ['id', 'name']
                }
            ]
        });

        return data
    }

    static async create(data) {
        const cert = await Cert.create(data);
        await certSearch.add(cert)
        return cert
    }

    static async update(id, data) {
        const cert = await Cert.findOne({ where: { id: id } })
        if (!cert) throw new Error('Không tìm thấy cert');

        const updated = await cert.update(data);
        await certSearch.update(updated)
        return updated;
    }

    static async delete(id) {
        const cert = await Cert.findOne({ where: { id } });
        if (!cert) throw new Error('cert không tồn tại');

        await Cert.destroy({ where: { id } });
        await certSearch.delete(id);
        return true;
    }

    static async print(certId) {
        const cert = await Cert.findByPk(certId, {
            include: [
                { model: Student, as: 'student' },
                { model: Template, as: 'template' }
            ]
        });
        if (!cert) throw new Error("Không tìm thấy chứng chỉ");

        // ✅ Chỉ cho in khi đã cấp
        if (cert.status !== 'issued') {
            throw new Error("Chứng chỉ chưa được phát hành, không thể in");
        }

        const student = cert.student;
        if (!student) throw new Error("Không tìm thấy sinh viên");

        const template = cert.template;
        if (!template) throw new Error("Không tìm thấy template");

        const classification = getClassification(student.gpa);

        // đọc file template HTML
        const templatePath = path.join(__dirname, '../templates', path.basename(template.fileUrl));
        const html = fs.readFileSync(templatePath, 'utf8');

        // đọc logo
        let logoBase64 = null;
        try {
            const logoPath = path.join(__dirname, '../public/logo.png');
            const logoBuffer = fs.readFileSync(logoPath);
            logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
        } catch (err) {
            console.warn("Không tìm thấy logo, bỏ qua.");
        }

        // render với ejs
        const rendered = ejs.render(html, {
            fullname: `${student.lastname} ${student.firstname}`,
            dob: student.dob,
            gradYear: cert.gradDate ? new Date(cert.gradDate).getFullYear() : '',
            number: cert.number,
            classification: classification.vn,
            classificationEn: classification.en,
            logoBase64
        });

        const gradYear = cert.gradDate ? new Date(cert.gradDate).getFullYear() : 'unknown';
        const rawName = `${student.lastname} ${student.firstname}_${gradYear}_${cert.id}.html`;

        const fileName = normalizeFileName(rawName);

        const outputPath = path.join(__dirname, '../outputs', fileName);
        fs.writeFileSync(outputPath, rendered, 'utf8');

        await cert.update({ fileUrl: `outputs/${fileName}` });

        return rendered;
    }

    static async count() {
        return await Cert.count();
    }

    static async statsByStatus() {
        const issued = await Cert.count({ where: { status: 'issued' } });
        const draft = await Cert.count({ where: { status: 'draft' } });
        const revoked = await Cert.count({ where: { status: 'revoked' } });
        return { issued, draft, revoked };
    }

    static async statsByYear() {
        const data = await Cert.findAll({
            attributes: [
                [Sequelize.fn('YEAR', Sequelize.col('gradDate')), 'year'],
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
            ],
            group: [Sequelize.fn('YEAR', Sequelize.col('gradDate'))],
            order: [[Sequelize.fn('YEAR', Sequelize.col('gradDate')), 'ASC']]
        });

        return data.map(item => ({
            year: item.dataValues.year,
            count: item.dataValues.count
        }));
    }

}

module.exports = CertService