import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { Station } from '../types/types';
import { Loading } from './Loading';
import MapView from '../components/MapView';

export default function SingleStation() {
  const [singleStation, setSingleStation] = useState<Station[]>([]);
  const [totalReturn, setTotalReturn] = useState(0);
  const [totalDeparture, setTotalDeparture] = useState(0);
  const [averageReturnDistance, setAverageReturnDistance] = useState(0);
  const [averageDepartureDistance, setAverageDepartureDistance] = useState(0);
  const [averageReturnDuration, setAverageReturnDuration] = useState(0);
  const [averageDepartureDuration, setAverageDepartureDuration] = useState(0);
  const { id } = useParams<{ id: string }>();

  const fetchSingleStation = async (id: string) => {
    const response = await fetch(
      `http://localhost:8000/stations/station/${id}`,
    );
    const data = await response.json();
    setSingleStation(data.station);
    setTotalReturn(data.totalReturn);
    setTotalDeparture(data.totalDeparture);
    setAverageDepartureDistance(data.averageDepartureDistance[0].average);
    setAverageReturnDistance(data.averageReturnDistance[0].average);
    setAverageDepartureDuration(data.averageDepartureDistance[0].avgtime);
    setAverageReturnDuration(data.averageReturnDistance[0].avgtime);
  };

  useEffect(() => {
    fetchSingleStation(id);
  }, []);

  return (
    <Container>
      {singleStation.length > 0 ? (
        <div>
          <p className="fs-3 m-4 text-center">
            {singleStation[0].Nimi} ({singleStation[0].ID})
          </p>
          <Row>
            <Col className="border border-warning mt-4">
              <Table>
                <tbody>
                  <tr>
                    <td>
                      <b>Address:</b>
                    </td>
                    <td>
                      <b>{singleStation[0].Osoite}</b>
                    </td>
                  </tr>
                  <tr>
                    <td>Total number of journeys from this station:</td>
                    <td>{totalDeparture}</td>
                  </tr>
                  <tr>
                    <td>Total number of journeys to this station:</td>
                    <td>{totalReturn}</td>
                  </tr>
                  <tr>
                    <td>Average distance of journeys from this station:</td>
                    <td>{(averageDepartureDistance / 1000).toFixed(2)} km</td>
                  </tr>
                  <tr>
                    <td>Average duration of journeys from this station:</td>
                    <td>{(averageDepartureDuration / 60).toFixed(2)} min</td>
                  </tr>
                  <tr>
                    <td>Average distance of journeys to this station:</td>
                    <td>{(averageReturnDistance / 1000).toFixed(2)} km</td>
                  </tr>
                  <tr>
                    <td>Average duration of journeys to this station:</td>
                    <td>{(averageReturnDuration / 60).toFixed(2)} min</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col className="mt-4">
              <MapView x={singleStation[0].x} y={singleStation[0].y} />
            </Col>
          </Row>
        </div>
      ) : (
        <Loading />
      )}
    </Container>
  );
}
