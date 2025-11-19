const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Teacher = require('./Teacher');

const Assignment = sequelize.define('Assignment', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  subject: { type: DataTypes.STRING, allowNull: false },
  classId: { type: DataTypes.UUID, allowNull: false },
  createdBy: {
    type: DataTypes.UUID,
    references: { model: Teacher, key: 'id' },
    allowNull: false
  },
  dueDate: { type: DataTypes.DATE, allowNull: false },
  maxMarks: DataTypes.FLOAT,
  attachmentUrl: DataTypes.STRING,
  status: {
    type: DataTypes.ENUM('Draft', 'Published', 'Closed'),
    defaultValue: 'Draft'
  }
}, { timestamps: true });

const AssignmentSubmission = sequelize.define('AssignmentSubmission', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  assignmentId: { type: DataTypes.UUID, allowNull: false },
  studentId: { type: DataTypes.UUID, allowNull: false },
  submissionText: DataTypes.TEXT,
  attachmentUrl: DataTypes.STRING,
  submittedAt: DataTypes.DATE,
  marksObtained: DataTypes.FLOAT,
  feedback: DataTypes.TEXT,
  status: {
    type: DataTypes.ENUM('Not Submitted', 'Submitted', 'Graded', 'Late Submission'),
    defaultValue: 'Not Submitted'
  }
}, { timestamps: true });

Assignment.belongsTo(Teacher, { foreignKey: 'createdBy', as: 'teacher' });
Assignment.hasMany(AssignmentSubmission, { foreignKey: 'assignmentId' });
AssignmentSubmission.belongsTo(Assignment, { foreignKey: 'assignmentId' });

module.exports = { Assignment, AssignmentSubmission };
