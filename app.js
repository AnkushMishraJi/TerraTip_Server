require('dotenv').config();
const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes/index.route');
// const errorHandler = require('./utils/errorHandler');

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/v1', routes);
// app.use(errorHandler);

module.exports = app;
