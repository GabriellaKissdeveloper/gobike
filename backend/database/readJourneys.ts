import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { readdir } from 'node:fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import { IJourney } from './journeyModel';
import { IStation } from './stationModel';
import { parseJourneysFromCSVFile, parseStationsFromCSVFile } from './parseCSV';

dotenv.config();
const uri: string = String(process.env.MONGO_URI);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

mongoose.connect(uri);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const readJourneys = async (): Promise<void> => {
  await db.createCollection<IJourney>('journeys');
  const journeysCollection = db.collection<IJourney>('journeys');
  await db.createCollection<IStation>('stations');
  const stationsCollection = db.collection<IStation>('stations');

  const filesDirectory = path.join(__dirname, './data');
  try {
    const files = await readdir(filesDirectory);
    const filteredFiles = files.filter(
      (filename) => path.extname(filename) === '.csv',
    );

    for (const file of filteredFiles) {
      const filepath = path.join(filesDirectory, file);

      if (filepath.includes('station')) {
        const data = await parseStationsFromCSVFile(filepath);
        const filteredData = data.filter((item) => item.ID > 0);
        const result = await stationsCollection.insertMany(filteredData);
        console.log(
          `Successfully inserted ${result.insertedCount} rows into the stations collection`,
        );
      } else {
        const data = await parseJourneysFromCSVFile(filepath);
        const filteredData = data.filter(
          (item) => item.CoveredDistance >= 10 && item.Duration >= 10,
        );

        const result = await journeysCollection.insertMany(filteredData);
        console.log(
          `Successfully inserted ${result.insertedCount} rows into the journeys collection`,
        );
      }
    }
  } catch (err) {
    console.error(err);
  }
};

readJourneys().then(() => mongoose.connection.close());
