const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.static('public')); // Serve static files if you add a frontend later

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Request Header Parser Microservice! Use /api/whoami');
});

// API route
app.get('/api/whoami', (req, res) => {
    const ipaddress = req.ip || req.connection.remoteAddress;
    const language = req.get('Accept-Language') || 'unknown';
    const software = req.get('User-Agent') || 'unknown';

    res.json({
        ipaddress,
        language,
        software
    });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
