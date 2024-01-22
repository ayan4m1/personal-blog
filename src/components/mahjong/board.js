import PropTypes from 'prop-types';
import {
  useEffect,
  useRef,
  useState,
  useCallback,
  Fragment,
  useMemo
} from 'react';
import {
  Container,
  Row,
  Col,
  Alert,
  ProgressBar,
  ButtonGroup,
  Button
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationTriangle,
  faFloppyDisk,
  faFolderOpen,
  faHighlighter,
  faRecycle,
  faTrash
} from '@fortawesome/free-solid-svg-icons';

import MahjongTile from 'components/mahjong/tile';
import TimeViewer from 'components/timeViewer';
import {
  generateLayout,
  getTileImagePath,
  getAvailableMatches,
  isOpen,
  isMatch
} from 'utils/mahjong';
import useTimer from 'hooks/useTimer';
import useBoundingBoxRef from 'hooks/useBoundingBoxRef';

export default function MahjongBoard({ images }) {
  const {
    elapsedTime,
    running,
    startTimer,
    stopTimer,
    toggleTimer,
    resetTimer
  } = useTimer();
  const boardRef = useRef(null);
  const [solved, setSolved] = useState(false);
  const [failed, setFailed] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [activeTile, setActiveTile] = useState(null);
  const boardRect = useBoundingBoxRef(boardRef, [solved, failed]);
  const [layout, setLayout] = useState(generateLayout('turtle'));
  const matches = useMemo(() => getAvailableMatches(layout), [layout]);
  const completePct = useMemo(() => 1 - layout.length / 144, [layout]);
  const handleMatch = useCallback(
    (a, b) =>
      setLayout((prevVal) => {
        const newVal = [...prevVal];
        const aTileIdx = newVal.findIndex((tile) => tile.index === a);
        let bTileIdx = newVal.findIndex((tile) => tile.index === b);

        if (aTileIdx === -1 || bTileIdx === -1) {
          return prevVal;
        }

        const aTile = newVal[aTileIdx];
        const bTile = newVal[bTileIdx];

        if (!isMatch(aTile, bTile)) {
          return prevVal;
        }

        newVal.splice(aTileIdx, 1);
        bTileIdx = newVal.findIndex((tile) => tile.index === b);
        newVal.splice(bTileIdx, 1);

        return newVal;
      }),
    [setLayout]
  );
  const handleTileClick = useCallback(
    (tile) => {
      setActiveTile((prevVal) => {
        if (prevVal === tile.index) {
          return null;
        } else if (prevVal && isOpen(tile, layout)) {
          handleMatch(prevVal, tile.index);
          return null;
        } else if (isOpen(tile, layout)) {
          return tile.index;
        }
      });
      startTimer();
    },
    [setActiveTile, handleMatch, layout, startTimer]
  );
  const handleNew = useCallback(() => {
    setLayout(generateLayout('turtle'));
    resetTimer();
  }, [setLayout, resetTimer]);

  useEffect(() => {
    if (!layout.length) {
      setSolved(true);
      stopTimer();
    }
  }, [layout]);

  useEffect(() => {
    if (matches.length === 0) {
      setFailed(true);
      stopTimer();
    }
  }, [matches]);

  return (
    <Fragment>
      <Container fluid>
        {solved && (
          <Row className="mb-2">
            <Col>
              <Alert variant="success">You solved it!</Alert>
            </Col>
          </Row>
        )}
        {failed && (
          <Row className="mb-2">
            <Col>
              <Alert variant="danger">Out of moves, try again!</Alert>
            </Col>
          </Row>
        )}
        <Row>
          <Col xs={4}>
            <h4 className="mt-0 mb-2">Progress</h4>
          </Col>
          <Col xs={2}>
            <h4 className="mt-0 mb-2">Matches Left</h4>
          </Col>
          <Col xs={2}>
            <h4 className="mt-0 mb-2">Time</h4>
          </Col>
          <Col xs={4}>
            <h4 className="mt-0 mb-2">Options</h4>
          </Col>
        </Row>
        <Row className="d-flex align-items-center mb-4">
          <Col xs={4}>
            <ProgressBar
              variant="success"
              now={completePct * 100}
              label={`${(completePct * 100).toFixed(2)}%`}
              style={{ height: 24 }}
            />
          </Col>
          <Col xs={2}>
            <p className="mb-0">
              {matches.length}{' '}
              {matches.length === 1 && (
                <FontAwesomeIcon icon={faExclamationTriangle} color="orange" />
              )}
            </p>
          </Col>
          <Col xs={2}>
            <TimeViewer
              elapsedTime={elapsedTime}
              running={running}
              onToggle={toggleTimer}
            />
          </Col>
          <Col xs={4}>
            <ButtonGroup className="me-4">
              <Button onClick={handleNew}>
                <FontAwesomeIcon icon={faRecycle} /> New
              </Button>
              <Button disabled>
                <FontAwesomeIcon icon={faFloppyDisk} /> Save
              </Button>
              <Button disabled>
                <FontAwesomeIcon icon={faTrash} /> Clear
              </Button>
              <Button disabled>
                <FontAwesomeIcon icon={faFolderOpen} /> Load
              </Button>
              <Button onClick={() => setShowHints((prevVal) => !prevVal)}>
                <FontAwesomeIcon icon={faHighlighter} /> Hint
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Container>
      <div ref={boardRef} style={{ height: '100vh' }}>
        {boardRef.current &&
          layout.map((tile) => (
            <MahjongTile
              key={tile.index}
              tile={tile}
              x={
                tile.x * 48 -
                tile.layer * -5 +
                (boardRect?.left ?? 0) +
                (boardRect?.width ?? 0) / 2
              }
              y={tile.y * 64 - tile.layer * -5 + (boardRect?.top ?? 0)}
              active={activeTile === tile.index}
              hint={
                showHints &&
                Boolean(
                  matches.find(
                    ([a, b]) => a.index === tile.index || b.index === tile.index
                  )
                )
              }
              imageUrl={
                images.nodes.find((node) =>
                  node.relativePath.endsWith(getTileImagePath(tile))
                )?.publicURL
              }
              onClick={handleTileClick}
            />
          ))}
      </div>
    </Fragment>
  );
}

MahjongBoard.propTypes = {
  images: PropTypes.object.isRequired
};
