const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const postController = require('../controllers/postController');
const interactionController = require('../controllers/interactionController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

const uploadDir = path.join(__dirname, '../public/Media');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, 'post-' + unique + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

const handleUpload = (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: 'Image upload failed: ' + err.message });
        }
        next();
    });
};

router.get('/', postController.getAllPosts);
router.post('/', ensureAuthenticated, handleUpload, postController.createPost);
router.get('/:id', postController.getPostById);
router.put('/:id', ensureAuthenticated, handleUpload, postController.updatePost);
router.delete('/:id', ensureAuthenticated, postController.deletePost);

router.get('/:id/comments', interactionController.getComments);
router.post('/:id/comments', ensureAuthenticated, interactionController.addComment);
router.delete('/:id/comments/:commentId', ensureAuthenticated, interactionController.deleteComment);
router.post('/:id/like', ensureAuthenticated, interactionController.toggleLike);
router.post('/:id/bookmark', ensureAuthenticated, interactionController.toggleBookmark);

module.exports = router;
