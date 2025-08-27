// import React, { useState, useMemo } from 'react';
// import { useProperty } from '../contexts/PropertyContext';
// import MapView from '../components/MapView';
// import SearchFilters from '../components/SearchFilters';
// import { Property } from '../contexts/PropertyContext';
// import { List, Map, Filter } from 'lucide-react';
// import { Link } from 'react-router-dom';

// const PropertiesMap: React.FC = () => {
//   const { properties } = useProperty();
//   const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
//   const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
//   const [showFilters, setShowFilters] = useState(false);
//   const [filters, setFilters] = useState({});

//   const filteredProperties = useMemo(() => {
//     return properties.filter(property => {
//       // Apply filters logic here
//       const search = (filters as any).search;
//       if (
//         search &&
//         !property.title.toLowerCase().includes(search.toLowerCase()) &&
//         !property.location.city.toLowerCase().includes(search.toLowerCase())
//       ) {
//         return false;
//       }
//       const type = (filters as any).type;
//       if (type && property.type !== type) return false;
//       if ((filters as any).status && property.status !== (filters as any).status) return false;
//       if ((filters as any).minPrice && property.price.usd < parseInt((filters as any).minPrice)) return false;
//       if ((filters as any).maxPrice && property.price.usd > parseInt((filters as any).maxPrice)) return false;
//       if ((filters as any).bedrooms && property.features.bedrooms !== parseInt((filters as any).bedrooms)) return false;
//       if ((filters as any).location && !property.location.city.toLowerCase().includes((filters as any).location.toLowerCase())) return false;
//       if ((filters as any).furnished && property.features.furnished !== ((filters as any).furnished === 'true')) return false;
//       if ((filters as any).amenities && Array.isArray((filters as any).amenities) && (filters as any).amenities.length > 0) {
//         const hasAllAmenities = (filters as any).amenities.every((amenity: string) => 
//           property.amenities.includes(amenity)
//         );
//         if (!hasAllAmenities) return false;
//       }
//       return true;
//     });
//   }, [properties, filters]);

//   const handleSearch = (newFilters: any) => {
//     setFilters(newFilters);
//   };

//   const mapCenter = useMemo(() => {
//     if (filteredProperties.length === 0) {
//       return { lat: 6.5244, lng: 3.3792 }; // Lagos, Nigeria
//     }
    
//     const avgLat = filteredProperties.reduce((sum, p) => sum + p.location.coordinates.lat, 0) / filteredProperties.length;
//     const avgLng = filteredProperties.reduce((sum, p) => sum + p.location.coordinates.lng, 0) / filteredProperties.length;
    
//     return { lat: avgLat, lng: avgLng };
//   }, [filteredProperties]);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="mb-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Property Map</h1>
//               <p className="text-gray-600 mt-2">
//                 Explore {filteredProperties.length} properties on the map
//               </p>
//             </div>
            
//             <div className="flex items-center space-x-4">
//               {/* View Toggle */}
//               <div className="flex bg-gray-100 rounded-lg p-1">
//                 <button
//                   onClick={() => setViewMode('map')}
//                   className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
//                     viewMode === 'map'
//                       ? 'bg-white text-gray-900 shadow-sm'
//                       : 'text-gray-600 hover:text-gray-900'
//                   }`}
//                 >
//                   <Map className="h-4 w-4 mr-2" />
//                   Map
//                 </button>
//                 <button
//                   onClick={() => setViewMode('list')}
//                   className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
//                     viewMode === 'list'
//                       ? 'bg-white text-gray-900 shadow-sm'
//                       : 'text-gray-600 hover:text-gray-900'
//                   }`}
//                 >
//                   <List className="h-4 w-4 mr-2" />
//                   List
//                 </button>
//               </div>

//               {/* Filter Toggle */}
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
//               >
//                 <Filter className="h-4 w-4 mr-2" />
//                 Filters
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Search Filters */}
//         {showFilters && (
//           <div className="mb-6">
//             <SearchFilters onSearch={handleSearch} initialFilters={filters} />
//           </div>
//         )}

