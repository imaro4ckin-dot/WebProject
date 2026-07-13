const ensureAdmin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    if (req.user.is_banned) {
        return res.redirect('/banned');
    }
    if (req.user.is_admin) {
        return next();
    }
    // Logged-in but not an admin — show a clear 403 message
    res.status(403).render('403');
};

module.exports = { ensureAdmin };
