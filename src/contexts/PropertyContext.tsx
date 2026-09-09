// import React, { createContext, useContext, useState } from 'react';

// export interface Property {
//   id: string;
//   title: string;
//   description: string;
//   price: {
//     usd: number;
//     ngn: number;
//   };
//   type: 'house' | 'apartment' | 'land' | 'commercial';
//   status: 'for-sale' | 'for-rent';
//   location: {
//     address: string;
//     city: string;
//     state: string;
//     coordinates: {
//       lat: number;
//       lng: number;
//     };
//   };
//   features: {
//     bedrooms?: number;
//     bathrooms?: number;
//     area: number;
//     furnished: boolean;
//     petFriendly: boolean;
//     parking: boolean;
//   };
//   amenities: string[];
//   images: string[];
//   videos?: string[];
//   owner: {
//     id: string;
//     name: string;
//     email: string;
//     phone: string;
//   };
//   agent?: {
//     id: string;
//     name: string;
//     email: string;
//     phone: string;
//     commission: number;
//   };
//   createdAt: string;
//   updatedAt: string;
// }

// interface PropertyContextType {
//   properties: Property[];
//   searchProperties: (filters: any) => Property[];
//   getProperty: (id: string) => Property | undefined;
//   addProperty: (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => void;
//   updateProperty: (id: string, updates: Partial<Property>) => void;
//   deleteProperty: (id: string) => void;
//   isLoading: boolean;
// }

// const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

// export const useProperty = () => {
//   const context = useContext(PropertyContext);
//   if (!context) {
//     throw new Error('useProperty must be used within a PropertyProvider');
//   }
//   return context;
// };

