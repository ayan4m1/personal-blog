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
  faDice,
  faPlusCircle,
  faWandMagicSparkles
} from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import palette from 'get-rgba-palette';
import { SketchPicker } from 'react-color';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useCallback, useMemo, useRef, Fragment } from 'react';

import {
  createRandomPuzzle,
  createRandomColor,
  getRemainingPct
} from 'utils/coloree';
import { rgb } from 'd3-color';

import ColorPicker from 'components/coloree/colorPicker';

export default function ColorBuilder({
  colors,
  pieColors,
  finalColor,
  onSliceAdd,
  onSoloPlayClick,
  width
}) {
  const canvasRef = useRef();
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
  const handleFileChange = useCallback(
    async (event) => {
      const [file] = event.target.files;
      const bitmap = await createImageBitmap(file);

      if (!canvasRef.current) {
        return;
      }

      canvasRef.current.attributes['width'] = bitmap.width;
      canvasRef.current.attributes['height'] = bitmap.height;

      const ctx = canvasRef.current.getContext('2d');

      ctx.drawImage(bitmap, 0, 0);

      const { data } = ctx.getImageData(0, 0, bitmap.width, bitmap.height);

      const colorPalette = palette.bins(data, 5, 10, (pixels, index) => {
        const averageValue =
          pixels
            .slice(index, index + 2)
            .reduce((prev, curr) => prev + curr, 0) / 3;

        return averageValue > 80;
      });

      for (const { color, amount } of colorPalette) {
        const colorHex = rgb(...color).formatHex();

        onSliceAdd(colorHex, amount);
      }
    },
    [canvasRef, onSliceAdd]
  );

  return (
    <Fragment>
      <Col xs={12} md={6} className="me-2">
        <h2 className="mb-3">Singleplayer</h2>
        <Card body className="mb-3">
          <Card.Title>Generate a Puzzle</Card.Title>
          <Alert variant="info" className="my-2">
            Play a game on your own with a randomly generated puzzle!
          </Alert>
          <div className="text-end">
            <Button variant="success" onClick={onSoloPlayClick}>
              <FontAwesomeIcon icon={faWandMagicSparkles} /> Start Game
            </Button>
          </div>
        </Card>
      </Col>
      <Col xs={12} md={6}>
        <h2 className="mb-3">Multiplayer</h2>
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
          <Card.Title>Create a Puzzle By Hand</Card.Title>
          <div className="d-flex justify-content-center my-2">
            <ColorPicker
              diameter={Math.min(300, width / 2 - 24)}
              pieColors={pieColors}
              finalColor={finalColor}
            />
          </div>
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
        <Card body className="mb-2">
          <Card.Title>Create a Puzzle from an Image</Card.Title>
          <Form>
            <Form.Group>
              <Form.Label>Image File</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </Form>
        </Card>
      </Col>
    </Fragment>
  );
}

ColorBuilder.propTypes = {
  colors: PropTypes.arrayOf(PropTypes.object).isRequired,
  pieColors: PropTypes.arrayOf(PropTypes.object).isRequired,
  finalColor: PropTypes.string.isRequired,
  onSliceAdd: PropTypes.func.isRequired,
  onSoloPlayClick: PropTypes.func.isRequired,
  width: PropTypes.number
};
