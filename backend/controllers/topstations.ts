import express from 'express';
import Journey from '../database/journeyModel';

export const top5Stations = async (
  req: express.Request,
  res: express.Response,
) => {
  const id = parseInt(req.params.id);
  let start = new Date(String(req.query.startDate));
  let end = new Date(String(req.query.endDate));
  const matching_dep = {
    $and: [
      { DepartureStationId: id },
      { Departure: { $gte: start } },
      { Return: { $lte: end } },
    ],
  };
  const matching_ret = {
    $and: [
      { ReturnStationId: id },
      { Departure: { $gte: start } },
      { Return: { $lte: end } },
    ],
  };
  const top5return = await Journey.aggregate([
    { $match: matching_dep },
    {
      $group: {
        _id: '$ReturnStationName',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);
  const top5departure = await Journey.aggregate([
    { $match: matching_ret },
    {
      $group: {
        _id: '$DepartureStationName',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);

  res.json({ top5return, top5departure });
};
