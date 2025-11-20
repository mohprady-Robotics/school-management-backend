const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Student = require('./Student.js');

const Fee = sequelize.define('Fee', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  studentId: {
    type: DataTypes.UUID,
    references: { model: Student, key: 'id' },
    allowNull: false
  },
  feeType: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  dueDate: { type: DataTypes.DATEONLY, allowNull: false },
  paidAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  paidDate: DataTypes.DATEONLY,
  status: {
    type: DataTypes.ENUM('Pending', 'Partial', 'Paid', 'Overdue'),
    defaultValue: 'Pending'
  },
  paymentMethod: DataTypes.STRING,
  transactionId: DataTypes.STRING,
  receiptNumber: DataTypes.STRING,
  academicYear: { type: DataTypes.STRING, allowNull: false },
  remarks: DataTypes.TEXT
}, { timestamps: true });

Fee.belongsTo(Student, { foreignKey: 'studentId' });
Student.hasMany(Fee, { foreignKey: 'studentId' });

module.exports = Fee;
