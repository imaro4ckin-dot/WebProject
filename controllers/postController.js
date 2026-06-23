const db = require('../models/db');
const getAllPosts = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM posts');
        res.json(rows);
    }catch(err) {
        console.error(err);
        res.status(500).json({error: err});
    }
};

module.exports = {
    getAllPosts
}

const createPost  = async (req, res) => {
   const { user_id, title, slug, content, category } = req.body;
   try{
       const[result] = await db.query(
            'INSERT INTO posts (user_id, title, slug, content, category) VALUES (?, ?, ?, ?, ?)',
            [user_id, title, slug, content, category]
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

// Don't forget to export the new function!
module.exports = { getAllPosts, createPost };