//         {/* Content */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Map View */}
//           <div className={`${viewMode === 'map' ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
//             {viewMode === 'map' ? (
//               <MapView
//                 properties={filteredProperties}
//                 selectedProperty={selectedProperty}
//                 onPropertySelect={setSelectedProperty}
//                 center={mapCenter}
//                 height="600px"
//               />
//             ) : (
//               /* List View */
//               <div className="space-y-4">
//                 {filteredProperties.map((property) => (
//                   <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
//                     <div className="flex">
//                       <div className="w-48 h-32 flex-shrink-0">
//                         <img
//                           src={property.images[0]}
//                           alt={property.title}
//                           className="w-full h-full object-cover"
//                         />
//                       </div>
//                       <div className="flex-1 p-4">
//                         <div className="flex items-start justify-between">
//                           <div className="flex-1">
//                             <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                               {property.title}
//                             </h3>
//                             <p className="text-gray-600 mb-2">{property.location.address}</p>
//                             <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
//                               {property.features.bedrooms && (
//                                 <span>{property.features.bedrooms} beds</span>
//                               )}
//                               {property.features.bathrooms && (
//                                 <span>{property.features.bathrooms} baths</span>
//                               )}
//                               <span>{property.features.area} sqm</span>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                               <span className={`px-2 py-1 text-xs font-medium rounded-full ${
//                                 property.status === 'for-sale'
//                                   ? 'bg-green-100 text-green-800'
//                                   : 'bg-blue-100 text-blue-800'
//                               }`}>
//                                 {property.status === 'for-sale' ? 'For Sale' : 'For Rent'}
//                               </span>
//                               <span className="text-xs text-gray-500 capitalize">
//                                 {property.type}
//                               </span>
//                             </div>
//                           </div>
//                           <div className="text-right ml-4">
//                             <div className="text-xl font-bold text-gray-900">
//                               ${property.price.usd.toLocaleString()}
//                             </div>
//                             <div className="text-sm text-gray-500">
//                               ₦{property.price.ngn.toLocaleString()}
//                             </div>
//                             <Link
//                               to={`/property/${property.id}`}
//                               className="mt-2 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
//                             >
//                               View Details
//                             </Link>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
                
//                 {filteredProperties.length === 0 && (
//                   <div className="text-center py-12">
//                     <Map className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                     <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
//                     <p className="text-gray-600">Try adjusting your search filters</p>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Property Details Sidebar (Map View Only) */}
//           {viewMode === 'map' && (
//             <div className="lg:col-span-1">
//               {selectedProperty ? (
//                 <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-8">
//                   <img
//                     src={selectedProperty.images[0]}
//                     alt={selectedProperty.title}
//                     className="w-full h-48 object-cover"
//                   />
//                   <div className="p-4">
//                     <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                       {selectedProperty.title}
//                     </h3>
//                     <p className="text-gray-600 mb-3">{selectedProperty.location.address}</p>
                    
//                     <div className="flex items-center justify-between mb-3">
//                       <div className="text-xl font-bold text-gray-900">
//                         ${selectedProperty.price.usd.toLocaleString()}
//                       </div>
//                       <span className={`px-2 py-1 text-xs font-medium rounded-full ${
//                         selectedProperty.status === 'for-sale'
//                           ? 'bg-green-100 text-green-800'
//                           : 'bg-blue-100 text-blue-800'
//                       }`}>
//                         {selectedProperty.status === 'for-sale' ? 'For Sale' : 'For Rent'}
//                       </span>
//                     </div>

//                     {selectedProperty.features.bedrooms && (
//                       <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
//                         <span>{selectedProperty.features.bedrooms} beds</span>
//                         <span>{selectedProperty.features.bathrooms} baths</span>
//                         <span>{selectedProperty.features.area} sqm</span>
//                       </div>
//                     )}

//                     <p className="text-gray-600 text-sm mb-4 line-clamp-3">
//                       {selectedProperty.description}
//                     </p>

//                     <div className="space-y-2">
//                       <Link
//                         to={`/property/${selectedProperty.id}`}
//                         className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-center block"
//                       >
//                         View Full Details
//                       </Link>
//                       <button
//                         onClick={() => setSelectedProperty(null)}
//                         className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
//                       >
//                         Close
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="bg-white rounded-lg shadow-md p-6 text-center">
//                   <Map className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                   <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Property</h3>
//                   <p className="text-gray-600">Click on a map marker to view property details</p>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PropertiesMap;


