import { useSpring, animated } from '@react-spring/web';
import { Link, useStaticQuery, graphql } from 'gatsby';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';

import usePrefersReducedMotion from 'hooks/usePrefersReducedMotion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileArchive,
  faHeart,
  faTable
} from '@fortawesome/free-solid-svg-icons';

const bobbleSpring = {
  from: { y: 4 },
  to: [{ y: -4 }, { y: 4 }],
  config: {
    mass: 0.1,
    tension: 20,
    friction: 0.1
  },
  loop: true,
  reset: false
};

export default function Header() {
  const [springs] = useSpring(() => bobbleSpring);
  const disableMotion = usePrefersReducedMotion();
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }

      allArticleCategoriesJson {
        nodes {
          name
          title
          description
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
              {data.allArticleCategoriesJson.nodes.map((category) => (
                <Nav.Link
                  key={category.name}
                  as={Link}
                  className="text-dark"
                  to={`/${category.name}`}
                >
                  {category.title}
                </Nav.Link>
              ))}
            </NavDropdown>
            <Nav.Link as={Link} to="/projects">
              <FontAwesomeIcon icon={faFileArchive} /> Projects
            </Nav.Link>
            <Nav.Link as={Link} to="/love">
              <FontAwesomeIcon icon={faHeart} /> Things I Love
            </Nav.Link>
            <Nav.Link as={Link} to="/sudoku">
              <FontAwesomeIcon icon={faTable} /> Sudoku
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto text-light">
            {disableMotion ? (
              <p style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.6)' }}>
                More Coming Soon &trade;
              </p>
            ) : (
              <animated.p
                className="mb-0"
                style={{
                  position: 'relative',
                  textShadow: '1px 1px 4px rgba(0,0,0,0.6)',
                  ...springs
                }}
              >
                More Coming Soon &trade;
              </animated.p>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
