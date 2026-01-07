const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  toxicityScore: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['allowed', 'flagged', 'blocked'], 
    default: 'allowed' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);