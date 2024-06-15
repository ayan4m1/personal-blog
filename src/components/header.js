import { Link, useStaticQuery, graphql } from 'gatsby';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileArchive,
  faGamepad,
  faHeart,
  faMoon,
  faNewspaper,
  faSwatchbook,
  faMaximize,
  faSun,
  faTable,
  faWrench
} from '@fortawesome/free-solid-svg-icons';
import { faGameBoard, faGrid } from '@fortawesome/pro-solid-svg-icons';

import NavLink from 'components/nav/link';
import NavDropdown from 'components/nav/dropdown';
import { useThemeContext } from 'hooks/useThemeContext';

import icon from '../images/gatsby-icon.png';

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
        <Navbar.Brand className="py-2 d-flex align-items-center">
          <img
            src={icon}
            alt="Sloth Face"
            style={{ height: 32 }}
            className="me-2"
          />
          <Link to="/" className="text-light">
            {data.site.siteMetadata.title}
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ms-2">
            <NavDropdown icon={faNewspaper} title="Articles">
              {data.allArticleCategoriesJson.nodes.map((category) => (
                <NavLink
                  key={category.name}
                  to={`/${category.name}`}
                  label={category.title}
                />
              ))}
            </NavDropdown>
            <NavLink
              icon={faFileArchive}
              label="Projects"
              topLevel
              to="/projects"
            />
            <NavLink icon={faHeart} label="Things I Love" topLevel to="/love" />
            <NavDropdown icon={faGamepad} title="Games">
              <NavLink to="/games/sudoku" icon={faGrid} label="Sudoku" />
              <NavLink to="/games/mahjong" icon={faGameBoard} label="Mahjong" />
              <NavLink
                to="/games/coloree"
                icon={faSwatchbook}
                label="Coloree"
              />
            </NavDropdown>
            <NavDropdown icon={faWrench} title="Utilities">
              <NavLink
                to="/utilities/bom-sheet-maker"
                icon={faTable}
                label="BOM Sheet Maker"
              />
              <NavLink
                to="/utilities/scale-converter"
                icon={faMaximize}
                label="Scale Converter"
              />
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
