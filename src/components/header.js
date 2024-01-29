import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileArchive,
  faGamepad,
  faHeart,
  faMoon,
  faNewspaper,
  faPaintBrush,
  faRectangleList,
  faSun,
  faTable
} from '@fortawesome/free-solid-svg-icons';
import { Fragment } from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';
import { Container, Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';

import { useThemeContext } from 'hooks/useThemeContext';

export default function Header() {
  const { darkMode, toggleDarkMode } = useThemeContext();
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
            <NavDropdown
              title={
                <Fragment>
                  <FontAwesomeIcon icon={faNewspaper} /> Articles
                </Fragment>
              }
            >
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
            <NavDropdown
              title={
                <Fragment>
                  <FontAwesomeIcon icon={faGamepad} /> Games
                </Fragment>
              }
            >
              <Nav.Link as={Link} to="/sudoku" className="text-dark">
                <FontAwesomeIcon icon={faTable} /> Sudoku
              </Nav.Link>
              <Nav.Link as={Link} to="/mahjong" className="text-dark">
                <FontAwesomeIcon icon={faRectangleList} /> Mahjong
              </Nav.Link>
              <Nav.Link as={Link} to="/coloree" className="text-dark">
                <FontAwesomeIcon icon={faPaintBrush} /> Coloree
              </Nav.Link>
            </NavDropdown>
          </Nav>
          <Nav
            className="ms-lg-auto text-light d-flex align-items-center justify-content-end"
            style={{ flexDirection: 'row' }}
          >
            <Button variant="info" onClick={toggleDarkMode}>
              <FontAwesomeIcon icon={darkMode ? faMoon : faSun} fixedWidth />
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
