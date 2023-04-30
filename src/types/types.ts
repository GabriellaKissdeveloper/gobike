export interface Station {
  ID: number;
  Nimi: string;
  Osoite: string;
  Kaupunki: string;
  Kapasiteet: number;
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
