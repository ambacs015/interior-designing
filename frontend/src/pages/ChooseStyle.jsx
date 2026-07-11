import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const STYLES = [
  { id: 'Modern', name: 'Modern', img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=400&q=80', desc: 'Clean lines and minimal clutter' },
  { id: 'Industrial', name: 'Industrial', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80', desc: 'Raw materials and exposed elements' },
  { id: 'Scandinavian', name: 'Scandinavian', img: 'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?auto=format&fit=crop&w=400&q=80', desc: 'Cozy, light, and functional' },
  { id: 'Minimalist', name: 'Minimalist', img: 'https://images.unsplash.com/photo-1583847268964-b28ce8f300d3?auto=format&fit=crop&w=400&q=80', desc: 'Simple, uncluttered, and serene' },
  { id: 'Luxury', name: 'Luxury', img: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=400&q=80', desc: 'Rich textures and elegant finishes' },
  { id: 'Bohemian', name: 'Bohemian', img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80', desc: 'Eclectic, colorful, and relaxed' },
];

function ChooseStyle({ currentUpload, onStyleSelected }) {
  const [selected, setSelected] = useState('Modern');
  const navigate = useNavigate();

  const handleGenerate = () => {
    onStyleSelected(selected);
    navigate('/recommendation');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] py-12 px-4 bg-slate-50 dark:bg-slate-950 flex flex-col items-center">
      <div className="w-full max-w-5xl mb-8">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1 text-sm font-medium">
            <ArrowLeft size={16} /> Back to Upload
          </button>
          <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm">Step 2: Choose Style</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
          <div className="bg-primary-600 h-2 rounded-full w-full transition-all"></div>
        </div>
      </div>

      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Select a Design Style</h2>
        <p className="text-slate-500">Choose the aesthetic you want AI to apply to your {currentUpload.roomType.toLowerCase()}.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full mb-12">
        {STYLES.map((style, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={style.id}
            onClick={() => setSelected(style.id)}
            className={`glass-card p-2 cursor-pointer transition-all duration-300 ${selected === style.id ? 'ring-4 ring-primary-500 shadow-glow scale-[1.02]' : 'hover:border-primary-300 hover:scale-[1.02]'}`}
          >
            <div className="relative h-48 rounded-xl overflow-hidden mb-3">
              <img src={style.img} alt={style.name} className="w-full h-full object-cover" />
              {selected === style.id && (
                <div className="absolute inset-0 bg-primary-600/20 flex items-center justify-center">
                  <div className="bg-primary-600 text-white p-2 rounded-full shadow-lg">
                    <Sparkles size={24} />
                  </div>
                </div>
              )}
            </div>
            <div className="px-2 pb-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{style.name}</h3>
              <p className="text-sm text-slate-500">{style.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <button onClick={handleGenerate} className="btn btn-primary text-lg px-12 py-4 shadow-xl">
        <Sparkles size={20} /> Generate Design
      </button>
    </div>
  );
}

export default ChooseStyle;
