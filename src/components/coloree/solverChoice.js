import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Col } from 'react-bootstrap';

export default function SolverChoice({
  type,
  color = '#ffffff',
  eliminated = false,
  button = false,
  children,
  ...props
}) {
  return (
    <Col xs={2} className="my-2 d-flex justify-content-center">
      {button ? (
        <button
          {...props}
          className={classNames(
            'color-solver-choice',
            eliminated && 'color-solver-choice--eliminated',
            Boolean(type) && `color-solver-choice--${type}`
          )}
          style={{
            ...props.style,
            backgroundColor: color
          }}
        >
          {children}
        </button>
      ) : (
        <div
          {...props}
          className={classNames(
            'color-solver-choice',
            eliminated && 'color-solver-choice--eliminated',
            Boolean(type) && `color-solver-choice--${type}`
          )}
          style={{
            ...props.style,
            backgroundColor: color
          }}
        >
          {children}
        </div>
      )}
    </Col>
  );
}

SolverChoice.propTypes = {
  type: PropTypes.string,
  color: PropTypes.string,
  eliminated: PropTypes.bool,
  button: PropTypes.bool,
  children: PropTypes.node,
  style: PropTypes.object
};
