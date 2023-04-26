import express from 'express';
const journeyRouter: express.Router = express.Router();

import { getAllJourneys } from '../controllers/journey';

journeyRouter.get('/', getAllJourneys);

export default journeyRouter;
