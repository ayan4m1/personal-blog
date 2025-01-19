import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';

import { useThemeContext } from 'hooks/useThemeContext';

export default function BodyCard({ children, ...props }) {
  const { darkMode } = useThemeContext();

  const className = classNames(
    props?.className,
    `text-${darkMode ? 'light' : 'dark'}`
  );

  return (
    <Card body {...props} className={className}>
      {children}
    </Card>
  );
}

BodyCard.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};
