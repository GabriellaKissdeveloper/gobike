import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export default function NavBar() {
  return (
    <Navbar collapseOnSelect expand="lg" bg="warning">
      <Container>
        <Navbar.Brand href="/" className="mr-4">
          <img className="logo" alt="logo" src="/images/logo.jpg" />
        </Navbar.Brand>
        <Navbar.Text className="fs-3 text-success">GoBIKE</Navbar.Text>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse
          id="responsive-navbar-nav"
          className="justify-content-end"
        >
          <Nav className="link-attr">
            <Nav.Link className="link-success" href="#features">
              List Journeys
            </Nav.Link>
            <Nav.Link className="link-success" href="#pricing">
              List Stations
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}