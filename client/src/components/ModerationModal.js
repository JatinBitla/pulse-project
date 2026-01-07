import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ModerationModal = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-sm w-full p-6 shadow-xl">
        <div className="flex items-center gap-3 text-amber-600 mb-4">
          <AlertTriangle size={28} />
          <h3 className="text-lg font-bold">Community Warning</h3>
        </div>
        <p className="text-gray-600 mb-6">
          {message |

"Your caption may violate our community standards. Do you still want to post it?"}
        </p>
        <div className="flex flex-col gap-2">
          <button 
            onClick={onConfirm}
            className="w-full bg-red-500 text-white py-2 rounded-md font-semibold hover:bg-red-600 transition"
          >
            Post Anyway
          </button>
          <button 
            onClick={onCancel}
            className="w-full bg-gray-100 text-gray-700 py-2 rounded-md font-semibold hover:bg-gray-200 transition"
          >
            Go Back & Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModerationModal;