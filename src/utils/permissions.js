const PERMISSIONS = {
  super_admin: {
    students: ['create', 'read', 'update', 'delete'],
    teachers: ['create', 'read', 'update', 'delete'],
    attendance: ['create', 'read', 'update', 'delete'],
    grades: ['create', 'read', 'update', 'delete'],
    assignments: ['create', 'read', 'update', 'delete'],
    fees: ['create', 'read', 'update', 'delete'],
    communication: ['create', 'read', 'update', 'delete'],
    reports: ['read']
  },
  admin: {
    students: ['create', 'read', 'update'],
    teachers: ['create', 'read', 'update'],
    attendance: ['read', 'update'],
    grades: ['read', 'update'],
    fees: ['create', 'read', 'update'],
    communication: ['create', 'read'],
    reports: ['read']
  },
  teacher: {
    students: ['read'],
    attendance: ['create', 'read', 'update'],
    grades: ['create', 'read', 'update'],
    assignments: ['create', 'read', 'update'],
    communication: ['create', 'read'],
    reports: ['read']
  },
  class_teacher: {
    students: ['read', 'update'],
    attendance: ['create', 'read', 'update'],
    grades: ['read', 'update'],
    assignments: ['create', 'read', 'update'],
    communication: ['create', 'read'],
    reports: ['read']
  },
  accountant: {
    students: ['read'],
    fees: ['create', 'read', 'update'],
    reports: ['read']
  },
  parent: {
    students: ['read'],
    attendance: ['read'],
    grades: ['read'],
    assignments: ['read'],
    fees: ['read', 'update'],
    communication: ['create', 'read']
  },
  student: {
    attendance: ['read'],
    grades: ['read'],
    assignments: ['read', 'update'],
    fees: ['read'],
    communication: ['create', 'read']
  }
};

const hasPermission = (role, module, action) => {
  return PERMISSIONS[role]?.[module]?.includes(action) || false;
};

module.exports = { PERMISSIONS, hasPermission };
