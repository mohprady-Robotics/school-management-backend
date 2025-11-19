const Grade = require('../models/Grade');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

exports.createGrade = async (req, res) => {
  try {
    const { 
      studentId, subject, examType, maxMarks, 
      obtainedMarks, academicYear, term, remarks 
    } = req.body;
    
    const percentage = (obtainedMarks / maxMarks) * 100;
    let grade = 'F';
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B';
    else if (percentage >= 60) grade = 'C';
    else if (percentage >= 50) grade = 'D';
    
    const gradeRecord = await Grade.create({
      studentId, subject, examType, maxMarks, 
      obtainedMarks, grade, academicYear, term, 
      remarks, enteredBy: req.user.Teacher?.id
    });
    
    res.status(201).json({ success: true, grade: gradeRecord });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getGrades = async (req, res) => {
  try {
    const { studentId, subject, examType, academicYear, term } = req.query;
    const where = {};
    
    if (studentId) where.studentId = studentId;
    if (subject) where.subject = subject;
    if (examType) where.examType = examType;
    if (academicYear) where.academicYear = academicYear;
    if (term) where.term = term;
    
    const grades = await Grade.findAll({
      where,
      include: [
        { model: Student, include: [User] },
        { model: Teacher, as: 'teacher', include: [User] }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json({ success: true, count: grades.length, grades });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateGrade = async (req, res) => {
  try {
    const grade = await Grade.findByPk(req.params.id);
    
    if (!grade) {
      return res.status(404).json({ success: false, message: 'Grade not found' });
    }
    
    if (grade.isLocked) {
      return res.status(403).json({ 
        success: false, 
        message: 'Grade is locked and cannot be modified' 
      });
    }
    
    await grade.update(req.body);
    
    res.json({ success: true, grade });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.lockGrades = async (req, res) => {
  try {
    const { gradeIds } = req.body;
    
    await Grade.update(
      { isLocked: true },
      { where: { id: gradeIds } }
    );
    
    res.json({ success: true, message: 'Grades locked successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
