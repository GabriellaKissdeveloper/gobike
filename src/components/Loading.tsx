import Container from 'react-bootstrap/Container';

export default function Loading() {
  return (
    <Container>
      <p className="text-center mt-5">
        <img src="/images/2018-racing-bike.gif" alt="Boy riding on bike"></img>
        <p className="mt-3 fs-2 fw-bold">Bytes are flowing...</p>
      </p>
    </Container>
  );
}
