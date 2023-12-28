import PropTypes from 'prop-types';
import { hsl } from 'd3-color';
import { chunk } from 'lodash-es';
import { getSudoku } from 'sudoku-gen';
import { differenceInSeconds } from 'date-fns';
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
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRecycle,
  faFloppyDisk,
  faFolderOpen,
  faTrash,
  faPause,
  faPlay
} from '@fortawesome/free-solid-svg-icons';

import SudokuCell from 'components/sudokuCell';
import {
  formatTime,
  checkSolution,
  getInvalids,
  getInvalidArray,
  difficulties
} from 'utils/sudoku';
import useRainbow from 'hooks/useRainbow';

export default function SudokuBoard({ mode }) {
  const intervalRef = useRef(null);
  const startTime = useMemo(() => Date.now(), []);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [paused, setPaused] = useState(false);
  const [solved, setSolved] = useState(false);
  const [solveRate, setSolveRate] = useState(null);
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
  const handleNew = useCallback((difficulty) => {
    setCurrentTime(Date.now());
    setPuzzle(getSudoku(difficulty));
    setValues(getInvalidArray());
  }, []);
  const handleSave = useCallback(
    () =>
      setSavedState({
        puzzle,
        values,
        elapsedTime: differenceInSeconds(currentTime, startTime)
      }),
    [puzzle, values, currentTime, startTime]
  );
  const handleLoad = useCallback(() => {
    if (!savedState) {
      return;
    }

    setPuzzle(savedState.puzzle);
    setValues(savedState.values);
    setCurrentTime(startTime + savedState.elapsedTime * 1000);
  }, [savedState]);
  const handleClear = useCallback(() => setSavedState(null), []);
  const handlePause = useCallback(() => setPaused((prevVal) => !prevVal), []);
  const handleDocumentVisibilityChange = useCallback(
    () => setPaused(document.hidden),
    []
  );
  const { color: animationColor, start, stop } = useRainbow(false, false);

  useEffect(() => {
    const solved = checkSolution(cells, values, puzzle.solution);

    if (solved) {
      setSolved(solved);
      setSolveRate(
        differenceInSeconds(currentTime, startTime) /
          cells.reduce(
            (result, row) =>
              result +
              row.reduce(
                (rowResult, cell) => rowResult + (cell === null ? 1 : 0),
                0
              ),
            0
          )
      );
      start();
    } else {
      stop();
    }
  }, [cells, values, puzzle]);

  useEffect(() => {
    if (!paused) {
      intervalRef.current = setInterval(
        () => setCurrentTime((prevVal) => prevVal + 1000),
        1000
      );

      return () => clearInterval(intervalRef.current);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [paused]);

  useEffect(() => {
    // if we remove visibilitychange on unmount we lose it, so only set it up once
    document.addEventListener(
      'visibilitychange',
      handleDocumentVisibilityChange
    );
  });

  return (
    <Card body>
      <Container fluid>
        <Row>
          <Col xs={mode === 'timed' ? 8 : 12}>
            <h1>Sudoku</h1>
          </Col>
          {mode === 'timed' && (
            <Col className="d-flex justify-content-center align-items-center">
              <span className="font-monospace">
                {formatTime(currentTime, startTime)}
              </span>
              <Button
                variant="info"
                size="sm"
                className="ms-2"
                onClick={handlePause}
              >
                <FontAwesomeIcon icon={paused ? faPlay : faPause} fixedWidth />
              </Button>
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
