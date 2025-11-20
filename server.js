const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./src/config/database');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/students', require('./src/routes/student'));
app.use('/api/teachers', require('./src/routes/teacher'));
app.use('/api/attendance', require('./src/routes/attendance'));
app.use('/api/grades', require('./src/routes/grade'));
app.use('/api/assignments', require('./src/routes/assignment'));
app.use('/api/fees', require('./src/routes/fee'));
app.use('/api/communication', require('./src/routes/communication'));

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));


const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log('✓ Database connected');
    return sequelize.sync({ alter: false });
  })
  .then(() => {
    app.listen(PORT, () => console.log(`✓ Server on port ${PORT}`));
  })
  .catch(err => console.error('✗ Database error:', err));
