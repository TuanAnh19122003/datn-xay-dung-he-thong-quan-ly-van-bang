const Student = require('../models/student.model');
const Cert = require('../models/cert.model');
const Major = require('../models/major.model');
const studentSearch = require('../meilisearch/student.search');
const path = require('path');
const fs = require('fs');

class StudentService {
    static async findAll(options = {}) {
        const { offset, limit } = options;

        const queryOptions = {
            order: [['createdAt', 'ASC']]
        };

        if (offset !== undefined && limit !== undefined) {
            queryOptions.offset = offset;
            queryOptions.limit = limit;
        }

        const data = Student.findAndCountAll({
            ...queryOptions,
            include: [
                {
                    model: require('../models/major.model'),
                    as: 'major',
                    attributes: ['name']
                }
            ]
        });

        return data;
    }

    static async create(data, file) {
        if (file) {
            data.image = `uploads/${file.filename}`;
        }

        const student = await Student.create(data);
        await studentSearch.add(student)
        return student;
    }

    static async update(id, data, file) {
        const student = await Student.findOne({ where: { id: id } });
        if (!student) throw new Error('student không tồn tại');

        if (file) {
            if (student.image) {
                const oldImagePath = path.join(__dirname, '..', student.image);

                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            data.image = `uploads/${file.filename}`;
        }

        const updated = await student.update(data);
        await studentSearch.update(updated)
        return updated;
    }

    static async delete(id) {
        const student = await Student.findOne({ where: { id } });
        if (!student) throw new Error('student không tồn tại');

        await Student.destroy({ where: { id } });
        await studentSearch.delete(id);
        return true;
    }

    static async getCertsByStudent(studentId) {
        const certs = await Cert.findAll({
            include: [
                {
                    model: Student,
                    as: 'student',
                    attributes: ['id', 'code', 'lastname', 'firstname'],
                    where: { code: studentCode }, // lọc theo mã sinh viên
                    include: [
                        {
                            model: Major,
                            as: 'major',
                            attributes: ['id', 'name']
                        }
                    ]
                },
                {
                    model: Template,
                    as: 'template',
                    attributes: ['id', 'name']
                }
            ]
        });
        
        return certs
    }

}

module.exports = StudentService