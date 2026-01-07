const express = require('express');
const router = express.Router();
const { createPost } = require('../Controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// POST /api/posts - Protected route with image upload [13]
router.post('/', protect, upload.single('image'), createPost);

module.exports = router;