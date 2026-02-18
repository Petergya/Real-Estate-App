




import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProperty } from '../contexts/PropertyContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  MapPin, 
  DollarSign, 
  Bed, 
  Bath, 
  Square, 
  Car, 
  Phone, 
  Mail,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Wifi,
  Shield
} from 'lucide-react';

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getProperty } = useProperty();
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const navigate = useNavigate();

  const property = getProperty(id!);

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
          <Link to="/properties" className="text-blue-600 hover:text-blue-700">
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const amenityIcons: Record<string, string> = {
    'Swimming Pool': '🏊‍♂️',
    'Gym': '💪',
    '24/7 Security': '🛡️',
    'Generator': '⚡',
    'Elevator': '🛗',
    'Garden': '🌳',
    'Borehole': '💧',
    'Parking': '🚗',
    'WiFi': '📶'
  };

  const handleScheduleViewing = () => {
    navigate('/schedule', { 
      state: { 
        propertyId: property.id,
        propertyTitle: property.title,
        propertyImage: property.images[0]
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            to="/properties" 
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Properties
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="relative mb-8">
              <div className="relative h-96 rounded-lg overflow-hidden">
                <img
                  src={property.images[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Arrows */}
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {property.images.length}
                </div>

                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    property.status === 'for-sale' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {property.status === 'for-sale' ? 'For Sale' : 'For Rent'}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => setIsFavorited(!isFavorited)}
                    className={`p-2 rounded-full transition-colors ${
                      isFavorited 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Heart className="h-5 w-5" />
                  </button>
                  <button className="p-2 bg-white text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {property.images.length > 1 && (
                <div className="flex space-x-2 mt-4 overflow-x-auto">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                        index === currentImageIndex 
                          ? 'border-blue-500' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${property.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{property.title}</h1>
              
              <div className="flex items-center text-gray-600 mb-6">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{property.location.address}, {property.location.city}, {property.location.state}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {property.features.bedrooms && (
                  <div className="flex items-center">
                    <Bed className="h-5 w-5 text-gray-400 mr-2" />
                    <span>{property.features.bedrooms} Bedrooms</span>
                  </div>
                )}
                {property.features.bathrooms && (
                  <div className="flex items-center">
                    <Bath className="h-5 w-5 text-gray-400 mr-2" />
                    <span>{property.features.bathrooms} Bathrooms</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Square className="h-5 w-5 text-gray-400 mr-2" />
                  <span>{property.features.area} sqm</span>
                </div>
                {property.features.parking && (
                  <div className="flex items-center">
                    <Car className="h-5 w-5 text-gray-400 mr-2" />
                    <span>Parking</span>
                  </div>
                )}
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    {amenity === 'WiFi' ? (
                      <Wifi className="h-6 w-6 mr-3 text-gray-500" />
                    ) : amenity === '24/7 Security' ? (
                      <Shield className="h-6 w-6 mr-3 text-gray-500" />
                    ) : (
                      <span className="text-2xl mr-3">{amenityIcons[amenity] || '✓'}</span>
                    )}
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
              <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-2" />
                  <p>Interactive map would be displayed here</p>
                  <p className="text-sm">Coordinates: {property.location.coordinates.lat}, {property.location.coordinates.lng}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Price and Action */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-2">
                  <DollarSign className="h-6 w-6 text-green-600 mr-1" />
                  <span className="text-3xl font-bold text-gray-900">
                    ${property.price.usd.toLocaleString()}
                  </span>
                </div>
                <div className="text-lg text-gray-600">
                  ₦{property.price.ngn.toLocaleString()}
                </div>
                {property.status === 'for-rent' && (
                  <div className="text-sm text-gray-500">per month</div>
                )}
              </div>

              {user ? (
                <div className="space-y-3">
                  <Link
                    to={`/payment/${property.id}`}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors text-center block font-medium"
                  >
                    {property.status === 'for-sale' ? 'Buy Now' : 'Rent Now'}
                  </Link>
                  <button 
                    onClick={handleScheduleViewing}
                    className="w-full border border-blue-600 text-blue-600 py-3 px-4 rounded-md hover:bg-blue-50 transition-colors font-medium"
                  >
                    Schedule Viewing
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">Please login to proceed with purchase</p>
                  <Link
                    to="/login"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors text-center block font-medium"
                  >
                    Login to Continue
                  </Link>
                </div>
              )}
            </div>

            {/* Owner/Agent Contact */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              
              {/* Owner */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Property Owner</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{property.owner.name}</p>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{property.owner.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>{property.owner.email}</span>
                  </div>
                </div>
              </div>

              {/* Agent */}
              {property.agent && (
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Real Estate Agent</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{property.agent.name}</p>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{property.agent.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{property.agent.email}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Property Features */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Features</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Type</span>
                  <span className="font-medium capitalize">{property.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Furnished</span>
                  <span className="font-medium">{property.features.furnished ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pet Friendly</span>
                  <span className="font-medium">{property.features.petFriendly ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Parking</span>
                  <span className="font-medium">{property.features.parking ? 'Available' : 'Not Available'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Listed</span>
                  <span className="font-medium">
                    {new Date(property.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;