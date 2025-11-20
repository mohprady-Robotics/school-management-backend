const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Student = sequelize.define('Student', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, references: { model: User, key: 'id' }},
  admissionNumber: { type: DataTypes.STRING, unique: true, allowNull: false },
  classId: DataTypes.UUID,
  section: DataTypes.STRING,
  rollNumber: DataTypes.STRING,
  dateOfBirth: DataTypes.DATEONLY,
  gender: { type: DataTypes.ENUM('Male', 'Female', 'Other') },
  bloodGroup: DataTypes.STRING,
  address: DataTypes.TEXT,
  guardianName: DataTypes.STRING,
  guardianPhone: DataTypes.STRING,
  guardianEmail: DataTypes.STRING,
  admissionDate: DataTypes.DATEONLY,
  status: { 
    type: DataTypes.ENUM('Active', 'Inactive', 'Transferred', 'Graduated'),
    defaultValue: 'Active'
  }
}, { timestamps: true });

Student.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(Student, { foreignKey: 'userId' });

module.exports = Student;
