import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProperty } from '../contexts/PropertyContext';
import { MapPin, DollarSign, Bed, Bath, Square, Home } from 'lucide-react';

const TYPE_LABELS: Record<string, string> = {
  house: 'Houses',
  apartment: 'Apartments',
  land: 'Land',
  commercial: 'Commercial Properties'
};

const PropertyTypePage: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const { properties } = useProperty();

  const normalizedType = (type || '').toLowerCase();
  const heading = TYPE_LABELS[normalizedType];

  const filteredProperties = useMemo(
    () => properties.filter((p) => p.type === normalizedType),
    [properties, normalizedType]
  );

  if (!heading) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-ink mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-6">
            The property category you are looking for does not exist.
          </p>
          <Link
            to="/properties"
            className="inline-flex items-center px-4 py-2 bg-navy text-white rounded-md hover:bg-secondary transition-colors"
          >
            <Home className="h-4 w-4 mr-2" />
            Back to All Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-ink mb-2">{heading}</h1>
              <p className="text-lg text-gray-600">
                Showing {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'}
              </p>
            </div>
            <Link
              to="/properties"
              className="text-gold hover:text-secondary text-sm font-medium"
            >
              View all properties
            </Link>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4 space-y-1">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      property.status === 'for-sale'
                        ? 'bg-gold/15 text-navy'
                        : 'bg-light/70 text-accent'
                    }`}
                  >
                    {property.status === 'for-sale' ? 'For Sale' : 'For Rent'}
                  </span>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
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
                <div className="absolute top-4 right-4">
                  <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                    {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-ink mb-2 line-clamp-2">
                  {property.title}
                </h3>
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">
                    {property.location.address.split(',').pop()?.trim() || property.location.city}, {property.location.city}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-gold mr-1" />
                    <span className="text-xl font-bold text-gold">
                      ${property.price.usd.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    ₦{property.price.ngn.toLocaleString()}
                  </span>
                </div>

                {property.features.bedrooms && (
                  <div className="flex items-center text-sm text-gray-600 mb-4 space-x-4">
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1" />
                      <span>{property.features.bedrooms}</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-1" />
                      <span>{property.features.bathrooms}</span>
                    </div>
                    <div className="flex items-center">
                      <Square className="h-4 w-4 mr-1" />
                      <span>{property.features.area} sqm</span>
                    </div>
                  </div>
                )}

                <Link
                  to={`/property/${property.id}`}
                  className="w-full bg-navy text-white hover:text-white py-2 px-4 rounded-md hover:bg-secondary focus-visible:bg-secondary transition-colors text-center block"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              No {heading.toLowerCase()} found at the moment.
            </div>
            <Link
              to="/properties"
              className="text-gold hover:text-secondary font-medium"
            >
              Back to all properties
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyTypePage;
