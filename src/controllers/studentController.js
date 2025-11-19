const Student = require('../models/Student');
const User = require('../models/User');

exports.getAllStudents = async (req, res) => {
  try {
    const { classId, section, status } = req.query;
    const where = {};
    
    if (classId) where.classId = classId;
    if (section) where.section = section;
    if (status) where.status = status;
    
    const students = await Student.findAll({
      where,
      include: [{ model: User, attributes: ['firstName', 'lastName', 'email', 'phoneNumber'] }],
      order: [['rollNumber', 'ASC']]
    });
    
    res.json({ success: true, count: students.length, students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['firstName', 'lastName', 'email', 'phoneNumber'] }]
    });
    
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    
    res.json({ success: true, student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const { 
      email, firstName, lastName, phoneNumber,
      admissionNumber, classId, section, rollNumber,
      dateOfBirth, gender, bloodGroup, address,
      guardianName, guardianPhone, guardianEmail, admissionDate
    } = req.body;
    
    const user = await User.create({
      email,
      password: dateOfBirth || 'student123',
      role: 'student',
      firstName,
      lastName,
      phoneNumber
    });
    
    const student = await Student.create({
      userId: user.id,
      admissionNumber, classId, section, rollNumber,
      dateOfBirth, gender, bloodGroup, address,
      guardianName, guardianPhone, guardianEmail, admissionDate
    });
    
    res.status(201).json({ success: true, student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    
    await student.update(req.body);
    
    res.json({ success: true, student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    
    await student.update({ status: 'Inactive' });
    
    res.json({ success: true, message: 'Student deactivated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
