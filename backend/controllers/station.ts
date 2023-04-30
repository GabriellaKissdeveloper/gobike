import express from 'express';
import Station from '../database/stationModel';

export const getAllStations = async (
  req: express.Request,
  res: express.Response,
) => {
  const { pageNo = 0, limit = 20 } = req.query;
  const total = await Station.count();
  const stations = await Station.find({})
    .skip(parseInt(pageNo as string) * parseInt(limit as string))
    .limit(parseInt(limit as string))
    .select('ID Nimi Osoite Kaupunki Kapasiteet x y');

  res.json({ stations, total });
};