import React, { useState, useMemo } from 'react';
import { useProperty } from '../contexts/PropertyContext';
import MapView from '../components/MapView';
import SearchFilters from '../components/SearchFilters';
import { Property } from '../contexts/PropertyContext';
import { List, Map, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Filters {
  search?: string;
  type?: string;
  status?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  location?: string;
  furnished?: string;
  amenities?: string[];
}

const PropertiesMap: React.FC = () => {
  const { properties } = useProperty();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({});

  // Create a handler function with the correct type signature
  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
  };

  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      if (
        filters.search &&
        !property.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !property.location.city.toLowerCase().includes(filters.search.toLowerCase())
      ) {
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

  const handleSearch = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const mapCenter = useMemo(() => {
    if (filteredProperties.length === 0) {
      return { lat: 6.5244, lng: 3.3792 }; // Lagos, Nigeria
    }
    
    const avgLat = filteredProperties.reduce((sum, p) => sum + p.location.coordinates.lat, 0) / filteredProperties.length;
    const avgLng = filteredProperties.reduce((sum, p) => sum + p.location.coordinates.lng, 0) / filteredProperties.length;
    
    return { lat: avgLat, lng: avgLng };
  }, [filteredProperties]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Property Map</h1>
              <p className="text-gray-600 mt-2">
                Explore {filteredProperties.length} properties on the map
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('map')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'map'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Map className="h-4 w-4 mr-2" />
                  Map
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="h-4 w-4 mr-2" />
                  List
                </button>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Search Filters */}
        {showFilters && (
          <div className="mb-6">
            <SearchFilters onSearch={handleSearch} initialFilters={filters} />
          </div>
        )}

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map View */}
          <div className={`${viewMode === 'map' ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            {viewMode === 'map' ? (
              <MapView
                properties={filteredProperties as any}
                selectedProperty={selectedProperty as any}
                onPropertySelect={handlePropertySelect as any}
                center={mapCenter}
                height="600px"
              />
            ) : (
              /* List View */
              <div className="space-y-4">
                {filteredProperties.map((property) => (
                  <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="flex">
                      <div className="w-48 h-32 flex-shrink-0">
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {property.title}
                            </h3>
                            <p className="text-gray-600 mb-2">{property.location.address}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                              {property.features.bedrooms && (
                                <span>{property.features.bedrooms} beds</span>
                              )}
                              {property.features.bathrooms && (
                                <span>{property.features.bathrooms} baths</span>
                              )}
                              <span>{property.features.area} sqm</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                property.status === 'for-sale'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {property.status === 'for-sale' ? 'For Sale' : 'For Rent'}
                              </span>
                              <span className="text-xs text-gray-500 capitalize">
                                {property.type}
                              </span>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-xl font-bold text-gray-900">
                              ${property.price.usd.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              ₦{property.price.ngn.toLocaleString()}
                            </div>
                            <Link
                              to={`/property/${property.id}`}
                              className="mt-2 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredProperties.length === 0 && (
                  <div className="text-center py-12">
                    <Map className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
                    <p className="text-gray-600">Try adjusting your search filters</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Property Details Sidebar (Map View Only) */}
          {viewMode === 'map' && (
            <div className="lg:col-span-1">
              {selectedProperty ? (
                <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-8">
                  <img
                    src={selectedProperty.images[0]}
                    alt={selectedProperty.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {selectedProperty.title}
                    </h3>
                    <p className="text-gray-600 mb-3">{selectedProperty.location.address}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xl font-bold text-gray-900">
                        ${selectedProperty.price.usd.toLocaleString()}
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        selectedProperty.status === 'for-sale'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {selectedProperty.status === 'for-sale' ? 'For Sale' : 'For Rent'}
                      </span>
                    </div>

                    {selectedProperty.features.bedrooms && (
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                        <span>{selectedProperty.features.bedrooms} beds</span>
                        <span>{selectedProperty.features.bathrooms} baths</span>
                        <span>{selectedProperty.features.area} sqm</span>
                      </div>
                    )}

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {selectedProperty.description}
                    </p>

                    <div className="space-y-2">
                      <Link
                        to={`/property/${selectedProperty.id}`}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-center block"
                      >
                        View Full Details
                      </Link>
                      <button
                        onClick={() => setSelectedProperty(null)}
                        className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <Map className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Property</h3>
                  <p className="text-gray-600">Click on a map marker to view property details</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertiesMap;