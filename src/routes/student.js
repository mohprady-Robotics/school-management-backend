const express = require('express');
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', protect, authorize('students', 'read'), getAllStudents);
router.get('/:id', protect, authorize('students', 'read'), getStudentById);
router.post('/', protect, authorize('students', 'create'), createStudent);
router.put('/:id', protect, authorize('students', 'update'), updateStudent);
router.delete('/:id', protect, authorize('students', 'delete'), deleteStudent);

module.exports = router;
