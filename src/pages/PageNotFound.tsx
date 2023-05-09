import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

export default function PageNotFound() {
  return (
    <Container>
      <div className="text-center">
        <p className="fs-3 mt-5">
          <b>Ooops, something went wrong!</b>
        </p>
        <img src="/images/404pagenotfound.jpg"></img>
        <p className="fs-4 mt-4">
          We can't seem to find the page you're looking for.
        </p>
        <Button className="btn btn-warning btn-lg mx-3" href="/stations">
          Back to stations
        </Button>
        <Button className="btn btn-warning btn-lg" href="/journeys">
          Back to journeys
        </Button>
      </div>
    </Container>
  );
}
