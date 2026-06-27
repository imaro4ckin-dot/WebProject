const db = require('../models/db');

const getAllPosts = async (req, res) => {
    // Look for ?category= or ?q= in the URL
    const { category, q } = req.query;

    try {
        let sqlQuery = 'SELECT * FROM posts WHERE 1=1';
        let queryParams = [];

        // If they click a category filter
        if (category) {
            sqlQuery += ' AND category = ?';
            queryParams.push(category);
        }

        // If they use a text search bar
        if (q) {
            sqlQuery += ' AND (title LIKE ? OR content LIKE ?)';
            queryParams.push(`%${q}%`, `%${q}%`);
        }

        sqlQuery += ' ORDER BY created_at DESC';

        const [rows] = await db.query(sqlQuery, queryParams);
        res.json(rows);

    } catch(err) {
        console.error("Error fetching posts:", err);
        res.status(500).json({ error: "Failed to fetch posts." });
    }
};

const createPost  = async (req, res) => {
   const { title, content, category, tags } = req.body;
   const userId = req.user.id;
   const image = req.file ? req.file.filename : null;

   // Auto-generate slug from title
   const slug = title.toLowerCase()
       .replace(/[^a-z0-9\s-]/g, '')
       .trim()
       .replace(/\s+/g, '-')
       + '-' + Date.now();

   if (!title || !content || !category) {
       return res.status(400).json({ error: "Title, content and category are required." });
   }

   try {
       const [result] = await db.query(
            'INSERT INTO posts (user_id, title, slug, content, category, tags, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, title, slug, content, category, tags || null, image]
        );
        res.status(201).json({
            message: "Post created successfully!",
            postId: result.insertId
        });
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

    // Auto-generate new slug from title
    const slug = title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        + '-' + Date.now();

    try {
        let sql, params;
        if (image) {
            sql = 'UPDATE posts SET title=?, slug=?, content=?, category=?, tags=?, image=? WHERE id=? AND user_id=?';
            params = [title, slug, content, category, tags || null, image, postId, userId];
        } else {
            sql = 'UPDATE posts SET title=?, slug=?, content=?, category=?, tags=? WHERE id=? AND user_id=?';
            params = [title, slug, content, category, tags || null, postId, userId];
        }

        const [result] = await db.query(sql, params);

        if (result.affectedRows === 0) {
            return res.status(403).json({ error: "Not authorized to edit this post or post does not exist." });
        }

        res.status(200).json({ message: "Post updated successfully!" });

    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update post." });
    }
};

const deletePost = async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;

    try {
        const [result] = await db.query(
            'DELETE FROM posts WHERE id = ? AND user_id = ?',
            [postId, userId]
        );

        if (result.affectedRows === 0) {
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
        const [rows] = await db.query(
            `SELECT posts.*, users.username, users.profile_pic
             FROM posts
             JOIN users ON posts.user_id = users.id
             WHERE posts.id = ?`,
            [id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: "Post not found." });
        }
        // Increment view counter
        await db.query('UPDATE posts SET views = views + 1 WHERE id = ?', [id]);
        res.json(rows[0]);
    } catch (err) {
        console.error("Error fetching post:", err);
        res.status(500).json({ error: "Failed to fetch post." });
    }
};

// FIX 3: Consolidated export at the very bottom of the file
module.exports = { getAllPosts, getPostById, createPost, updatePost, deletePost };