
import React from 'react';
import type { AnalysisResult } from '../types';
import { PawPrintIcon } from './icons';

interface ResultCardProps {
  result: AnalysisResult;
  imagePreview: string;
  onScanAgain: () => void;
}

const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="py-3 sm:py-4 px-4 bg-slate-50 rounded-lg transition hover:bg-slate-100">
        <dt className="text-sm font-medium text-slate-500">{label}</dt>
        <dd className="mt-1 text-md font-semibold text-slate-800">{value}</dd>
    </div>
);

const ResultCard: React.FC<ResultCardProps> = ({ result, imagePreview, onScanAgain }) => {
  const primaryBreed = result.breeds[0];

  return (
    <div className="animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="flex flex-col items-center">
                <img src={imagePreview} alt="Scanned dog" className="rounded-xl shadow-lg w-full max-w-sm object-cover aspect-square" />
            </div>

            <div className="flex flex-col">
                <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Analysis Results</h2>
                
                <div className="mt-4 space-y-2">
                    {result.breeds.map((breed, index) => (
                        <div key={index} className="bg-cyan-50 border-l-4 border-cyan-500 p-4 rounded-r-lg">
                            <div className="flex justify-between items-center">
                                <span className={`font-bold text-lg ${index === 0 ? 'text-cyan-800' : 'text-cyan-700'}`}>{breed.name}</span>
                                <span className={`font-semibold text-lg ${index === 0 ? 'text-cyan-800' : 'text-cyan-700'}`}>{breed.percentage.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-cyan-200 rounded-full h-2.5 mt-2">
                                <div className="bg-cyan-600 h-2.5 rounded-full" style={{ width: `${breed.percentage}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>

                {primaryBreed && (
                    <div className="mt-8">
                        <h3 className="text-xl font-bold text-slate-700 flex items-center gap-2">
                            <PawPrintIcon className="h-5 w-5 text-cyan-600" />
                            About {primaryBreed.name}
                        </h3>
                        <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <DetailItem label="Origin" value={result.details.origin || 'N/A'} />
                            <DetailItem label="Lifespan" value={result.details.lifespan || 'N/A'} />
                            <DetailItem label="Temperament" value={result.details.temperament || 'N/A'} />
                            <DetailItem label="Size & Weight" value={result.details.sizeAndWeight || 'N/A'} />
                            <DetailItem label="Common Traits" value={result.details.commonTraits || 'N/A'} />
                            <DetailItem label="Fun Fact" value={result.details.interestingFact || 'N/A'} />
                        </dl>
                    </div>
                )}
            </div>
        </div>
        
        <div className="mt-10 text-center">
            <button
                onClick={onScanAgain}
                className="px-8 py-3 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-transform transform hover:scale-105"
            >
                Back to Scanner
            </button>
        </div>
    </div>
  );
};

export default ResultCard;
