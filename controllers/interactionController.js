const Comment = require('../models/Comment');
const Like = require('../models/Like');
const Bookmark = require('../models/Bookmark');

const addComment = async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;
    const { body } = req.body;

    if (!body) return res.status(400).json({ error: "Comment body cannot be empty." });

    try {
        const commentId = await Comment.create(postId, userId, body);
        res.status(201).json({ message: "Comment added successfully!", commentId });
    } catch (error) {
        console.error("Error adding comment:", error.message);
        res.status(500).json({ error: "Failed to add comment." });
    }
};

const getComments = async (req, res) => {
    const postId = req.params.id;
    try {
        const rows = await Comment.getByPost(postId);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching comments:", error.message);
        res.status(500).json({ error: "Failed to fetch comments." });
    }
};

const toggleLike = async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;
    try {
        const exists = await Like.check(postId, userId);
        if (exists) {
            await Like.remove(postId, userId);
            return res.status(200).json({ message: "Post unliked." });
        } else {
            await Like.add(postId, userId);
            return res.status(201).json({ message: "Post liked!" });
        }
    } catch (error) {
        console.error("Error toggling like:", error.message);
        res.status(500).json({ error: "Failed to toggle like." });
    }
};

const toggleBookmark = async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;
    try {
        const exists = await Bookmark.check(postId, userId);
        if (exists) {
            await Bookmark.remove(postId, userId);
            return res.status(200).json({ message: "Bookmark removed.", bookmarked: false });
        } else {
            await Bookmark.add(postId, userId);
            return res.status(201).json({ message: "Post bookmarked!", bookmarked: true });
        }
    } catch (error) {
        console.error("Error toggling bookmark:", error.message);
        res.status(500).json({ error: "Failed to toggle bookmark." });
    }
};

const deleteComment = async (req, res) => {
    const commentId = req.params.commentId;
    const userId = req.user.id;
    try {
        const affected = await Comment.remove(commentId, userId);
        if (affected === 0) return res.status(403).json({ error: "Not allowed or comment not found." });
        res.json({ message: "Comment deleted." });
    } catch (error) {
        console.error("Error deleting comment:", error.message);
        res.status(500).json({ error: "Failed to delete comment." });
    }
};

module.exports = { addComment, getComments, toggleLike, toggleBookmark, deleteComment };
