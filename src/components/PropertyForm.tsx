import React, { useState } from 'react';
import { useProperty } from '../contexts/PropertyContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  MapPin, 
  DollarSign, 
  Home, 
  Plus, 
  X,
  Camera,
  Video,
  Check,
  ImagePlus
} from 'lucide-react';
import toast from 'react-hot-toast';
import Sheet from './Sheet';

import type { Property } from '../contexts/PropertyContext';

interface PropertyFormProps {
  onClose?: () => void;
  editProperty?: Property;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ onClose, editProperty }) => {
  const { addProperty, updateProperty } = useProperty();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: editProperty?.title || '',
    description: editProperty?.description || '',
    price: {
      usd: editProperty?.price.usd || '',
      ngn: editProperty?.price.ngn || ''
    },
    type: editProperty?.type || 'apartment',
    status: editProperty?.status || 'for-sale',
    availabilityStatus: editProperty?.availabilityStatus || 'available',
    location: {
      address: editProperty?.location.address || '',
      city: editProperty?.location.city || '',
      state: editProperty?.location.state || '',
      coordinates: {
        lat: editProperty?.location.coordinates.lat || '',
        lng: editProperty?.location.coordinates.lng || ''
      }
    },
    features: {
      bedrooms: editProperty?.features.bedrooms || '',
      bathrooms: editProperty?.features.bathrooms || '',
      area: editProperty?.features.area || '',
      furnished: editProperty?.features.furnished || false,
      petFriendly: editProperty?.features.petFriendly || false,
      parking: editProperty?.features.parking || false
    },
    amenities: editProperty?.amenities || [],
    images: editProperty?.images || [],
    plotType: editProperty?.plotType || '',
    topography: editProperty?.topography || '',
    hasSurveyPlan: editProperty?.hasSurveyPlan || false,
    hasCOO: editProperty?.hasCOO || false,
    accessRoad: editProperty?.accessRoad ?? true
  });

  const [newAmenity, setNewAmenity] = useState('');
  const [imageUrls, setImageUrls] = useState('');
  const [showSheet, setShowSheet] = useState(false);

  const amenityOptions = formData.type === 'land'
    ? [
        'Survey Plan', 'Certificate of Occupancy', 'Access Road', 'Fenced',
        'Near Tarred Road', 'Natural Water Source', 'Fenced Perimeter', 'Electricity Available'
      ]
    : [
        'Swimming Pool', 'Gym', '24/7 Security', 'Generator', 'Elevator',
        'Garden', 'Borehole', 'WiFi', 'Air Conditioning', 'Balcony',
        'Garage', 'Playground', 'CCTV', 'Intercom', 'Solar Power'
      ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const nextValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    if (!name.includes('.')) {
      setFormData(prev => ({
        ...prev,
        [name]: nextValue
      }));
      return;
    }

    const keys = name.split('.');
    setFormData(prev => {
      const next: any = { ...prev };
      let cursor: any = next;

      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        const existing = cursor?.[k];
        cursor[k] = typeof existing === 'object' && existing !== null ? { ...existing } : {};
        cursor = cursor[k];
      }

      cursor[keys[keys.length - 1]] = nextValue;
      return next;
    });
  };


  const addAmenity = (amenity: string) => {
    if (amenity && !formData.amenities.includes(amenity)) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenity]
      }));
    }
    setNewAmenity('');
  };

  const removeAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((a: string) => a !== amenity)
    }));
  };

  const addImages = () => {
    if (imageUrls.trim()) {
      const urls = imageUrls.split('\n').map(url => url.trim()).filter(url => url);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...urls]
      }));
      setImageUrls('');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_: string, i: number) => i !== index)
    }));
  };

  const handlePhotoTaken = (photoData: string) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, photoData]
    }));
    toast.success('Photo added successfully!');
  };

  const handleVideoRecorded = (videoBlob: Blob) => {
    // Convert video blob to data URL for storage
    const reader = new FileReader();
    reader.onload = (e) => {
      const videoDataUrl = e.target?.result as string;
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, videoDataUrl]
      }));
      toast.success('Video added successfully!');
    };
    reader.readAsDataURL(videoBlob);
  };

  const handleFileUploaded = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileDataUrl = e.target?.result as string;
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, fileDataUrl]
      }));
      toast.success(`${file.type.startsWith('image/') ? 'Image' : 'File'} uploaded successfully!`);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to add a property');
      return;
    }

    // Validation
    if (!formData.title || !formData.description || !formData.price.usd) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.images.length === 0) {
      toast.error('Please add at least one image');
      return;
    }

    const { plotType, topography, hasSurveyPlan, hasCOO, accessRoad, ...restFormData } = formData;
    const propertyData = {
      ...restFormData,
      price: {
        usd: parseFloat(formData.price.usd.toString()),
        ngn: parseFloat(formData.price.ngn.toString()) || parseFloat(formData.price.usd.toString()) * 1600
      },
      features: {
        ...formData.features,
        bedrooms: formData.features.bedrooms ? parseInt(formData.features.bedrooms.toString()) : undefined,
        bathrooms: formData.features.bathrooms ? parseInt(formData.features.bathrooms.toString()) : undefined,
        area: parseFloat(formData.features.area.toString())
      },
      location: {
        ...formData.location,
        coordinates: {
          lat: parseFloat(formData.location.coordinates.lat.toString()) || 9.8965,
          lng: parseFloat(formData.location.coordinates.lng.toString()) || 8.8583
        }
      },
      owner: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || ''
      },
      ...(formData.type === 'land' && {
        plotType: (plotType || undefined) as 'residential' | 'commercial' | 'agricultural' | 'mixed' | undefined,
        topography: (topography || undefined) as 'flat' | 'sloping' | 'hilly' | undefined,
        hasSurveyPlan,
        hasCOO,
        accessRoad
      }),
      agent: user.role === 'agent' ? {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        commission: 10
      } : undefined
    };

    try {
      const payload = propertyData as Omit<Property, 'id' | 'createdAt' | 'updatedAt'>;
      if (editProperty) {
        updateProperty(editProperty.id, payload);
        toast.success('Property updated successfully!');
      } else {
        addProperty(payload);
        toast.success('Property added successfully!');
      }
      
      if (onClose) {
        onClose();
      } else {
        navigate('/dashboard');
      }
    } catch {
      toast.error('Failed to save property. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-ink">
          {editProperty ? 'Edit Property' : 'Add New Property'}
        </h2>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-semibold text-ink mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="e.g., Luxury 3-Bedroom Apartment in Rayfield, Jos"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
                required
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="land">Land</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Listing Type *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
                required
              >
                <option value="for-sale">For Sale</option>
                <option value="for-rent">For Rent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Availability *
              </label>
              <select
                name="availabilityStatus"
                value={formData.availabilityStatus}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
                required
              >
                <option value="available">Available</option>
                <option value="taken">Taken</option>
                <option value="sold">Sold</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (USD) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  name="price.usd"
                  value={formData.price.usd}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="250000"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (NGN)
              </label>
              <input
                type="number"
                name="price.ngn"
                value={formData.price.ngn}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="Auto-calculated if empty"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="Describe the property features, location benefits, and unique selling points..."
                required
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <h3 className="text-lg font-semibold text-ink mb-4">Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="location.address"
                  value={formData.location.address}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="15 Rayfield Road, Rayfield"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                name="location.city"
                value={formData.location.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="Jos"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State *
              </label>
              <input
                type="text"
                name="location.state"
                value={formData.location.state}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="Plateau"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                name="location.coordinates.lat"
                value={formData.location.coordinates.lat}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="9.8965"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                name="location.coordinates.lng"
                value={formData.location.coordinates.lng}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="8.8583"
              />
            </div>
          </div>
        </div>

        {/* Property Features */}
        <div>
          <h3 className="text-lg font-semibold text-ink mb-4">Property Features</h3>
          {formData.type === 'land' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plot Type</label>
                  <select
                    name="plotType"
                    value={formData.plotType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
                  >
                    <option value="">Select plot type</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="agricultural">Agricultural</option>
                    <option value="mixed">Mixed Use</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Topography</label>
                  <select
                    name="topography"
                    value={formData.topography}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
                  >
                    <option value="">Select topography</option>
                    <option value="flat">Flat</option>
                    <option value="sloping">Sloping</option>
                    <option value="hilly">Hilly</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area (sqm) *</label>
                <input
                  type="number"
                  name="features.area"
                  value={formData.features.area}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="500"
                  required
                  min="1"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="hasSurveyPlan"
                    checked={formData.hasSurveyPlan}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Survey Plan Available</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="hasCOO"
                    checked={formData.hasCOO}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Certificate of Occupancy</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="accessRoad"
                    checked={formData.accessRoad}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Access Road</span>
                </label>
              </div>
            </div>
          ) : (
          <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bedrooms
              </label>
              <input
                type="number"
                name="features.bedrooms"
                value={formData.features.bedrooms}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="3"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bathrooms
              </label>
              <input
                type="number"
                name="features.bathrooms"
                value={formData.features.bathrooms}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="2"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Area (sqm) *
              </label>
              <input
                type="number"
                name="features.area"
                value={formData.features.area}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="120"
                required
                min="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="features.furnished"
                checked={formData.features.furnished}
                onChange={handleInputChange}
                className="h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Furnished</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="features.petFriendly"
                checked={formData.features.petFriendly}
                onChange={handleInputChange}
                className="h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Pet Friendly</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="features.parking"
                checked={formData.features.parking}
                onChange={handleInputChange}
                className="h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Parking Available</span>
            </label>
          </div>
          </>
          )}
        </div>

        {/* Amenities */}
        <div>
          <h3 className="text-lg font-semibold text-ink mb-4">Amenities</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
            {amenityOptions.map((amenity) => (
              <button
                key={amenity}
                type="button"
                onClick={() => addAmenity(amenity)}
                className={`p-2 text-sm border rounded-md transition-colors ${
                  formData.amenities.includes(amenity)
                    ? 'bg-light/70 border-primary text-accent'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {formData.amenities.includes(amenity) && (
                  <Check className="h-4 w-4 inline mr-1" />
                )}
                {amenity}
              </button>
            ))}
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              value={newAmenity}
              onChange={(e) => setNewAmenity(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
              placeholder="Add custom amenity"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity(newAmenity))}
            />
            <button
              type="button"
              onClick={() => addAmenity(newAmenity)}
              className="px-4 py-2 bg-navy text-white rounded-md hover:bg-secondary transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {formData.amenities.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Selected Amenities:</p>
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((amenity: string) => (
                  <span
                    key={amenity}
                    className="inline-flex items-center px-3 py-1 bg-light/70 text-accent text-sm rounded-full"
                  >
                    {amenity}
                    <button
                      type="button"
                      onClick={() => removeAmenity(amenity)}
                      className="ml-2 text-primary hover:text-accent"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Images */}
        <div>
          <h3 className="text-lg font-semibold text-ink mb-4">Property Images *</h3>
          
          <div className="space-y-4">
            {/* Media Upload Options */}
            <div className="flex flex-wrap gap-3 mb-4">
              <button
                type="button"
                onClick={() => setShowSheet(true)}
                className="flex items-center px-4 py-2 bg-navy text-white rounded-md hover:bg-secondary transition-colors"
              >
                <ImagePlus className="h-5 w-5 mr-2" />
                Add Media
              </button>
              <button
                type="button"
                onClick={() => setShowSheet(true)}
                className="flex items-center px-4 py-2 bg-navy text-white rounded-md hover:bg-secondary transition-colors"
              >
                <Camera className="h-5 w-5 mr-2" />
                Take Photo
              </button>
              <button
                type="button"
                onClick={() => setShowSheet(true)}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                <Video className="h-5 w-5 mr-2" />
                Record Video
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URLs (one per line)
              </label>
              <textarea
                value={imageUrls}
                onChange={(e) => setImageUrls(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg
https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg"
              />
              <button
                type="button"
                onClick={addImages}
                className="mt-2 px-4 py-2 bg-navy text-white rounded-md hover:bg-secondary transition-colors flex items-center"
              >
                <Upload className="h-4 w-4 mr-2" />
                Add Images
              </button>
            </div>

            {formData.images.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Property Images ({formData.images.length}):
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image: string, index: number) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Property ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2 bg-navy text-white rounded-md hover:bg-secondary transition-colors flex items-center"
          >
            <Home className="h-4 w-4 mr-2" />
            {editProperty ? 'Update Property' : 'Add Property'}
          </button>
        </div>
      </form>

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

export default PropertyForm;