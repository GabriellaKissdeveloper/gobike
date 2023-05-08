import express from 'express';
const journeyRouter: express.Router = express.Router();

import { getAllJourneys, createNewJourney } from '../controllers/journey';
import { searchJourneys } from '../controllers/search';

journeyRouter.get('/', getAllJourneys);
journeyRouter.post('/new', createNewJourney);
journeyRouter.get('/search', searchJourneys);

export default journeyRouter;
