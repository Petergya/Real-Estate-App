import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Video, Square, Play, Pause, RotateCcw, Download, X } from 'lucide-react';

interface VideoRecorderProps {
  onVideoRecorded: (videoBlob: Blob) => void;
  onClose: () => void;
}

const VideoRecorder: React.FC<VideoRecorderProps> = ({ onVideoRecorded, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [showCameraSelector, setShowCameraSelector] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const getAvailableCameras = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    let interval: number | undefined;
    if (isRecording) {
      interval = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval !== undefined) {
        window.clearInterval(interval);
      }
    };
  }, [isRecording]);

  const startCamera = useCallback(async () => {
    try {
      // Check if we're on a mobile device
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      let constraints;
      
      if (isMobile) {
        // On mobile, try back camera first
        try {
          constraints = {
            video: { 
              facingMode: 'environment',
              width: { ideal: 1280 },
              height: { ideal: 720 }
            },
            audio: true
          };
          const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
          setStream(mediaStream);
          setIsCameraActive(true);
          setError(null);
          return;
        } catch {
          // Back camera not available, try front/default camera
        }
      }
      
      // For desktop or fallback, use selected camera or any available camera
      if (selectedCamera && availableCameras.length > 1) {
        constraints = {
          video: {
            deviceId: { exact: selectedCamera },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: true
        };
      } else {
        constraints = {
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: true
        };
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setIsCameraActive(true);
      setError(null);
    } catch (err) {
      setError('Unable to access camera. Please check permissions and ensure camera is available.');
      // eslint-disable-next-line no-console
      console.error('Camera access error:', err);
    }
  }, [availableCameras.length, selectedCamera]);

  // Connect stream to video element when stream changes
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    getAvailableCameras();
    // Auto-start camera when component mounts
    const timer = setTimeout(() => {
      void startCamera();
    }, 500);
    return () => {
      clearTimeout(timer);
      stopCamera();
    };
  }, [getAvailableCameras, startCamera, stopCamera]);

  const startRecording = () => {
    if (stream && videoRef.current) {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        setRecordedVideo(videoUrl);
        setIsRecording(false);
        setRecordingTime(0);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const playVideo = () => {
    if (videoRef.current && recordedVideo) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const retakeVideo = () => {
    setRecordedVideo(null);
    setRecordingTime(0);
    if (videoRef.current) {
      videoRef.current.src = '';
    }
  };

  const saveVideo = () => {
    if (recordedVideo) {
      fetch(recordedVideo)
        .then(res => res.blob())
        .then(blob => {
          onVideoRecorded(blob);
          onClose();
        });
    }
  };

  const downloadVideo = () => {
    if (recordedVideo) {
      const link = document.createElement('a');
      link.download = `property-video-${Date.now()}.webm`;
      link.href = recordedVideo;
      link.click();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Record Video</h3>
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

        {/* Video View */}
        <div className="relative">
          {error ? (
            <div className="p-8 text-center">
              <div className="text-red-500 mb-4">
                <Video size={48} className="mx-auto" />
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
                <Video size={48} className="mx-auto" />
              </div>
              <p className="text-gray-600 mb-4">Camera not started</p>
              <button
                onClick={startCamera}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Start Camera
              </button>
            </div>
          ) : recordedVideo ? (
            <div className="p-4">
              <video
                ref={videoRef}
                src={recordedVideo}
                className="w-full h-64 object-cover rounded-lg"
                onEnded={() => setIsPlaying(false)}
              />
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={isPlaying ? pauseVideo : playVideo}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  <span className="ml-2">{isPlaying ? 'Pause' : 'Play'}</span>
                </button>
                <button
                  onClick={retakeVideo}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 flex items-center justify-center"
                >
                  <RotateCcw size={16} className="mr-2" />
                  Retake
                </button>
              </div>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={downloadVideo}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 flex items-center justify-center"
                >
                  <Download size={16} className="mr-2" />
                  Download
                </button>
                <button
                  onClick={saveVideo}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Use This Video
                </button>
              </div>
            </div>
          ) : (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 object-cover"
              />
              {isRecording && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-md text-sm">
                  {formatTime(recordingTime)}
                </div>
              )}
              <div className="p-4">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={!stream}
                  className={`w-full py-3 px-4 rounded-md font-medium flex items-center justify-center ${
                    isRecording
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  } disabled:bg-gray-400 disabled:cursor-not-allowed`}
                >
                  {isRecording ? (
                    <>
                      <Square size={20} className="mr-2" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Video size={20} className="mr-2" />
                      Start Recording
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Camera Selector */}
        {showCameraSelector && availableCameras.length > 1 && (
          <div className="absolute top-16 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-10">
            <div className="text-sm font-medium text-gray-700 mb-2">Select Camera:</div>
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

export default VideoRecorder; 