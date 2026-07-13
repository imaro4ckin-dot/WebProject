const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadFile } = require('../config/storage');
const postController = require('../controllers/postController');
const interactionController = require('../controllers/interactionController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

const upload = multer({ storage: multer.memoryStorage() });

const handleUpload = (req, res, next) => {
    upload.single('image')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: 'Image upload failed: ' + err.message });
        }
        if (req.file) {
            try {
                const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const filename = 'post-' + unique + path.extname(req.file.originalname);
                req.fileUrl = await uploadFile(req.file.buffer, filename, req.file.mimetype);
            } catch (uploadErr) {
                return res.status(500).json({ error: uploadErr.message });
            }
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
