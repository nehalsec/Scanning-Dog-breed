
import React from 'react';
import type { ScanHistoryItem } from '../types';

interface HistorySectionProps {
  history: ScanHistoryItem[];
}

const HistorySection: React.FC<HistorySectionProps> = ({ history }) => {
  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold text-slate-700 mb-4 text-center">Recent Scans</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {history.map((item) => (
          <div key={item.id} className="group relative overflow-hidden rounded-lg shadow-md transition-transform transform hover:scale-105">
            <img src={item.imageUrl} alt={item.result.breeds[0]?.name || 'Scanned dog'} className="h-40 w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 p-2">
              <p className="text-white text-sm font-semibold truncate">
                {item.result.breeds[0]?.name || 'Unknown'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistorySection;
