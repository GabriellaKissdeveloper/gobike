import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Station } from '../types/types';
import Alert from 'react-bootstrap/Alert';

export default function AddNewStationForm() {
  const [show, setShow] = useState(true);
  const [status, setStatus] = useState();
  const [message, setMessage] = useState('');
  const [inputs, setInputs] = useState<Station>({
    FID: 0,
    ID: 0,
    Nimi: '',
    Namn: '',
    Name: '',
    Osoite: '',
    Adress: '',
    Kaupunki: '',
    Stad: '',
    Operaattor: '',
    Kapasiteet: 0,
    x: 0.0,
    y: 0.0,
  });

  const handleClear = () => {
    setInputs({
      FID: 0,
      ID: 0,
      Nimi: '',
      Namn: '',
      Name: '',
      Osoite: '',
      Adress: '',
      Kaupunki: '',
      Stad: '',
      Operaattor: '',
      Kapasiteet: 0,
      x: 0.0,
      y: 0.0,
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
    const result = (await fetch('http://localhost:8000/stations/new', {
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
              {inputs.Nimi} - {message}
            </Alert>
          ) : status === 409 ? (
            <Alert variant="warning" dismissible onClose={closing}>
              {inputs.ID} - {message}
            </Alert>
          ) : status === 500 ? (
            <Alert variant="danger" dismissible onClose={closing}>
              {message}
            </Alert>
          ) : null}
        </div>
      ) : null}

      <div className="mt-5 border rounded border-warning p-5">
        <p className="text-center text-bold fs-3 mb-5">Add New Station Form</p>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="fid">
                <Form.Label>Station FID Number</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  name="FID"
                  value={inputs.FID}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="id">
                <Form.Label>Station ID Number</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  name="ID"
                  value={inputs.ID}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="mb-3" controlId="nimi">
                <Form.Label>Station Name (Finnish)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Hanasaari"
                  name="Nimi"
                  value={inputs.Nimi}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="namn">
                <Form.Label>Station Name (Swedish)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Hanaholmen"
                  name="Namn"
                  value={inputs.Namn}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Station Name (English)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Hanasaari"
                  name="Name"
                  value={inputs.Name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="osoite">
                <Form.Label>Station Address (Finnish)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Hanasaarenranta 1"
                  name="Osoite"
                  value={inputs.Osoite}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="adress">
                <Form.Label>Station Address (Swedish)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Hanaholmsstranden 1"
                  name="Adress"
                  value={inputs.Adress}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="kaupunki">
                <Form.Label>City Name (Finnish)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Espoo"
                  name="Kaupunki"
                  value={inputs.Kaupunki}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="stad">
                <Form.Label>City Name (Swedish)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Esbo"
                  name="Stad"
                  value={inputs.Stad}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="operator">
                <Form.Label>Station Operator</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="CityBike Finland"
                  name="Operaattor"
                  value={inputs.Operaattor}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="capacity">
                <Form.Label>Capacity</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  name="Kapasiteet"
                  value={inputs.Kapasiteet}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="x">
                <Form.Label>Geocoordinate lattitude</Form.Label>
                <Form.Control
                  type="number"
                  name="x"
                  value={inputs.x}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="y">
                <Form.Label>Geocoordinate longitude</Form.Label>
                <Form.Control
                  type="number"
                  name="y"
                  value={inputs.y}
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
              onClick={handleClear}
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
