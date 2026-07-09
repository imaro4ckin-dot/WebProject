// controllers/postController.js
const Post = require('../models/Post');
const Stamp = require('../models/Stamp');

const generateSlug = (title) =>
    title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        + '-' + Date.now();

const getAllPosts = async (req, res) => {
    const { category, q } = req.query;
    try {
        const rows = await Post.getAll(category, q);
        res.json(rows);
    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).json({ error: "Failed to fetch posts." });
    }
};

const createPost = async (req, res) => {
    const { title, content, category, tags } = req.body;
    const userId = req.user.id;
    const image = req.file ? req.file.filename : null;

    if (!title || !content || !category) {
        return res.status(400).json({ error: "Title, content and category are required." });
    }

    const slug = generateSlug(title);

    try {
        const postId = await Post.create(userId, title, slug, content, category, tags, image);
        
        // STAMP LOGIC
        const textToCheck = `${title} ${tags || ''}`.toLowerCase();
        
        if (textToCheck.includes('spain') || textToCheck.includes('barcelona')) {
            await Stamp.awardStamp(userId, 1);
        }
        if (textToCheck.includes('lithuania') || textToCheck.includes('vilnius')) {
            await Stamp.awardStamp(userId, 2);
        }
        if (textToCheck.includes('germany') || textToCheck.includes('heidelberg')) {
            await Stamp.awardStamp(userId, 3);
        }

        res.status(201).json({ message: "Post created successfully!", postId, slug });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ error: "Failed to create post." });
    }
};

const updatePost = async (req, res) => {
    const { title, content, category, tags } = req.body;
    const postId = req.params.id;
    const userId = req.user.id;
    const image = req.file ? req.file.filename : null;

    if (!title || !content || !category) {
        return res.status(400).json({ error: "Title, content and category are required." });
    }

    try {
        // Fetch the existing post so we can preserve the slug when the title hasn't changed
        const existing = await Post.getForEdit(postId, userId);
        if (!existing) {
            return res.status(403).json({ error: "Not authorized to edit this post or post does not exist." });
        }

        // Only regenerate the slug when the title has actually changed
        const slug = existing.title === title ? existing.slug : generateSlug(title);

        const affected = await Post.update(postId, userId, title, slug, content, category, tags, image);
        if (affected === 0) {
            return res.status(403).json({ error: "Not authorized to edit this post or post does not exist." });
        }
        res.status(200).json({ message: "Post updated successfully!", slug });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update post." });
    }
};

const deletePost = async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;
    try {
        const affected = await Post.remove(postId, userId);
        if (affected === 0) {
            return res.status(403).json({ error: "Not authorized to delete this post, or post not found." });
        }
        res.status(200).json({ message: "Post deleted successfully!" });
    } catch (error) {
        console.error("Error deleting post:", error.message);
        res.status(500).json({ error: "Failed to delete post." });
    }
};

const getPostById = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.getById(id);
        if (!post) return res.status(404).json({ error: "Post not found." });
        await Post.incrementViews(id);
        res.json(post);
    } catch (err) {
        console.error("Error fetching post:", err);
        res.status(500).json({ error: "Failed to fetch post." });
    }
};

module.exports = { getAllPosts, getPostById, createPost, updatePost, deletePost };