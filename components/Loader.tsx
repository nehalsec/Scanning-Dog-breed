
import React from 'react';

interface LoaderProps {
  onCancel: () => void;
}

const Loader: React.FC<LoaderProps> = ({ onCancel }) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <h2 className="mt-6 text-xl font-semibold text-slate-700">Analyzing your dog's photo...</h2>
        <p className="text-slate-500 mt-2">The AI is having a good look. Please wait a moment!</p>
        <div className="mt-8">
            <button
                onClick={onCancel}
                className="px-6 py-2 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-colors"
            >
                Cancel
            </button>
        </div>
    </div>
  );
};

export default Loader;
