
import React, { useRef } from 'react';
import { CameraIcon, GalleryIcon, AlertTriangleIcon } from './icons';

interface ImageSelectorProps {
  onTakePhoto: () => void;
  onUploadImage: (file: File) => void;
  error: string | null;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ onTakePhoto, onUploadImage, error }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUploadImage(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
        fileInputRef.current.click();
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold text-slate-700 mb-2">Identify a Dog's Breed in Seconds</h2>
      <p className="text-slate-500 mb-8 max-w-md mx-auto">
        Take a photo or upload an image to instantly learn about your furry friend.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onTakePhoto}
          className="flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-transform transform hover:scale-105"
        >
          <CameraIcon className="h-6 w-6" />
          Take Photo
        </button>
        <button
          onClick={triggerFileInput}
          className="flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-transform transform hover:scale-105"
        >
          <GalleryIcon className="h-6 w-6" />
          Upload Image
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />

      {error && (
        <div className="mt-8 p-4 bg-red-100 border border-red-200 text-red-800 rounded-lg flex items-center justify-center max-w-md mx-auto">
          <AlertTriangleIcon className="h-5 w-5 mr-3 flex-shrink-0"/>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default ImageSelector;
