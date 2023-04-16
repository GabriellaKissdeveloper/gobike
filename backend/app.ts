import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import stationRouter from './routes/station';

dotenv.config();
const uri: string = String(process.env.MONGO_URI);

mongoose
  .connect(uri)
  .then(() => {
    app.listen(8000, () =>
      console.log('Database connected, server is listening on port 8000!'),
    );
  })
  .catch((error) => console.log('Database connection failed: ', error));

const app = express();
app.use(cors());
app.use(express.json());
app.use('/stations', stationRouter);