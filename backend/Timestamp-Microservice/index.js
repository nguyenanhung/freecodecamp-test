const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.static('public')); // Serve static files if you add a frontend later

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Timestamp Microservice! Use /api/:date or /api');
});

// API route for current time
app.get('/api', (req, res) => {
    const now = new Date();
    res.json({
        unix: now.getTime(),
        utc: now.toUTCString()
    });
});

// API route for timestamp
app.get('/api/:date?', (req, res) => {
    const { date } = req.params;
    let parsedDate;

    // If no date provided, use current time (already handled by /api, but for completeness)
    if (!date) {
        const now = new Date();
        return res.json({
            unix: now.getTime(),
            utc: now.toUTCString()
        });
    }

    // Check if date is a Unix timestamp (numeric)
    if (!isNaN(date) && !isNaN(parseInt(date))) {
        parsedDate = new Date(parseInt(date));
    } else {
        // Try parsing as date string
        parsedDate = new Date(date);
    }

    // Validate date
    if (isNaN(parsedDate.getTime())) {
        return res.json({ error: 'Invalid Date' });
    }

    // Return response
    res.json({
        unix: parsedDate.getTime(),
        utc: parsedDate.toUTCString()
    });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
