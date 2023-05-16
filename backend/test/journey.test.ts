const mongoose = require('mongoose');
const request = require('supertest');

import app from '../app';
import Journey from '../database/journeyModel';

let resAllJourneys: any;
let newAllJourneys: any;
let resNewJourney: any;

beforeAll(async () => {
  resAllJourneys = await request(app).get('/journeys');
}, 1000000);

describe('Testing journeys route', () => {
  test('Get all journeys', () => {
    expect(resAllJourneys.body.status).toEqual(200);
    expect(resAllJourneys.body.total).toEqual(1964138);
  });
  test('Pagination - only 20 journeys are returned at once', () => {
    expect(resAllJourneys.body.journeys).toHaveLength(20);
  });
  test("First route departure station's name is Laajalahden aukio", () => {
    expect(resAllJourneys.body.journeys[0].DepartureStationName).toEqual(
      'Laajalahden aukio',
    );
  });
});

describe('Test search functionality', () => {
  let string = 'Itämerentori';
  test('Search with valid string', async () => {
    const searchRes = await request(app).get(
      `/journeys/search?string=${string}`,
    );
    expect(searchRes.body.status).toEqual(200);
    expect(searchRes.body.total).toEqual(64200);
  });

  test('Search with valid string, but no result', async () => {
    string = 'itämerentorisss';
    const searchRes = await request(app).get(
      `/journeys/search?string=${string}`,
    );
    expect(searchRes.body.status).toEqual(404);
    expect(searchRes.body.message).toEqual(
      'No journeys found with this search criteria.',
    );
  });

  test('Search with invalid string', async () => {
    string = '<p>something</p>';
    const searchRes = await request(app).get(
      `/journeys/search?string=${string}`,
    );
    expect(searchRes.body.status).toEqual(404);
    expect(searchRes.body.message).toEqual(
      'No journeys found with this search criteria.',
    );
  });
});

describe('Create a new journey', () => {
  const query = {
    Departure: '2021-05-16T15:10',
    Return: '2021-05-16T15:15',
    DepartureStationId: 501,
    DepartureStationName: 'Hanasaari',
    ReturnStationId: 503,
    ReturnStationName: 'Keilalahti',
    CoveredDistance: 1580,
    Duration: 150,
  };
  test('Create a new station with valid data', async () => {
    resNewJourney = await request(app)
      .post('/journeys/new')
      .send(JSON.stringify(query))
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    expect(resNewJourney._body.status).toEqual(200);
    expect(resNewJourney._body.message).toEqual(
      'New journey has been created successfully.',
    );
  });

  test('After creating a new journey, total number increased with 1', async () => {
    newAllJourneys = await request(app).get('/journeys');
    expect(newAllJourneys.body.total).toEqual(resAllJourneys.body.total + 1);
  });

  test('Try to create a new journey with duration < 10 sec', async () => {
    const result = await request(app)
      .post('/journeys/new')
      .send(
        JSON.stringify({
          DepartureStationId: 501,
          ReturnStationId: 503,
          Duration: 1,
        }),
      )
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    expect(result._body.status).toEqual(409);
    expect(result._body.message).toEqual(
      'Duration must be greater than 10 seconds.',
    );
  });

  test('Try to create a new journey with distance < 10 m', async () => {
    const result = await request(app)
      .post('/journeys/new')
      .send(
        JSON.stringify({
          DepartureStationId: 501,
          ReturnStationId: 503,
          CoveredDistance: 8,
        }),
      )
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    expect(result._body.status).toEqual(409);
    expect(result._body.message).toEqual(
      'Covered distance must be greater than 10 meters.',
    );
  });

  test('Try to create a new journey with invalid departure station ID', async () => {
    const result = await request(app)
      .post('/journeys/new')
      .send(
        JSON.stringify({
          DepartureStationId: 803,
          ReturnStationId: 503,
        }),
      )
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    expect(result._body.status).toEqual(409);
    expect(result._body.message).toEqual(
      'There is not a departure station with this ID. Please check again.',
    );
  });

  test('Try to create a new journey with invalid return station ID', async () => {
    const result = await request(app)
      .post('/journeys/new')
      .send(
        JSON.stringify({
          DepartureStationId: 501,
          ReturnStationId: 803,
        }),
      )
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    expect(result._body.status).toEqual(409);
    expect(result._body.message).toEqual(
      'There is not a return station with this ID. Please check again.',
    );
  });

  test('Try to create a new journey when departure station ID does not match with name', async () => {
    const result = await request(app)
      .post('/journeys/new')
      .send(
        JSON.stringify({
          DepartureStationId: 501,
          DepartureStationName: 'Hanasa',
          ReturnStationId: 503,
          ReturnStationName: 'Keilalahti',
        }),
      )
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    expect(result._body.status).toEqual(409);
    expect(result._body.message).toEqual(
      'Departure station name does not match with ID. Please check them again.',
    );
  });

  test('Try to create a new journey when return station ID does not match with name', async () => {
    const result = await request(app)
      .post('/journeys/new')
      .send(
        JSON.stringify({
          DepartureStationId: 501,
          DepartureStationName: 'Hanasaari',
          ReturnStationId: 503,
          ReturnStationName: 'Keilahti',
        }),
      )
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    expect(result._body.status).toEqual(409);
    expect(result._body.message).toEqual(
      'Return station name does not match with ID. Please check them again.',
    );
  });

  test('Try to create a new journey when departure date greater than return date', async () => {
    const result = await request(app)
      .post('/journeys/new')
      .send(
        JSON.stringify({
          Departure: '2021-05-16T15:10',
          Return: '2021-05-15T15:15',
          DepartureStationId: 501,
          ReturnStationId: 503,
        }),
      )
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    expect(result._body.status).toEqual(400);
    expect(result._body.message).toEqual(
      'Start date/time cannot be greater than end date/time!',
    );
  });

  // to pass the test more times, we need to restore the original state
  test('Delete the newly created journey', async () => {
    const res = await Journey.deleteOne({
      _id: resNewJourney._body.newJourney._id,
    });
    expect(res.deletedCount).toEqual(1);
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});
