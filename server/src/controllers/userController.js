const User = require('../models/User');
const mongoose = require('mongoose');
const User = require('../models/User');

exports.getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const profileData = await User.aggregate([
      {
        $match: { username }
      },
      {
        $project: {
          email: 0
        }
      },
      {
        $addFields: {
          postCount: { $size: "$posts" }
        }
      }
    ]);

    if (!profileData.length) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(profileData[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.followUser = async (req, res) => {
  try {
    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }
    // 1. Add target to my 'following' list
    // 2. Add me to target's 'followers' list
    // $addToSet prevents duplicate entries
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { following: req.params.id }
    });
    
    await User.findByIdAndUpdate(req.params.id, {
      $addToSet: { followers: req.user.id }
    });

    res.status(200).json({ message: "Successfully followed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Unfollow a User
exports.unfollowUser = async (req, res) => {
  try {
    // $pull removes the ID from the array
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { following: req.params.id }
    });
    
    await User.findByIdAndUpdate(req.params.id, {
      $pull: { followers: req.user.id }
    });

    res.status(200).json({ message: "Successfully unfollowed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};