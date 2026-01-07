const express = require('express');
const router = express.Router();
const { getUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Publicly viewable profile, but protected by auth middleware for usage tracking
router.get('/profile/:username', protect, getUserProfile);
router.post('/follow/:id', protect, followUser);
router.post('/unfollow/:id', protect, unfollowUser);

module.exports = router;