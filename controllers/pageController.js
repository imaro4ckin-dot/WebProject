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
    const { id } = req.params;
    try {
        const post = await Post.getForEdit(id, req.user.id);
        if (!post) return res.status(403).render('404');
        res.render('create-post', { post });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading post editor');
    }
};

const postDetail = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.getById(id);
        if (!post) return res.status(404).render('404');
        await Post.incrementViews(id);

        const comments = await Comment.getByPost(id);

        let liked = false;
        let bookmarked = false;
        if (req.user) {
            liked = await Like.check(id, req.user.id);
            bookmarked = await Bookmark.check(id, req.user.id);
        }

        const likeCount = await Like.count(id);

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
