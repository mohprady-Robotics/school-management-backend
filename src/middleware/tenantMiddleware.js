// backend/src/middleware/tenantMiddleware.js
const School = require('../models/School');

const identifyTenant = async (req, res, next) => {
  try {
    let school;
    
    // Method 1: Subdomain-based (myschool.yourplatform.com)
    const subdomain = req.hostname.split('.')[0];
    if (subdomain && subdomain !== 'www' && subdomain !== 'api') {
      school = await School.findOne({ 
        where: { subdomain, isActive: true } 
      });
    }
    
    // Method 2: Custom domain (www.myschool.com)
    if (!school) {
      school = await School.findOne({ 
        where: { customDomain: req.hostname, isActive: true } 
      });
    }
    
    // Method 3: Header-based (for API calls)
    const schoolCode = req.headers['x-school-code'];
    if (!school && schoolCode) {
      school = await School.findOne({ 
        where: { schoolCode, isActive: true } 
      });
    }
    
    if (!school) {
      return res.status(404).json({ 
        success: false, 
        message: 'School not found' 
      });
    }
    
    // Check subscription status
    if (school.subscriptionStatus === 'expired' || 
        school.subscriptionStatus === 'suspended') {
      return res.status(403).json({ 
        success: false, 
        message: 'School subscription is not active' 
      });
    }
    
    req.school = school;
    next();
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Data isolation for queries
const scopeToTenant = (req, res, next) => {
  if (!req.school) {
    return res.status(403).json({ 
      success: false, 
      message: 'School context required' 
    });
  }
  
  // Add schoolId filter to all queries automatically
  req.tenantFilter = { schoolId: req.school.id };
  next();
};

module.exports = { identifyTenant, scopeToTenant };
