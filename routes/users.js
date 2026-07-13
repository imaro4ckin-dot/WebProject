const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const userController = require('../controllers/userController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

const uploadDir = path.join(__dirname, '../public/Media');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, 'avatar-' + unique + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

const handleUpload = (req, res, next) => {
    upload.single('profile_pic')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: 'Image upload failed: ' + err.message });
        }
        next();
    });
};

router.get('/:id', userController.getUserProfile);
router.put('/:id', ensureAuthenticated, handleUpload, userController.updateUserProfile);
router.get('/:id/bookmarks', ensureAuthenticated, userController.getUserBookmarks);

module.exports = router;
