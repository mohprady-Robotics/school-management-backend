const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User ');

const Teacher = sequelize.define('Teacher', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, references: { model: User, key: 'id' }},
  employeeId: { type: DataTypes.STRING, unique: true, allowNull: false },
  department: DataTypes.STRING,
  subjects: DataTypes.ARRAY(DataTypes.STRING),
  qualifications: DataTypes.TEXT,
  dateOfJoining: DataTypes.DATEONLY,
  classTeacherOf: DataTypes.UUID,
  isDepartmentHead: { type: DataTypes.BOOLEAN, defaultValue: false },
  status: { 
    type: DataTypes.ENUM('Active', 'Inactive', 'On Leave'),
    defaultValue: 'Active'
  }
}, { timestamps: true });

Teacher.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(Teacher, { foreignKey: 'userId' });

module.exports = Teacher;
