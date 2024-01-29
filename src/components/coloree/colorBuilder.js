import PropTypes from 'prop-types';
import { SketchPicker } from 'react-color';
import { useState, useCallback, useMemo, Fragment } from 'react';
import {
  faDice,
  faPlusCircle,
  faWandMagicSparkles
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Card,
  Form,
  InputGroup,
  Button,
  ButtonGroup,
  Alert,
  Row,
  Col
} from 'react-bootstrap';

import {
  createRandomPuzzle,
  createRandomColor,
  getRemainingPct
} from 'utils/coloree';

export default function ColorBuilder({ colors, onSliceAdd, onSoloPlayClick }) {
  const maxSlicePercentage = useMemo(() => getRemainingPct(colors), [colors]);
  const [difficulty, setDifficulty] = useState(1);
  const [selectedColor, setSelectedColor] = useState(createRandomColor());
  const [slicePercentage, setSlicePercentage] = useState(
    Math.min(50, maxSlicePercentage)
  );

  const handleSliceColorChange = useCallback(
    (color) => setSelectedColor(color.hex),
    []
  );
  const handleSlicePctChange = useCallback(
    (e) => setSlicePercentage(Math.round(parseFloat(e.target.value))),
    []
  );
  const handleSliceAdd = useCallback(
    () => onSliceAdd(selectedColor, slicePercentage / 100),
    [onSliceAdd, selectedColor, slicePercentage]
  );
  const handleSliceRandomize = useCallback(
    () => setSelectedColor(createRandomColor()),
    []
  );
  const handlePuzzleRandomize = useCallback(() => {
    for (const { color, pct } of createRandomPuzzle(difficulty)) {
      onSliceAdd(color, pct);
    }
  }, [onSliceAdd, difficulty]);
  const handleDifficultyChange = useCallback(
    (e) =>
      setDifficulty(Math.min(6, Math.max(1, parseInt(e.target.value, 10)))),
    []
  );

  return (
    <Fragment>
      <Card body className="mb-3">
        <Card.Title>Solo Play</Card.Title>
        <Alert variant="info" className="my-2">
          Play a game on your own with a randomly generated puzzle!
        </Alert>
        <div className="text-end">
          <Button className="mt-2" variant="success" onClick={onSoloPlayClick}>
            <FontAwesomeIcon icon={faWandMagicSparkles} /> Start Game
          </Button>
        </div>
      </Card>
      <Card body className="mb-3">
        <Card.Title>Generate a Puzzle</Card.Title>
        <Alert variant="info" className="my-2">
          Create a randomly generated puzzle to share with your friends!
        </Alert>
        <Form>
          <Form.Group>
            <Form.Label>Difficulty (1 - 6)</Form.Label>
            <Form.Control
              type="number"
              min={1}
              max={6}
              step={1}
              value={difficulty}
              onChange={handleDifficultyChange}
            />
          </Form.Group>
          <Form.Group className="text-end">
            <Button
              className="mt-2"
              variant="success"
              onClick={handlePuzzleRandomize}
            >
              <FontAwesomeIcon icon={faDice} /> Generate
            </Button>
          </Form.Group>
        </Form>
      </Card>
      <Card body className="mb-3">
        <Card.Title>Create a Puzzle</Card.Title>
        <Alert variant="info" className="my-2">
          Use the color picker and percentage inputs below to add colors up to
          100%. Then, share your puzzle with friends and see if you can stump
          them!
        </Alert>
        <Form>
          <Row>
            <Col xs={12} md={6} className="mb-2">
              <Form.Label>Color</Form.Label>
              <SketchPicker
                color={selectedColor}
                onChange={handleSliceColorChange}
                presetColors={[]}
                disableAlpha
              />
            </Col>
            <Col xs={12} md={6} className="mb-2">
              <Form.Label>Percentage</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  min={0}
                  max={maxSlicePercentage}
                  step={1}
                  onChange={handleSlicePctChange}
                  value={slicePercentage}
                />
                <InputGroup.Text>
                  of {Math.round(maxSlicePercentage)}%
                </InputGroup.Text>
              </InputGroup>
            </Col>
          </Row>
          <Form.Group className="text-end">
            <ButtonGroup>
              <Button variant="success" onClick={handleSliceAdd}>
                <FontAwesomeIcon icon={faPlusCircle} /> Add Color
              </Button>
              <Button variant="info" onClick={handleSliceRandomize}>
                <FontAwesomeIcon icon={faDice} /> Randomize Color
              </Button>
            </ButtonGroup>
          </Form.Group>
        </Form>
      </Card>
    </Fragment>
  );
}

ColorBuilder.propTypes = {
  colors: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSliceAdd: PropTypes.func.isRequired,
  onSoloPlayClick: PropTypes.func.isRequired
};
