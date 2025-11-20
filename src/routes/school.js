// backend/src/routes/school.js
const express = require('express');
const {
  createSchool,
  getSchoolSettings,
  updateSchoolSettings,
  updateBranding,
  updateModules
} = require('../controllers/schoolController');
const { protect } = require('../middleware/authMiddleware');
const { identifyTenant } = require('../middleware/tenantMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// Public route for school registration
router.post('/register', createSchool);

// Protected routes requiring authentication
router.use(protect);
router.use(identifyTenant);

router.get('/settings', getSchoolSettings);
router.put('/settings', authorize('settings', 'update'), updateSchoolSettings);
router.put('/branding', authorize('settings', 'update'), updateBranding);
router.put('/modules', authorize('settings', 'update'), updateModules);

module.exports = router;
