import express from 'express';
const stationRouter: express.Router = express.Router();

import {
  getAllStations,
  getSingleStation,
  createNewStation,
} from '../controllers/station';
import { top5Stations } from '../controllers/topstations';
import { searchStations } from '../controllers/search';

stationRouter.get('/', getAllStations);
stationRouter.post('/new', createNewStation);
stationRouter.get('/search', searchStations);
stationRouter.get('/top/:id', top5Stations);
stationRouter.get('/station/:id', getSingleStation);

export default stationRouter;
