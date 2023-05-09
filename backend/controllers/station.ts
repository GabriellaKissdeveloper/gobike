import express from 'express';
import Station from '../database/stationModel';
import Journey from '../database/journeyModel';

export const getAllStations = async (
  req: express.Request,
  res: express.Response,
) => {
  const { pageNo = 0, limit = 20, field, order } = req.query;
  let sortObj: { [key: string]: any } = {};
  let key = field as string;
  sortObj[key] = order === 'asc' ? 1 : -1;
  const total = await Station.count();
  const stations = await Station.find({})
    .sort(sortObj)
    .skip(parseInt(pageNo as string) * parseInt(limit as string))
    .limit(parseInt(limit as string))
    .select('ID Nimi Osoite Kaupunki Kapasiteet x y');
  res.json({ stations, total });
};

export const getSingleStation = async (
  req: express.Request,
  res: express.Response,
) => {
  const id = parseInt(req.params.id);
  let start = new Date(String(req.query.startDate));
  let end = new Date(String(req.query.endDate));

  if (start > end) {
    const station = await Station.find({ ID: id }).select('ID Nimi Osoite x y');
    return res.json({
      station,
      message: 'Start date cannot be greater than end date!',
    });
  } else {
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
    const station = await Station.find({ ID: id }).select('ID Nimi Osoite x y');
    const totalDeparture = await Journey.find({
      DepartureStationId: id,
      Departure: { $gte: start },
      Return: { $lte: end },
    }).count();
    const totalReturn = await Journey.find({
      ReturnStationId: id,
      Departure: { $gte: start },
      Return: { $lte: end },
    }).count();
    const averageDepartureDistance = await Journey.aggregate([
      {
        $match: matching_dep,
      },
      {
        $group: {
          _id: '$DepartureStationId',
          average: { $avg: '$CoveredDistance' },
          avgtime: { $avg: '$Duration' },
        },
      },
    ]);
    const averageReturnDistance = await Journey.aggregate([
      { $match: matching_ret },
      {
        $group: {
          _id: '$ReturnStationId',
          average: { $avg: '$CoveredDistance' },
          avgtime: { $avg: '$Duration' },
        },
      },
    ]);

    res.json({
      station,
      totalDeparture,
      totalReturn,
      averageDepartureDistance,
      averageReturnDistance,
    });
  }
};

export const createNewStation = async (
  req: express.Request,
  res: express.Response,
) => {
  const id = req.body.ID;
  const station = await Station.findOne({ ID: id });
  if (station) {
    return res.json({
      message: 'This ID already exist. ID must be unique.',
      id,
      status: 409,
    });
  } else {
    try {
      const newStation = new Station(req.body);
      await newStation.save();
      return res.json({
        message: 'New station has been created successfully.',
        newStation,
        status: 200,
      });
    } catch (err) {
      return res.json({ message: err, status: 500 });
    }
  }
};
