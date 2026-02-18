import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProperty } from '../contexts/PropertyContext';
import type { PropertyFilters } from '../contexts/PropertyContext';
import { Search, MapPin, DollarSign, Building, Landmark, Store, Home as HomeIcon } from 'lucide-react';
import SearchFilters from '../components/SearchFilters';

const propertyImages = [
  {
    url: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
    alt: 'Modern House',
    label: 'Modern House'
  },
  {
    url: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
    alt: 'Luxury Duplex',
    label: 'Luxury Duplex'
  },
  {
    url: 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg',
    alt: 'Land for Sale',
    label: 'Land for Sale'
  },
  {
    url: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
    alt: 'Commercial Shop',
    label: 'Commercial Shop'
  },
  // NEW EMPTY LAND IMAGES
  {
    url: 'https://images.pexels.com/photos/164336/pexels-photo-164336.jpeg',
    alt: 'Open Green Land',
    label: 'Open Green Land'
  },
  {
    url: 'https://images.pexels.com/photos/248771/pexels-photo-248771.jpeg',
    alt: 'Empty Plot',
    label: 'Empty Plot'
  },
  {
    url: 'https://images.pexels.com/photos/325944/pexels-photo-325944.jpeg',
    alt: 'Farmland',
    label: 'Farmland'
  },
  {
    url: 'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg',
    alt: 'Dry Land',
    label: 'Dry Land'
  },
  // EXISTING SHOP IMAGES
  {
    url: 'https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg',
    alt: 'Open Land',
    label: 'Open Land'
  },
  {
    url: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg',
    alt: 'Shop Front',
    label: 'Shop Front'
  },
  {
    url: 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg',
    alt: 'Vacant Land',
    label: 'Vacant Land'
  },
  {
    url: 'https://images.pexels.com/photos/264507/pexels-photo-264507.jpeg',
    alt: 'Retail Store',
    label: 'Retail Store'
  }
];

const HomePage: React.FC = () => {
  const { properties, searchProperties } = useProperty();
  const navigate = useNavigate();

  // Info banner state
  const [showBanner, setShowBanner] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % propertyImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + propertyImages.length) % propertyImages.length);
  };
  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % propertyImages.length);
  };

  const handleSearch = (filters: PropertyFilters) => {
    searchProperties(filters);
    navigate('/properties');
  };

  const propertyTypes = [
    { value: 'house', label: 'Houses', icon: HomeIcon },
    { value: 'apartment', label: 'Apartments', icon: Building },
    { value: 'land', label: 'Land', icon: Landmark },
    { value: 'commercial', label: 'Commercial', icon: Store }
  ];

  return (
    <div className="min-h-screen">
      {/* Info Banner using useState and Search icon */}
      {showBanner && (
        <div className="flex items-center justify-between bg-blue-100 text-blue-900 px-4 py-2">
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Tip: Use the advanced search below to find your perfect property!</span>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="text-blue-900 hover:text-blue-700 font-bold text-lg"
            aria-label="Close info banner"
          >
            ×
          </button>
        </div>
      )}
      {/* Hero Section with Image Carousel */}
      <section className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center">
        {/* Carousel Images */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          {propertyImages.map((img, idx) => (
            <img
              key={img.url}
              src={img.url}
              alt={img.alt}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              style={{ transitionProperty: 'opacity' }}
            />
          ))}
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-40 z-20"></div>
        </div>
        {/* Carousel Controls */}
        <button
          onClick={goToPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-40 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Previous slide"
          tabIndex={0}
        >
          <span className="text-2xl">&#8592;</span>
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-40 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Next slide"
          tabIndex={0}
        >
          <span className="text-2xl">&#8594;</span>
        </button>
        {/* Carousel Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
          {propertyImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full border-2 ${idx === currentSlide ? 'bg-white border-blue-600' : 'bg-gray-300 border-gray-400'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
        {/* Hero Text and Search */}
        <div className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center h-full">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
            Find Your Dream Property
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 drop-shadow">
            Buy, rent, or invest in premium properties across Nigeria
          </p>
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto w-full">
            <SearchFilters onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Property Types */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Property Type</h2>
            <p className="text-lg text-gray-600">Find the perfect property that matches your needs</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {propertyTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Link
                  key={type.value}
                  to={`/properties?type=${type.value}`}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center group"
                >
                  <Icon className="h-12 w-12 text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-semibold text-gray-900">{type.label}</h3>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      {/* <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Properties</h2>
            <p className="text-lg text-gray-600">Handpicked properties for you</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.slice(0, 3).map((property) => (
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
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.title}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
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
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <span>{property.features.bedrooms} beds</span>
                      <span className="mx-2">•</span>
                      <span>{property.features.bathrooms} baths</span>
                      <span className="mx-2">•</span>
                      <span>{property.features.area} sqm</span>
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
          
          <div className="text-center mt-12">
            <Link
              to="/properties"
              className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              View All Properties
            </Link>
          </div>
        </div>
      </section> */}
<section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Properties</h2>
          <p className="text-lg text-gray-600">Handpicked properties for you</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.slice(0, 3).map((property) => (
            <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Property Card Image Gallery */}
              <div className="relative">
                {/* Main image (shows first image by default) */}
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                
                {/* Image count badge */}
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-xs">
                  {property.images.length} photos
                </div>
                
                {/* Status badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    property.status === 'for-sale' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {property.status === 'for-sale' ? 'For Sale' : 'For Rent'}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.title}</h3>
                <div className="flex items-center text-gray-600 mb-2">
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
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <span>{property.features.bedrooms} beds</span>
                    <span className="mx-2">•</span>
                    <span>{property.features.bathrooms} baths</span>
                    <span className="mx-2">•</span>
                    <span>{property.features.area} sqm</span>
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
        
        <div className="text-center mt-12">
          <Link
            to="/properties"
            className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            View All Properties
          </Link>
        </div>
      </div>
    </section>
      {/* Stats Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Properties Listed</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">5,000+</div>
              <div className="text-blue-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Verified Agents</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Cities Covered</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;