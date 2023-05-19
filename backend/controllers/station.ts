import express from 'express';
import Station from '../database/stationModel';
import Journey from '../database/journeyModel';

export const getAllStations = async (
  req: express.Request,
  res: express.Response,
) => {
  const { pageNo = 0, limit = 20, field = 'ID', order = 'asc' } = req.query;
  let sortObj: { [key: string]: any } = {};
  let key = field as string;
  sortObj[key] = order === 'asc' ? 1 : -1;
  const total = await Station.count();
  const stations = await Station.find({})
    .sort(sortObj)
    .skip(parseInt(pageNo as string) * parseInt(limit as string))
    .limit(parseInt(limit as string))
    .select('ID Nimi Osoite Kaupunki Kapasiteet x y');
  res.json({ stations, total, status: 200 });
};

export const getSingleStation = async (
  req: express.Request,
  res: express.Response,
) => {
  const id = parseInt(req.params.id);
  let start = new Date(String(req.query.startDate));
  let end = new Date(String(req.query.endDate));

  if (start > end) {
    return res.json({
      status: 400,
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
    if (station.length === 0) {
      return res.json({
        status: 404,
        message: 'There is no station with this ID!',
      });
    } else {
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
        status: 200,
      });
    }
  }
};

export const createNewStation = async (
  req: express.Request,
  res: express.Response,
) => {
  const id = req.body.ID;
  if (
    typeof id === 'string' ||
    typeof req.body.Kapasiteet === 'string' ||
    typeof req.body.x === 'string' ||
    typeof req.body.y === 'string'
  ) {
    return res.json({ status: 500, message: 'It must be a number' });
  }
  if (
    typeof req.body.Nimi !== 'string' ||
    typeof req.body.Namn !== 'string' ||
    typeof req.body.Name !== 'string' ||
    typeof req.body.Osoite !== 'string' ||
    typeof req.body.Adress !== 'string' ||
    typeof req.body.Kaupunki !== 'string' ||
    typeof req.body.Stad !== 'string' ||
    typeof req.body.Operaattor !== 'string'
  ) {
    return res.json({ status: 500, message: 'This field must contain text' });
  }
  const latitude: number = req.body.y;
  const longitude: number = req.body.x;
  const station = await Station.findOne({ ID: id });
  if (station) {
    return res.json({
      message: 'This ID already exist. ID must be unique.',
      id,
      status: 409,
    });
  } else if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
    return res.json({
      message:
        'Latitude must be between -90 and +90, longitude must be between -180 and +180.',
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