// // Mock data
// const mockProperties: Property[] = [
//   {
//     id: '1',
//     title: 'Luxury 3-Bedroom Apartment in Victoria Island',
//     description: 'Beautiful modern apartment with stunning ocean views, fully furnished with premium amenities.',
//     price: { usd: 2500, ngn: 4000000 },
//     type: 'apartment',
//     status: 'for-rent',
//     location: {
//       address: '123 Ahmadu Bello Way, Victoria Island',
//       city: 'Lagos',
//       state: 'Lagos',
//       coordinates: { lat: 6.4281, lng: 3.4219 }
//     },
//     features: {
//       bedrooms: 3,
//       bathrooms: 2,
//       area: 120,
//       furnished: true,
//       petFriendly: false,
//       parking: true
//     },
//     amenities: ['Swimming Pool', 'Gym', '24/7 Security', 'Generator', 'Elevator'],
//     images: [
//       'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
//       'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg'
//     ],
//     owner: {
//       id: 'owner1',
//       name: 'Mrs. Adebayo',
//       email: 'adebayo@email.com',
//       phone: '+234 801 234 5678'
//     },
//     agent: {
//       id: 'agent1',
//       name: 'John Smith',
//       email: 'john@realestate.com',
//       phone: '+234 802 345 6789',
//       commission: 10
//     },
//     createdAt: '2024-01-15T10:00:00Z',
//     updatedAt: '2024-01-15T10:00:00Z'
//   },
//   {
//     id: '1',
//     title: 'Luxury 3-Bedroom Apartment in Victoria Island',
//     description: 'Beautiful modern apartment with stunning ocean views, fully furnished with premium amenities.',
//     price: { usd: 2500, ngn: 4000000 },
//     type: 'apartment',
//     status: 'for-rent',
//     location: {
//       address: '123 Ahmadu Bello Way, Victoria Island',
//       city: 'Lagos',
//       state: 'Lagos',
//       coordinates: { lat: 6.4281, lng: 3.4219 }
//     },
//     features: {
//       bedrooms: 3,
//       bathrooms: 2,
//       area: 120,
//       furnished: true,
//       petFriendly: false,
//       parking: true
//     },
//     amenities: ['Swimming Pool', 'Gym', '24/7 Security', 'Generator', 'Elevator'],
//     images: [
//       'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
//       'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg'
//     ],
//     owner: {
//       id: 'owner1',
//       name: 'Mrs. Adebayo',
//       email: 'adebayo@email.com',
//       phone: '+234 801 234 5678'
//     },
//     agent: {
//       id: 'agent1',
//       name: 'John Smith',
//       email: 'john@realestate.com',
//       phone: '+234 802 345 6789',
//       commission: 10
//     },
//     createdAt: '2024-01-15T10:00:00Z',
//     updatedAt: '2024-01-15T10:00:00Z'
//   },
//   {
//     id: '1',
//     title: 'Luxury 3-Bedroom Apartment in Victoria Island',
//     description: 'Beautiful modern apartment with stunning ocean views, fully furnished with premium amenities.',
//     price: { usd: 2500, ngn: 4000000 },
//     type: 'apartment',
//     status: 'for-rent',
//     location: {
//       address: '123 Ahmadu Bello Way, Victoria Island',
//       city: 'Lagos',
//       state: 'Lagos',
//       coordinates: { lat: 6.4281, lng: 3.4219 }
//     },
//     features: {
//       bedrooms: 3,
//       bathrooms: 2,
//       area: 120,
//       furnished: true,
//       petFriendly: false,
//       parking: true
//     },
//     amenities: ['Swimming Pool', 'Gym', '24/7 Security', 'Generator', 'Elevator'],
//     images: [
//       'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
//       'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg'
//     ],
//     owner: {
//       id: 'owner1',
//       name: 'Mrs. Adebayo',
//       email: 'adebayo@email.com',
//       phone: '+234 801 234 5678'
//     },
//     agent: {
//       id: 'agent1',
//       name: 'John Smith',
//       email: 'john@realestate.com',
//       phone: '+234 802 345 6789',
//       commission: 10
//     },
//     createdAt: '2024-01-15T10:00:00Z',
//     updatedAt: '2024-01-15T10:00:00Z'
//   },
//   {
//     id: '1',
//     title: 'Luxury 3-Bedroom Apartment in Victoria Island',
//     description: 'Beautiful modern apartment with stunning ocean views, fully furnished with premium amenities.',
//     price: { usd: 2500, ngn: 4000000 },
//     type: 'apartment',
//     status: 'for-rent',
//     location: {
//       address: '123 Ahmadu Bello Way, Victoria Island',
//       city: 'Lagos',
//       state: 'Lagos',
//       coordinates: { lat: 6.4281, lng: 3.4219 }
//     },
//     features: {
//       bedrooms: 3,
//       bathrooms: 2,
//       area: 120,
//       furnished: true,
//       petFriendly: false,
//       parking: true
//     },
//     amenities: ['Swimming Pool', 'Gym', '24/7 Security', 'Generator', 'Elevator'],
//     images: [
//       'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
//       'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg'
//     ],
//     owner: {
//       id: 'owner1',
//       name: 'Mrs. Adebayo',
//       email: 'adebayo@email.com',
//       phone: '+234 801 234 5678'
//     },
//     agent: {
//       id: 'agent1',
//       name: 'John Smith',
//       email: 'john@realestate.com',
//       phone: '+234 802 345 6789',
//       commission: 10
//     },
//     createdAt: '2024-01-15T10:00:00Z',
//     updatedAt: '2024-01-15T10:00:00Z'
//   },
//   {
//     id: '1',
//     title: 'Luxury 3-Bedroom Apartment in Victoria Island',
//     description: 'Beautiful modern apartment with stunning ocean views, fully furnished with premium amenities.',
//     price: { usd: 2500, ngn: 4000000 },
//     type: 'apartment',
//     status: 'for-rent',
//     location: {
//       address: '123 Ahmadu Bello Way, Victoria Island',
//       city: 'Lagos',
//       state: 'Lagos',
//       coordinates: { lat: 6.4281, lng: 3.4219 }
//     },
//     features: {
//       bedrooms: 3,
//       bathrooms: 2,
//       area: 120,
//       furnished: true,
//       petFriendly: false,
//       parking: true
//     },
//     amenities: ['Swimming Pool', 'Gym', '24/7 Security', 'Generator', 'Elevator'],
//     images: [
//       'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
//       'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg'
//     ],
//     owner: {
//       id: 'owner1',
//       name: 'Mrs. Adebayo',
//       email: 'adebayo@email.com',
//       phone: '+234 801 234 5678'
//     },
//     agent: {
//       id: 'agent1',
//       name: 'John Smith',
//       email: 'john@realestate.com',
//       phone: '+234 802 345 6789',
//       commission: 10
//     },
//     createdAt: '2024-01-15T10:00:00Z',
//     updatedAt: '2024-01-15T10:00:00Z'
//   },
  

//   {
//     id: '2',
//     title: '4-Bedroom Duplex in Lekki Phase 1',
//     description: 'Spacious family home in a serene environment with modern facilities and excellent security.',
//     price: { usd: 450000, ngn: 720000000 },
//     type: 'house',
//     status: 'for-sale',
//     location: {
//       address: '45 Admiralty Way, Lekki Phase 1',
//       city: 'Lagos',
//       state: 'Lagos',
//       coordinates: { lat: 6.4698, lng: 3.5852 }
//     },
//     features: {
//       bedrooms: 4,
//       bathrooms: 3,
//       area: 250,
//       furnished: false,
//       petFriendly: true,
//       parking: true
//     },
//     amenities: ['Swimming Pool', 'Garden', 'Security', 'Generator', 'Borehole'],
//     images: [
//       'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
//       'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg'
//     ],
//     owner: {
//       id: 'owner2',
//       name: 'Mr. Okafor',
//       email: 'okafor@email.com',
//       phone: '+234 803 456 7890'
//     },
//     createdAt: '2024-01-10T14:30:00Z',
//     updatedAt: '2024-01-10T14:30:00Z'
//   }
// ];

