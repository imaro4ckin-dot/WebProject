const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const interactionController = require('../controllers/interactionController'); // <-- 1. Import the new controller
const { ensureAuthenticated } = require('../middleware/authMiddleware');


router.get('/', postController.getAllPosts);
router.post('/', ensureAuthenticated, postController.createPost);
router.put('/:id', ensureAuthenticated, postController.updatePost);
router.delete('/:id', ensureAuthenticated, postController.deletePost);

// <-- 2. Add these two new routes at the bottom! -->
router.post('/:id/comments', ensureAuthenticated, interactionController.addComment);
router.post('/:id/like', ensureAuthenticated, interactionController.toggleLike);

module.exports = router;