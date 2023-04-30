import express from 'express';
import Station from '../database/stationModel';
import Journey from '../database/journeyModel';

export const searchStations = async (
  req: express.Request,
  res: express.Response,
) => {
  let string = new RegExp(`${req.query.string}`, 'i');
  let searchString = {
    $or: [{ Nimi: string }, { Osoite: string }, { Kaupunki: string }],
  };

  const searchStations = await Station.find(searchString).select(
    'ID Nimi Osoite Kaupunki Kapasiteet x y',
  );

  res.json({ searchStations });
};

export const searchJourneys = async (
  req: express.Request,
  res: express.Response,
) => {
  const { pageNo = 0, limit = 20 } = req.query;
  let string = new RegExp(`${req.query.string}`, 'i');
  let searchString = {
    $or: [{ DepartureStationName: string }, { ReturnStationName: string }],
  };

  const total = await Journey.find(searchString).count();
  const searchJourneys = await Journey.find(searchString)
    .skip(parseInt(pageNo as string) * parseInt(limit as string))
    .limit(parseInt(limit as string))
    .select('DepartureStationName ReturnStationName CoveredDistance Duration');

  res.json({ searchJourneys, total });
};
