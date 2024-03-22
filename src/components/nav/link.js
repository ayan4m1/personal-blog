import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import { Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function NavLink({
  to,
  label,
  icon,
  topLevel = false,
  ...props
}) {
  return (
    <Nav.Link
      {...props}
      as={Link}
      className={topLevel ? null : 'text-dark'}
      to={to}
    >
      <FontAwesomeIcon icon={icon} /> {label}
    </Nav.Link>
  );
}

NavLink.propTypes = {
  to: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  topLevel: PropTypes.bool,
  icon: PropTypes.object
};
