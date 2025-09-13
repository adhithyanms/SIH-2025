export interface User {
  id: string;
  phoneNumber: string;
  role: 'conductor' | 'passenger' | 'admin';
  name: string;
  conductorId?: string;
  isVerified: boolean;
}

export interface Bus {
  id: string;
  routeNumber: string;
  currentStop: string;
  nextStop: string;
  currentLocation: {
    lat: number;
    lng: number;
  };
  crowdLevel: 'low' | 'medium' | 'high';
  conductorId: string;
  passengerCount: number;
  maxCapacity: number;
  estimatedArrival: string;
  isActive: boolean;
}

export interface Route {
  id: string;
  routeNumber: string;
  routeName: string;
  stops: Stop[];
  isActive: boolean;
}

export interface Stop {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  order: number;
}

export interface Ticket {
  id: string;
  routeNumber: string;
  fromStop: string;
  toStop: string;
  fare: number;
  timestamp: string;
  qrCode: string;
  conductorId: string;
}

export interface Alert {
  id: string;
  busId: string;
  type: 'emergency' | 'breakdown' | 'delay' | 'info';
  message: string;
  timestamp: string;
  isResolved: boolean;
}