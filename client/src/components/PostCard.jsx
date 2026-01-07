import React, { useState } from 'react';
import { Heart, MessageCircle, Send, MoreHorizontal } from 'lucide-react';
import { likePost } from '../services/api';

const PostCard = ({ post }) => {
  const [likes, setLikes] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false); // We'll refine this once Auth is deep-linked

  const handleLike = async () => {
    try {
      // Optimistic UI update
      setIsLiked(!isLiked);
      setLikes(isLiked? likes - 1 : likes + 1);
      
      await likePost(post._id);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      // Revert if API fails
      setIsLiked(!isLiked);
      setLikes(isLiked? likes + 1 : likes - 1);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm mb-6 max-w-[470px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-yellow-400 to-purple-600 rounded-full p-[1.5px]">
            <div className="w-full h-full bg-white rounded-full p-[1px]">
              <img 
                src={post.user.avatar | "https://via.placeholder.com/150"} 
                className="w-full h-full rounded-full object-cover" 
                alt="profile"
              />
            </div>
          </div>
          <span className="font-semibold text-sm">{post.user.username}</span>
        </div>
        <MoreHorizontal size={20} className="text-gray-500 cursor-pointer" />
      </div>

      {/* Main Image */}
      <img src={post.imageUrl} className="w-full object-cover aspect-square" alt="post" />

      {/* Actions */}
      <div className="p-3">
        <div className="flex items-center gap-4 mb-2">
          <Heart 
            size={26} 
            onClick={handleLike}
            className={`cursor-pointer transition ${isLiked? 'fill-red-500 text-red-500' : 'hover:text-gray-500'}`} 
          />
          <MessageCircle size={26} className="cursor-pointer hover:text-gray-500" />
          <Send size={26} className="cursor-pointer hover:text-gray-500" />
        </div>
        
        <p className="font-bold text-sm mb-1">{likes} likes</p>
        
        <p className="text-sm">
          <span className="font-bold mr-2">{post.user.username}</span>
          {post.caption}
        </p>
        
        <p className="text-gray-400 text-[10px] uppercase mt-2">
          {new Date(post.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default PostCard;