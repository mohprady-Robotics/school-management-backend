const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Student = require('./Student.js');
const Teacher = require('./Teacher.js/index.js');

const Attendance = sequelize.define('Attendance', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  studentId: { 
    type: DataTypes.UUID, 
    references: { model: Student, key: 'id' },
    allowNull: false
  },
  classId: { type: DataTypes.UUID, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  status: {
    type: DataTypes.ENUM('Present', 'Absent', 'Late', 'Half Day', 'Excused'),
    allowNull: false
  },
  markedBy: { type: DataTypes.UUID, references: { model: Teacher, key: 'id' }},
  remarks: DataTypes.TEXT,
  modifiedAt: DataTypes.DATE
}, {
  timestamps: true,
  indexes: [{ unique: true, fields: ['studentId', 'date'] }]
});

Attendance.belongsTo(Student, { foreignKey: 'studentId' });
Attendance.belongsTo(Teacher, { foreignKey: 'markedBy', as: 'marker' });

module.exports = Attendance;
