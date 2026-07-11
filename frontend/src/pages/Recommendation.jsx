import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Save, CheckCircle, ArrowLeft, RefreshCw, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api';
import toast from 'react-hot-toast';
import html2pdf from 'html2pdf.js';

function Recommendation({ user, currentUpload }) {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const pdfRef = useRef(null);

  useEffect(() => {
    if (!currentUpload.image) {
      navigate('/upload');
      return;
    }
    
    // Convert base64 preview back to file or send directly as string
    generateDesign();
  }, []);

  const generateDesign = async () => {
    setLoading(true);
    try {
      // In a real app with file upload, you'd send form data.
      // We'll send the base64 string directly for simplicity.
      const payload = {
        image_data: currentUpload.image,
        room_type: currentUpload.roomType,
        style: currentUpload.style
      };
      
      const response = await api.post('/recommendation', payload);
      setResult(response.data);
    } catch (error) {
      toast.error('Failed to generate design');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post('/designs/save', {
        design: {
          result_image_url: result.redesign_image,
          room_type: currentUpload.roomType,
          style: currentUpload.style,
          recommendations: JSON.stringify(result.recommendations)
        }
      });
      toast.success('Design saved to dashboard!');
    } catch (error) {
      toast.error('Failed to save design');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = () => {
    const element = pdfRef.current;
    if (!element) return;
    
    const opt = {
      margin: 0.5,
      filename: `${currentUpload.roomType}_${currentUpload.style}_Design.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
    toast.success('Downloading PDF...');
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center px-4">
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-800 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <Sparkles className="absolute inset-0 m-auto text-primary-500" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Generating Design</h2>
        <p className="text-slate-500">AI is rendering your {currentUpload.roomType.toLowerCase()} in {currentUpload.style} style...</p>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="min-h-[calc(100vh-80px)] py-12 px-4 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <button onClick={() => navigate('/style')} className="btn btn-secondary py-2">
            <ArrowLeft size={16} /> Try Another Style
          </button>
          
          <div className="flex gap-4">
            <button onClick={handleDownloadPDF} className="btn btn-secondary py-2">
              <Download size={16} /> Download PDF
            </button>
            <button onClick={handleSave} disabled={saving} className="btn btn-primary py-2">
              {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'Saving...' : 'Save to Dashboard'}
            </button>
          </div>
        </div>

        {/* Content to be converted to PDF */}
        <div ref={pdfRef} className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="p-8 md:p-12 border-b border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">{currentUpload.roomType} Makeover</h1>
                <p className="text-lg text-primary-600 dark:text-primary-400 font-medium">{currentUpload.style} Aesthetic</p>
              </div>
              <div className="hidden sm:block">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/50 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400">
                  <CheckCircle size={24} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div>
                <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-3 text-sm uppercase tracking-wider">Original Room</h3>
                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-video bg-slate-100 dark:bg-slate-800">
                  <img src={currentUpload.image} alt="Original" className="w-full h-full object-cover" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-primary-600 dark:text-primary-400 mb-3 text-sm uppercase tracking-wider">AI Redesign</h3>
                <div className="rounded-xl overflow-hidden shadow-2xl ring-4 ring-primary-500/20 aspect-video bg-slate-100 dark:bg-slate-800 relative">
                  <img src={result.redesign_image} alt="Redesign" className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Design Recommendations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {result.recommendations?.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-950 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2 capitalize">{item.category}</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 leading-relaxed">{item.suggestion}</p>
                    <a href={item.link} target="_blank" rel="noreferrer" className="text-primary-600 hover:text-primary-700 text-sm font-medium">View Example &rarr;</a>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-950 p-6 text-center text-slate-500 text-sm">
            Generated by AI Interiors • {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Recommendation;
