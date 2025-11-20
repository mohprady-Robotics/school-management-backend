// backend/src/controllers/schoolController.js
const School = require('../models/School');
const User = require('../models/User');

exports.createSchool = async (req, res) => {
  try {
    const {
      schoolName, subdomain, email, phoneNumber,
      address, city, state, zipCode,
      adminFirstName, adminLastName, adminEmail, adminPassword
    } = req.body;
    
    // Generate unique school code
    const schoolCode = `SCH${Date.now()}`;
    
    // Create school
    const school = await School.create({
      schoolCode,
      schoolName,
      subdomain: subdomain.toLowerCase(),
      email,
      phoneNumber,
      address,
      city,
      state,
      zipCode,
      subscriptionStatus: 'trial',
      subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });
    
    // Create admin user for the school
    const adminUser = await User.create({
      schoolId: school.id,
      email: adminEmail,
      password: adminPassword,
      role: 'super_admin',
      firstName: adminFirstName,
      lastName: adminLastName
    });
    
    // Update school with admin user ID
    await school.update({ adminUserId: adminUser.id });
    
    res.status(201).json({
      success: true,
      school,
      message: 'School created successfully',
      loginUrl: `https://${subdomain}.yourplatform.com/login`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSchoolSettings = async (req, res) => {
  try {
    const school = await School.findByPk(req.school.id);
    res.json({ success: true, school });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSchoolSettings = async (req, res) => {
  try {
    const school = await School.findByPk(req.school.id);
    
    if (!school) {
      return res.status(404).json({ success: false, message: 'School not found' });
    }
    
    // Allow updating specific fields
    const allowedFields = [
      'schoolName', 'logo', 'primaryColor', 'secondaryColor', 
      'accentColor', 'schoolTheme', 'settings', 'enabledModules',
      'address', 'city', 'state', 'zipCode', 'phoneNumber', 
      'email', 'website', 'showPoweredBy', 'customFooterText'
    ];
    
    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });
    
    await school.update(updates);
    
    res.json({ success: true, school });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateBranding = async (req, res) => {
  try {
    const { logo, primaryColor, secondaryColor, accentColor, schoolTheme } = req.body;
    
    const school = await School.findByPk(req.school.id);
    
    await school.update({
      logo,
      primaryColor,
      secondaryColor,
      accentColor,
      schoolTheme: {
        ...school.schoolTheme,
        ...schoolTheme
      }
    });
    
    res.json({ 
      success: true, 
      message: 'Branding updated successfully',
      school 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateModules = async (req, res) => {
  try {
    const { enabledModules } = req.body;
    
    const school = await School.findByPk(req.school.id);
    
    // Check if plan supports requested modules
    const planLimits = {
      free: ['students', 'attendance', 'communication'],
      basic: ['students', 'attendance', 'grades', 'communication', 'fees'],
      premium: ['students', 'attendance', 'grades', 'assignments', 'communication', 'fees', 'library'],
      enterprise: ['students', 'attendance', 'grades', 'assignments', 'communication', 'fees', 'library', 'transport', 'hostel', 'hr']
    };
    
    const allowedModules = planLimits[school.subscriptionPlan] || planLimits.free;
    const validModules = enabledModules.filter(m => allowedModules.includes(m));
    
    await school.update({ enabledModules: validModules });
    
    res.json({ 
      success: true, 
      enabledModules: validModules,
      message: 'Modules updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
