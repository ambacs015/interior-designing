import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Sparkles, Compass, Menu, X, Globe, Share2, Mail, Sun, Moon } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

// Import Pages
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Services from './pages/Services.jsx';
import Contact from './pages/Contact.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import UploadRoom from './pages/UploadRoom.jsx';
import ChooseStyle from './pages/ChooseStyle.jsx';
import Recommendation from './pages/Recommendation.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [currentUpload, setCurrentUpload] = useState({
    image: null,
    roomType: 'Living Room',
    style: 'Modern'
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check dark mode preference
    const isDark = localStorage.getItem('darkMode') === 'true' || 
                   (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
    
    // Check for active session
    const session = localStorage.getItem('user_session');
    const token = localStorage.getItem('token');
    if (session && token) {
      setUser(JSON.parse(session));
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user_session', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user_session');
    localStorage.removeItem('token');
  };

  const handleUploadDone = ({ image, roomType }) => {
    setCurrentUpload(prev => ({ ...prev, image, roomType }));
  };

  const handleStyleSelected = (style) => {
    setCurrentUpload(prev => ({ ...prev, style }));
  };

  return (
    <Router>
      <Toaster position="top-right" />
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="container flex justify-between items-center h-20">
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-3 font-heading font-extrabold text-xl group">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform duration-300">
              <Sparkles size={22} />
            </div>
            <span className="text-slate-900 dark:text-white tracking-tight">AI Interiors</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
            <Link to="/" className="text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors">Home</Link>
            <Link to="/about" className="text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors">About</Link>
            <Link to="/services" className="text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors">Services</Link>
            <Link to="/contact" className="text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors">Contact</Link>
            
            {user ? (
              <div className="flex items-center gap-4 ml-2">
                <Link to="/dashboard" className="text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors">Dashboard</Link>
                <Link to="/upload" className="btn btn-primary px-4 py-2 text-sm">
                  Upload Room <Compass size={16} />
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4 ml-2">
                <Link to="/login" className="text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors">Login</Link>
                <Link to="/register" className="btn btn-primary px-5 py-2 text-sm">
                  Sign Up
                </Link>
              </div>
            )}
            <button onClick={toggleDarkMode} className="text-slate-500 hover:text-primary-600 dark:text-slate-400 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-2">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button onClick={toggleDarkMode} className="text-slate-500 dark:text-slate-400 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-900 dark:text-white p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 p-6 z-40 flex flex-col gap-4 font-semibold shadow-2xl md:hidden">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-slate-700 dark:text-slate-200 py-2 border-b border-slate-100 dark:border-slate-800">Home</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-slate-700 dark:text-slate-200 py-2 border-b border-slate-100 dark:border-slate-800">About</Link>
          <Link to="/services" onClick={() => setMobileMenuOpen(false)} className="text-slate-700 dark:text-slate-200 py-2 border-b border-slate-100 dark:border-slate-800">Services</Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-slate-700 dark:text-slate-200 py-2 border-b border-slate-100 dark:border-slate-800">Contact</Link>
          {user ? (
            <div className="flex flex-col gap-4 mt-2">
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-slate-700 dark:text-slate-200 py-2">Dashboard</Link>
              <Link to="/upload" className="btn btn-primary w-full" onClick={() => setMobileMenuOpen(false)}>
                Upload Room <Compass size={16} />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3 mt-4">
              <Link to="/login" className="btn btn-secondary w-full" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn btn-primary w-full" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
            </div>
          )}
        </div>
      )}

      {/* Main Pages Content Area */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/dashboard" /> : <Register onLogin={handleLogin} />} 
          />
          
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/upload" 
            element={user ? <UploadRoom user={user} currentUpload={currentUpload} onUploadDone={handleUploadDone} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/style" 
            element={user ? <ChooseStyle user={user} currentUpload={currentUpload} onStyleSelected={handleStyleSelected} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/recommendation" 
            element={user ? <Recommendation user={user} currentUpload={currentUpload} /> : <Navigate to="/login" />} 
          />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8 text-slate-500 dark:text-slate-400 transition-colors duration-300">
        <div className="container">
          <div className="grid-4 mb-12">
            {/* Column 1 */}
            <div>
              <h3 className="text-slate-900 dark:text-white font-heading font-bold text-xl mb-4">AI Interiors</h3>
              <p className="mb-6 leading-relaxed">Instant luxury design concepts mapping spatial geometry to customized material palettes.</p>
              <div className="flex gap-4">
                <a href="#" className="hover:text-primary-600 transition-colors"><Share2 size={20} /></a>
                <a href="#" className="hover:text-primary-600 transition-colors"><Globe size={20} /></a>
                <a href="#" className="hover:text-primary-600 transition-colors"><Mail size={20} /></a>
              </div>
            </div>

            {/* Column 2 */}
            <div>
              <h4 className="text-slate-900 dark:text-white font-heading font-semibold mb-4">Explore Page</h4>
              <ul className="flex flex-col gap-3">
                <li><Link to="/" className="hover:text-primary-600 transition-colors">Home</Link></li>
                <li><Link to="/about" className="hover:text-primary-600 transition-colors">About us</Link></li>
                <li><Link to="/services" className="hover:text-primary-600 transition-colors">Services</Link></li>
                <li><Link to="/contact" className="hover:text-primary-600 transition-colors">Contact Support</Link></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h4 className="text-slate-900 dark:text-white font-heading font-semibold mb-4">Interactive Tiers</h4>
              <ul className="flex flex-col gap-3">
                <li><Link to="/upload" className="hover:text-primary-600 transition-colors">Redesign Room</Link></li>
                <li><Link to="/login" className="hover:text-primary-600 transition-colors">Sign In</Link></li>
                <li><Link to="/register" className="hover:text-primary-600 transition-colors">Register Account</Link></li>
                <li><Link to="/dashboard" className="hover:text-primary-600 transition-colors">User Dashboard</Link></li>
              </ul>
            </div>

            {/* Column 4 */}
            <div>
              <h4 className="text-slate-900 dark:text-white font-heading font-semibold mb-4">Corporate Info</h4>
              <p className="mb-4 leading-relaxed">Leveraging Neural Renderers & Vector Space planning models.</p>
              <p className="text-sm">Headquarters: San Francisco, CA</p>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-wrap justify-between items-center gap-4 text-sm">
            <span>© 2026 AI Interiors Inc. All Rights Reserved.</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary-600 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </Router>
  );
}

export default App;;
