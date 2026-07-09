// config/passport.js
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('../models/db');
const User = require('../models/User');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
            try {
                const user = await User.getByEmail(email);
                if (!user) return done(null, false, { message: 'That email is not registered.' });

                const isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Password incorrect.' });
                }
            } catch (err) {
                return done(err);
            }
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const [users] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
            const user = users[0];
            // Pass the full user object even when banned so the request middleware
            // can detect the flag and redirect to /banned with proper context.
            done(null, user || false);
        } catch (err) {
            done(err, null);
        }
    });
};