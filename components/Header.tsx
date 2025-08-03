
import React from 'react';
import { PawPrintIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-center py-4">
          <PawPrintIcon className="h-8 w-8 text-cyan-600 mr-3" />
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
            Dog Breed <span className="text-cyan-600">Scanner</span>
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
