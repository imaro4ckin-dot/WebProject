// config/passport.js
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('../models/db');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
            try {
                // 1. Check if the email exists
                const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
                
                if (users.length === 0) {
                    return done(null, false, { message: 'That email is not registered.' });
                }

                const user = users[0];

                // 2. Match the password
                const isMatch = await bcrypt.compare(password, user.password);
                
                if (isMatch) {
                    return done(null, user); // Success!
                } else {
                    return done(null, false, { message: 'Password incorrect.' });
                }
            } catch (err) {
                return done(err);
            }
        })
    );

    // This determines which data of the user object should be stored in the session (the ID)
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // This takes the ID from the session and fetches the full user object from the DB
    passport.deserializeUser(async (id, done) => {
        try {
            const [users] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
            done(null, users[0]);
        } catch (err) {
            done(err, null);
        }
    });
};