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

// Make user available in all EJS templates
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

// --- API Routes ---
const postRoutes = require('./routes/posts');
app.use('/api/posts', postRoutes);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

// --- Page Routes ---
const db = require('./models/db');

// Home page - show latest posts from DB
app.get(['/', '/index'], async (req, res) => {
    try {
        const [posts] = await db.query(
            'SELECT posts.*, users.username FROM posts JOIN users ON posts.user_id = users.id ORDER BY posts.created_at DESC LIMIT 6'
        );
        res.render('index', { posts });
    } catch (err) {
        console.error(err);
        res.render('index', { posts: [] });
    }
});

// Destinations / blog listing - supports ?q= and ?category=
app.get('/destinations', async (req, res) => {
    const { category, q } = req.query;
    try {
        let sql = 'SELECT posts.*, users.username FROM posts JOIN users ON posts.user_id = users.id WHERE 1=1';
        const params = [];
        if (category) { sql += ' AND category = ?'; params.push(category); }
        if (q)        { sql += ' AND (title LIKE ? OR content LIKE ?)'; params.push(`%${q}%`, `%${q}%`); }
        sql += ' ORDER BY posts.created_at DESC';
        const [posts] = await db.query(sql, params);
        res.render('destinations', { posts, category: category || 'all', q: q || '' });
    } catch (err) {
        console.error(err);
        res.render('destinations', { posts: [], category: 'all', q: '' });
    }
});

// Single post page
app.get('/posts/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query(
            'SELECT posts.*, users.username, users.profile_pic FROM posts JOIN users ON posts.user_id = users.id WHERE posts.id = ?',
            [id]
        );
        if (rows.length === 0) return res.status(404).render('404');
        await db.query('UPDATE posts SET views = views + 1 WHERE id = ?', [id]);

        const [comments] = await db.query(
            'SELECT comments.*, users.username, users.profile_pic FROM comments JOIN users ON comments.user_id = users.id WHERE post_id = ? ORDER BY comments.created_at DESC',
            [id]
        );

        // Check if current user liked / bookmarked
        let liked = false;
        let bookmarked = false;
        if (req.user) {
            const [likes] = await db.query('SELECT id FROM likes WHERE post_id = ? AND user_id = ?', [id, req.user.id]);
            const [bmarks] = await db.query('SELECT id FROM bookmarks WHERE post_id = ? AND user_id = ?', [id, req.user.id]);
            liked = likes.length > 0;
            bookmarked = bmarks.length > 0;
        }

        const [likeCount] = await db.query('SELECT COUNT(*) as count FROM likes WHERE post_id = ?', [id]);

        res.render('post', { post: rows[0], comments, liked, bookmarked, likeCount: likeCount[0].count });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading post');
    }
});

// User profile page
app.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [users] = await db.query(
            'SELECT id, username, bio, profile_pic, created_at FROM users WHERE id = ?',
            [id]
        );
        if (users.length === 0) return res.status(404).render('404');
        const [posts] = await db.query(
            'SELECT id, title, slug, category, image, created_at FROM posts WHERE user_id = ? ORDER BY created_at DESC',
            [id]
        );
        res.render('profile', { profileUser: users[0], posts });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading profile');
    }
});

// Static-ish pages
app.get('/about',   (req, res) => res.render('about'));
app.get('/contact', (req, res) => res.render('contact'));
app.get('/book',    (req, res) => res.render('book'));
app.get('/login',   (req, res) => res.render('login'));
app.get('/register',(req, res) => res.render('register'));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
