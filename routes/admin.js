const express = require('express');
const router  = express.Router();
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const { ensureAdmin }         = require('../middleware/adminMiddleware');
const adminController         = require('../controllers/adminController');

const guard = [ensureAuthenticated, ensureAdmin];

router.get('/',                        guard, adminController.dashboard);
router.post('/posts/:id/delete',       guard, adminController.deletePost);
router.post('/comments/:id/delete',    guard, adminController.deleteComment);
router.post('/users/:id/ban',          guard, adminController.banUser);
router.post('/users/:id/unban',        guard, adminController.unbanUser);

module.exports = router;
