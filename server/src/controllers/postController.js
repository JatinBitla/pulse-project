const Post = require('../models/Post');
const axios = require('axios');

exports.createPost = async (req, res) => {
  try {
    const { caption } = req.body;
    
    // 1. Check if an image was actually uploaded
    if (!req.file) return res.status(400).json({ message: "Image is required" });

    // 2. Hybrid NLP Check for the caption [8, 9]
    // We call our Python service before saving the post
    const nlpResponse = await axios.post(`${process.env.NLP_SERVICE_URL}/predict`, {
      text: caption
    });

    const { action, probability } = nlpResponse.data;

    if (action === 'block') {
      return res.status(400).json({ message: "Caption violates community standards" });
    }

    // 3. Save to MongoDB [1, 10]
    const newPost = await Post.create({
      user: req.user._id, // From Auth middleware
      imageUrl: req.file.path, // Cloudinary URL 
      caption: caption,
      // We could also store the toxicity score for audit logs
    });

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};