import express from 'express';
import Journey from '../database/journeyModel';

export const getAllJourneys = async (
  req: express.Request,
  res: express.Response,
) => {
  const { pageNo = 0, limit = 20 } = req.query;
  const total = await Journey.count();
  const journeys = await Journey.find({})
    .skip(parseInt(pageNo as string) * parseInt(limit as string))
    .limit(parseInt(limit as string));

  const results = journeys.map((journey) => {
    return {
      DepartureStationName: journey.DepartureStationName,
      ReturnStationName: journey.ReturnStationName,
      CoveredDistance: journey.CoveredDistance,
      Duration: journey.Duration,
    };
  });

  res.json({ journeys: results, total: total });
};
