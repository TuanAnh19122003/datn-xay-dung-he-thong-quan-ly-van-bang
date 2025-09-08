module.exports = (db) => {
    const { Role, User, Department, Major, Student, Cert, Template, Log } = db;

    // ========== Role ↔ User ==========
    User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
    Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });

    // ========== Department ↔ Major ==========
    Major.belongsTo(Department, { foreignKey: 'deptId', as: 'department' });
    Department.hasMany(Major, { foreignKey: 'deptId', as: 'majors' });

    // ========== Major ↔ Student ==========
    Student.belongsTo(Major, { foreignKey: 'majorId', as: 'major' });
    Major.hasMany(Student, { foreignKey: 'majorId', as: 'students' });

    // ========== Cert ↔ Student ==========
    Cert.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });
    Student.hasMany(Cert, { foreignKey: 'studentId', as: 'certs' });

    // ========== Cert ↔ Template ==========
    Cert.belongsTo(Template, { foreignKey: 'templateId', as: 'template' });
    Template.hasMany(Cert, { foreignKey: 'templateId', as: 'certs' });

    // ========== Log ↔ User ==========
    Log.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    User.hasMany(Log, { foreignKey: 'userId', as: 'logs' });
};
