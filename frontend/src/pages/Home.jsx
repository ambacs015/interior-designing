import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, UploadCloud, PaintBucket, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

function Home({ user }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 px-4">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-primary-200/50 dark:bg-primary-900/20 rounded-full blur-[100px] -z-10" />
        
        <div className="container mx-auto text-center z-10 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-semibold text-sm mb-8 border border-primary-100 dark:border-primary-800"
          >
            <Sparkles size={16} />
            <span>AI-Powered Interior Design</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6 tracking-tight"
          >
            Design your dream room <br className="hidden md:block" />
            in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">seconds.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Upload a photo of any space and instantly receive AI-generated redesigns tailored to your unique style and aesthetic preferences.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to={user ? "/upload" : "/register"} className="btn btn-primary w-full sm:w-auto text-lg px-8 py-4">
              Start Designing Now <ArrowRight size={20} />
            </Link>
            <Link to="/about" className="btn btn-secondary w-full sm:w-auto text-lg px-8 py-4">
              Learn More
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">How It Works</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">Three simple steps to transform your space completely.</p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {[
              { icon: UploadCloud, title: "1. Upload Photo", desc: "Take a picture of your current room and upload it to our secure platform." },
              { icon: PaintBucket, title: "2. Choose Style", desc: "Select from Modern, Luxury, Minimalist, Scandinavian, and many more." },
              { icon: Clock, title: "3. Get Results", desc: "Within seconds, receive beautiful AI renders and complete furniture recommendations." }
            ].map((feature, idx) => (
              <motion.div key={idx} variants={itemVariants} className="glass-card flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/50 rounded-2xl flex items-center justify-center text-primary-600 dark:text-primary-400 mb-6 shadow-sm">
                  <feature.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-600 dark:bg-primary-900 -z-10" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/20 rounded-full blur-3xl -z-10" />
        
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to redesign your space?</h2>
          <p className="text-primary-100 max-w-2xl mx-auto text-lg mb-10">Join thousands of users who have already discovered their perfect room layouts with AI Interiors.</p>
          <Link to={user ? "/upload" : "/register"} className="btn bg-white text-primary-700 hover:bg-slate-50 text-lg px-8 py-4">
            Get Started For Free
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
