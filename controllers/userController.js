const User = require('../models/User');
const Post = require('../models/Post');
const Bookmark = require('../models/Bookmark');

const getUserProfile = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.getById(id);
        if (!user) return res.status(404).json({ error: "User not found." });
        const posts = await Post.getByUser(id);
        res.json({ user, posts });
    } catch (err) {
        console.error("Error fetching profile:", err);
        res.status(500).json({ error: "Failed to fetch profile." });
    }
};

const updateUserProfile = async (req, res) => {
    const { id } = req.params;
    const userId = parseInt(id, 10);
    if (isNaN(userId) || req.user.id !== userId) {
        return res.status(403).json({ error: "Not authorized to edit this profile." });
    }
    const { bio } = req.body;
    const profile_pic = req.fileUrl || null;
    try {
        await User.updateProfile(id, bio, profile_pic);
        res.json({ message: "Profile updated successfully!" });
    } catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).json({ error: "Failed to update profile." });
    }
};

const getUserBookmarks = async (req, res) => {
    const { id } = req.params;
    const userId = parseInt(id, 10);
    if (isNaN(userId) || req.user.id !== userId) {
        return res.status(403).json({ error: "Not authorized to view these bookmarks." });
    }
    try {
        const rows = await Bookmark.getByUser(id);
        res.json(rows);
    } catch (err) {
        console.error("Error fetching bookmarks:", err);
        res.status(500).json({ error: "Failed to fetch bookmarks." });
    }
};

module.exports = { getUserProfile, updateUserProfile, getUserBookmarks };
