import express from 'express';
import Station from '../database/stationModel';

export const getAllStations = async (
  req: express.Request,
  res: express.Response,
) => {
  const stations = await Station.find({});

  const results = stations.map((station) => {
    return {
      id: station.ID,
      name: station.Nimi,
      address: station.Osoite,
      city: station.Kaupunki,
      capacity: station.Kapasiteet,
      x: station.x,
      y: station.y,
    };
  });

  res.json({ stations: results });
};
