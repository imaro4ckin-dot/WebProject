const ensureAuthenticated = (req, res, next) => {


    if (req.isAuthenticated()) {
        return next(); // The user has a valid session cookie, let them through
    }

    // If they aren't logged in, kick them out with a 401 error
    res.status(401).json({ error: "Unauthorized: You must be logged in to do that." });
};

module.exports = { ensureAuthenticated };