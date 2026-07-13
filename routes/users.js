const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadFile } = require('../config/storage');
const userController = require('../controllers/userController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

const upload = multer({ storage: multer.memoryStorage() });

const handleUpload = (req, res, next) => {
    upload.single('profile_pic')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: 'Image upload failed: ' + err.message });
        }
        if (req.file) {
            try {
                const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const filename = 'avatar-' + unique + path.extname(req.file.originalname);
                req.fileUrl = await uploadFile(req.file.buffer, filename, req.file.mimetype);
            } catch (uploadErr) {
                return res.status(500).json({ error: uploadErr.message });
            }
        }
        next();
    });
};

router.get('/:id', userController.getUserProfile);
router.put('/:id', ensureAuthenticated, handleUpload, userController.updateUserProfile);
router.get('/:id/bookmarks', ensureAuthenticated, userController.getUserBookmarks);

module.exports = router;
