import { Fragment } from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';
import { Container, Navbar, Nav } from 'react-bootstrap';

export default function Header() {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <Fragment>
      <Navbar variant="dark" bg="primary" expand="lg">
        <Container>
          <Navbar.Brand>
            <Link to="/" className="text-light">
              {data.site.siteMetadata.title}
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="ms-2">
              <Nav.Link as={Link} className="text-light" to="/electronics">
                Electronics
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Fragment>
  );
}
