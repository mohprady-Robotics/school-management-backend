const { hasPermission } = require('../utils/permissions.js');

const authorize = (module, action) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    if (!hasPermission(req.user.role, module, action)) {
      return res.status(403).json({ 
        success: false, 
        message: `Access denied: ${action} permission required for ${module}` 
      });
    }
    
    next();
  };
};

module.exports = { authorize };
