import Container from 'react-bootstrap/Container';

export default function Home() {
  return (
    <div>
      <Container>
        <p className="fs-3 mt-4 text-center">
          City bikes are shared-use bicycles that can be borrowed for a fee by
          anyone, residents and visitors alike. There are more than 4,600 bikes
          and 460 bike stations in the capital region. The service is used by
          almost 50,000 people for some 3.2 million trips per day.
        </p>
        <p className="fs-3 mt-4 text-center">
          The 1200-kilometre network of bike paths in Helsinki makes it easy to
          access all parts of the city on two wheels.
        </p>
        <p className="fs-3 mt-4 text-center">
          This page helps you discover the available bike stations in Helsinki
          area, get information about the trips, total number of journeys, top
          five return or departure stations, and so on.
        </p>
        <img src="/images/bikes.jpg" alt="city bikes" className="bike-img" />
      </Container>
    </div>
  );
}
