import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import { Station, TopStations } from '../types/types';
import Loading from '../components/Loading';
import MapView from '../components/MapView';

export default function SingleStation() {
  const [singleStation, setSingleStation] = useState<Station[]>([]);
  const [topReturn, setTopReturn] = useState<TopStations[]>([]);
  const [topDeparture, setTopDeparture] = useState<TopStations[]>([]);
  const [totalReturn, setTotalReturn] = useState(0);
  const [totalDeparture, setTotalDeparture] = useState(0);
  const [averageReturnDistance, setAverageReturnDistance] = useState(0);
  const [averageDepartureDistance, setAverageDepartureDistance] = useState(0);
  const [averageReturnDuration, setAverageReturnDuration] = useState(0);
  const [averageDepartureDuration, setAverageDepartureDuration] = useState(0);
  const [startDate, setStartDate] = useState('2021-05-01');
  const [endDate, setEndDate] = useState('2021-06-30');
  const [message, setMessage] = useState('');
  const [show, setShow] = useState(false);
  const { id } = useParams<{ id: string }>();

  let formatStartDate = startDate.split('-').reverse().join('/');
  let formatEndDate = endDate.split('-').reverse().join('/');

  const fetchSingleStation = async (id: string) => {
    const response = await fetch(
      `http://localhost:8000/stations/station/${id}?startDate=${startDate}&endDate=${endDate}`,
    );
    const data = await response.json();
    if (data.message) {
      setMessage(data.message);
      setSingleStation(data.station);
      setShow(true);
      setTotalReturn(0);
      setTotalDeparture(0);
      setAverageDepartureDistance(0);
      setAverageReturnDistance(0);
      setAverageDepartureDuration(0);
      setAverageReturnDuration(0);
    } else {
      setSingleStation(data.station);
      setTotalReturn(data.totalReturn);
      setTotalDeparture(data.totalDeparture);
      setAverageDepartureDistance(data.averageDepartureDistance[0].average);
      setAverageReturnDistance(data.averageReturnDistance[0].average);
      setAverageDepartureDuration(data.averageDepartureDistance[0].avgtime);
      setAverageReturnDuration(data.averageReturnDistance[0].avgtime);
    }
  };

  const fetchTopStations = async (id: string) => {
    const response = await fetch(
      `http://localhost:8000/stations/top/${id}?startDate=${startDate}&endDate=${endDate}`,
    );
    const { top5return, top5departure } = await response.json();
    setTopReturn(top5return);
    setTopDeparture(top5departure);
  };

  useEffect(() => {
    fetchSingleStation(id);
    fetchTopStations(id);
  }, []);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    fetchSingleStation(id);
    fetchTopStations(id);
  };

  const closing = () => {
    setShow(false);
  };

  return (
    <Container>
      {show ? (
        <div className="mt-5">
          <Alert variant="warning" dismissible onClose={closing}>
            {message}
          </Alert>
        </div>
      ) : null}
      {singleStation.length > 0 ? (
        <div>
          <p className="fs-3 m-4 text-center">
            {singleStation[0].Nimi} ({singleStation[0].ID})
          </p>
          <p className="text-center">
            The displayed calculations are based on journey data between{' '}
            {formatStartDate} and {formatEndDate}. <br />
            You can choose a different time period between the two dates.
          </p>
          <div className="mb-4 d-flex justify-content-center">
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col xs={12} md={4} sm={6}>
                  <Form.Control
                    type="date"
                    name="startDate"
                    min="2021-05-01"
                    max="2021-06-30"
                    defaultValue="2021-05-01"
                    onChange={(e) => setStartDate(e.target.value)}
                    value={startDate}
                  />
                </Col>
                <Col xs={12} md={4} sm={6}>
                  <Form.Control
                    type="date"
                    name="startDate"
                    min="2021-05-01"
                    max="2021-06-30"
                    defaultValue="2021-06-30"
                    onChange={(e) => setEndDate(e.target.value)}
                    value={endDate}
                  />
                </Col>
                <Col xs={12} md={4} sm={12}>
                  <Button type="submit" variant="warning" className="calculate">
                    Calculate
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>

          <Row>
            <Col className="border border-warning mt-4" md={12} lg={6}>
              <Table>
                <thead>
                  <tr style={{ backgroundColor: 'white' }}>
                    <th>Address:</th>
                    <th>{singleStation[0].Osoite}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <span style={{ color: 'black' }}>
                        Total number of journeys from this station:
                      </span>
                    </td>
                    <td>{totalDeparture}</td>
                  </tr>
                  <tr>
                    <td>
                      <span style={{ color: 'black' }}>
                        Total number of journeys to this station:
                      </span>
                    </td>
                    <td>{totalReturn}</td>
                  </tr>
                  <tr>
                    <td>
                      <span style={{ color: 'black' }}>
                        Average distance of journeys from this station:
                      </span>
                    </td>
                    <td>{(averageDepartureDistance / 1000).toFixed(2)} km</td>
                  </tr>
                  <tr>
                    <td>
                      <span style={{ color: 'black' }}>
                        Average duration of journeys from this station:
                      </span>
                    </td>
                    <td>{(averageDepartureDuration / 60).toFixed(2)} min</td>
                  </tr>
                  <tr>
                    <td>
                      <span style={{ color: 'black' }}>
                        Average distance of journeys to this station:
                      </span>
                    </td>
                    <td>{(averageReturnDistance / 1000).toFixed(2)} km</td>
                  </tr>
                  <tr>
                    <td>
                      <span style={{ color: 'black' }}>
                        Average duration of journeys to this station:
                      </span>
                    </td>
                    <td>{(averageReturnDuration / 60).toFixed(2)} min</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col className="mt-4 mapview" md={12} lg={6}>
              <MapView x={singleStation[0].x} y={singleStation[0].y} />
            </Col>
          </Row>
          <Row className="mt-5">
            <Col className="border border-warning mt-4">
              <Table>
                <thead>
                  <tr>
                    <th colSpan={2} className="text-center">
                      Top 5 Return Stations
                    </th>
                  </tr>
                  <tr
                    className="text-center"
                    style={{ backgroundColor: 'white' }}
                  >
                    <th>Station Name</th>
                    <th>Number of journeys</th>
                  </tr>
                </thead>
                <tbody>
                  {topReturn.map((item, i = 0) => {
                    return (
                      <tr key={i} className="text-center">
                        <td>
                          <span style={{ color: 'black' }}>{item._id}</span>
                        </td>
                        <td>{item.count}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Col>
            <Col className="border border-warning mt-4">
              <Table>
                <thead>
                  <tr>
                    <th colSpan={2} className="text-center">
                      Top 5 Departure Stations
                    </th>
                  </tr>
                  <tr
                    className="text-center"
                    style={{ backgroundColor: 'white' }}
                  >
                    <th>Station Name</th>
                    <th>Number of journeys</th>
                  </tr>
                </thead>
                <tbody>
                  {topDeparture.map((item, i = 0) => {
                    return (
                      <tr key={i} className="text-center">
                        <td>
                          <span style={{ color: 'black' }}>{item._id}</span>
                        </td>
                        <td>{item.count}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Col>
          </Row>
        </div>
      ) : (
        <Loading />
      )}
    </Container>
  );
}
