const express = require('express');
const {
  createGrade,
  getGrades,
  updateGrade,
  lockGrades
} = require('../controllers/gradeController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', protect, authorize('grades', 'create'), createGrade);
router.get('/', protect, authorize('grades', 'read'), getGrades);
router.put('/:id', protect, authorize('grades', 'update'), updateGrade);
router.post('/lock', protect, authorize('grades', 'update'), lockGrades);

module.exports = router;
