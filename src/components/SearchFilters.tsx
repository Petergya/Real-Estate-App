import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin, DollarSign, Bed, Bath, Square, X, Home } from 'lucide-react';
import type { PropertyFilters } from '../contexts/PropertyContext';
import { useAuth } from '../contexts/AuthContext';
interface SearchFiltersProps {
  onSearch: (filters: PropertyFilters) => void;
  initialFilters?: PropertyFilters;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onSearch, initialFilters }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filters, setFilters] = useState<PropertyFilters>({
    search: initialFilters?.search || '',
    location: initialFilters?.location || '',
    type: initialFilters?.type || '',
    status: initialFilters?.status || '',
    minPrice: initialFilters?.minPrice || '',
    maxPrice: initialFilters?.maxPrice || '',
    bedrooms: initialFilters?.bedrooms || '',
    bathrooms: initialFilters?.bathrooms || '',
    minArea: initialFilters?.minArea || '',
    maxArea: initialFilters?.maxArea || '',
    furnished: initialFilters?.furnished || '',
    petFriendly: initialFilters?.petFriendly || '',
    parking: initialFilters?.parking || '',
    amenities: initialFilters?.amenities || []
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(initialFilters?.amenities || []);

  const amenityOptions = [
    'Swimming Pool', 'Gym', '24/7 Security', 'Generator', 'Elevator',
    'Garden', 'Borehole', 'WiFi', 'Air Conditioning', 'Balcony',
    'Garage', 'Playground', 'CCTV', 'Intercom', 'Solar Power'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const toggleAmenity = (amenity: string) => {
    const newAmenities = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter(a => a !== amenity)
      : [...selectedAmenities, amenity];

    setSelectedAmenities(newAmenities);
    setFilters(prev => ({ ...prev, amenities: newAmenities }));
  };

  const handleSearch = () => {
    if (!user) {
      navigate('/register', { state: { message: 'Please sign up to create an account to access all properties' } });
      return;
    }
    onSearch(filters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      location: '',
      type: '',
      status: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      minArea: '',
      maxArea: '',
      furnished: '',
      petFriendly: '',
      parking: '',
      amenities: []
    };
    setFilters(clearedFilters);
    setSelectedAmenities([]);
    onSearch(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value =>
    Array.isArray(value) ? value.length > 0 : value !== ''
  );

  return (
    <div className={`rounded-lg shadow-md p-6 transition-all duration-300 ${showAdvanced
        ? 'bg-black/30 backdrop-blur-lg border border-gray-100/20'
        : 'bg-white'
      }`}>
      {/* Basic Search */}
      <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 ${showAdvanced ? 'opacity-0 h-0 invisible' : 'opacity-100 h-auto visible'}`}>
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/4 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleInputChange}
              placeholder="Search properties, locations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent text-gray-800 placeholder-gray-500"
            />
          </div>
        </div>

        <div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleInputChange}
              placeholder="Location"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent text-gray-800 placeholder-gray-500"
            />
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleSearch}
            className="flex-1 bg-navy text-white py-2 px-4 rounded-md hover:bg-secondary transition-colors flex items-center justify-center"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </button>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center"
          >
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className={`flex flex-wrap gap-2 mb-4 ${showAdvanced ? 'opacity-0 h-0 invisible' : 'opacity-100 h-auto visible'}`}>
        <button
          onClick={() => {
            setFilters(prev => ({ ...prev, type: prev.type === 'apartment' ? '' : 'apartment' }));
          }}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${filters.type === 'apartment'
              ? 'bg-light/70 text-accent border border-primary/50'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          Apartments
        </button>
        <button
          onClick={() => {
            setFilters(prev => ({ ...prev, type: prev.type === 'house' ? '' : 'house' }));
          }}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${filters.type === 'house'
              ? 'bg-light/70 text-accent border border-primary/50'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          Houses
        </button>
        <button
          onClick={() => {
            setFilters(prev => ({ ...prev, type: prev.type === 'land' ? '' : 'land' }));
          }}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${filters.type === 'land'
              ? 'bg-light/70 text-accent border border-primary/50'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          Land
        </button>
        <button
          onClick={() => {
            setFilters(prev => ({ ...prev, type: prev.type === 'commercial' ? '' : 'commercial' }));
          }}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${filters.type === 'commercial'
              ? 'bg-light/70 text-accent border border-primary/50'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          Commercial
        </button>
        <button
          onClick={() => {
            setFilters(prev => ({ ...prev, status: prev.status === 'for-sale' ? '' : 'for-sale' }));
          }}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${filters.status === 'for-sale'
              ? 'bg-gold/15 text-navy border border-gold/50'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          For Sale
        </button>
        <button
          onClick={() => {
            setFilters(prev => ({ ...prev, status: prev.status === 'for-rent' ? '' : 'for-rent' }));
          }}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${filters.status === 'for-rent'
              ? 'bg-light/70 text-accent border border-primary/50'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          For Rent
        </button>
        <button
          onClick={() => {
            setFilters(prev => ({ ...prev, furnished: prev.furnished === 'true' ? '' : 'true' }));
          }}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${filters.furnished === 'true'
              ? 'bg-purple-100 text-purple-800 border border-purple-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          Furnished
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="space-y-6">
          {/* Property Details */}
          <div>
            <h4 className="text-sm font-medium text-white mb-3">Property Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-200 mb-1 flex items-center gap-1">
                  <Home className="h-4 w-4 mr-1 text-light" />
                  Property Type
                </label>
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-gold focus:border-transparent bg-black/30 border-gray-100/30 text-white"
                >
                  <option className="text-black" value="">All Types</option>
                  <option className="text-black" value="apartment">Apartment</option>
                  <option className="text-black" value="house">House</option>
                  <option className="text-black" value="land">Land</option>
                  <option className="text-black" value="commercial">Commercial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-200 mb-1">Listing Type</label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-gold focus:border-transparent bg-black/30 border-gray-100/30 text-white"
                >
                  <option className="text-black" value="">All</option>
                  <option className="text-black" value="for-sale">For Sale</option>
                  <option className="text-black" value="for-rent">For Rent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-200 mb-1">Furnished</label>
                <select
                  name="furnished"
                  value={filters.furnished}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-gold focus:border-transparent bg-black/30 border-gray-100/30 text-white"
                >
                  <option className="text-black" value="">Any</option>
                  <option className="text-black" value="true">Furnished</option>
                  <option className="text-black" value="false">Unfurnished</option>
                </select>
              </div>
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="text-sm font-medium text-white mb-3">Price Range (USD)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-200 mb-1">Min Price</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full pl-9 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-gold focus:border-transparent bg-black/30 border-gray-100/30 text-white placeholder-gray-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-200 mb-1">Max Price</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleInputChange}
                    placeholder="1000000"
                    className="w-full pl-9 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-gold focus:border-transparent bg-black/30 border-gray-100/30 text-white placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Rooms & Area */}
          <div>
            <h4 className="text-sm font-medium text-white mb-3">Rooms & Area</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-gray-200 mb-1">Bedrooms</label>
                <div className="relative">
                  <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <select
                    name="bedrooms"
                    value={filters.bedrooms}
                    onChange={handleInputChange}
                    className="w-full pl-9 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-gold focus:border-transparent bg-black/30 border-gray-100/30 text-white"
                  >
                    <option className="text-black" value="">Any</option>
                    <option className="text-black" value="1">1+</option>
                    <option className="text-black" value="2">2+</option>
                    <option className="text-black" value="3">3+</option>
                    <option className="text-black" value="4">4+</option>
                    <option className="text-black" value="5">5+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-200 mb-1">Bathrooms</label>
                <div className="relative">
                  <Bath className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <select
                    name="bathrooms"
                    value={filters.bathrooms}
                    onChange={handleInputChange}
                    className="w-full pl-9 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-gold focus:border-transparent bg-black/30 border-gray-100/30 text-white"
                  >
                    <option className="text-black" value="">Any</option>
                    <option className="text-black" value="1">1+</option>
                    <option className="text-black" value="2">2+</option>
                    <option className="text-black" value="3">3+</option>
                    <option className="text-black" value="4">4+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-200 mb-1">Min Area (sqm)</label>
                <div className="relative">
                  <Square className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="number"
                    name="minArea"
                    value={filters.minArea}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full pl-9 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-gold focus:border-transparent bg-black/30 border-gray-100/30 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-200 mb-1">Max Area (sqm)</label>
                <div className="relative">
                  <Square className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="number"
                    name="maxArea"
                    value={filters.maxArea}
                    onChange={handleInputChange}
                    placeholder="1000"
                    className="w-full pl-9 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-gold focus:border-transparent bg-black/30 border-gray-100/30 text-white placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-sm font-medium text-white mb-3">Features</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.petFriendly === 'true'}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    petFriendly: e.target.checked ? 'true' : ''
                  }))}
                  className="h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-200">Pet Friendly</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.parking === 'true'}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    parking: e.target.checked ? 'true' : ''
                  }))}
                  className="h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-200">Parking</span>
              </label>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h4 className="text-sm font-medium text-white mb-3">Amenities</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {amenityOptions.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`p-2 text-xs border rounded-md transition-colors text-left ${selectedAmenities.includes(amenity)
                      ? 'bg-primary border-primary text-white'
                      : 'border-gray-100/30 text-gray-200 hover:bg-black/20'
                    }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100/20">
            <div className="flex items-center space-x-4">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-300 hover:text-white flex items-center"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear All Filters
                </button>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setShowAdvanced(false)}
                className="px-4 py-2 border border-gray-100/30 text-white rounded-md hover:bg-black/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-navy text-white rounded-md hover:bg-secondary transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;