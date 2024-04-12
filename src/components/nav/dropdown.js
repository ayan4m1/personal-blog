import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { NavDropdown as BsNavDropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function NavDropdown({ children, icon, title }) {
  return (
    <BsNavDropdown
      title={
        <Fragment>
          {Boolean(icon) && <FontAwesomeIcon icon={icon} />} {title}
        </Fragment>
      }
    >
      {children}
    </BsNavDropdown>
  );
}

NavDropdown.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.object,
  title: PropTypes.string.isRequired
};
