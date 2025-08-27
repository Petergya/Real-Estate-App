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
}

interface PropertyContextType {
  properties: Property[];
  searchProperties: (filters: any) => Property[];
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
    title: 'Luxury 3-Bedroom Apartment in Victoria Island',
    description: 'Beautiful modern apartment with stunning ocean views, fully furnished with premium amenities.',
    price: { usd: 2500, ngn: 4000000 },
    type: 'apartment',
    status: 'for-rent',
    location: {
      address: '123 Ahmadu Bello Way, Victoria Island',
      city: 'Lagos',
      state: 'Lagos',
      coordinates: { lat: 6.4281, lng: 3.4219 }
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
    title: '4-Bedroom Duplex in Lekki Phase 1',
    description: 'Spacious family home in a serene environment with modern facilities and excellent security.',
    price: { usd: 450000, ngn: 720000000 },
    type: 'house',
    status: 'for-sale',
    location: {
      address: '45 Admiralty Way, Lekki Phase 1',
      city: 'Lagos',
      state: 'Lagos',
      coordinates: { lat: 6.4698, lng: 3.5852 }
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
    title: 'Commercial Space in Ikeja',
    description: 'Prime commercial space suitable for offices or retail business in the heart of Ikeja.',
    price: { usd: 300000, ngn: 480000000 },
    type: 'commercial',
    status: 'for-sale',
    location: {
      address: '23 Allen Avenue, Ikeja',
      city: 'Lagos',
      state: 'Lagos',
      coordinates: { lat: 6.6018, lng: 3.3515 }
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
    title: 'Commercial Space in Ikeja',
    description: 'Prime commercial space suitable for offices or retail business in the heart of Ikeja.',
    price: { usd: 300000, ngn: 480000000 },
    type: 'commercial',
    status: 'for-sale',
    location: {
      address: '23 Allen Avenue, Ikeja',
      city: 'Lagos',
      state: 'Lagos',
      coordinates: { lat: 6.6018, lng: 3.3515 }
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
    title: 'Commercial Space in Ikeja',
    description: 'Prime commercial space suitable for offices or retail business in the heart of Ikeja.',
    price: { usd: 300000, ngn: 480000000 },
    type: 'commercial',
    status: 'for-sale',
    location: {
      address: '23 Allen Avenue, Ikeja',
      city: 'Lagos',
      state: 'Lagos',
      coordinates: { lat: 6.6018, lng: 3.3515 }
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
    title: 'Commercial Space in Ikeja',
    description: 'Prime commercial space suitable for offices or retail business in the heart of Ikeja.',
    price: { usd: 300000, ngn: 480000000 },
    type: 'commercial',
    status: 'for-sale',
    location: {
      address: '23 Allen Avenue, Ikeja',
      city: 'Lagos',
      state: 'Lagos',
      coordinates: { lat: 6.6018, lng: 3.3515 }
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
  }
];

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [isLoading, setIsLoading] = useState(false);

  const searchProperties = (filters: any) => {
    return properties.filter(property => {
      if (filters.type && property.type !== filters.type) return false;
      if (filters.status && property.status !== filters.status) return false;
      if (filters.minPrice && property.price.usd < filters.minPrice) return false;
      if (filters.maxPrice && property.price.usd > filters.maxPrice) return false;
      if (filters.bedrooms && property.features.bedrooms !== filters.bedrooms) return false;
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