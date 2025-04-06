const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static('public'));

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
    if (!req.file) {
        return res.json({ error: 'No file uploaded' });
    }

    const fileInfo = {
        name: req.file.originalname,
        type: req.file.mimetype,
        size: req.file.size
    };

    res.json(fileInfo);
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
