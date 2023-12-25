import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Col, Form } from 'react-bootstrap';
import { useCallback, useEffect, useRef } from 'react';

export default function SudokuCell({
  row,
  column,
  value,
  unknown = false,
  active = false,
  valid = true,
  onClick,
  onChange
}) {
  const textRef = useRef(null);
  const handleChange = useCallback(
    (event) => {
      const newVal = parseInt(event.target.value, 10);

      if (isNaN(newVal) || newVal < 1 || newVal > 9) {
        return;
      }

      onChange(row, column, newVal);
      onClick(-1, -1);
    },
    [onClick, onChange]
  );
  const handleKeyDown = useCallback(
    ({ key }) => {
      if (!active || !['Enter', 'Tab'].includes(key)) {
        return;
      }

      event.preventDefault();
      onClick(-1, -1);
    },
    [active, onClick]
  );
  const handleBlur = useCallback(() => onClick(-1, -1), [onClick]);

  useEffect(() => {
    if (active && textRef.current) {
      textRef.current.focus();
    }
  }, [active]);

  const displayValue = value === -1 ? '' : value;
  const text = unknown ? displayValue : <strong>{displayValue}</strong>;

  return (
    <Col
      onClick={() => {
        if (onClick) {
          onClick(row, column);
        }
      }}
      className={classNames(
        'd-flex',
        'justify-content-center',
        'align-items-center',
        'text-dark',
        'p-0',
        'border-2',
        'border-dark',
        column > 0 && column % 3 === 2 && 'border-end',
        row > 0 && row % 3 === 2 && 'border-bottom',
        valid ? 'bg-white' : 'bg-danger'
      )}
      style={{ height: 48, maxWidth: 48, minWidth: 48 }}
    >
      {unknown && active ? (
        <Form.Control
          ref={textRef}
          type="text"
          className={classNames('bg-warning', 'p-1', 'text-center', 'h-100')}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
      ) : (
        text
      )}
    </Col>
  );
}

SudokuCell.propTypes = {
  row: PropTypes.number.isRequired,
  column: PropTypes.number.isRequired,
  value: PropTypes.number,
  unknown: PropTypes.bool,
  active: PropTypes.bool,
  valid: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};
