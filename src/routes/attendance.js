const express = require('express');
const {
  markAttendance,
  bulkMarkAttendance,
  getAttendance,
  updateAttendance
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', protect, authorize('attendance', 'create'), markAttendance);
router.post('/bulk', protect, authorize('attendance', 'create'), bulkMarkAttendance);
router.get('/', protect, authorize('attendance', 'read'), getAttendance);
router.put('/:id', protect, authorize('attendance', 'update'), updateAttendance);

module.exports = router;
