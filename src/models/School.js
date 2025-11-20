// backend/src/models/School.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const School = sequelize.define('School', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  schoolCode: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  schoolName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subdomain: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  customDomain: {
    type: DataTypes.STRING,
    unique: true
  },
  
  // Branding & Customization
  logo: DataTypes.STRING,
  primaryColor: {
    type: DataTypes.STRING,
    defaultValue: '#4F46E5'
  },
  secondaryColor: {
    type: DataTypes.STRING,
    defaultValue: '#10B981'
  },
  accentColor: {
    type: DataTypes.STRING,
    defaultValue: '#F59E0B'
  },
  schoolTheme: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  
  // Contact Information
  address: DataTypes.TEXT,
  city: DataTypes.STRING,
  state: DataTypes.STRING,
  zipCode: DataTypes.STRING,
  country: {
    type: DataTypes.STRING,
    defaultValue: 'India'
  },
  phoneNumber: DataTypes.STRING,
  email: DataTypes.STRING,
  website: DataTypes.STRING,
  
  // Configuration Settings
  settings: {
    type: DataTypes.JSONB,
    defaultValue: {
      academicYearStart: '04-01',
      attendanceGracePeriod: 24,
      gradeModificationDeadline: 7,
      enableOnlinePayments: true,
      enableSMSNotifications: true,
      enableWhatsAppIntegration: false,
      currency: 'INR',
      dateFormat: 'DD-MM-YYYY',
      timeFormat: '12h',
      language: 'en'
    }
  },
  
  // Features & Modules
  enabledModules: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [
      'students', 'attendance', 'grades', 
      'assignments', 'fees', 'communication', 
      'library', 'transport'
    ]
  },
  
  // Subscription & Billing
  subscriptionPlan: {
    type: DataTypes.ENUM('free', 'basic', 'premium', 'enterprise'),
    defaultValue: 'free'
  },
  subscriptionStatus: {
    type: DataTypes.ENUM('active', 'trial', 'expired', 'suspended'),
    defaultValue: 'trial'
  },
  maxStudents: {
    type: DataTypes.INTEGER,
    defaultValue: 100
  },
  maxStaff: {
    type: DataTypes.INTEGER,
    defaultValue: 20
  },
  subscriptionExpiry: DataTypes.DATE,
  
  // White Label Options
  showPoweredBy: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  customFooterText: DataTypes.STRING,
  
  // Admin Contact
  adminUserId: DataTypes.UUID,
  
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['schoolCode'] },
    { fields: ['subdomain'] },
    { fields: ['subscriptionStatus'] }
  ]
});

module.exports = School;
