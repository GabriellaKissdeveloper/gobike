import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import AddNewJourneyForm from '../components/AddNewJourneyForm';
import AddNewStationForm from '../components/AddNewStationForm';

export default function AddNew() {
  const [clickStation, setClickStation] = useState(false);
  const [clickJourney, setClickJourney] = useState(false);

  const newStationForm = () => {
    setClickStation(true);
    setClickJourney(false);
  };

  const newJourneyForm = () => {
    setClickJourney(true);
    setClickStation(false);
  };

  return (
    <Container>
      <div className="d-flex justify-content-center mt-5 new-buttons">
        <Button
          className="new"
          variant="warning"
          size="lg"
          onClick={newStationForm}
        >
          Add New Station
        </Button>
        <Button className="hidden"></Button>
        <Button
          className="new"
          variant="warning"
          size="lg"
          onClick={newJourneyForm}
        >
          Add New Journey
        </Button>
      </div>
      {clickStation && <AddNewStationForm />}
      {clickJourney && <AddNewJourneyForm />}
    </Container>
  );
}
