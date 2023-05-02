import express from 'express';
const stationRouter: express.Router = express.Router();

import { getAllStations, getSingleStation } from '../controllers/station';
import { searchStations } from '../controllers/search';

stationRouter.get('/', getAllStations);
stationRouter.get('/search', searchStations);
stationRouter.get('/station/:id', getSingleStation);

export default stationRouter;
