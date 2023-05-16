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
  const { field, order } = req.query;
  let sortObj: { [key: string]: any } = {};
  let key = field as string;
  sortObj[key] = order === 'asc' ? 1 : -1;
  const searchStations = await Station.find(searchString)
    .sort(sortObj)
    .select('ID Nimi Osoite Kaupunki Kapasiteet x y');
  if (searchStations.length !== 0) {
    res.json({ searchStations, status: 200 });
  } else {
    res.json({
      message: "No station's found with this search criteria.",
      status: 404,
      searchStations,
    });
  }
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

  if (searchJourneys.length !== 0) {
    res.json({ searchJourneys, status: 200, total });
  } else {
    res.json({
      message: 'No journeys found with this search criteria.',
      status: 404,
      searchJourneys,
    });
  }
};
