const Comment = require('../models/Comment');
const axios = require('axios');

exports.addComment = async (req, res) => {
  const { text, forcePost } = req.body;
  const { postId } = req.params;

  try {
    // 1. Ask the NLP Service for a verdict [13, 14, 15]
    const { data } = await axios.post(`${process.env.NLP_SERVICE_URL}/predict`, { text });

    // 2. Handle 'Block'
    if (data.action === 'block') {
      return res.status(400).json({ status: 'block', message: "Comment blocked: violates community standards." });
    }

    // 3. Handle 'Warn' (Only allow if user confirmed 'forcePost') [16, 11]
    if (data.action === 'warn' &&!forcePost) {
      return res.status(403).json({ status: 'warn', message: "This comment may be offensive. Are you sure?" });
    }

    // 4. Save to DB [17, 18]
    const comment = await Comment.create({
      post: postId,
      user: req.user._id,
      text,
      status: data.action === 'warn'? 'flagged' : 'allowed'
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Moderation service unavailable" });
  }
};