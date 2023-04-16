import express from 'express';
const stationRouter: express.Router = express.Router();

import { getAllStations } from '../controllers/station';

stationRouter.get('/', getAllStations);

export default stationRouter;
