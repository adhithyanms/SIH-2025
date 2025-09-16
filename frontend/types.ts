export interface Stop {
  id: string;
  name: string;
  lat?: number;
  lng?: number;
}

export interface Route {
  routeNumber: string;
  routeName: string;
  stops: Stop[];
}
