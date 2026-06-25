
const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');

// Keep your custom registration controller
router.post('/register', authController.registerUser);

// Use Passport for the login route
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(401).json({ error: info.message });

        req.logIn(user, (err) => {
            if (err) return res.status(500).json({ error: err.message });
            return res.status(200).json({ message: "Successfully logged in!", user: user.username });
        });
    })(req, res, next);
});

// Add a logout route (Requirement 1.1.3)
router.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.status(200).json({ message: "Successfully logged out!" });
    });
});

module.exports = router;