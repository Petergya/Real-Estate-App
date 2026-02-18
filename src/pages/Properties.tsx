import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProperty } from '../contexts/PropertyContext';
import type { PropertyFilters } from '../contexts/PropertyContext';
import { MapPin, DollarSign, Bed, Bath, Square, Map } from 'lucide-react';
import SearchFilters from '../components/SearchFilters';

const Properties: React.FC = () => {
  const { properties } = useProperty();
  const [filters, setFilters] = useState<PropertyFilters>({ amenities: [] });

  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      if (filters.search && !property.title.toLowerCase().includes(filters.search.toLowerCase()) &&
          !property.location.city.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.type && property.type !== filters.type) return false;
      if (filters.status && property.status !== filters.status) return false;
      if (filters.minPrice && property.price.usd < parseInt(filters.minPrice)) return false;
      if (filters.maxPrice && property.price.usd > parseInt(filters.maxPrice)) return false;
      if (filters.bedrooms && property.features.bedrooms !== parseInt(filters.bedrooms)) return false;
      if (filters.location && !property.location.city.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters.furnished && property.features.furnished !== (filters.furnished === 'true')) return false;
      if (filters.amenities && filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(amenity => 
          property.amenities.includes(amenity)
        );
        if (!hasAllAmenities) return false;
      }
      return true;
    });
  }, [properties, filters]);

  const handleSearch = (newFilters: PropertyFilters) => {
    setFilters(newFilters);
  };


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Properties</h1>
          <p className="text-lg text-gray-600">
            Showing {filteredProperties.length} of {properties.length} properties
          </p>
            </div>
            <Link
              to="/properties/map"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Map className="h-4 w-4 mr-2" />
              Map View
            </Link>
          </div>
        </div>

        {/* Search and Filters */}








        <div className="mb-8">
          <SearchFilters onSearch={handleSearch} initialFilters={filters} />
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    property.status === 'for-sale' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {property.status === 'for-sale' ? 'For Sale' : 'For Rent'}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                    {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{property.title}</h3>
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{property.location.city}, {property.location.state}</span>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-green-600 mr-1" />
                    <span className="text-xl font-bold text-gray-900">
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
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-center block"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">No properties found matching your criteria</div>
            <button 
              onClick={() => handleSearch({})}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filters to see all properties
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;