// export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [properties, setProperties] = useState<Property[]>(mockProperties);
//   const [isLoading, setIsLoading] = useState(false);

//   const searchProperties = (filters: any) => {
//     return properties.filter(property => {
//       if (filters.type && property.type !== filters.type) return false;
//       if (filters.status && property.status !== filters.status) return false;
//       if (filters.minPrice && property.price.usd < filters.minPrice) return false;
//       if (filters.maxPrice && property.price.usd > filters.maxPrice) return false;
//       if (filters.bedrooms && property.features.bedrooms !== filters.bedrooms) return false;
//       if (filters.city && !property.location.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
//       return true;
//     });
//   };

//   const getProperty = (id: string) => {
//     return properties.find(property => property.id === id);
//   };

//   const addProperty = (propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
//     setIsLoading(true);
//     setTimeout(() => {
//       const newProperty: Property = {
//         ...propertyData,
//         id: Date.now().toString(),
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString()
//       };
//       setProperties(prev => [...prev, newProperty]);
//       setIsLoading(false);
//     }, 500);
//   };

//   const updateProperty = (id: string, updates: Partial<Property>) => {
//     setIsLoading(true);
//     setTimeout(() => {
//       setProperties(prev => prev.map(property => 
//         property.id === id 
//           ? { ...property, ...updates, updatedAt: new Date().toISOString() }
//           : property
//       ));
//       setIsLoading(false);
//     }, 500);
//   };

//   const deleteProperty = (id: string) => {
//     setIsLoading(true);
//     setTimeout(() => {
//       setProperties(prev => prev.filter(property => property.id !== id));
//       setIsLoading(false);
//     }, 500);
//   };

//   return (
//     <PropertyContext.Provider value={{
//       properties,
//       searchProperties,
//       getProperty,
//       addProperty,
//       updateProperty,
//       deleteProperty,
//       isLoading
//     }}>
//       {children}
//     </PropertyContext.Provider>
//   );
// };



import React, { createContext, useContext, useState } from 'react';

export interface Property {
  id: string;
  title: string;
  description: string;
  price: {
    usd: number;
    ngn: number;
  };
  type: 'house' | 'apartment' | 'land' | 'commercial';
  status: 'for-sale' | 'for-rent';
  location: {
    address: string;
    city: string;
    state: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  features: {
    bedrooms?: number;
    bathrooms?: number;
    area: number;
    furnished: boolean;
    petFriendly: boolean;
    parking: boolean;
  };
  amenities: string[];
  images: string[];
  videos?: string[];
  availabilityStatus: 'available' | 'sold' | 'taken';
  owner: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  agent?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    commission: number;
  };
  createdAt: string;
  updatedAt: string;
  // Optional land-specific fields
  plotType?: 'residential' | 'commercial' | 'agricultural' | 'mixed';
  topography?: 'flat' | 'sloping' | 'hilly';
  hasSurveyPlan?: boolean;
  hasCOO?: boolean;
  accessRoad?: boolean;
}

export interface PropertyFilters {
  search?: string;
  location?: string;
  city?: string;
  type?: string;
  status?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  bathrooms?: string;
  minArea?: string;
  maxArea?: string;
  furnished?: string;
  petFriendly?: string;
  parking?: string;
  amenities?: string[];
}

