import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';
import { Container, Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileArchive,
  faGamepad,
  faHeart,
  faMoon,
  faNewspaper,
  faPaintBrush,
  faRectangleList,
  faBalanceScale,
  faSun,
  faTable,
  faWrench
} from '@fortawesome/free-solid-svg-icons';

import { useThemeContext } from 'hooks/useThemeContext';

import icon from '../images/gatsby-icon.png';

const NavLink = ({ to, label, icon, topLevel = false, ...props }) => (
  <Nav.Link
    {...props}
    as={Link}
    className={topLevel ? null : 'text-dark'}
    to={to}
  >
    <FontAwesomeIcon icon={icon} /> {label}
  </Nav.Link>
);

NavLink.propTypes = {
  to: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  topLevel: PropTypes.bool,
  icon: PropTypes.object
};

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
            <NavDropdown
              title={
                <Fragment>
                  <FontAwesomeIcon icon={faNewspaper} /> Articles
                </Fragment>
              }
            >
              {data.allArticleCategoriesJson.nodes.map((category) => (
                <NavLink
                  key={category.name}
                  to={`/${category.name}`}
                  label={category.title}
                />
              ))}
            </NavDropdown>
            <NavLink
              to="/projects"
              icon={faFileArchive}
              label="Projects"
              topLevel
            />
            <NavLink to="/love" icon={faHeart} label="Things I Love" topLevel />
            <NavDropdown
              title={
                <Fragment>
                  <FontAwesomeIcon icon={faGamepad} /> Games
                </Fragment>
              }
            >
              <NavLink to="/games/sudoku" icon={faTable} label="Sudoku" />
              <NavLink
                to="/games/mahjong"
                icon={faRectangleList}
                label="Mahjong"
              />
              <NavLink
                to="/games/coloree"
                icon={faPaintBrush}
                label="Coloree"
              />
            </NavDropdown>
            <NavDropdown
              title={
                <Fragment>
                  <FontAwesomeIcon icon={faWrench} /> Utilities
                </Fragment>
              }
            >
              <NavLink
                to="/utilities/bom-sheet-maker"
                icon={faTable}
                label="BOM Sheet Maker"
              />
              <NavLink
                to="/utilities/scale-converter"
                icon={faBalanceScale}
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
