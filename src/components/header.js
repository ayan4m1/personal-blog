import { Link, useStaticQuery, graphql } from 'gatsby';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';

export default function Header() {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <Navbar variant="dark" bg="primary" expand="lg">
      <Container>
        <Navbar.Brand className="pt-2 pb-2">
          <Link to="/" className="text-light">
            {data.site.siteMetadata.title}
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ms-2">
            <NavDropdown title="Articles">
              <Nav.Link as={Link} className="text-dark" to="/electronics">
                Electronics
              </Nav.Link>
            </NavDropdown>
          </Nav>
          <Nav className="ms-auto text-light">
            <p className="mb-0">More Coming Soon &trade;</p>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
