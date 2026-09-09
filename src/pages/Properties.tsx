import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProperty } from '../contexts/PropertyContext';
import type { PropertyFilters } from '../contexts/PropertyContext';
import { MapPin, DollarSign, Bed, Bath, Square, Map, ChevronLeft, ChevronRight } from 'lucide-react';
import SearchFilters from '../components/SearchFilters';

const Properties: React.FC = () => {
  const { properties } = useProperty();
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [filters, setFilters] = useState<PropertyFilters>(() => {
    const amenitiesParam = searchParams.get('amenities');
    return {
      search: searchParams.get('search') || '',
      location: searchParams.get('location') || '',
      type: searchParams.get('type') || '',
      status: searchParams.get('status') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      bedrooms: searchParams.get('bedrooms') || '',
      bathrooms: searchParams.get('bathrooms') || '',
      minArea: searchParams.get('minArea') || '',
      maxArea: searchParams.get('maxArea') || '',
      furnished: searchParams.get('furnished') || '',
      petFriendly: searchParams.get('petFriendly') || '',
      parking: searchParams.get('parking') || '',
      amenities: amenitiesParam ? amenitiesParam.split(',').filter(Boolean) : [],
    };
  });

  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      // Text search across title and city
      if (
        filters.search &&
        !property.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !property.location.city.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      // Basic category filters
      if (filters.type && property.type !== filters.type) return false;
      if (filters.status && property.status !== filters.status) return false;

      // Price range
      if (filters.minPrice && property.price.usd < parseInt(filters.minPrice, 10)) return false;
      if (filters.maxPrice && property.price.usd > parseInt(filters.maxPrice, 10)) return false;

      // Bedrooms / bathrooms
      if (filters.bedrooms && property.features.bedrooms !== parseInt(filters.bedrooms, 10)) return false;
      if (filters.bathrooms && property.features.bathrooms !== parseInt(filters.bathrooms, 10)) return false;

      // Area range
      if (filters.minArea && property.features.area < parseInt(filters.minArea, 10)) return false;
      if (filters.maxArea && property.features.area > parseInt(filters.maxArea, 10)) return false;

      // Location text (city/state)
      if (
        filters.location &&
        !`${property.location.city} ${property.location.state}`
          .toLowerCase()
          .includes(filters.location.toLowerCase())
      ) {
        return false;
      }

      // Furnished / pet friendly / parking
      if (filters.furnished && property.features.furnished !== (filters.furnished === 'true')) return false;
      if (filters.petFriendly && property.features.petFriendly !== (filters.petFriendly === 'true')) return false;
      if (filters.parking && property.features.parking !== (filters.parking === 'true')) return false;

      // Amenities (must include all selected)
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
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  return (
    <div className="min-h-screen bg-light py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-ink mb-4">Properties</h1>
          <p className="text-lg text-gray-600">
            Showing {filteredProperties.length} of {properties.length} properties
          </p>
            </div>
            <Link
              to="/properties/map"
              className="flex items-center px-4 py-2 bg-navy text-white rounded-md hover:bg-secondary transition-colors"
            >
              <Map className="h-4 w-4 mr-2" />
              Map View
            </Link>
          </div>
        </div>

        {/* Quick category links */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-3">
            <Link
              to="/properties/type/house"
              className="inline-flex items-center px-3 py-1.5 rounded-full text-sm border border-gray-300 text-gray-700 hover:border-primary hover:text-primary transition-colors"
            >
              Houses
            </Link>
            <Link
              to="/properties/type/apartment"
              className="inline-flex items-center px-3 py-1.5 rounded-full text-sm border border-gray-300 text-gray-700 hover:border-primary hover:text-primary transition-colors"
            >
              Apartments
            </Link>
            <Link
              to="/properties/type/land"
              className="inline-flex items-center px-3 py-1.5 rounded-full text-sm border border-gray-300 text-gray-700 hover:border-primary hover:text-primary transition-colors"
            >
              Land
            </Link>
            <Link
              to="/properties/type/commercial"
              className="inline-flex items-center px-3 py-1.5 rounded-full text-sm border border-gray-300 text-gray-700 hover:border-primary hover:text-primary transition-colors"
            >
              Commercial
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <SearchFilters onSearch={handleSearch} initialFilters={filters} />
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium w-fit ${
                    property.status === 'for-sale' 
                      ? 'bg-gold/15 text-navy' 
                      : 'bg-light/70 text-accent'
                  }`}>
                    {property.status === 'for-sale' ? 'For Sale' : 'For Rent'}
                  </span>
                  {property.availabilityStatus !== 'available' && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium w-fit shadow-sm ${
                        property.availabilityStatus === 'sold'
                          ? 'bg-red-500 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {property.availabilityStatus === 'sold' ? 'Sold' : 'Taken'}
                    </span>
                  )}
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                    {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-ink mb-2 line-clamp-2">{property.title}</h3>
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{property.location.address.split(',').pop()?.trim() || property.location.city}, {property.location.city}</span>
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
                  className="w-full bg-gold text-navy py-2 px-4 rounded-md hover:bg-gold/90 transition-colors text-center block"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Setup */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center space-x-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'} transition-colors`}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <span className="text-gray-700 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'} transition-colors`}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        )}

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">No properties found matching your criteria</div>
            <button 
              onClick={() => handleSearch({})}
              className="text-primary hover:text-accent font-medium"
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