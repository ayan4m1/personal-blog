import PropTypes from 'prop-types';
import { hsl } from 'd3-color';
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
  Button,
  Dropdown,
  DropdownButton
} from 'react-bootstrap';
import { Fragment, useCallback, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRecycle,
  faFloppyDisk,
  faFolderOpen,
  faTrash,
  faGridHorizontal
} from '@fortawesome/free-solid-svg-icons';

import SudokuCell from 'components/sudoku/cell';
import TimeViewer from 'components/timeViewer';
import useRainbow from 'hooks/useRainbow';
import useTimer from 'hooks/useTimer';
import {
  checkSolution,
  getInvalids,
  getInvalidArray,
  difficulties
} from 'utils/sudoku';

const parseCells = (puzzle) =>
  chunk(puzzle.split(''), 9).map((row) =>
    row.map((value) => (value === '-' ? null : parseInt(value, 10)))
  );

export default function SudokuBoard({ mode }) {
  const {
    elapsedTime,
    running,
    startTimer,
    stopTimer,
    resetTimer,
    incrementTimer,
    toggleTimer
  } = useTimer();
  const [activeCell, setActiveCell] = useState([-1, -1]);
  const [puzzle, setPuzzle] = useState(getSudoku('easy'));
  const [savedState, setSavedState] = useLocalStorageState('savedState', {
    defaultValue: null
  });
  const cells = useMemo(() => parseCells(puzzle.puzzle), [puzzle]);
  const [values, setValues] = useState(getInvalidArray());
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
  const solved = useMemo(
    () => checkSolution(cells, values, puzzle.solution),
    [cells, values, puzzle]
  );
  const blankCount = useMemo(
    () => cells.flat().filter((cell) => cell === null).length,
    [cells]
  );
  const solveRate = elapsedTime / blankCount;
  const handleChange = useCallback(
    (row, column, value) => {
      const newValues = [...values];
      const newRow = [...newValues[row]];

      newRow[column] = value;
      newValues.splice(row, 1, newRow);
      setValues(newValues);

      if (checkSolution(cells, newValues, puzzle.solution)) {
        stopTimer();
      } else {
        startTimer();
      }
    },
    [values, cells, puzzle, startTimer, stopTimer]
  );
  const handleNew = useCallback(
    (difficulty) => {
      resetTimer();
      setPuzzle(getSudoku(difficulty));
      setValues(getInvalidArray());
    },
    [resetTimer]
  );
  const handleSave = useCallback(
    () =>
      setSavedState({
        puzzle,
        values,
        elapsedTime
      }),
    [puzzle, values, elapsedTime, setSavedState]
  );
  const handleLoad = useCallback(() => {
    if (!savedState) {
      return;
    }

    setPuzzle(savedState.puzzle);
    setValues(savedState.values);
    incrementTimer(savedState.elapsedTime * 1000);

    if (
      checkSolution(
        parseCells(savedState.puzzle.puzzle),
        savedState.values,
        savedState.puzzle.solution
      )
    ) {
      stopTimer();
    }
  }, [savedState, incrementTimer, stopTimer]);
  const handleClear = useCallback(() => setSavedState(null), [setSavedState]);
  const { color: animationColor } = useRainbow(solved, false);

  return (
    <Card body>
      <Container fluid>
        <Row>
          <Col xs={8}>
            <h1>
              <FontAwesomeIcon icon={faGridHorizontal} /> Sudoku
            </h1>
          </Col>
          {mode === 'timed' && (
            <Col xs={4} className="d-flex align-items-center">
              <TimeViewer
                elapsedTime={elapsedTime}
                running={running}
                onToggle={toggleTimer}
              />
            </Col>
          )}
        </Row>
        <Row className="mb-2">
          <Col className="d-flex justify-content-center g-0">
            <ButtonGroup className="w-100">
              <DropdownButton
                as={ButtonGroup}
                title={
                  <Fragment>
                    <FontAwesomeIcon icon={faRecycle} /> New
                  </Fragment>
                }
              >
                {difficulties.map((difficulty) => (
                  <Dropdown.Item
                    key={difficulty}
                    onClick={() => handleNew(difficulty.toLowerCase())}
                  >
                    {difficulty}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
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
        {solved && (
          <Row className="mb-2">
            <Col className="g-0">
              <Alert className="mb-2" variant="success">
                You solved it, averaging {solveRate.toFixed(1)} seconds per
                cell!
              </Alert>
            </Col>
          </Row>
        )}
        {cells.map((row, rowIdx) => (
          <Row key={rowIdx} className="d-flex justify-content-center">
            {row.map((value, colIdx) => {
              let cellColor = null;

              if (solved) {
                cellColor = hsl(animationColor);
                cellColor.h += (rowIdx * 9 + colIdx) * 5;
              }

              return (
                <SudokuCell
                  key={colIdx}
                  row={rowIdx}
                  column={colIdx}
                  value={!value ? values[rowIdx][colIdx] : value}
                  unknown={!value}
                  active={activeCell[0] === rowIdx && activeCell[1] === colIdx}
                  valid={invalids[rowIdx][colIdx]}
                  onClick={handleClick}
                  onChange={handleChange}
                  bg={cellColor?.formatHex?.()}
                />
              );
            })}
          </Row>
        ))}
      </Container>
    </Card>
  );
}

SudokuBoard.propTypes = {
  mode: PropTypes.oneOf(['timed', 'free']).isRequired
};
