const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');

router.get('/', pageController.home);
router.get('/index', pageController.home);
router.get('/destinations', pageController.destinations);
router.get('/posts/create', pageController.createPostPage);
router.get('/posts/:id/edit', pageController.editPostPage);
router.get('/posts/:id', pageController.postDetail);
router.get('/users/:id', pageController.userProfilePage);

module.exports = router;
