import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Journey } from '../types/types';
import Alert from 'react-bootstrap/Alert';

export default function AddNewJourneyForm() {
  const [show, setShow] = useState(true);
  const [status, setStatus] = useState();
  const [message, setMessage] = useState('');
  const [inputs, setInputs] = useState<Journey>({
    Departure: new Date(),
    Return: new Date(),
    DepartureStationId: 1,
    DepartureStationName: '',
    ReturnStationId: 1,
    ReturnStationName: '',
    CoveredDistance: 0,
    Duration: 0,
  });

  const clear = () => {
    setInputs({
      Departure: new Date(),
      Return: new Date(),
      DepartureStationId: 1,
      DepartureStationName: '',
      ReturnStationId: 1,
      ReturnStationName: '',
      CoveredDistance: 0,
      Duration: 0,
    });
  };

  const handleChange = (e: any) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const result = (await fetch('http://localhost:8000/journeys/new', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inputs),
    }).catch((err) => console.log(err))) as Response;
    const data = await result.json();
    setStatus(data.status);
    setMessage(data.message);
    setShow(true);
  };

  const closing = () => {
    setShow(false);
  };

  return (
    <Container>
      {show ? (
        <div className="mt-5">
          {status === 200 ? (
            <Alert variant="success" dismissible onClose={closing}>
              {message}
            </Alert>
          ) : status === 409 ? (
            <Alert variant="warning" dismissible onClose={closing}>
              {message}
            </Alert>
          ) : status === 500 ? (
            <Alert variant="danger" dismissible onClose={closing}>
              {message}
            </Alert>
          ) : null}
        </div>
      ) : null}
      <div className="mt-5 border rounded border-warning p-5">
        <p className="text-center text-bold fs-3 mb-5">Add New Journey Form</p>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="Departure">
                <Form.Label>Departure Date and Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="Departure"
                  value={inputs.Departure.toString()}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="Return">
                <Form.Label>Return Date and Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="Return"
                  value={inputs.Return.toString()}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="DepartureStationId">
                <Form.Label>Departure Station ID</Form.Label>
                <Form.Control
                  type="number"
                  name="DepartureStationId"
                  min="0"
                  value={inputs.DepartureStationId}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="DepartureStationName">
                <Form.Label>Departure Station Name</Form.Label>
                <Form.Control
                  type="text"
                  name="DepartureStationName"
                  value={inputs.DepartureStationName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="ReturnStationId">
                <Form.Label>Return Station ID</Form.Label>
                <Form.Control
                  type="number"
                  name="ReturnStationId"
                  min="0"
                  value={inputs.ReturnStationId}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="ReturnStationName">
                <Form.Label>Return Station Name</Form.Label>
                <Form.Control
                  type="text"
                  name="ReturnStationName"
                  value={inputs.ReturnStationName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="CoveredDistance">
                <Form.Label>Covered distance in meters</Form.Label>
                <Form.Control
                  type="number"
                  name="CoveredDistance"
                  value={inputs.CoveredDistance}
                  min="0"
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="Duration">
                <Form.Label>Duration in seconds</Form.Label>
                <Form.Control
                  type="number"
                  name="Duration"
                  value={inputs.Duration}
                  min="0"
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <div className="d-flex flex-row justify-content-center mt-4">
            <Button
              style={{ width: '200px', marginRight: '15px' }}
              variant="warning"
              type="submit"
            >
              Submit
            </Button>
            <Button
              style={{ width: '200px', marginRight: '15px' }}
              variant="outline-warning"
              type="reset"
              onClick={clear}
            >
              Clear
            </Button>
            <Button
              href="/new"
              style={{ width: '200px' }}
              variant="outline-danger"
              type="button"
            >
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
}
