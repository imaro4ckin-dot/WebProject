const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();
require('./config/passport')(passport);

 
const app = express();
const PORT = process.env.PORT || 3000;
 
// --- View Engine ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
 
// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
 
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
 
app.use(passport.initialize());
app.use(passport.session());
 
// Make user and base URL available in all EJS templates
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    next();
});

// Redirect banned users to /banned for all page requests.
// Allowed through: the banned page itself, logout (so they can sign out),
// and all static assets so the banned page actually renders correctly.
const BANNED_ALLOWLIST = ['/banned', '/contact', '/api/auth/logout'];
app.use((req, res, next) => {
    if (
        req.user &&
        req.user.is_banned &&
        !BANNED_ALLOWLIST.includes(req.path) &&
        !req.path.startsWith('/css') &&
        !req.path.startsWith('/js') &&
        !req.path.startsWith('/Media')
    ) {
        return res.redirect('/banned');
    }
    next();
});
 
// --- API Routes ---
app.use('/api/posts', require('./routes/posts'));
app.use('/api/auth',  require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

// --- Admin ---
app.use('/admin', require('./routes/admin'));

// --- Page Routes ---
app.use('/', require('./routes/pages'));
 
// Static pages
app.get('/about',    (req, res) => res.render('about'));
app.get('/contact',  (req, res) => res.render('contact'));
app.get('/book',     (req, res) => res.render('book'));
app.get('/login',    (req, res) => res.render('login'));
app.get('/register', (req, res) => res.render('register'));
app.get('/banned',   (req, res) => res.status(403).render('banned'));
 
// --- 404 (must be last — catches anything not matched above) ---
app.use((req, res) => {
    res.status(404).render('404');
});
 
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});