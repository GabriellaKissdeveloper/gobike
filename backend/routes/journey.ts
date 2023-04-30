import express from 'express';
const journeyRouter: express.Router = express.Router();

import { getAllJourneys } from '../controllers/journey';
import { searchJourneys } from '../controllers/search';

journeyRouter.get('/', getAllJourneys);
journeyRouter.get('/search', searchJourneys);

export default journeyRouter;
