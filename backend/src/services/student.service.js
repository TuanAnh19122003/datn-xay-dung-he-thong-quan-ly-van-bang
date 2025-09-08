const Student = require('../models/student.model');
const Cert = require('../models/cert.model');
const Major = require('../models/major.model');
const studentSearch = require('../meilisearch/student.search');

class StudentService {
    static async findAll() {
        const data = Student.findAll({
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
        await studentSearch.remove(id);
        return true;
    }

    static async getCertsByStudent(studentId) {
        const data = await Cert.findOne({
            where: { id: studentId },
            include: [
                {
                    model: Major,
                    as: 'major',
                    attributes: ['id', 'name']
                },
                {
                    model: Student,
                    as: 'student',
                    attributes: ['id', 'lastname', 'firstname']
                }
            ]
        });

        return data
    }

}

module.exports = StudentService