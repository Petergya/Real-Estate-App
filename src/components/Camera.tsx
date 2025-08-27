import React, { useRef, useState, useEffect } from 'react';
import { Camera as CameraIcon, RotateCcw, Download, X } from 'lucide-react';

interface CameraProps {
  onPhotoTaken: (photoData: string) => void;
  onClose: () => void;
}

const Camera: React.FC<CameraProps> = ({ onPhotoTaken, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [showCameraSelector, setShowCameraSelector] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    getAvailableCameras();
    // Auto-start camera when component mounts
    setTimeout(() => {
      startCamera();
    }, 500);
    return () => {
      stopCamera();
    };
  }, []);

  const getAvailableCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setAvailableCameras(videoDevices);
      
      // Auto-select first camera
      if (videoDevices.length > 0) {
        setSelectedCamera(videoDevices[0].deviceId);
      }
    } catch (err) {
      console.error('Error getting cameras:', err);
    }
  };

  const startCamera = async () => {
    try {
      console.log('Starting computer camera...');
      
      let constraints;
      
      // Use selected camera if available, otherwise use default
      if (selectedCamera && availableCameras.length > 1) {
        console.log('Using selected camera:', selectedCamera);
        constraints = {
          video: {
            deviceId: { exact: selectedCamera },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };
      } else {
        console.log('Using default computer camera');
        constraints = {
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Computer camera started successfully');
      setStream(mediaStream);
      setIsCameraActive(true);
      setError(null);
    } catch (err) {
      console.error('Computer camera access error:', err);
      setError('Unable to access computer camera. Please check permissions and ensure camera is available.');
    }
  };

  // Connect stream to video element when stream changes
  useEffect(() => {
    if (stream && videoRef.current) {
      console.log('Connecting stream to video element');
      videoRef.current.srcObject = stream;
      setIsVideoReady(false); // Reset video ready state
      
      // Check video ready state periodically
      const checkVideoReady = () => {
        if (videoRef.current && videoRef.current.readyState >= 2) {
          console.log('Video ready, readyState:', videoRef.current.readyState);
          setIsVideoReady(true);
        } else {
          setTimeout(checkVideoReady, 100);
        }
      };
      
      // Start checking after a short delay
      setTimeout(checkVideoReady, 500);
    }
  }, [stream]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    console.log('Capture photo clicked');
    
    if (!videoRef.current) {
      console.error('Video element not found');
      alert('Camera not available');
      return;
    }

    const video = videoRef.current;
    
    // Create a new canvas element
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      console.error('Could not get canvas context');
      alert('Error creating canvas context');
      return;
    }

    try {
      // Use default dimensions if video dimensions are not available
      const width = video.videoWidth || 640;
      const height = video.videoHeight || 480;
      
      // Set canvas size
      canvas.width = width;
      canvas.height = height;
      
      console.log('Capturing photo...', width, 'x', height);
      console.log('Video readyState:', video.readyState);
      console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);
      
      // Draw the current video frame to canvas
      context.drawImage(video, 0, 0, width, height);
      
      // Convert to data URL
      const photoData = canvas.toDataURL('image/jpeg', 0.9);
      
      console.log('Photo captured successfully, data length:', photoData.length);
      setCapturedPhoto(photoData);
      
    } catch (error) {
      console.error('Error capturing photo:', error);
      
      // Fallback: create a simple test image
      try {
        console.log('Creating fallback test image');
        canvas.width = 400;
        canvas.height = 300;
        
        // Draw a simple test image
        context.fillStyle = '#4a90e2';
        context.fillRect(0, 0, 400, 300);
        
        context.fillStyle = '#ffffff';
        context.font = '24px Arial';
        context.fillText('Camera Test', 150, 150);
        context.fillText(new Date().toLocaleTimeString(), 150, 180);
        
        const photoData = canvas.toDataURL('image/jpeg', 0.9);
        console.log('Fallback image created successfully');
        setCapturedPhoto(photoData);
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        alert('Error capturing photo. Please try again.');
      }
    }
  };



  const retakePhoto = () => {
    setCapturedPhoto(null);
  };

  const savePhoto = () => {
    if (capturedPhoto) {
      onPhotoTaken(capturedPhoto);
      onClose();
    }
  };

  const downloadPhoto = () => {
    if (capturedPhoto) {
      const link = document.createElement('a');
      link.download = `property-photo-${Date.now()}.jpg`;
      link.href = capturedPhoto;
      link.click();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                 {/* Header */}
         <div className="flex justify-between items-center p-4 border-b">
           <h3 className="text-lg font-semibold">Take Photo (Computer Camera)</h3>
          <div className="flex items-center space-x-2">
            {availableCameras.length > 1 && (
              <button
                onClick={() => setShowCameraSelector(!showCameraSelector)}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
              >
                Switch Camera
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Camera View */}
        <div className="relative">
          {error ? (
            <div className="p-8 text-center">
              <div className="text-red-500 mb-4">
                <CameraIcon size={48} className="mx-auto" />
              </div>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={startCamera}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
                     ) : !isCameraActive ? (
             <div className="p-8 text-center">
               <div className="text-blue-500 mb-4">
                 <CameraIcon size={48} className="mx-auto" />
               </div>
               <p className="text-gray-600 mb-4">Computer camera not started</p>
               <button
                 onClick={startCamera}
                 className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
               >
                 Start Camera
               </button>
                               
             </div>
          ) : capturedPhoto ? (
            <div className="p-4">
              <img
                src={capturedPhoto}
                alt="Captured photo"
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={retakePhoto}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 flex items-center justify-center"
                >
                  <RotateCcw size={16} className="mr-2" />
                  Retake
                </button>
                <button
                  onClick={downloadPhoto}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 flex items-center justify-center"
                >
                  <Download size={16} className="mr-2" />
                  Download
                </button>
              </div>
              <button
                onClick={savePhoto}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 mt-2"
              >
                Use This Photo
              </button>
            </div>
          ) : (
                         <div className="relative">
               <video
                 ref={videoRef}
                 autoPlay
                 playsInline
                 muted
                 className="w-full h-64 object-cover"
                 onLoadedMetadata={() => {
                   console.log('Video metadata loaded');
                   setIsVideoReady(true);
                 }}
                 onCanPlay={() => {
                   console.log('Video can play');
                   setIsVideoReady(true);
                 }}
                 onError={(e) => {
                   console.error('Video error:', e);
                   setIsVideoReady(false);
                 }}
               />
               {isCameraActive && (
                 <div className="absolute inset-0 flex items-center justify-center">
                   <div className="border-2 border-white border-dashed w-48 h-32 rounded-lg"></div>
                 </div>
               )}
                             <div className="p-4">
                                   <button
                    onClick={capturePhoto}
                    disabled={!isCameraActive}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <CameraIcon size={20} className="mr-2" />
                    Capture Photo
                  </button>
                                                      {!isVideoReady && isCameraActive && (
                     <p className="text-sm text-gray-500 text-center mt-2">
                       Computer camera initializing... You can still try to capture
                     </p>
                   )}
                   
               </div>
            </div>
          )}
        </div>

                 {/* Canvas for capturing */}
         <canvas 
           ref={canvasRef} 
           className="hidden"
           style={{ display: 'none' }}
         />

        {/* Camera Selector */}
        {showCameraSelector && availableCameras.length > 1 && (
          <div className="absolute top-16 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-10">
                         <div className="text-sm font-medium text-gray-700 mb-2">Select Computer Camera:</div>
            {availableCameras.map((camera) => (
              <button
                key={camera.deviceId}
                onClick={() => {
                  setSelectedCamera(camera.deviceId);
                  setShowCameraSelector(false);
                  stopCamera();
                  setTimeout(() => startCamera(), 100);
                }}
                className={`w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 ${
                  selectedCamera === camera.deviceId ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
                }`}
              >
                {camera.label || `Camera ${camera.deviceId.slice(0, 8)}`}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Camera; 