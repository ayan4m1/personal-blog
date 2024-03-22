import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import NavLink from 'components/nav/link';

export default function NavDropdown({ links = [], icon, title }) {
  return (
    <NavDropdown
      title={
        <Fragment>
          {Boolean(icon) && <FontAwesomeIcon icon={icon} />} {title}
        </Fragment>
      }
    >
      {links.map(({ name, title }) => (
        <NavLink key={name} to={`/${name}`} label={title} />
      ))}
    </NavDropdown>
  );
}

NavDropdown.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      title: PropTypes.string
    })
  ).isRequired,
  icon: PropTypes.object,
  title: PropTypes.string.isRequired
};
