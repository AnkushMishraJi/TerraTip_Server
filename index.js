const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/mongoose');
const adminRoutes = require('./routes/admin');
const clientRoutes = require('./routes/client');

require('dotenv').config();

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Example route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Admin and Client routes
app.use('/admin', adminRoutes);
app.use('/client', clientRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}: ${process.env.NODE_ENV}`);
});
