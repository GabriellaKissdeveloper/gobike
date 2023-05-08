export interface Station {
  FID: number;
  ID: number;
  Nimi: string;
  Namn: string;
  Name: string;
  Osoite: string;
  Adress: string;
  Kaupunki: string;
  Stad: string;
  Operaattor: string;
  Kapasiteet: number;
  x: number;
  y: number;
}

export interface Journey {
  Departure: Date;
  Return: Date;
  DepartureStationId: number;
  DepartureStationName: string;
  ReturnStationId: number;
  ReturnStationName: string;
  CoveredDistance: number;
  Duration: number;
}

export interface TopStations {
  _id: string;
  count: number;
}
