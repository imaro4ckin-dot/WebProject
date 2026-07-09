const Admin = require('../models/Admin');

const dashboard = async (req, res) => {
    try {
        const [stats, postsByCategory, topPosts, writers, recentUsers, recentComments] = await Promise.all([
            Admin.getStats(),
            Admin.getPostsByCategory(),
            Admin.getTopPosts(10),
            Admin.getMostActiveWriters(5),
            Admin.getRecentUsers(15),
            Admin.getRecentComments(20),
        ]);

        // Compute max count for the category bar chart scaling
        const maxCategoryCount = postsByCategory.length > 0
            ? Math.max(...postsByCategory.map(r => r.count))
            : 1;

        res.render('admin', {
            stats,
            postsByCategory,
            maxCategoryCount,
            topPosts,
            writers,
            recentUsers,
            recentComments,
        });
    } catch (err) {
        console.error('Admin dashboard error:', err);
        res.status(500).send('Error loading admin dashboard.');
    }
};

const deletePost = async (req, res) => {
    try {
        await Admin.deletePost(req.params.id);
    } catch (err) {
        console.error('Admin deletePost error:', err);
    }
    res.redirect('/admin');
};

const deleteComment = async (req, res) => {
    try {
        await Admin.deleteComment(req.params.id);
    } catch (err) {
        console.error('Admin deleteComment error:', err);
    }
    res.redirect('/admin#comments');
};

const banUser = async (req, res) => {
    try {
        await Admin.setBanned(req.params.id, true);
    } catch (err) {
        console.error('Admin banUser error:', err);
    }
    res.redirect('/admin#users');
};

const unbanUser = async (req, res) => {
    try {
        await Admin.setBanned(req.params.id, false);
    } catch (err) {
        console.error('Admin unbanUser error:', err);
    }
    res.redirect('/admin#users');
};

module.exports = { dashboard, deletePost, deleteComment, banUser, unbanUser };
