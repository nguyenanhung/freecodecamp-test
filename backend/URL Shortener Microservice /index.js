const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');
const url = require('url');
const app = express();

// Middleware
app.use(cors({ optionsSuccessStatus: 200 }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public')); // Serve static files if you add a frontend later

// In-memory storage for URLs (for simplicity; use a DB in production)
const urlDatabase = new Map();
let shortUrlCounter = 1;

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the URL Shortener Microservice! Use /api/shorturl');
});

// POST route to shorten URL
app.post('/api/shorturl', (req, res) => {
    const originalUrl = req.body.url;

    // Check if URL has protocol
    if (!originalUrl.match(/^https?:\/\//)) {
        return res.json({ error: 'invalid url' });
    }

    // Parse URL and extract hostname
    const parsedUrl = url.parse(originalUrl);
    const hostname = parsedUrl.hostname;

    if (!hostname) {
        return res.json({ error: 'invalid url' });
    }

    // Validate URL with dns.lookup
    dns.lookup(hostname, (err) => {
        if (err) {
            return res.json({ error: 'invalid url' });
        }

        // Check if URL already exists
        let shortUrl = [...urlDatabase.entries()].find(([_, value]) => value === originalUrl)?.[0];
        if (!shortUrl) {
            shortUrl = shortUrlCounter++;
            urlDatabase.set(shortUrl, originalUrl);
        }

        res.json({
            original_url: originalUrl,
            short_url: shortUrl
        });
    });
});

// GET route to redirect
app.get('/api/shorturl/:short_url', (req, res) => {
    const shortUrl = parseInt(req.params.short_url);
    const originalUrl = urlDatabase.get(shortUrl);

    if (originalUrl) {
        res.redirect(originalUrl);
    } else {
        res.json({ error: 'No short URL found for the given input' });
    }
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
