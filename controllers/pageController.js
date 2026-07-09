const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const Bookmark = require('../models/Bookmark');

const home = async (req, res) => {
    try {
        const posts = await Post.getLatest(6);
        res.render('index', { posts });
    } catch (err) {
        console.error(err);
        res.render('index', { posts: [] });
    }
};

const destinations = async (req, res) => {
    const { category, q } = req.query;
    try {
        const posts = await Post.getAll(category, q);
        res.render('destinations', { posts, category: category || 'all', q: q || '' });
    } catch (err) {
        console.error(err);
        res.render('destinations', { posts: [], category: 'all', q: '' });
    }
};

const createPostPage = (req, res) => {
    if (!req.user) return res.redirect('/login');
    res.render('create-post', { post: undefined });
};

const editPostPage = async (req, res) => {
    if (!req.user) return res.redirect('/login');
    const { slug } = req.params;
    try {
        let post = await Post.getForEditBySlug(slug, req.user.id);

        // Fallback: numeric ID in URL → redirect to slug-based edit URL
        if (!post && /^\d+$/.test(slug)) {
            const found = await Post.getForEdit(slug, req.user.id);
            if (found) return res.redirect(301, `/posts/${found.slug}/edit`);
        }

        if (!post) return res.status(403).render('404');
        res.render('create-post', { post });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading post editor');
    }
};

const postDetail = async (req, res) => {
    const slug = decodeURIComponent(req.params.slug);
    try {
        let post = await Post.getBySlug(slug);

        // Fallback: if param is a numeric ID (old links), look up by ID and redirect
        if (!post && /^\d+$/.test(slug)) {
            post = await Post.getById(slug);
            if (post) return res.redirect(301, `/posts/${post.slug}`);
        }

        if (!post) return res.status(404).render('404');
        await Post.incrementViews(post.id);

        const comments = await Comment.getByPost(post.id);

        let liked = false;
        let bookmarked = false;
        if (req.user) {
            liked = await Like.check(post.id, req.user.id);
            bookmarked = await Bookmark.check(post.id, req.user.id);
        }

        const likeCount = await Like.count(post.id);

        res.render('post', { post, comments, liked, bookmarked, likeCount });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading post');
    }
};

const userProfilePage = async (req, res) => {
    const { id } = req.params;
    try {
        const profileUser = await User.getById(id);
        if (!profileUser) return res.status(404).render('404');
        const posts = await Post.getByUser(id);
        res.render('profile', { profileUser, posts });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading profile');
    }
};

module.exports = { home, destinations, createPostPage, editPostPage, postDetail, userProfilePage };
