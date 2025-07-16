const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./utils/errorHandler');
const connectDB = require('./config/mongoose');
const adminRoutes = require('./routes/admin');
const clientRoutes = require('./routes/client');

require('dotenv').config();

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(morgan(':method :url :status :response-time ms'));
app.use(cors());
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Example route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

// Admin and Client routes
app.use('/admin', adminRoutes);
app.use('/client', clientRoutes);
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}: ${process.env.NODE_ENV}`);
});
