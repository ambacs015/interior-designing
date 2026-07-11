import React from 'react';

function About() {
  return (
    <div className="min-h-[calc(100vh-80px)] py-12 px-4 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">About AI Interiors</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
          At AI Interiors, we believe everyone deserves a beautifully designed space. By leveraging cutting-edge artificial intelligence, we're democratizing interior design, making it accessible, affordable, and instant. Our platform analyzes your room's spatial geometry and applies sophisticated aesthetic models to generate stunning, realistic redesigns in seconds.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-12">
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Innovation</h3>
            <p className="text-slate-500">Pushing the boundaries of what's possible with neural rendering and spatial planning.</p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Accessibility</h3>
            <p className="text-slate-500">Premium interior design concepts should be available to everyone, not just the elite.</p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Sustainability</h3>
            <p className="text-slate-500">Visualize before you buy to minimize waste and make confident decor decisions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
