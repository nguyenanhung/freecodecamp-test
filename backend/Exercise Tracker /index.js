const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

// Middleware
app.use(cors({ optionsSuccessStatus: 200 }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Schemas
const userSchema = new mongoose.Schema({
    username: { type: String, required: true }
});

const exerciseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Exercise = mongoose.model('Exercise', exerciseSchema);

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Exercise Tracker! Use /api/users');
});

// Create user
app.post('/api/users', async (req, res) => {
    const { username } = req.body;
    if (!username) return res.json({ error: 'Username is required' });

    try {
        const user = new User({ username });
        await user.save();
        res.json({ username: user.username, _id: user._id });
    } catch (err) {
        res.json({ error: 'Error creating user' });
    }
});

// Get all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({}, 'username _id');
        res.json(users);
    } catch (err) {
        res.json({ error: 'Error fetching users' });
    }
});

// Add exercise
app.post('/api/users/:_id/exercises', async (req, res) => {
    const { _id } = req.params;
    const { description, duration, date } = req.body;

    if (!description || !duration) {
        return res.json({ error: 'Description and duration are required' });
    }

    try {
        const user = await User.findById(_id);
        if (!user) return res.json({ error: 'User not found' });

        const exerciseDate = date ? new Date(date) : new Date();
        if (isNaN(exerciseDate.getTime())) return res.json({ error: 'Invalid date' });

        const exercise = new Exercise({
            userId: _id,
            description,
            duration: parseInt(duration),
            date: exerciseDate
        });
        await exercise.save();

        res.json({
            username: user.username,
            description: exercise.description,
            duration: exercise.duration,
            date: exercise.date.toDateString(),
            _id: user._id
        });
    } catch (err) {
        res.json({ error: 'Error adding exercise' });
    }
});

// Get user log
app.get('/api/users/:_id/logs', async (req, res) => {
    const { _id } = req.params;
    const { from, to, limit } = req.query;

    try {
        const user = await User.findById(_id);
        if (!user) return res.json({ error: 'User not found' });

        let query = { userId: _id };
        if (from || to) {
            query.date = {};
            if (from) query.date.$gte = new Date(from);
            if (to) query.date.$lte = new Date(to);
        }

        const exercises = await Exercise.find(query)
            .limit(parseInt(limit) || 0)
            .select('description duration date -_id');

        const log = exercises.map(ex => ({
            description: ex.description,
            duration: ex.duration,
            date: ex.date.toDateString()
        }));

        res.json({
            username: user.username,
            count: exercises.length,
            _id: user._id,
            log
        });
    } catch (err) {
        res.json({ error: 'Error fetching log' });
    }
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
