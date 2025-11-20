const Attendance = require('../models/Attendance.js');
const Student = require('../models/Student.js/index.js');
const { canModifyWithinTimeLimit } = require('../utils/permissions.js/index.js');

exports.markAttendance = async (req, res) => {
  try {
    const { studentId, classId, date, status, remarks } = req.body;
    
    const [attendance, created] = await Attendance.findOrCreate({
      where: { studentId, date },
      defaults: {
        classId,
        status,
        markedBy: req.user.Teacher?.id,
        remarks
      }
    });
    
    if (!created) {
      return res.status(400).json({ 
        success: false, 
        message: 'Attendance already marked for this date' 
      });
    }
    
    res.status(201).json({ success: true, attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.bulkMarkAttendance = async (req, res) => {
  try {
    const { date, classId, attendanceData } = req.body;
    
    const attendanceRecords = await Promise.all(
      attendanceData.map(async ({ studentId, status, remarks }) => {
        const [attendance] = await Attendance.findOrCreate({
          where: { studentId, date },
          defaults: {
            classId,
            status,
            markedBy: req.user.Teacher?.id,
            remarks
          }
        });
        return attendance;
      })
    );
    
    res.json({ success: true, count: attendanceRecords.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const { studentId, classId, startDate, endDate } = req.query;
    const where = {};
    
    if (studentId) where.studentId = studentId;
    if (classId) where.classId = classId;
    if (startDate && endDate) {
      where.date = { [require('sequelize').Op.between]: [startDate, endDate] };
    }
    
    const attendance = await Attendance.findAll({
      where,
      include: [{ model: Student, include: [User] }],
      order: [['date', 'DESC']]
    });
    
    res.json({ success: true, count: attendance.length, attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByPk(req.params.id);
    
    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }
    
    // Check time restriction
    if (!canModifyWithinTimeLimit(req.user.role, 'attendance', attendance.date)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Time limit exceeded for modifying attendance' 
      });
    }
    
    await attendance.update({ 
      ...req.body, 
      modifiedAt: new Date() 
    });
    
    res.json({ success: true, attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
