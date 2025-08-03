
import React, { useState, useRef, useEffect } from 'react';
import { CloseIcon, AlertTriangleIcon } from './icons';

interface CameraViewProps {
    onCapture: (file: File) => void;
    onCancel: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture, onCancel }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const startCamera = async () => {
            try {
                // Prefer the rear camera
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' },
                    audio: false
                });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (err) {
                console.error("Camera access error:", err);
                if (err instanceof DOMException && (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError')) {
                    setError('Camera permission was denied. Please enable it in your browser settings to use this feature.');
                } else {
                    setError('Could not access the camera. Please ensure it is not being used by another application.');
                }
            }
        };

        startCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                canvas.toBlob(blob => {
                    if (blob) {
                        const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
                        onCapture(file);
                    }
                }, 'image/jpeg', 0.95);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-20 flex flex-col items-center justify-center animate-fade-in p-4">
            <button onClick={onCancel} className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors" aria-label="Close camera">
                <CloseIcon className="h-6 w-6"/>
            </button>

            <canvas ref={canvasRef} className="hidden"></canvas>
            
            <div className="relative w-full max-w-3xl aspect-square sm:aspect-[4/3] bg-black rounded-lg overflow-hidden shadow-2xl flex items-center justify-center">
                {error ? (
                     <div className="text-center p-8 max-w-sm mx-auto">
                        <AlertTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4"/>
                        <h3 className="text-xl font-semibold text-white mb-2">Camera Error</h3>
                        <p className="text-slate-300 mb-6">{error}</p>
                        <button onClick={onCancel} className="px-6 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700">Go Back</button>
                     </div>
                ) : (
                    <>
                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
                        {!stream && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                <div className="w-10 h-10 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                            </div>
                        )}
                    </>
                )}
            </div>
            
            {!error && stream && (
                 <div className="absolute bottom-8 flex justify-center w-full">
                    <button onClick={handleCapture} className="w-20 h-20 rounded-full bg-white flex items-center justify-center ring-4 ring-white/30 transition-transform transform hover:scale-110 focus:outline-none focus:ring-cyan-500" aria-label="Capture photo">
                        <div className="w-16 h-16 rounded-full bg-white border-4 border-cyan-600"></div>
                    </button>
                </div>
            )}
        </div>
    );
};

export default CameraView;
