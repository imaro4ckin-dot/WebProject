const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const userController = require('../controllers/userController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

// Set up multer for profile picture uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/Media/'),
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, 'avatar-' + unique + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

router.get('/:id', userController.getUserProfile);
router.put('/:id', ensureAuthenticated, upload.single('profile_pic'), userController.updateUserProfile);
router.get('/:id/bookmarks', ensureAuthenticated, userController.getUserBookmarks);

module.exports = router;
