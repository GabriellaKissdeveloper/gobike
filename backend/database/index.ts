import fs from 'fs';
import { parse } from 'csv-parse';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { IStation } from './stationModel';
import Station from './stationModel';

dotenv.config();
const uri: string = String(process.env.MONGO_URI);

const readDataFromCSV = async () => {
  const headers = [
    'FID',
    'ID',
    'Nimi',
    'Namn',
    'Name',
    'Osoite',
    'Adress',
    'Kaupunki',
    'Stad',
    'Operaattor',
    'Kapasiteet',
    'x',
    'y',
  ];
  const fileContent = fs.readFileSync('database/station.csv');
  let data: any[] = [];

  parse(
    fileContent,
    {
      delimiter: ',',
      columns: headers,
      fromLine: 2,
      skip_empty_lines: true,
      cast: (columnValue, context) => {
        if (
          context.column === 'FID' ||
          context.column === 'ID' ||
          context.column === 'Kapasiteet'
        ) {
          return parseInt(columnValue, 10);
        } else if (context.column === 'x' || context.column === 'y') {
          return parseFloat(columnValue);
        }
        return columnValue;
      },
    },
    async (error, result: IStation[]) => {
      if (error) {
        console.error(error);
      }
      mongoose
        .connect(uri)
        .then(async () => {
          console.log('Database connected!');
          await Station.deleteMany({});
          for (let i = 0; i < result.length; i++) {
            const station = new Station({
              FID: result[i].FID,
              ID: result[i].ID,
              Nimi: result[i].Nimi,
              Namn: result[i].Namn,
              Name: result[i].Name,
              Osoite: result[i].Osoite,
              Adress: result[i].Adress,
              Kaupunki: result[i].Kaupunki,
              Stad: result[i].Stad,
              Operaattor: result[i].Operaattor,
              Kapasiteet: result[i].Kapasiteet,
              x: result[i].x,
              y: result[i].y,
            });
            await station.save();
          }
          console.log('Database disconnected!');
          process.exit(0);
        })
        .catch((err) => {
          console.log('Connection Error!!!');
          console.log(err);
        });
    },
  );
};

readDataFromCSV();
