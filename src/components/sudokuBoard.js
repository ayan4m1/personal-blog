import PropTypes from 'prop-types';
import { chunk } from 'lodash-es';
import { Alert, Card, Container, Row } from 'react-bootstrap';

import SudokuCell from 'components/sudokuCell';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function SudokuBoard({ puzzle, solution }) {
  const [solved, setSolved] = useState(false);
  const [activeCell, setActiveCell] = useState([-1, -1]);
  const rows = useMemo(
    () =>
      chunk(puzzle.split(''), 9).map((row) =>
        row.map((value) => (value === '-' ? null : parseInt(value, 10)))
      ),
    [puzzle]
  );
  const [values, setValues] = useState(Array(9).fill(Array(9).fill(-1)));
  const invalids = useMemo(
    () =>
      values.map((row, rowIdx) =>
        row.map((value, colIdx) => {
          if (value === -1) {
            return true;
          }

          const targetRow = rows[rowIdx];

          if (
            ((targetRow &&
              targetRow.indexOf(value) === colIdx &&
              targetRow.lastIndexOf(value) === colIdx) ||
              (targetRow.indexOf(value) === -1 &&
                targetRow.lastIndexOf(value) === -1) ||
              row.indexOf(value) !== colIdx ||
              row.lastIndexOf(value) !== colIdx) &&
            rows.every((searchRow) => searchRow[colIdx] !== value)
          ) {
            const cellRow = Math.floor(rowIdx / 3);
            const cellCol = Math.floor(colIdx / 3);

            for (
              let searchRowIdx = cellRow * 3;
              searchRowIdx < (cellRow + 1) * 3;
              searchRowIdx++
            ) {
              for (
                let searchColIdx = cellCol * 3;
                searchColIdx < (cellCol + 1) * 3;
                searchColIdx++
              ) {
                if (
                  searchRowIdx !== rowIdx &&
                  searchColIdx !== colIdx &&
                  (rows[searchRowIdx][searchColIdx] === value ||
                    values[searchRowIdx][searchColIdx] === value)
                ) {
                  return false;
                }
              }
            }

            return true;
          } else {
            return false;
          }
        })
      ),
    [rows, values]
  );
  const handleClick = useCallback(
    (row, column) =>
      setActiveCell(([prevRow, prevCol]) => {
        if (prevRow === row && prevCol === column) {
          return [-1, -1];
        } else {
          return [row, column];
        }
      }),
    []
  );
  const handleChange = useCallback((row, column, value) => {
    setValues((prevVal) => {
      const newVal = [...prevVal];
      const newRow = [...newVal[row]];

      newRow[column] = value;
      newVal.splice(row, 1, newRow);

      return newVal;
    });
  }, []);

  useEffect(() => {
    if (!rows.length) {
      return;
    }

    const currentBoard = rows
      .map((boardRow, rowIdx) =>
        boardRow
          .map((value, colIdx) => {
            if (value !== null) {
              return value.toString();
            }

            const liveValue = values[rowIdx][colIdx];

            return liveValue === -1 ? '-' : liveValue;
          })
          .join('')
      )
      .join('');

    if (currentBoard === solution) {
      setSolved(true);
    }
  }, [rows, values]);

  return (
    <Card body>
      {solved && <Alert variant="success">You did it!</Alert>}
      <Container fluid>
        {rows.map((row, rowIdx) => (
          <Row key={rowIdx}>
            {row.map((value, colIdx) => (
              <SudokuCell
                row={rowIdx}
                column={colIdx}
                key={colIdx}
                value={!value ? values[rowIdx][colIdx] : value}
                unknown={!value}
                active={activeCell[0] === rowIdx && activeCell[1] === colIdx}
                valid={invalids[rowIdx][colIdx]}
                onClick={handleClick}
                onChange={handleChange}
              />
            ))}
          </Row>
        ))}
      </Container>
    </Card>
  );
}

SudokuBoard.propTypes = {
  puzzle: PropTypes.string.isRequired,
  solution: PropTypes.string.isRequired
};
