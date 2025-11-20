const { sequelize } = require('./src/config/database');
const User = require('./src/models/User');
const School = require('./src/models/School');

async function seed() {
  await sequelize.sync({ force: true });
  
  const school = await School.create({
    schoolCode: 'DEMO001',
    schoolName: 'Demo School',
    subdomain: 'demo',
    email: 'admin@demoschool.com',
    phoneNumber: '1234567890',
    address: '123 School Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400001'
  });
  
  const admin = await User.create({
    schoolId: school.id,
    email: 'admin@demo.com',
    password: 'admin123',
    role: 'super_admin',
    firstName: 'Admin',
    lastName: 'User'
  });
  
  console.log('Database seeded successfully!');
  process.exit(0);
}

seed();