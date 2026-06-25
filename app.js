const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();
require('./config/passport')(passport);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON data (crucial for when you build the login/register forms)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from your "public" directory (for your JS, CSS, and Media)
app.use(express.static(path.join(__dirname, 'public')));

// Temporarily serve your HTML files directly from the "views" directory
// (You will update this later when you transition to EJS templates)
app.use(express.static(path.join(__dirname, 'views')));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));

// Passport Middleware <-- ADD THIS BLOCK
app.use(passport.initialize());
app.use(passport.session());

// Import and mount your API routes
const postRoutes = require('./routes/posts');
app.use('/api/posts', postRoutes);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});