import { createReadStream } from 'fs';
import csv from 'csv-parser';

import { IJourney } from './journeyModel';
import { IStation } from './stationModel';

export const parseJourneysFromCSVFile = async (
  filePath: string,
): Promise<any[]> => {
  const results: IJourney[] = [];

  return new Promise((resolve: any, reject) => {
    const stream = createReadStream(filePath).on('error', (error) =>
      reject(error),
    );

    stream
      .pipe(
        csv([
          'Departure',
          'Return',
          'DepartureStationId',
          'DepartureStationName',
          'ReturnStationId',
          'ReturnStationName',
          'CoveredDistance',
          'Duration',
        ]),
      )
      .on('data', (data) => {
        try {
          data.Departure = new Date(data.Departure);
          data.Return = new Date(data.Return);
          data.DepartureStationId = parseInt(data.DepartureStationId);
          data.ReturnStationId = parseInt(data.ReturnStationId);
          data.Duration = parseInt(data.Duration);
          data.CoveredDistance = parseInt(data.CoveredDistance);
          results.push(data);
        } catch (error: any) {
          console.error(`Error processing row: ${error.message}`);
        }
      })
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
};

export const parseStationsFromCSVFile = async (
  filePath: string,
): Promise<any[]> => {
  const results: IStation[] = [];

  return new Promise((resolve: any, reject) => {
    const stream = createReadStream(filePath).on('error', (error) =>
      reject(error),
    );

    stream
      .pipe(
        csv([
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
        ]),
      )
      .on('data', (data) => {
        try {
          data.FID = parseInt(data.FID);
          data.ID = parseInt(data.ID);
          data.Kapasiteet = parseInt(data.Kapasiteet);
          data.x = parseFloat(data.x);
          data.y = parseFloat(data.y);
          results.push(data);
        } catch (error: any) {
          console.error(`Error processing row: ${error.message}`);
        }
      })
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
};
