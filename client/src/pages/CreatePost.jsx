import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, X, Loader2 } from 'lucide-react';
import { createPost } from '../services/api';
import ModerationModal from '../components/ModerationModal';

const CreatePost = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Moderation states
  // Moderation states
const [showWarning, setShowWarning] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selected = e.target.files;
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected)); // Temporary preview for the user
    }
  };

  const handleUpload = async (isConfirmed = false) => {
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append('image', file);
    formData.append('caption', caption);
    if (isConfirmed) formData.append('confirmed', 'true');

    try {
      await createPost(formData);
      navigate('/'); // Redirect to feed on success
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message;

      if (status === 403) { // Our custom code for "Warning" level [3]
        setShowWarning(true);
      } else {
        setError(message | "An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
      
      {/* Image Picker */}
      <div className="relative aspect-square w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden flex items-center justify-center mb-4">
        {preview? (
          <>
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <button 
              onClick={() => {setFile(null); setPreview("");}}
              className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white"
            >
              <X size={20} />
            </button>
          </>
        ) : (
          <label className="flex flex-col items-center cursor-pointer">
            <Camera size={48} className="text-gray-400 mb-2" />
            <span className="text-gray-500 font-medium">Click to upload photo</span>
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </label>
        )}
      </div>

      {/* Caption Input */}
      <textarea
        placeholder="Write a caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-4 min-h-[100px]"
      />

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <button
        onClick={() => handleUpload(false)}
        disabled={loading ||!file}
        className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-600 disabled:opacity-50 transition"
      >
        {loading? <Loader2 className="animate-spin" /> : "Share Post"}
      </button>

      {/* Warning Interaction */}
      <ModerationModal 
        isOpen={showWarning}
        onConfirm={() => { setShowWarning(false); handleUpload(true); }}
        onCancel={() => setShowWarning(false)}
      />
    </div>
  );
};

export default CreatePost;