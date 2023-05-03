import express from 'express';
import Journey from '../database/journeyModel';

export const top5Stations = async (
  req: express.Request,
  res: express.Response,
) => {
  const id = parseInt(req.params.id);
  const matching_dep = { DepartureStationId: id };
  const matching_ret = { ReturnStationId: id };
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
