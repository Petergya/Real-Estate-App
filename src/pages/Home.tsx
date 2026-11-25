import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProperty } from '../contexts/PropertyContext';
import type { PropertyFilters } from '../contexts/PropertyContext';
import {
  Search,
  MapPin,
  DollarSign,
  Building,
  Landmark,
  Store,
  Home as HomeIcon,
  Calendar,
  CreditCard,
  Shield,
  CheckCircle2,
  Star,
  Quote,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import SearchFilters from '../components/SearchFilters';

const propertyImages = [
  { url: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg', alt: 'Modern House', label: 'Modern House' },
  { url: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg', alt: 'Luxury Duplex', label: 'Luxury Duplex' },
  { url: 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg', alt: 'Land for Sale', label: 'Land for Sale' },
  { url: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg', alt: 'Commercial Shop', label: 'Commercial Shop' },
  { url: 'https://images.pexels.com/photos/164336/pexels-photo-164336.jpeg', alt: 'Open Green Land', label: 'Open Green Land' },
  { url: 'https://images.pexels.com/photos/248771/pexels-photo-248771.jpeg', alt: 'Empty Plot', label: 'Empty Plot' },
  { url: 'https://images.pexels.com/photos/325944/pexels-photo-325944.jpeg', alt: 'Farmland', label: 'Farmland' },
  { url: 'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg', alt: 'Dry Land', label: 'Dry Land' },
  { url: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg', alt: 'Shop Front', label: 'Shop Front' },
  { url: 'https://images.pexels.com/photos/264507/pexels-photo-264507.jpeg', alt: 'Retail Store', label: 'Retail Store' },
];

const howItWorksSteps = [
  { icon: Search, title: 'Search', description: 'Filter by type, location, price & amenities to find your match.', delay: '0' },
  { icon: MapPin, title: 'View', description: 'Browse listings, view photos & map locations before you visit.', delay: '100' },
  { icon: Calendar, title: 'Schedule', description: 'Book viewings at your convenience with owners or agents.', delay: '200' },
  { icon: CreditCard, title: 'Secure Pay', description: 'Pay safely through escrow. Funds released when you’re satisfied.', delay: '300' },
];

const whyChooseUs = [
  { icon: Shield, title: 'Secure Escrow', description: 'Your money is held safely until the deal is complete.', color: 'text-gold' },
  { icon: CheckCircle2, title: 'Verified Listings', description: 'Listings are checked for accuracy and legitimacy.', color: 'text-gold' },
  { icon: MapPin, title: 'Map & Location', description: 'See every property on the map and explore neighborhoods.', color: 'text-gold' },
  { icon: Sparkles, title: 'Dedicated Support', description: 'Get help from our team throughout your journey.', color: 'text-gold' },
];

const featuredLocations = [
  { name: 'Jos', count: '2,400+', path: '/properties?location=Jos' },
  { name: 'Lagos', count: '4,100+', path: '/properties?location=Lagos' },
  { name: 'Abuja', count: '3,200+', path: '/properties?location=Abuja' },
  { name: 'Port Harcourt', count: '1,800+', path: '/properties?location=Port Harcourt' },
];

const testimonials = [
  { quote: 'Found my dream apartment in Jos within a week. The escrow payment made the process stress-free.', author: 'Amina B.', role: 'Buyer', rating: 5 },
  { quote: 'As an agent, listing and managing properties here is straightforward. My clients love the map view.', author: 'Chidi O.', role: 'Real Estate Agent', rating: 5 },
  { quote: 'Transparent pricing and verified listings. Finally a platform I can trust for land investment.', author: 'Ibrahim M.', role: 'Investor', rating: 5 },
  { quote: 'Habixa made finding an office space in Abuja so easy. The direct chat with the landlord saved us weeks of back-and-forth negotiations.', author: 'Sarah T.', role: 'Business Owner', rating: 5 },
  { quote: 'I was skeptical about buying property online, but the secure escrow process gave me the peace of mind I needed to complete my purchase in Lagos.', author: 'Kunle A.', role: 'Buyer', rating: 5 },
  { quote: 'A game changer for landlords! I listed my duplex and had verified tenants scheduling viewings within 48 hours. Excellent service.', author: 'Mrs. Okafor', role: 'Landlord', rating: 5 },
];

const HomePage: React.FC = () => {
  const { properties } = useProperty();
  const navigate = useNavigate();
  const [showBanner, setShowBanner] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % propertyImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const goToPrev = () => setCurrentSlide((prev) => (prev - 1 + propertyImages.length) % propertyImages.length);
  const goToNext = () => setCurrentSlide((prev) => (prev + 1) % propertyImages.length);

  const handleSearch = (filters: PropertyFilters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) params.set(key, value.join(','));
      } else if (value) params.set(key, String(value));
    });
    navigate(params.toString() ? `/properties?${params.toString()}` : '/properties');
  };

  const propertyTypes = [
    { value: 'house', label: 'Houses', icon: HomeIcon },
    { value: 'apartment', label: 'Apartments', icon: Building },
    { value: 'land', label: 'Land', icon: Landmark },
    { value: 'commercial', label: 'Commercial', icon: Store },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Info Banner */}
      {showBanner && (
        <div className="flex items-center justify-between bg-gold/15 text-navy px-4 py-2 animate-fade-in">
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 flex-shrink-0" />
            <span>Tip: Use the advanced search below to find your perfect property!</span>
          </div>
          <button onClick={() => setShowBanner(false)} className="text-accent hover:text-primary font-bold text-lg" aria-label="Close">×</button>
        </div>
      )}

      {/* Hero */}
      <section className="relative w-full h-[420px] md:h-[520px] flex items-center justify-center bg-white">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          {propertyImages.map((img, idx) => (
            <img
              key={img.url}
              src={img.url}
              alt={img.alt}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            />
          ))}
          <div className="absolute inset-0 bg-white/5 z-20" />
        </div>
        <button onClick={goToPrev} className="absolute left-4 top-1/2 -translate-y-1/2 z-40 bg-white/90 hover:bg-white rounded-full p-2.5 shadow-xl transition-all hover:scale-110" aria-label="Previous"><span className="text-xl">&#8592;</span></button>
        <button onClick={goToNext} className="absolute right-4 top-1/2 -translate-y-1/2 z-40 bg-white/90 hover:bg-white rounded-full p-2.5 shadow-xl transition-all hover:scale-110" aria-label="Next"><span className="text-xl">&#8594;</span></button>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {propertyImages.slice(0, 6).map((_, idx) => (
            <button key={idx} onClick={() => setCurrentSlide(idx)} className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'}`} aria-label={`Slide ${idx + 1}`} />
          ))}
        </div>
        <div className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center h-full">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-[#14243A] drop-shadow-sm opacity-0 animate-fade-in-up animate-delay-100 animate-fill-both">
            Find Your Dream Property
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-[#526477] drop-shadow-sm opacity-0 animate-fade-in-up animate-delay-300 animate-fill-both max-w-2xl">
            Buy, rent, or invest in premium properties across Nigeria
          </p>
          <div className="max-w-4xl w-full opacity-0 animate-fade-in-up animate-delay-500 animate-fill-both">
            <SearchFilters onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-3 opacity-0 animate-fade-in-up animate-fill-both">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto opacity-0 animate-fade-in-up animate-delay-100 animate-fill-both">From search to keys in four simple steps</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="relative text-center group opacity-0 animate-fade-in-up animate-fill-both"
                  style={{ animationDelay: `${300 + i * 100}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold/15 text-gold mb-4 group-hover:bg-navy group-hover:text-gold transition-all duration-300 group-hover:scale-110">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-ink mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-3">Why Choose Habixa Properties</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">We make property search and purchase simple and secure</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  <div className={`inline-flex p-3 rounded-xl bg-gray-50 ${item.color}`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-semibold text-ink mt-4 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Property types */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-ink mb-4">Browse by Property Type</h2>
            <p className="text-lg text-gray-600">Find the perfect property that matches your needs</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {propertyTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Link
                  key={type.value}
                  to={`/properties?type=${type.value}`}
                  className="bg-white hover:bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 text-center group border border-transparent hover:border-gold/40 hover:-translate-y-1"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gold/15 text-gold group-hover:scale-110 group-hover:bg-navy group-hover:text-gold transition-all duration-300">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-semibold text-ink mt-4">{type.label}</h3>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured locations */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-ink mb-2">Popular Locations</h2>
            <p className="text-gray-600">Explore properties in Nigeria’s top cities</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredLocations.map((loc) => (
              <Link
                key={loc.name}
                to={loc.path}
                className="bg-white/80 backdrop-blur rounded-xl p-5 border border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 text-center"
              >
                <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-ink">{loc.name}</h3>
                <p className="text-sm text-gray-500">{loc.count} listings</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured properties */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-ink mb-4">Featured Properties</h2>
            <p className="text-lg text-gray-600">Handpicked properties for you</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.slice(0, 6).map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="relative overflow-hidden">
                  <img src={property.images[0]} alt={property.title} className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded-lg text-xs">{property.images.length} photos</div>
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium w-fit shadow-md ${property.status === 'for-sale' ? 'bg-gold/15 text-navy' : 'bg-light/90 text-accent'}`}>
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
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-ink mb-2 line-clamp-2">{property.title}</h3>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="text-sm">{property.location.address.split(',').pop()?.trim() || property.location.city}, {property.location.city}</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-gold mr-1" />
                      <span className="text-xl font-bold text-gold">${property.price.usd.toLocaleString()}</span>
                    </div>
                    <span className="text-sm text-gray-500">₦{property.price.ngn.toLocaleString()}</span>
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
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#123B7A] text-white hover:text-white py-2.5 px-4 rounded-xl hover:bg-[#0D2D5E] focus-visible:bg-[#0D2D5E] transition-colors font-medium"
                  >
                    View Details <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/properties" className="inline-flex items-center gap-2 bg-[#123B7A] text-white hover:text-white px-8 py-3 rounded-xl hover:bg-[#0D2D5E] focus-visible:bg-[#0D2D5E] transition-colors font-medium">
              View All Properties <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-ink mb-2">What Our Users Say</h2>
            <p className="text-gray-600">Trusted by buyers, agents, and investors across Nigeria</p>
          </div>
          <div className="relative overflow-hidden w-full py-4 -mx-4 px-4 sm:mx-0 sm:px-0">
            {/* Gradient overlays to smooth the edges of the slider */}
            <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none hidden md:block"></div>
            <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none hidden md:block"></div>
            
            <div className="flex gap-8 animate-ticker">
              {[...testimonials, ...testimonials].map((t, index) => (
                <div key={`${t.author}-${index}`} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow w-[300px] md:w-[400px] flex-shrink-0 cursor-default">
                  <Quote className="h-10 w-10 text-primary/30 mb-4" />
                  <p className="text-gray-700 mb-4 line-clamp-4">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="font-semibold text-ink">{t.author}</p>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '10,000+', label: 'Properties Listed' },
              { value: '5,000+', label: 'Happy Customers' },
              { value: '500+', label: 'Verified Agents' },
              { value: '50+', label: 'Cities Covered' },
            ].map((stat) => (
              <div key={stat.label} className="hover:scale-105 transition-transform duration-300">
                <div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
                <div className="text-white/90 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Find Your Property?</h2>
          <p className="text-white/90 text-lg mb-8">Join thousands of satisfied users. Start searching or list your property today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/properties" className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              Browse Properties <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-gold text-navy px-8 py-3 rounded-xl font-semibold hover:bg-gold-hover transition-colors">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
