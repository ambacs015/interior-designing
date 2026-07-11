import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

function UploadRoom({ onUploadDone }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [roomType, setRoomType] = useState('Living Room');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (!selectedFile) {
      toast.error('Please upload an image first');
      return;
    }
    onUploadDone({ image: preview, roomType });
    navigate('/style');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] py-12 px-4 bg-slate-50 dark:bg-slate-950 flex flex-col items-center">
      <div className="w-full max-w-3xl mb-8">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-primary-600 dark:text-primary-400 font-semibold">Step 1: Upload Room</span>
          <span className="text-slate-400">Step 2: Choose Style</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
          <div className="bg-primary-600 h-2 rounded-full w-1/2 transition-all"></div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-3xl p-8 shadow-xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Upload Your Room</h2>
          <p className="text-slate-500">Take a clear photo of the room you want to redesign.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Upload Area */}
          <div>
            <label className="form-label mb-3">Room Image</label>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl h-64 flex flex-col items-center justify-center relative overflow-hidden bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              {preview ? (
                <>
                  <img src={preview} alt="Room preview" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white font-medium flex items-center gap-2"><UploadCloud size={20} /> Change Image</span>
                  </div>
                </>
              ) : (
                <div className="text-center p-6">
                  <ImageIcon size={48} className="mx-auto text-primary-500 mb-4" />
                  <p className="text-slate-600 dark:text-slate-300 font-medium mb-1">Click to browse or drag image here</p>
                  <p className="text-xs text-slate-400">Supports JPG, PNG, WEBP (Max 5MB)</p>
                </div>
              )}
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Details Area */}
          <div className="flex flex-col justify-center">
            <div className="form-group">
              <label className="form-label mb-3">Room Type</label>
              <select 
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="form-input py-3"
              >
                <option value="Living Room">Living Room</option>
                <option value="Bedroom">Bedroom</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Bathroom">Bathroom</option>
                <option value="Dining Room">Dining Room</option>
                <option value="Office">Home Office</option>
              </select>
            </div>

            <button 
              onClick={handleNext}
              className="btn btn-primary w-full py-4 mt-auto text-lg"
              disabled={!preview}
            >
              Continue to Styles <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default UploadRoom;
