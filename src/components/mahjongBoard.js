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

import MahjongTile from 'components/mahjongTile';
import {
  generateLayout,
  getTileImagePath,
  getAvailableMatches,
  isOpen,
  isMatch
} from 'utils/mahjong';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationTriangle,
  faRecycle
} from '@fortawesome/free-solid-svg-icons';

export default function MahjongBoard({ images }) {
  const boardRef = useRef(null);
  const [solved, setSolved] = useState(false);
  const [failed, setFailed] = useState(false);
  const [boardRect, setBoardRect] = useState(null);
  const [activeTile, setActiveTile] = useState(null);
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
    (tile) =>
      setActiveTile((prevVal) => {
        if (prevVal === tile.index) {
          return null;
        } else if (prevVal && isOpen(tile, layout)) {
          handleMatch(prevVal, tile.index);
          return null;
        } else if (isOpen(tile, layout)) {
          return tile.index;
        }
      }),
    [setActiveTile, handleMatch, layout]
  );

  useEffect(() => {
    if (boardRef.current) {
      setBoardRect(boardRef.current.getBoundingClientRect());
    }
  }, [boardRef, solved, failed]);

  useEffect(() => {
    setSolved(!layout.length);
  }, [layout]);

  useEffect(() => {
    setFailed(matches === 0);
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
        <Row className="d-flex align-items-center mb-4">
          <Col xs={6}>
            <ButtonGroup className="me-4">
              <Button onClick={() => setLayout(generateLayout('turtle'))}>
                <FontAwesomeIcon icon={faRecycle} /> Reset
              </Button>
            </ButtonGroup>
          </Col>
          <Col xs={2}>
            <h4 className="mt-0 mb-2">Matches Left</h4>
            <p className="mb-0">
              {matches}{' '}
              {matches === 1 && (
                <FontAwesomeIcon icon={faExclamationTriangle} color="orange" />
              )}
            </p>
          </Col>
          <Col xs={4}>
            <h4 className="mt-0 mb-2">Progress</h4>
            <ProgressBar
              variant="success"
              now={completePct * 100}
              label={`${(completePct * 100).toFixed(2)}%`}
              style={{ height: 24 }}
            />
          </Col>
        </Row>
      </Container>
      <div ref={boardRef} style={{ height: '100vh' }}>
        {layout.map((tile) => (
          <MahjongTile
            key={tile.index}
            tile={tile}
            x={
              tile.x * 48 + (boardRect?.left ?? 0) + (boardRect?.width ?? 0) / 2
            }
            y={tile.y * 64 + (boardRect?.top ?? 0)}
            active={activeTile === tile.index}
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