interface PropertyContextType {
  properties: Property[];
  searchProperties: (filters: PropertyFilters) => Property[];
  getProperty: (id: string) => Property | undefined;
  addProperty: (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  isLoading: boolean;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
};

// Mock data with unique IDs and more images
const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Luxury 3-Bedroom Apartment in University Quarters, Jos',
    description: 'Beautiful modern apartment with stunning city views, fully furnished with premium amenities.',
    price: { usd: 2500, ngn: 4000000 },
    type: 'apartment',
    status: 'for-rent',
    location: {
      address: '15 Rayfield Road, University Quarters',
      city: 'Jos',
      state: 'Plateau',
      coordinates: { lat: 9.8539, lng: 8.8921 }
    },
    features: {
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      furnished: true,
      petFriendly: false,
      parking: true
    },
    amenities: ['Swimming Pool', 'Gym', '24/7 Security', 'Generator', 'Elevator'],
    images: [
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
      'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg',
      'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
      'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg',
      'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg',
      'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg'
    ],
    availabilityStatus: 'available',
    owner: {
      id: 'owner1',
      name: 'Mrs. Adebayo',
      email: 'adebayo@email.com',
      phone: '+234 801 234 5678'
    },
    agent: {
      id: 'agent1',
      name: 'John Smith',
      email: 'john@realestate.com',
      phone: '+234 802 345 6789',
      commission: 10
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: '4-Bedroom Duplex in Angwa Rukuba, Jos',
    description: 'Spacious family home in a serene environment with modern facilities and excellent security.',
    price: { usd: 450000, ngn: 720000000 },
    type: 'house',
    status: 'for-sale',
    location: {
      address: '8 Joseph Gomwalk Way, Angwa Rukuba',
      city: 'Jos',
      state: 'Plateau',
      coordinates: { lat: 9.9146, lng: 8.8749 }
    },
    features: {
      bedrooms: 4,
      bathrooms: 3,
      area: 250,
      furnished: false,
      petFriendly: true,
      parking: true
    },
    amenities: ['Swimming Pool', 'Garden', 'Security', 'Generator', 'Borehole'],
    images: [
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
      'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg',
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
      'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg',
      'https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg'
    ],
    availabilityStatus: 'sold',
    owner: {
      id: 'owner2',
      name: 'Mr. Okafor',
      email: 'okafor@email.com',
      phone: '+234 803 456 7890'
    },
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-10T14:30:00Z'
  },
  {
    id: '3',
    title: 'Commercial Space in Haske Quarters, Jos',
    description: 'Prime commercial space suitable for offices or retail business in the heart of Jos.',
    price: { usd: 300000, ngn: 480000000 },
    type: 'commercial',
    status: 'for-sale',
    location: {
      address: '12 Ahmadu Bello Way, Haske Quarters',
      city: 'Jos',
      state: 'Plateau',
      coordinates: { lat: 9.9172, lng: 8.8929 }
    },
    features: {
      area: 500,
      furnished: false,
      petFriendly: false,
      parking: true
    },
    amenities: ['24/7 Security', 'Elevator', 'Generator', 'Parking Lot'],
    images: [
      'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg',
      'https://images.pexels.com/photos/936722/pexels-photo-936722.jpeg',
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
      'https://images.pexels.com/photos/259751/pexels-photo-259751.jpeg',
      'https://images.pexels.com/photos/259751/pexels-photo-259751.jpeg',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'
    ],
    availabilityStatus: 'taken',
    owner: {
      id: 'owner3',
      name: 'Alhaji Bello',
      email: 'bello@email.com',
      phone: '+234 804 567 8901'
    },
    agent: {
      id: 'agent2',
      name: 'Sarah Johnson',
      email: 'sarah@realestate.com',
      phone: '+234 805 678 9012',
      commission: 8
    },
    createdAt: '2024-01-05T09:15:00Z',
    updatedAt: '2024-01-05T09:15:00Z'
  },
  {
    id: '4',
    title: 'Commercial Space in Mazaram, Jos',
    description: 'Prime commercial space suitable for offices or retail business in the heart of Jos.',
    price: { usd: 300000, ngn: 480000000 },
    type: 'commercial',
    status: 'for-sale',
    location: {
      address: '5 Bukuru Expressway, Mazaram',
      city: 'Jos',
      state: 'Plateau',
      coordinates: { lat: 9.7836, lng: 8.8589 }
    },
    features: {
      area: 500,
      furnished: false,
      petFriendly: false,
      parking: true
    },
    amenities: ['24/7 Security', 'Elevator', 'Generator', 'Parking Lot'],
    images: [
      'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg',
      'https://images.pexels.com/photos/936722/pexels-photo-936722.jpeg',
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
      'https://images.pexels.com/photos/259751/pexels-photo-259751.jpeg',
      'https://images.pexels.com/photos/259751/pexels-photo-259751.jpeg',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'
    ],
    availabilityStatus: 'available',
    owner: {
      id: 'owner3',
      name: 'Alhaji Bello',
      email: 'bello@email.com',
      phone: '+234 804 567 8901'
    },
    agent: {
      id: 'agent2',
      name: 'Sarah Johnson',
      email: 'sarah@realestate.com',
      phone: '+234 805 678 9012',
      commission: 8
    },
    createdAt: '2024-01-05T09:15:00Z',
    updatedAt: '2024-01-05T09:15:00Z'
  },
  {
    id: '5',
    title: 'Commercial Space in Dadin Kowa, Jos',
    description: 'Prime commercial space suitable for offices or retail business in the heart of Jos.',
    price: { usd: 300000, ngn: 480000000 },
    type: 'commercial',
    status: 'for-sale',
    location: {
      address: '20 Murtala Mohammed Way, Dadin Kowa',
      city: 'Jos',
      state: 'Plateau',
      coordinates: { lat: 9.8827, lng: 8.8753 }
    },
    features: {
      area: 500,
      furnished: false,
      petFriendly: false,
      parking: true
    },
    amenities: ['24/7 Security', 'Elevator', 'Generator', 'Parking Lot'],
    images: [
      'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg',
      'https://images.pexels.com/photos/936722/pexels-photo-936722.jpeg',
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
      'https://images.pexels.com/photos/259751/pexels-photo-259751.jpeg',
      'https://images.pexels.com/photos/259751/pexels-photo-259751.jpeg',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'
    ],
    availabilityStatus: 'available',
    owner: {
      id: 'owner3',
      name: 'Alhaji Bello',
      email: 'bello@email.com',
      phone: '+234 804 567 8901'
    },
    agent: {
      id: 'agent2',
      name: 'Sarah Johnson',
      email: 'sarah@realestate.com',
      phone: '+234 805 678 9012',
      commission: 8
    },
    createdAt: '2024-01-05T09:15:00Z',
    updatedAt: '2024-01-05T09:15:00Z'
  },
  {
    id: '6',
    title: 'Commercial Space in Zarmaganda, Jos',
    description: 'Prime commercial space suitable for offices or retail business in the heart of Jos.',
    price: { usd: 300000, ngn: 480000000 },
    type: 'commercial',
    status: 'for-sale',
    location: {
      address: '3 Zarmaganda Road, Zarmaganda',
      city: 'Jos',
      state: 'Plateau',
      coordinates: { lat: 9.9422, lng: 8.9231 }
    },
    features: {
      area: 500,
      furnished: false,
      petFriendly: false,
      parking: true
    },
    amenities: ['24/7 Security', 'Elevator', 'Generator', 'Parking Lot'],
    images: [
      'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg',
      'https://images.pexels.com/photos/936722/pexels-photo-936722.jpeg',
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
      'https://images.pexels.com/photos/259751/pexels-photo-259751.jpeg',
      'https://images.pexels.com/photos/259751/pexels-photo-259751.jpeg',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'
    ],
    availabilityStatus: 'available',
    owner: {
      id: 'owner3',
      name: 'Alhaji Bello',
      email: 'bello@email.com',
      phone: '+234 804 567 8901'
    },
    agent: {
      id: 'agent2',
      name: 'Sarah Johnson',
      email: 'sarah@realestate.com',
      phone: '+234 805 678 9012',
      commission: 8
    },
    createdAt: '2024-01-05T09:15:00Z',
    updatedAt: '2024-01-05T09:15:00Z'
  },
  {
    id: '7',
    title: 'Prime Residential Plot in GRA, Jos',
    description: 'Excellent developable land in a high-demand area. Flat terrain, good drainage, and direct access to tarred road. Perfect for building your dream home or investment property. Certificate of Occupancy available.',
    price: { usd: 85000, ngn: 136000000 },
    type: 'land',
    status: 'for-sale',
    location: {
      address: 'Plot 15, Block B, GRA',
      city: 'Jos',
      state: 'Plateau',
      coordinates: { lat: 9.8489, lng: 8.8854 }
    },
    features: {
      area: 500,
      furnished: false,
      petFriendly: false,
      parking: false
    },
    amenities: ['Survey Plan', 'Certificate of Occupancy', 'Access Road', 'Fenced', 'Near Tarred Road'],
    images: [
      'https://images.pexels.com/photos/164336/pexels-photo-164336.jpeg',
      'https://images.pexels.com/photos/248771/pexels-photo-248771.jpeg',
      'https://images.pexels.com/photos/325944/pexels-photo-325944.jpeg',
      'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg',
      'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg',
      'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg'
    ],
    availabilityStatus: 'available',
    plotType: 'residential',
    topography: 'flat',
    hasSurveyPlan: true,
    hasCOO: true,
    accessRoad: true,
    owner: {
      id: 'owner4',
      name: 'Mr. Danjuma',
      email: 'danjuma@email.com',
      phone: '+234 806 789 0123'
    },
    agent: {
      id: 'agent1',
      name: 'John Smith',
      email: 'john@realestate.com',
      phone: '+234 802 345 6789',
      commission: 10
    },
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z'
  },
  {
    id: '8',
    title: 'Large Agricultural Land in Kwang, Jos',
    description: 'Expansive farmland suitable for farming, ranching, or future development. Rich soil, natural water source nearby. Ideal for agricultural investment or large-scale farming projects.',
    price: { usd: 120000, ngn: 192000000 },
    type: 'land',
    status: 'for-sale',
    location: {
      address: 'Off Zawan Road, Kwang',
      city: 'Jos',
      state: 'Plateau',
      coordinates: { lat: 9.8722, lng: 8.9123 }
    },
    features: {
      area: 2000,
      furnished: false,
      petFriendly: false,
      parking: false
    },
    amenities: ['Survey Plan', 'Access Road', 'Natural Water Source', 'Fenced Perimeter'],
    images: [
      'https://images.pexels.com/photos/325944/pexels-photo-325944.jpeg',
      'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg',
      'https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg',
      'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg',
      'https://images.pexels.com/photos/248771/pexels-photo-248771.jpeg',
      'https://images.pexels.com/photos/164336/pexels-photo-164336.jpeg'
    ],
    availabilityStatus: 'available',
    plotType: 'agricultural',
    topography: 'flat',
    hasSurveyPlan: true,
    hasCOO: false,
    accessRoad: true,
    owner: {
      id: 'owner5',
      name: 'Alhaji Garba',
      email: 'garba@email.com',
      phone: '+234 807 890 1234'
    },
    agent: {
      id: 'agent2',
      name: 'Sarah Johnson',
      email: 'sarah@realestate.com',
      phone: '+234 805 678 9012',
      commission: 8
    },
    createdAt: '2024-02-05T14:00:00Z',
    updatedAt: '2024-02-05T14:00:00Z'
  },
  {
    id: '9',
    title: 'Modern 2-Bedroom Apartment in Rayfield, Jos',
    description: 'Fully serviced 2-bedroom apartment with 24/7 power, security, and a communal pool. Located in a highly sought-after district.',
    price: { usd: 3500, ngn: 5600000 },
    type: 'apartment',
    status: 'for-rent',
    location: {
      address: 'Plot 8, Rayfield Resort Road, Rayfield',
      city: 'Jos',
      state: 'Plateau',
      coordinates: { lat: 9.8456, lng: 8.8876 }
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      area: 95,
      furnished: true,
      petFriendly: true,
      parking: true
    },
    amenities: ['Swimming Pool', 'Gym', '24/7 Security', 'Air Conditioning'],
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
      'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg',
      'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg'
    ],
    availabilityStatus: 'available',
    owner: {
      id: 'owner6',
      name: 'Dr. Ibrahim',
      email: 'ibrahim@email.com',
      phone: '+234 812 345 6789'
    },
    createdAt: '2024-02-10T09:00:00Z',
    updatedAt: '2024-02-10T09:00:00Z'
  },
  {
    id: '10',
    title: '5-Bedroom Mansion in Abattoir, Jos',
    description: 'Ultra-luxury mansion featuring smart home technology, cinema room, private pool, and staff quarters.',
    price: { usd: 1500000, ngn: 2400000000 },
    type: 'house',
    status: 'for-sale',
    location: {
      address: '45 Lamingo Dam Road, Abattoir',
      city: 'Jos',
      state: 'Plateau',
      coordinates: { lat: 9.9321, lng: 8.9111 }
    },
    features: {
      bedrooms: 5,
      bathrooms: 6,
      area: 600,
      furnished: false,
      petFriendly: true,
      parking: true
    },
    amenities: ['Private Pool', 'Cinema Room', 'Smart Home', 'Staff Quarters', 'Security System'],
    images: [
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg'
    ],
    availabilityStatus: 'available',
    owner: {
      id: 'owner7',
      name: 'Chief Emmanuel',
      email: 'emmanuel@email.com',
      phone: '+234 803 111 2222'
    },
    createdAt: '2024-02-12T11:00:00Z',
    updatedAt: '2024-02-12T11:00:00Z'
  },
  {
    id: '11',
    title: '3-Bedroom Terrace in Kufang, Jos',
    description: 'Newly built terrace duplex in a secure gated estate. Excellent location with easy access to major roads.',
    price: { usd: 15000, ngn: 24000000 },
    type: 'house',
    status: 'for-rent',
    location: {
      address: '8 Old Airport Road, Kufang',
      city: 'Jos',
      state: 'Plateau',
      coordinates: { lat: 9.8667, lng: 8.8833 }
    },
    features: {
      bedrooms: 3,
      bathrooms: 4,
      area: 180,
      furnished: false,
      petFriendly: false,
      parking: true
    },
    amenities: ['Gated Estate', 'Water Treatment', 'Prepaid Meter', 'Security Guards'],
    images: [
      'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
      'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg'
    ],
    availabilityStatus: 'taken',
    owner: {
      id: 'owner8',
      name: 'Mrs. Funke',
      email: 'funke@email.com',
      phone: '+234 809 333 4444'
    },
    createdAt: '2024-02-15T08:30:00Z',
    updatedAt: '2024-02-15T08:30:00Z'
  },
  {
    id: '12',
    title: 'Commercial Plaza in Guratop, Jos',
    description: 'A 3-story commercial plaza suitable for corporate offices, retail stores, and restaurants. Prime location with high foot traffic.',
    price: { usd: 2500000, ngn: 4000000000 },
    type: 'commercial',
    status: 'for-sale',
    location: {
      address: '22 Ahmadu Bello Way, Guratop',
      city: 'Jos',
      state: 'Plateau',
      coordinates: { lat: 9.9215, lng: 8.8912 }
    },
    features: {
      area: 1200,
      furnished: false,
      petFriendly: false,
      parking: true
    },
    amenities: ['Elevator', 'Central AC', 'Ample Parking', 'Backup Generator', 'CCTV'],
    images: [
      'https://images.pexels.com/photos/936722/pexels-photo-936722.jpeg',
      'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg',
      'https://images.pexels.com/photos/259751/pexels-photo-259751.jpeg'
    ],
    availabilityStatus: 'sold',
    owner: {
      id: 'owner9',
      name: 'Wuse Properties Ltd',
      email: 'contact@wuseproperties.com',
      phone: '+234 811 555 6666'
    },
    createdAt: '2024-02-18T16:45:00Z',
    updatedAt: '2024-02-18T16:45:00Z'
  },
  {
    id: '13',
    title: 'Cozy 1-Bedroom Loft in State Lowcost, Jos',
    description: 'A stylish 1-bedroom loft apartment with high ceilings, large windows, and modern furnishings. Perfect for young professionals.',
    price: { usd: 1800, ngn: 2880000 },
    type: 'apartment',
    status: 'for-rent',
    location: {
      address: '4 Dogon Karfe, State Lowcost',
      city: 'Jos',
      state: 'Plateau',
      coordinates: { lat: 9.9144, lng: 8.8923 }
    },
    features: {
      bedrooms: 1,
      bathrooms: 1,
      area: 65,
      furnished: true,
      petFriendly: true,
      parking: true
    },
    amenities: ['Gym', 'Rooftop Lounge', '24/7 Security', 'Elevator'],
    images: [
      'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
      'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg'
    ],
    availabilityStatus: 'available',
    owner: {
      id: 'owner10',
      name: 'Mr. Tunde',
      email: 'tunde@email.com',
      phone: '+234 802 222 3333'
    },
    createdAt: '2024-02-20T10:00:00Z',
    updatedAt: '2024-02-20T10:00:00Z'
  },
  {
    id: '14',
    title: 'Extensive Commercial Farm in Zaria Road, Jos',
    description: 'Over 5,000 sqm of prime agricultural land with irrigation systems and a farmhouse already built.',
    price: { usd: 85000, ngn: 136000000 },
    type: 'land',
    status: 'for-sale',
    location: {
      address: 'Km 12 Zaria Road, Zaria Road',
      city: 'Jos',
      state: 'Plateau',
      coordinates: { lat: 9.9975, lng: 8.9076 }
    },
    features: {
      area: 5000,
      furnished: false,
      petFriendly: true,
      parking: true
    },
    amenities: ['Irrigation System', 'Farmhouse', 'Access Road', 'Fenced Perimeter'],
    images: [
      'https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg',
      'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg',
      'https://images.pexels.com/photos/248771/pexels-photo-248771.jpeg'
    ],
    availabilityStatus: 'available',
    owner: {
      id: 'owner11',
      name: 'Alhaji Musa',
      email: 'musa@email.com',
      phone: '+234 807 444 5555'
    },
    createdAt: '2024-02-22T08:15:00Z',
    updatedAt: '2024-02-22T08:15:00Z'
  },
  {
    id: '15',
    title: 'Luxury 4-Bedroom Semi-Detached in New Abuja, Jos',
    description: 'Exquisite 4-bedroom semi-detached house with a private garden, swimming pool, and dedicated parking spaces.',
    price: { usd: 850000, ngn: 1360000000 },
    type: 'house',
    status: 'for-sale',
    location: {
      address: '15 Yakubu Gowon Way, New Abuja',
      city: 'Jos',
      state: 'Plateau',
      coordinates: { lat: 9.8965, lng: 8.8583 }
    },
    features: {
      bedrooms: 4,
      bathrooms: 5,
      area: 320,
      furnished: false,
      petFriendly: true,
      parking: true
    },
    amenities: ['Private Garden', 'Swimming Pool', '24/7 Power', 'Fully Fitted Kitchen'],
    images: [
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg'
    ],
    availabilityStatus: 'sold',
    owner: {
      id: 'owner12',
      name: 'Mrs. Adebayo',
      email: 'adebayo@email.com',
      phone: '+234 811 666 7777'
    },
    createdAt: '2024-02-25T14:30:00Z',
    updatedAt: '2024-02-25T14:30:00Z'
  },
  {
    id: '16',
    title: 'Spacious Office Space in Secretariat Junction, Jos',
    description: 'Open-plan office space on the 5th floor of a premium commercial building. Excellent views of the city skyline.',
    price: { usd: 45000, ngn: 72000000 },
    type: 'commercial',
    status: 'for-rent',
    location: {
      address: '22 Aliyu Makama Road, Secretariat Junction',
      city: 'Jos',
      state: 'Plateau',
      coordinates: { lat: 9.9123, lng: 8.8765 }
    },
    features: {
      area: 450,
      furnished: false,
      petFriendly: false,
      parking: true
    },
    amenities: ['Central Air Conditioning', 'High-Speed Elevators', 'CCTV Security', 'Dedicated Parking'],
    images: [
      'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg',
      'https://images.pexels.com/photos/260689/pexels-photo-260689.jpeg',
      'https://images.pexels.com/photos/37347/office-sitting-room-executive-sitting.jpg'
    ],
    availabilityStatus: 'available',
    owner: {
      id: 'owner13',
      name: 'VI Properties Group',
      email: 'leasing@viproperties.com',
      phone: '+234 809 888 9999'
    },
    createdAt: '2024-02-28T09:45:00Z',
    updatedAt: '2024-02-28T09:45:00Z'
  },
  {
    id: '17',
    title: 'Modern Retail Shop in Terminus, Jos',
    description: 'Prime retail shop location with high foot traffic. Ready for immediate move-in and custom build-out.',
    price: { usd: 25000, ngn: 40000000 },
    type: 'commercial',
    status: 'for-rent',
    location: {
      address: 'Shop 42, Terminus Main Market, Terminus',
      city: 'Jos',
      state: 'Plateau',
      coordinates: { lat: 9.9236, lng: 8.8978 }
    },
    features: {
      area: 85,
      furnished: false,
      petFriendly: false,
      parking: true
    },
    amenities: ['Mall Security', 'Central AC', 'Restrooms', 'Ample Parking'],
    images: [
      'https://images.pexels.com/photos/298864/pexels-photo-298864.jpeg',
      'https://images.pexels.com/photos/1036371/pexels-photo-1036371.jpeg',
      'https://images.pexels.com/photos/2733918/pexels-photo-2733918.jpeg'
    ],
    availabilityStatus: 'taken',
    owner: {
      id: 'owner14',
      name: 'ICM Management',
      email: 'leasing@ikejacitymall.com',
      phone: '+234 803 123 4567'
    },
    createdAt: '2024-03-01T11:20:00Z',
    updatedAt: '2024-03-01T11:20:00Z'
  },
  {
    id: '18',
    title: 'Family Home in Federal Lowcost, Jos',
    description: 'Beautifully finished 4-bedroom detached duplex in a serene and secure neighborhood.',
    price: { usd: 120000, ngn: 192000000 },
    type: 'house',
    status: 'for-sale',
    location: {
      address: '3rd Avenue, Federal Lowcost',
      city: 'Jos',
      state: 'Plateau',
      coordinates: { lat: 9.8883, lng: 8.8608 }
    },
    features: {
      bedrooms: 4,
      bathrooms: 4,
      area: 280,
      furnished: false,
      petFriendly: true,
      parking: true
    },
    amenities: ['Tarred Road', 'Borehole Water', 'Spacious Compound', 'Gatehouse'],
    images: [
      'https://images.pexels.com/photos/208736/pexels-photo-208736.jpeg',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
      'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg'
    ],
    availabilityStatus: 'available',
    owner: {
      id: 'owner15',
      name: 'Engr. Chukwudi',
      email: 'chukwudi@email.com',
      phone: '+234 805 777 8888'
    },
    createdAt: '2024-03-05T15:10:00Z',
    updatedAt: '2024-03-05T15:10:00Z'
  }
];

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [isLoading, setIsLoading] = useState(false);

  const searchProperties = (filters: PropertyFilters) => {
    const minPrice = filters.minPrice ? Number(filters.minPrice) : undefined;
    const maxPrice = filters.maxPrice ? Number(filters.maxPrice) : undefined;
    const bedrooms = filters.bedrooms ? Number.parseInt(filters.bedrooms, 10) : undefined;

    return properties.filter(property => {
      if (filters.type && property.type !== filters.type) return false;
      if (filters.status && property.status !== filters.status) return false;
      if (Number.isFinite(minPrice) && property.price.usd < (minPrice as number)) return false;
      if (Number.isFinite(maxPrice) && property.price.usd > (maxPrice as number)) return false;
      if (Number.isFinite(bedrooms) && property.features.bedrooms !== bedrooms) return false;
      if (filters.city && !property.location.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
      return true;
    });
  };

  const getProperty = (id: string) => {
    return properties.find(property => property.id === id);
  };

  const addProperty = (propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    setTimeout(() => {
      const newProperty: Property = {
        ...propertyData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setProperties(prev => [...prev, newProperty]);
      setIsLoading(false);
    }, 500);
  };

  const updateProperty = (id: string, updates: Partial<Property>) => {
    setIsLoading(true);
    setTimeout(() => {
      setProperties(prev => prev.map(property => 
        property.id === id 
          ? { ...property, ...updates, updatedAt: new Date().toISOString() }
          : property
      ));
      setIsLoading(false);
    }, 500);
  };

  const deleteProperty = (id: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setProperties(prev => prev.filter(property => property.id !== id));
      setIsLoading(false);
    }, 500);
  };

  return (
    <PropertyContext.Provider value={{
      properties,
      searchProperties,
      getProperty,
      addProperty,
      updateProperty,
      deleteProperty,
      isLoading
    }}>
      {children}
    </PropertyContext.Provider>
  );
};