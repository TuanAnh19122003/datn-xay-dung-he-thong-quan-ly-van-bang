const Student = require('../models/student.model');

class StudentService {
    static async findAll() {
        const data = Student.findAll();
        return data;
    }

    static async create(data, file) {
        if (file) {
            data.image = `uploads/${file.filename}`;
        }

        const student = await Student.create(data);
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

        return await student.update(data)
    }

    static async delete(id) {
        return await Student.destroy({ where: { id } });
    }

}

module.exports = StudentService