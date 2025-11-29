import React from 'react';
import { Zap } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onHome: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onHome }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button 
            onClick={onHome}
            className="flex items-center gap-2 group focus:outline-none"
          >
            <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20">
              <Zap className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
              ElectroViz
            </span>
          </button>
          
          <nav className="flex items-center gap-6">
            <span className="text-sm font-medium text-slate-400">Engineering Basics</span>
            <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>
            <span className="text-sm text-slate-500 hidden sm:block">Gemini Powered</span>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      <footer className="border-t border-slate-900 bg-slate-950 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-600 text-sm">
            Designed for Students. Powered by React, Tailwind & Google Gemini.
          </p>
        </div>
      </footer>
    </div>
  );
};
