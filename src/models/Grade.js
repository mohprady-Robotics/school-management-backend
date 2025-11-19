const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Student = require('./Student ');
const Teacher = require('./Teacher');

const Grade = sequelize.define('Grade', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  studentId: { 
    type: DataTypes.UUID,
    references: { model: Student, key: 'id' },
    allowNull: false
  },
  subject: { type: DataTypes.STRING, allowNull: false },
  examType: {
    type: DataTypes.ENUM('Unit Test', 'Mid Term', 'Final', 'Assignment', 'Project', 'Practical'),
    allowNull: false
  },
  maxMarks: { type: DataTypes.FLOAT, allowNull: false },
  obtainedMarks: { type: DataTypes.FLOAT, allowNull: false },
  grade: DataTypes.STRING,
  academicYear: { type: DataTypes.STRING, allowNull: false },
  term: DataTypes.STRING,
  enteredBy: { type: DataTypes.UUID, references: { model: Teacher, key: 'id' }},
  remarks: DataTypes.TEXT,
  isLocked: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { timestamps: true });

Grade.belongsTo(Student, { foreignKey: 'studentId' });
Grade.belongsTo(Teacher, { foreignKey: 'enteredBy', as: 'teacher' });

module.exports = Grade;
