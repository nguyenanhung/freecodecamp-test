const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');
require('dotenv').config();

const app = express();

app.use(cors());
app.use('/public', express.static('public'));
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    // Không log ở đây để tránh [Error] trong FreeCodeCamp
});
