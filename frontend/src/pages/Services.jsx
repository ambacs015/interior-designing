import React from 'react';
import { Link } from 'react-router-dom';
import { Wand2, Layout, Zap, Smartphone } from 'lucide-react';

function Services() {
  const services = [
    {
      icon: Wand2,
      title: 'AI Room Redesign',
      desc: 'Instantly transform any room photo into a beautifully designed space matching your preferred aesthetic.'
    },
    {
      icon: Layout,
      title: 'Space Planning',
      desc: 'Get intelligent recommendations for furniture placement and spatial flow optimization.'
    },
    {
      icon: Zap,
      title: 'Lighting Analysis',
      desc: 'Our models analyze your existing lighting and suggest improvements for better ambiance.'
    },
    {
      icon: Smartphone,
      title: 'AR Preview (Coming Soon)',
      desc: 'View your AI-generated designs in real-time through your smartphone camera.'
    }
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] py-12 px-4 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Our Services</h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">Discover how our AI technology can help you realize the full potential of your living spaces.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services.map((service, idx) => (
            <div key={idx} className="glass-card flex gap-6 p-8">
              <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/50 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
                <service.icon size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{service.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{service.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center bg-primary-600 dark:bg-primary-900 rounded-2xl p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -z-10" />
          <h2 className="text-3xl font-bold mb-4">Ready to try it yourself?</h2>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto">Create a free account today and get 3 free room generations to test our capabilities.</p>
          <Link to="/register" className="btn bg-white text-primary-700 hover:bg-slate-50">
            Sign Up Now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Services;
