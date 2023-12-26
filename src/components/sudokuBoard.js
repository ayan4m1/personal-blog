import PropTypes from 'prop-types';
import { chunk } from 'lodash-es';
import { getSudoku } from 'sudoku-gen';
import useLocalStorageState from 'use-local-storage-state';
import {
  Alert,
  Card,
  Container,
  Row,
  Col,
  ButtonGroup,
  Button
} from 'react-bootstrap';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRecycle,
  faFloppyDisk,
  faFolderOpen,
  faTrash
} from '@fortawesome/free-solid-svg-icons';

import SudokuCell from 'components/sudokuCell';
import { checkSolution, getInvalids } from 'utils/sudoku';

export default function SudokuBoard() {
  const [solved, setSolved] = useState(false);
  const [activeCell, setActiveCell] = useState([-1, -1]);
  const [puzzle, setPuzzle] = useState(getSudoku('easy'));
  const [savedState, setSavedState] = useLocalStorageState('savedState', {
    defaultValue: null
  });
  const cells = useMemo(
    () =>
      chunk(puzzle.puzzle.split(''), 9).map((row) =>
        row.map((value) => (value === '-' ? null : parseInt(value, 10)))
      ),
    [puzzle]
  );
  const [values, setValues] = useState(Array(9).fill(Array(9).fill(-1)));
  const invalids = useMemo(() => getInvalids(values, cells), [values, cells]);
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
  const handleChange = useCallback(
    (row, column, value) =>
      setValues((prevVal) => {
        const newVal = [...prevVal];
        const newRow = [...newVal[row]];

        newRow[column] = value;
        newVal.splice(row, 1, newRow);

        return newVal;
      }),
    []
  );
  const handleNew = useCallback(() => setPuzzle(getSudoku('easy')), []);
  const handleSave = useCallback(
    () =>
      setSavedState({
        puzzle,
        values
      }),
    [puzzle, values]
  );
  const handleLoad = useCallback(() => {
    if (!savedState) {
      return;
    }

    setPuzzle(savedState.puzzle);
    setValues(savedState.values);
  }, [savedState]);
  const handleClear = useCallback(() => setSavedState(null), []);

  useEffect(() => {
    setSolved(checkSolution(cells, values, puzzle.solution));
  }, [cells, values, puzzle]);

  return (
    <Card body>
      <Container fluid>
        <Row>
          <Col xs={12} className="mb-2">
            <h1>Sudoku</h1>
          </Col>
        </Row>
        <Row className="mb-2">
          <Col className="d-flex justify-content-center g-0">
            <ButtonGroup className="w-100">
              <Button onClick={handleNew}>
                <FontAwesomeIcon icon={faRecycle} /> New
              </Button>
              <Button onClick={handleSave}>
                <FontAwesomeIcon icon={faFloppyDisk} /> Save
              </Button>
              <Button onClick={handleClear} disabled={!savedState}>
                <FontAwesomeIcon icon={faTrash} /> Clear
              </Button>
              <Button onClick={handleLoad} disabled={!savedState}>
                <FontAwesomeIcon icon={faFolderOpen} /> Load
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
        <Row>
          <Col className="g-0">
            {solved && (
              <Alert className="mb-2" variant="success">
                You solved it!
              </Alert>
            )}
          </Col>
        </Row>
        {cells.map((row, rowIdx) => (
          <Row key={rowIdx} className="d-flex justify-content-center">
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
