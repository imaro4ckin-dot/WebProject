const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const postController = require('../controllers/postController');
const interactionController = require('../controllers/interactionController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/Media/'),
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, 'post-' + unique + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

router.get('/', postController.getAllPosts);
router.post('/', ensureAuthenticated, upload.single('image'), postController.createPost);
router.get('/:id', postController.getPostById);
router.put('/:id', ensureAuthenticated, upload.single('image'), postController.updatePost);
router.delete('/:id', ensureAuthenticated, postController.deletePost);

router.get('/:id/comments', interactionController.getComments);
router.post('/:id/comments', ensureAuthenticated, interactionController.addComment);
router.post('/:id/like', ensureAuthenticated, interactionController.toggleLike);
router.post('/:id/bookmark', ensureAuthenticated, interactionController.toggleBookmark);

module.exports = router;
