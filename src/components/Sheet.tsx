import React, { useState } from 'react';
import { X, Camera, Video, FileText, Upload, Image, File } from 'lucide-react';
import VideoRecorder from './VideoRecorder';

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoTaken?: (photoData: string) => void;
  onVideoRecorded?: (videoBlob: Blob) => void;
  onFileUploaded?: (file: File) => void;
}

const Sheet: React.FC<SheetProps> = ({ 
  isOpen, 
  onClose, 
  onPhotoTaken, 
  onVideoRecorded, 
  onFileUploaded 
}) => {
  const [activeTab, setActiveTab] = useState<'media' | 'documents'>('media');
  const [showCamera, setShowCamera] = useState(false);
  const [showVideoRecorder, setShowVideoRecorder] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onFileUploaded) {
      onFileUploaded(file);
      onClose();
    }
  };

  const handlePhotoTaken = (photoData: string) => {
    if (onPhotoTaken) {
      onPhotoTaken(photoData);
    }
    setShowCamera(false);
    onClose();
  };

  const handleVideoRecorded = (videoBlob: Blob) => {
    if (onVideoRecorded) {
      onVideoRecorded(videoBlob);
    }
    setShowVideoRecorder(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 transform transition-transform duration-300 ease-out">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Add Media</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('media')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'media'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Media
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'documents'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Documents
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'media' ? (
            <div className="space-y-4">
              {/* Camera */}
              <button
                onClick={() => setShowCamera(true)}
                className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Camera className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-900">Take Photo</h4>
                  <p className="text-sm text-gray-500">Capture a new photo</p>
                </div>
              </button>

              {/* Video Recording */}
              <button
                onClick={() => setShowVideoRecorder(true)}
                className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <Video className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-900">Record Video</h4>
                  <p className="text-sm text-gray-500">Record a new video</p>
                </div>
              </button>

              {/* Upload Image */}
              <label className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <Upload className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-900">Upload Image</h4>
                  <p className="text-sm text-gray-500">Choose from gallery</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Upload Video */}
              <label className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <Video className="h-6 w-6 text-orange-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-900">Upload Video</h4>
                  <p className="text-sm text-gray-500">Choose from gallery</p>
                </div>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Upload Document */}
              <label className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <FileText className="h-6 w-6 text-red-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-900">Upload Document</h4>
                  <p className="text-sm text-gray-500">PDF, DOC, or other files</p>
                </div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Upload Image */}
              <label className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Image className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-900">Upload Image</h4>
                  <p className="text-sm text-gray-500">JPG, PNG, or other images</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Upload Any File */}
              <label className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                  <File className="h-6 w-6 text-gray-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-900">Upload Any File</h4>
                  <p className="text-sm text-gray-500">Any file type</p>
                </div>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        {/* Bottom padding for safe area */}
        <div className="h-6"></div>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <Camera
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
    </>
  );
};

export default Sheet; 