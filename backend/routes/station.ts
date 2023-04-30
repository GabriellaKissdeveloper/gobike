import express from 'express';
const stationRouter: express.Router = express.Router();

import { getAllStations } from '../controllers/station';
import { searchStations } from '../controllers/search';

stationRouter.get('/', getAllStations);
stationRouter.get('/search', searchStations);

export default stationRouter;
