




import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProperty } from '../contexts/PropertyContext';
import { useAuth } from '../contexts/AuthContext';
import MapView from '../components/MapView';
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
  Shield,
  Landmark,
  FileCheck,
  Map,
  TreePine
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
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-ink mb-4">Property Not Found</h2>
          <Link to="/properties" className="text-gold hover:text-secondary">
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
    <div className="min-h-screen bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            to="/properties" 
            className="flex items-center text-gold hover:text-secondary transition-colors"
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
                <div className="absolute top-4 left-4 space-y-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    property.status === 'for-sale' 
                      ? 'bg-gold/15 text-navy' 
                      : 'bg-light/70 text-accent'
                  }`}>
                    {property.status === 'for-sale' ? 'For Sale' : 'For Rent'}
                  </span>
                  <span
                    className={`block px-3 py-1 rounded-full text-xs font-medium ${
                      property.availabilityStatus === 'available'
                        ? 'bg-emerald-100 text-emerald-800'
                        : property.availabilityStatus === 'sold'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {property.availabilityStatus === 'available'
                      ? 'Available'
                      : property.availabilityStatus === 'sold'
                      ? 'Sold'
                      : 'Taken'}
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
                          ? 'border-primary' 
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
              <h1 className="text-3xl font-bold text-ink mb-4">{property.title}</h1>
              
              <div className="flex items-center text-gray-600 mb-6">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{property.location.address}, {property.location.city}</span>
              </div>

              {/* Features - different layout for land vs other property types */}
              {property.type === 'land' ? (
                <div className="space-y-4 mb-6">
                  <h3 className="text-lg font-semibold text-ink">Land Details</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center bg-gray-50 rounded-lg p-4">
                      <Landmark className="h-6 w-6 text-gold mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Land Size</p>
                        <p className="font-semibold text-ink">{property.features.area?.toLocaleString() || property.features.area} sqm</p>
                      </div>
                    </div>
                    <div className="flex items-center bg-gray-50 rounded-lg p-4">
                      <MapPin className="h-6 w-6 text-gold mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Location</p>
                        <p className="font-semibold text-ink">{property.location.address.split(',').pop()?.trim() || property.location.city}, {property.location.city}</p>
                      </div>
                    </div>
                    {property.plotType && (
                      <div className="flex items-center bg-gray-50 rounded-lg p-4">
                        <TreePine className="h-6 w-6 text-gold mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase">Plot Type</p>
                          <p className="font-semibold text-ink capitalize">{property.plotType}</p>
                        </div>
                      </div>
                    )}
                    {property.topography && (
                      <div className="flex items-center bg-gray-50 rounded-lg p-4">
                        <Square className="h-6 w-6 text-gold mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase">Topography</p>
                          <p className="font-semibold text-ink capitalize">{property.topography}</p>
                        </div>
                      </div>
                    )}
                    {property.hasSurveyPlan !== undefined && (
                      <div className="flex items-center bg-gray-50 rounded-lg p-4">
                        <FileCheck className="h-6 w-6 text-gold mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase">Survey Plan</p>
                          <p className="font-semibold text-ink">{property.hasSurveyPlan ? 'Available' : 'Not Available'}</p>
                        </div>
                      </div>
                    )}
                    {property.hasCOO !== undefined && (
                      <div className="flex items-center bg-gray-50 rounded-lg p-4">
                        <FileCheck className="h-6 w-6 text-gold mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase">C of O</p>
                          <p className="font-semibold text-ink">{property.hasCOO ? 'Available' : 'Not Available'}</p>
                        </div>
                      </div>
                    )}
                    {property.accessRoad !== undefined && (
                      <div className="flex items-center bg-gray-50 rounded-lg p-4">
                        <Map className="h-6 w-6 text-gold mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase">Access Road</p>
                          <p className="font-semibold text-ink">{property.accessRoad ? 'Yes' : 'No'}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {property.features.bedrooms != null && (
                    <div className="flex items-center">
                      <Bed className="h-5 w-5 text-gray-400 mr-2" />
                      <span>{property.features.bedrooms} Bedrooms</span>
                    </div>
                  )}
                  {property.features.bathrooms != null && (
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
              )}

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-ink mb-4">Description</h3>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>
            </div>

            {/* Amenities / Land Features */}
            {property.amenities.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="text-lg font-semibold text-ink mb-4">
                  {property.type === 'land' ? 'Land Features & Documents' : 'Amenities'}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      {amenity === 'WiFi' ? (
                        <Wifi className="h-6 w-6 mr-3 text-gray-500" />
                      ) : amenity === '24/7 Security' ? (
                        <Shield className="h-6 w-6 mr-3 text-gray-500" />
                      ) : property.type === 'land' && (amenity.includes('Survey') || amenity.includes('Certificate')) ? (
                        <FileCheck className="h-6 w-6 mr-3 text-gray-500" />
                      ) : property.type === 'land' && amenity.includes('Road') ? (
                        <Map className="h-6 w-6 mr-3 text-gray-500" />
                      ) : (
                        <span className="text-2xl mr-3">{amenityIcons[amenity] || '✓'}</span>
                      )}
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map - larger for land properties */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-ink mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-gold" />
                Location & Map
                {property.type === 'land' && (
                  <span className="ml-2 text-sm font-normal text-gray-500">— View exact plot location</span>
                )}
              </h3>
              <MapView
                properties={[property]}
                center={{
                  lat: property.location.coordinates.lat || 9.8965,
                  lng: property.location.coordinates.lng || 8.8583
                }}
                zoom={property.type === 'land' ? 15 : 14}
                height={property.type === 'land' ? '360px' : '256px'}
                showPropertyLabels
              />
              <div className="mt-3 text-sm text-gray-500">
                Coordinates: {property.location.coordinates.lat}, {property.location.coordinates.lng}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Price and Action */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-2">
                  <DollarSign className="h-6 w-6 text-gold mr-1" />
                  <span className="text-3xl font-bold text-gold">
                    ${property.price.usd.toLocaleString()}
                  </span>
                </div>
                <div className="text-lg text-gray-600">
                  ₦{property.price.ngn.toLocaleString()}
                </div>
                {property.status === 'for-rent' && (
                  <div className="text-sm text-gray-500">per month</div>
                )}
                <div className="mt-2 text-sm">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      property.availabilityStatus === 'available'
                        ? 'bg-emerald-100 text-emerald-800'
                        : property.availabilityStatus === 'sold'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {property.availabilityStatus === 'available'
                      ? 'Available'
                      : property.availabilityStatus === 'sold'
                      ? 'Sold'
                      : 'Taken'}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    if (!user) {
                      navigate('/login', { state: { message: 'Please sign in or create an account to proceed with payment.', from: `/property/${property.id}` } });
                      return;
                    }
                    if (property.availabilityStatus === 'available') {
                      navigate(`/payment/${property.id}`);
                    }
                  }}
                  disabled={property.availabilityStatus !== 'available'}
                  className={`w-full py-3 px-4 rounded-md text-center block font-medium transition-colors ${
                    property.availabilityStatus === 'available'
                      ? 'bg-navy text-white hover:bg-secondary'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {property.availabilityStatus === 'sold'
                    ? 'Sold'
                    : property.availabilityStatus === 'taken'
                    ? 'Taken'
                    : property.status === 'for-sale'
                    ? 'Buy Now'
                    : 'Rent Now'}
                </button>
                <button 
                  onClick={() => {
                    if (!user) {
                      navigate('/login', { state: { message: 'Please sign in to schedule a viewing.', from: `/property/${property.id}` } });
                      return;
                    }
                    handleScheduleViewing();
                  }}
                  className="w-full border border-gold text-gold py-3 px-4 rounded-md hover:bg-gold/10 transition-colors font-medium"
                >
                  Schedule Viewing
                </button>
              </div>
            </div>

            {/* Owner/Agent Contact */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-ink mb-4">Contact Information</h3>
              
              {/* Owner */}
              <div className="mb-4">
                <h4 className="font-medium text-ink mb-2">Property Owner</h4>
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
                  <h4 className="font-medium text-ink mb-2">Real Estate Agent</h4>
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
              <h3 className="text-lg font-semibold text-ink mb-4">
                {property.type === 'land' ? 'Land Summary' : 'Property Features'}
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Type</span>
                  <span className="font-medium capitalize">{property.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{property.type === 'land' ? 'Land Size' : 'Area'}</span>
                  <span className="font-medium">{property.features.area?.toLocaleString() || property.features.area} sqm</span>
                </div>
                {property.type === 'land' ? (
                  <>
                    {property.plotType && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Plot Type</span>
                        <span className="font-medium capitalize">{property.plotType}</span>
                      </div>
                    )}
                    {property.topography && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Topography</span>
                        <span className="font-medium capitalize">{property.topography}</span>
                      </div>
                    )}
                    {property.hasSurveyPlan !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Survey Plan</span>
                        <span className="font-medium">{property.hasSurveyPlan ? 'Yes' : 'No'}</span>
                      </div>
                    )}
                    {property.hasCOO !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">C of O</span>
                        <span className="font-medium">{property.hasCOO ? 'Yes' : 'No'}</span>
                      </div>
                    )}
                    {property.accessRoad !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Access Road</span>
                        <span className="font-medium">{property.accessRoad ? 'Yes' : 'No'}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
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
                  </>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-200">
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