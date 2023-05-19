import express from 'express';
import Journey from '../database/journeyModel';
import Station from '../database/stationModel';

export const getAllJourneys = async (
  req: express.Request,
  res: express.Response,
) => {
  const { pageNo = 0, limit = 20 } = req.query;
  const total = await Journey.count();
  const journeys = await Journey.find({})
    .skip(parseInt(pageNo as string) * parseInt(limit as string))
    .limit(parseInt(limit as string))
    .select('DepartureStationName ReturnStationName CoveredDistance Duration');

  res.json({ journeys, total, status: 200 });
};

export const createNewJourney = async (
  req: express.Request,
  res: express.Response,
) => {
  if (
    typeof req.body.DepartureStationId === 'string' ||
    typeof req.body.ReturnStationId === 'string'
  ) {
    return res.json({ status: 500, message: 'ID must be a number' });
  }
  const depStation = await Station.findOne({ ID: req.body.DepartureStationId });
  const retStation = await Station.findOne({ ID: req.body.ReturnStationId });
  if (req.body.Departure > req.body.Return) {
    return res.json({
      status: 400,
      message: 'Start date/time cannot be greater than end date/time!',
    });
  } else if (req.body.Duration < 10) {
    return res.json({
      message: 'Duration must be greater than 10 seconds.',
      status: 409,
    });
  } else if (req.body.CoveredDistance < 10) {
    return res.json({
      message: 'Covered distance must be greater than 10 meters.',
      status: 409,
    });
  } else if (!depStation) {
    return res.json({
      message:
        'There is not a departure station with this ID. Please check again.',
      status: 409,
    });
  } else if (!retStation) {
    return res.json({
      message:
        'There is not a return station with this ID. Please check again.',
      status: 409,
    });
  } else if (depStation?.Nimi != req.body.DepartureStationName) {
    return res.json({
      message:
        'Departure station name does not match with ID. Please check them again.',
      status: 409,
    });
  } else if (retStation?.Nimi != req.body.ReturnStationName) {
    return res.json({
      message:
        'Return station name does not match with ID. Please check them again.',
      status: 409,
    });
  } else {
    try {
      const newJourney = new Journey(req.body);
      await newJourney.save();
      return res.json({
        message: 'New journey has been created successfully.',
        newJourney,
        status: 200,
      });
    } catch (err) {
      return res.json({ message: err, status: 500 });
    }
  }
};
