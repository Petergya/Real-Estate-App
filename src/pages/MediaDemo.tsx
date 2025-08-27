import React, { useState } from 'react';
import { Camera, Video, FileText, Upload, Image, File, Plus } from 'lucide-react';
import Sheet from '../components/Sheet';
import CameraComponent from '../components/Camera';
import VideoRecorder from '../components/VideoRecorder';

const MediaDemo: React.FC = () => {
  const [showSheet, setShowSheet] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showVideoRecorder, setShowVideoRecorder] = useState(false);
  const [mediaItems, setMediaItems] = useState<Array<{ type: string; data: string; name: string }>>([]);

  const handlePhotoTaken = (photoData: string) => {
    setMediaItems(prev => [...prev, { type: 'photo', data: photoData, name: `Photo ${prev.length + 1}` }]);
  };

  const handleVideoRecorded = (videoBlob: Blob) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const videoDataUrl = e.target?.result as string;
      setMediaItems(prev => [...prev, { type: 'video', data: videoDataUrl, name: `Video ${prev.length + 1}` }]);
    };
    reader.readAsDataURL(videoBlob);
  };

  const handleFileUploaded = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileDataUrl = e.target?.result as string;
      setMediaItems(prev => [...prev, { type: 'file', data: fileDataUrl, name: file.name }]);
    };
    reader.readAsDataURL(file);
  };

  const removeMediaItem = (index: number) => {
    setMediaItems(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Media Features Demo</h1>
          <p className="text-gray-600 mb-8">
            This page demonstrates the camera, video recording, and file upload capabilities of the app.
          </p>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => setShowCamera(true)}
              className="flex items-center justify-center p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Camera className="h-6 w-6 mr-2" />
              Take Photo
            </button>
            
            <button
              onClick={() => setShowVideoRecorder(true)}
              className="flex items-center justify-center p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Video className="h-6 w-6 mr-2" />
              Record Video
            </button>
            
            <button
              onClick={() => setShowSheet(true)}
              className="flex items-center justify-center p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="h-6 w-6 mr-2" />
              Add Media
            </button>
          </div>

          {/* Media Gallery */}
          {mediaItems.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Captured Media</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mediaItems.map((item, index) => (
                  <div key={index} className="bg-gray-100 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{item.name}</span>
                      <button
                        onClick={() => removeMediaItem(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                    
                    {item.type === 'photo' && (
                      <img
                        src={item.data}
                        alt={item.name}
                        className="w-full h-32 object-cover rounded-md"
                      />
                    )}
                    
                    {item.type === 'video' && (
                      <video
                        src={item.data}
                        controls
                        className="w-full h-32 object-cover rounded-md"
                      />
                    )}
                    
                    {item.type === 'file' && (
                      <div className="flex items-center justify-center h-32 bg-gray-200 rounded-md">
                        <FileText className="h-8 w-8 text-gray-500" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feature Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Camera Features</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Real-time camera access</li>
                <li>• Photo capture with preview</li>
                <li>• Download captured photos</li>
                <li>• Retake functionality</li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Video Features</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Video recording with audio</li>
                <li>• Recording timer display</li>
                <li>• Play/pause controls</li>
                <li>• Download recorded videos</li>
              </ul>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">Sheet Features</h3>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Slide-up panel interface</li>
                <li>• File upload support</li>
                <li>• Multiple file types</li>
                <li>• Organized media tabs</li>
              </ul>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-900 mb-2">File Support</h3>
              <ul className="text-sm text-orange-800 space-y-1">
                <li>• Images (JPG, PNG, etc.)</li>
                <li>• Videos (MP4, WebM, etc.)</li>
                <li>• Documents (PDF, DOC, etc.)</li>
                <li>• Any file type</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <CameraComponent
          onPhotoTaken={handlePhotoTaken}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* Video Recorder Modal */}
      {showVideoRecorder && (
        <VideoRecorder
          onVideoRecorded={handleVideoRecorded}
          onClose={() => setShowVideoRecorder(false)}
        />
      )}

      {/* Sheet Component */}
      <Sheet
        isOpen={showSheet}
        onClose={() => setShowSheet(false)}
        onPhotoTaken={handlePhotoTaken}
        onVideoRecorded={handleVideoRecorded}
        onFileUploaded={handleFileUploaded}
      />
    </div>
  );
};

export default MediaDemo; 