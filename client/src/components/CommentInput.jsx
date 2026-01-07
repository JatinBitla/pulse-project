import React, { useState } from 'react';
import { API } from '../services/api';
import ModerationModal from './ModerationModal'; // Built in previous step

// eslint-disable-next-line react-refresh/only-export-components
const CommentInput = ({ postId, onCommentAdded }) => {
  const [text, setText] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (force = false) => {
    setLoading(true);
    try {
      const { data } = await API.post(`/posts/${postId}/comments`, { 
        text, 
        forcePost: force 
      });
      setText("");
      setShowWarning(false);
      onCommentAdded(data);
    } catch (err) {
      if (err.response?.status === 403) {
        setShowWarning(true); // Trigger the "Warn" modal [16, 19]
      } else {
        alert(err.response?.data?.message | "Error posting comment");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 border-t pt-2">
      <div className="flex gap-2">
        <input 
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 text-sm outline-none"
          placeholder="Add a comment..."
        />
        <button 
          onClick={() => handleSubmit(false)}
          disabled={!text | loading}
          className="text-blue-500 font-semibold text-sm disabled:opacity-50"
        >
          Post
        </button>
      </div>

      <ModerationModal 
        isOpen={showWarning}
        onConfirm={() => handleSubmit(true)}
        onCancel={() => setShowWarning(false)}
      />
    </div>
  );
};