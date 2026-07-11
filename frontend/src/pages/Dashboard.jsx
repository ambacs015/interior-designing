import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Clock, Search, Filter, Trash2, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api';
import toast from 'react-hot-toast';

function Dashboard({ user, onLogout }) {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStyle, setFilterStyle] = useState('All');

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      const response = await api.get('/designs');
      setDesigns(response.data.designs);
    } catch (error) {
      toast.error('Failed to load designs');
    } finally {
      setLoading(false);
    }
  };

  const filteredDesigns = designs.filter(design => {
    const matchesSearch = design.room_type.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          design.style.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStyle = filterStyle === 'All' || design.style === filterStyle;
    return matchesSearch && matchesStyle;
  });

  const uniqueStyles = ['All', ...new Set(designs.map(d => d.style))];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-950 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome, {user?.name}</h1>
            <p className="text-slate-600 dark:text-slate-400">Manage your past designs and start new ones.</p>
          </div>
          <div className="flex gap-4">
            <Link to="/upload" className="btn btn-primary">
              <Compass size={18} /> New Design
            </Link>
            <button onClick={onLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="glass-card p-4 mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search designs..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10 py-2 w-full"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={18} className="text-slate-400" />
            <select 
              value={filterStyle} 
              onChange={(e) => setFilterStyle(e.target.value)}
              className="form-input py-2"
            >
              {uniqueStyles.map(style => (
                <option key={style} value={style}>{style}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Designs Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredDesigns.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDesigns.map((design, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={design.id} 
                className="glass-card p-0 overflow-hidden group cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={design.result_image_url} 
                    alt={design.room_type} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-medium">
                    {design.style}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{design.room_type}</h3>
                  <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
                    <Clock size={14} />
                    <span>{new Date(design.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <a href={design.result_image_url} target="_blank" rel="noreferrer" className="text-primary-600 hover:text-primary-700 font-medium text-sm inline-flex items-center gap-1">
                      <Download size={16} /> View Image
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass-card">
            <Compass size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">No designs found</h3>
            <p className="text-slate-500 mb-6">You haven't generated any designs matching your criteria yet.</p>
            <Link to="/upload" className="btn btn-primary">Start Your First Design</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
