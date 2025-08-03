
import React, { useState, useCallback, useRef } from 'react';
import { identifyBreedFromImage } from './services/geminiService';
import { fetchBreedDetails } from './services/dogApiService';
import type { AnalysisResult, ScanHistoryItem } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import ImageSelector from './components/ImageSelector';
import ResultCard from './components/ResultCard';
import Loader from './components/Loader';
import HistorySection from './components/HistorySection';
import CameraView from './components/CameraView';

const App: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [scanHistory, setScanHistory] = useLocalStorage<ScanHistoryItem[]>('dogScanHistory', []);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const isScanCancelled = useRef(false);

  const resetState = useCallback(() => {
    setImagePreview(null);
    setAnalysisResult(null);
    setIsLoading(false);
    setError(null);
    setIsCameraOpen(false);
  }, []);

  const handleImageSelect = useCallback(async (file: File) => {
    isScanCancelled.current = false;
    setIsCameraOpen(false);
    resetState();
    setIsLoading(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      if (isScanCancelled.current) return;
      const base64Image = (reader.result as string).split(',')[1];
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);

      try {
        // Step 1: Gemini analysis for breed identification and a fun fact
        const geminiResult = await identifyBreedFromImage(base64Image);
        if (isScanCancelled.current) return;
        
        if (!geminiResult.isDog || geminiResult.breeds.length === 0) {
            setError("The image doesn't appear to contain a dog. Please try another photo.");
            setAnalysisResult(null);
            setIsLoading(false);
            return;
        }

        // Step 2: Fetch structured details from The Dog API
        const primaryBreedName = geminiResult.breeds[0].name;
        const dogApiDetails = await fetchBreedDetails(primaryBreedName);
        if (isScanCancelled.current) return;

        // Step 3: Combine results into the final AnalysisResult
        const finalResult: AnalysisResult = {
            isDog: true,
            breeds: geminiResult.breeds,
            details: {
                origin: dogApiDetails.origin || 'N/A',
                temperament: dogApiDetails.temperament || 'N/A',
                lifespan: dogApiDetails.lifespan || 'N/A',
                sizeAndWeight: dogApiDetails.sizeAndWeight || 'N/A',
                commonTraits: dogApiDetails.commonTraits || 'N/A',
                interestingFact: geminiResult.interestingFact || 'A very good dog!',
            }
        };
        
        if (isScanCancelled.current) return;
        setAnalysisResult(finalResult);
        const newHistoryItem: ScanHistoryItem = {
          id: new Date().toISOString(),
          imageUrl,
          result: finalResult,
        };
        setScanHistory(prev => [newHistoryItem, ...prev.slice(0, 4)]);

      } catch (err) {
        if (isScanCancelled.current) return;
        console.error(err);
        setError('Failed to analyze the image. The AI may be busy, or an error occurred. Please try again.');
      } finally {
        if (isScanCancelled.current) return;
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
        if (isScanCancelled.current) return;
        setError('Failed to read the image file.');
        setIsLoading(false);
    }
  }, [resetState, setScanHistory]);

  const handleScanAgain = () => {
    resetState();
  };
  
  const handleCancelScan = () => {
    isScanCancelled.current = true;
    resetState();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      <Header />

      {isCameraOpen ? (
        <CameraView onCapture={handleImageSelect} onCancel={() => setIsCameraOpen(false)} />
      ) : (
        <>
          <main className="container mx-auto max-w-4xl p-4 sm:p-6 md:p-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              {isLoading ? (
                <Loader onCancel={handleCancelScan} />
              ) : analysisResult ? (
                <ResultCard result={analysisResult} imagePreview={imagePreview!} onScanAgain={handleScanAgain} />
              ) : (
                <ImageSelector
                  onTakePhoto={() => setIsCameraOpen(true)}
                  onUploadImage={handleImageSelect}
                  error={error}
                />
              )}
            </div>

            {!isLoading && !analysisResult && scanHistory.length > 0 && (
              <HistorySection history={scanHistory} />
            )}
          </main>
          <footer className="text-center py-4 text-slate-500 text-sm">
            <p>Powered by Gemini AI & The Dog API. For entertainment purposes only.</p>
          </footer>
        </>
      )}
    </div>
  );
};

export default App;
