import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Col, Form } from 'react-bootstrap';
import { useCallback, useEffect, useRef } from 'react';

export default function SudokuCell({
  row,
  column,
  value,
  bg,
  unknown = false,
  active = false,
  valid = true,
  onClick,
  onChange
}) {
  const textRef = useRef(null);
  const handleBlur = useCallback(() => onClick(-1, -1), [onClick]);
  const handleChange = useCallback(
    (event) => {
      const newVal = parseInt(event.target.value, 10);

      if (isNaN(newVal) || newVal < 1 || newVal > 9) {
        return;
      }

      onChange(row, column, newVal);
      handleBlur();
    },
    [onChange, column, row, handleBlur]
  );
  const handleKeyDown = useCallback(
    ({ key }) => {
      if (active && ['Enter', 'Tab'].includes(key)) {
        event.preventDefault();
        handleBlur();
      } else if (active && ['Backspace', 'Delete'].includes(key)) {
        event.preventDefault();
        onChange(row, column, -1);
        handleBlur();
      }
    },
    [active, onChange, column, row, handleBlur]
  );

  useEffect(() => {
    if (active && textRef.current) {
      textRef.current.focus();
    }
  }, [active]);

  const displayValue = value === -1 ? '' : value;
  const text = unknown ? displayValue : <strong>{displayValue}</strong>;

  return (
    <Col
      onClick={() => onClick(row, column)}
      className={classNames(
        'sudoku-cell',
        'border-dark',
        'border-2',
        'text-dark',
        column > 0 && column % 3 === 2 && 'border-end',
        row > 0 && row % 3 === 2 && 'border-bottom',
        !valid && 'bg-danger'
      )}
      style={bg && { backgroundColor: bg }}
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
  bg: PropTypes.string,
  unknown: PropTypes.bool,
  active: PropTypes.bool,
  valid: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};
