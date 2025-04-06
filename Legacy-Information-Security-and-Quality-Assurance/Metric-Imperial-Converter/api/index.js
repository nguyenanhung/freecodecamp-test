const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api'); // Đảm bảo đường dẫn này đúng
require('dotenv').config();

const app = express();

app.use(cors());
app.use('/api', apiRoutes);

module.exports = app;
