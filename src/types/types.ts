export interface Station {
  id: number;
  name: string;
  address: string;
  city: string;
  capacity: number;
  x: number;
  y: number;
}

export interface Journey {
  Departure: Date;
  DepartureStationName: string;
  ReturnStationName: string;
  CoveredDistance: number;
  Duration: number;
}
