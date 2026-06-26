const db = require('../models/db');

const getAllPosts = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM posts');
        res.json(rows);
    } catch(err) {
        console.error(err);
        res.status(500).json({error: err});
    }
};

const createPost  = async (req, res) => {
   // 1. We removed user_id from here...
   const { title, slug, content, category } = req.body;

   // 2. ...and we grab it securely from Passport here!
   const userId = req.user.id;

   if (!title || !slug || !content || !category) {
       return res.status(400).json({ error: "Missing required fields." });
   }

   try {
       const [result] = await db.query(
            'INSERT INTO posts (user_id, title, slug, content, category) VALUES (?, ?, ?, ?, ?)',
            [userId, title, slug, content, category]
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
    const { title, slug, content, category } = req.body;

    // FIX 1: Get the IDs from the URL params and Passport session
    const postId = req.params.id;
    const userId = req.user.id;

    if (!title || !slug || !content || !category) {
        return res.status(400).json({error: "Missing title, slug, content, or category"});
    }

    try {
        const [result] = await db.query(
            'UPDATE posts SET title = ?, slug = ?, content = ?, category = ? WHERE id = ? AND user_id = ?',
            // FIX 2: Added postId and userId to match the 6 question marks
            [title, slug, content, category, postId, userId]
        );

        if (result.affectedRows == 0) {
            return res.status(403).json({error: "Not authorized to edit this post or post is not existing."});
        }

        res.status(200).json({message: "Post updated successfully!"});

    } catch(err) {
        console.error(err);
        res.status(500).json({error: "Failed to update post."});
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

// FIX 3: Consolidated export at the very bottom of the file
module.exports = { getAllPosts, createPost, updatePost, deletePost };