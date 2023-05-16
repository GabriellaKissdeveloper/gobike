const mongoose = require('mongoose');
const request = require('supertest');

import app from '../app';
import Station from '../database/stationModel';

let resAllStations: any;
let resSingleStation: any;
let resInvalidStation: any;
let resInvalidDate: any;
let resTopStations: any;
let newAllStations: any;
let startDate = new Date('2021-05-01');
let endDate = new Date('2021-06-30');
let id = 505;

beforeAll(async () => {
  resAllStations = await request(app).get('/stations');
  resSingleStation = await request(app).get(
    `/stations/station/${id}?startDate=${startDate}&endDate=${endDate}`,
  );
  resInvalidStation = await request(app).get(
    `/stations/station/800?startDate=${startDate}&endDate=${endDate}`,
  );
  resInvalidDate = await request(app).get(
    `/stations/station/${id}?startDate=2021-05-10&endDate=2021-05-09`,
  );
  resTopStations = await request(app).get(
    `/stations/top/${id}?startDate=${startDate}&endDate=${endDate}`,
  );
}, 100000);

describe('Testing stations route', () => {
  test('Get all stations', () => {
    expect(resAllStations.body.status).toEqual(200);
    expect(resAllStations.body.total).toEqual(457);
  });
  test('Pagination - only 20 stations are returned at once', () => {
    expect(resAllStations.body.stations).toHaveLength(20);
  });
  test('Stations are in ascending order started with ID:1', () => {
    expect(resAllStations.body.stations[0].ID).toEqual(1);
    expect(resAllStations.body.stations[0].Nimi).toEqual('Kaivopuisto');
  });
});

describe('Testing single station route', () => {
  test('Get single station with valid ID:505', () => {
    expect(resSingleStation.body.status).toEqual(200);
  });

  test('Single station view returns info about total departure, return and distance', () => {
    expect(resSingleStation.body.totalDeparture).not.toBeNull();
    expect(resSingleStation.body.totalReturn).not.toBeNull();
    expect(resSingleStation.body.averageDepartureDistance).toHaveLength(1);
    expect(resSingleStation.body.averageReturnDistance).toHaveLength(1);
  });

  test('Single station has top 5 return and departure stations', () => {
    expect(resTopStations.body.top5return).toHaveLength(5);
    expect(resTopStations.body.top5departure).toHaveLength(5);
  });

  test('Invalid station ID:800', () => {
    expect(resInvalidStation.body.status).toEqual(404);
    expect(resInvalidStation.body.message).toEqual(
      'There is no station with this ID!',
    );
  });

  test('Start date is greater than departure date in request', () => {
    expect(resInvalidDate.body.status).toEqual(400);
    expect(resInvalidDate.body.message).toEqual(
      'Start date cannot be greater than end date!',
    );
  });
});

describe('Test search functionality', () => {
  let string = 'hana';
  test('Search with valid string', async () => {
    const searchRes = await request(app).get(
      `/stations/search?string=${string}`,
    );
    expect(searchRes.body.status).toEqual(200);
    expect(searchRes.body.searchStations).toHaveLength(2);
  });

  test('Search with valid string, but no result', async () => {
    string = 'hanaaaa';
    const searchRes = await request(app).get(
      `/stations/search?string=${string}`,
    );
    expect(searchRes.body.status).toEqual(404);
    expect(searchRes.body.message).toEqual(
      "No station's found with this search criteria.",
    );
  });

  test('Search with invalid string', async () => {
    string = '<p>select * from stations</p>';
    const searchRes = await request(app).get(
      `/stations/search?string=${string}`,
    );
    expect(searchRes.body.status).toEqual(404);
    expect(searchRes.body.message).toEqual(
      "No station's found with this search criteria.",
    );
  });
});

describe('Create a new station', () => {
  const query = {
    FID: 459,
    ID: 801,
    Nimi: 'Juhani Ahon',
    Namn: 'Juhani Aho',
    Name: 'Juhani Ahon',
    Osoite: 'Juhani Ahon tie 5',
    Adress: 'Juhani Aho väg 5',
    Kaupunki: 'Helsinki',
    Stad: 'Helsingfors',
    Operaattor: 'CityBike Helsinki',
    Kapasiteet: 20,
    x: 24.939271,
    y: 60.155937,
  };
  test('Create a new station with valid data', async () => {
    const result = await request(app)
      .post('/stations/new')
      .send(JSON.stringify(query))
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    expect(result._body.status).toEqual(200);
    expect(result._body.message).toEqual(
      'New station has been created successfully.',
    );
  });

  test('After creating a new station, total number increased with 1', async () => {
    newAllStations = await request(app).get('/stations');
    expect(newAllStations.body.total).toEqual(resAllStations.body.total + 1);
  });

  test('Try to create a new station with existing ID number', async () => {
    const result = await request(app)
      .post('/stations/new')
      .send(JSON.stringify({ ID: 801 }))
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    expect(result._body.status).toEqual(409);
    expect(result._body.message).toEqual(
      'This ID already exist. ID must be unique.',
    );
  });

  test('Try to create a new station with invalid geocoordinates', async () => {
    const result = await request(app)
      .post('/stations/new')
      .send(JSON.stringify({ ID: 802, x: 185.15246, y: -95.25346 }))
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    expect(result._body.status).toEqual(409);
    expect(result._body.message).toEqual(
      'Latitude must be between -90 and +90, longitude must be between -180 and +180.',
    );
  });

  // to pass the test more times, we need to restore the original state
  test('Delete the newly created station', async () => {
    const res = await Station.deleteOne({ ID: 801 });
    expect(res.deletedCount).toEqual(1);
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});
