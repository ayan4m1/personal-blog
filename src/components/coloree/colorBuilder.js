import PropTypes from 'prop-types';
import { SketchPicker } from 'react-color';
import { useState, useCallback, useMemo } from 'react';
import { faDice, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Form, InputGroup, Button, ButtonGroup } from 'react-bootstrap';

import { createRandomColor, getRemainingPct } from 'utils/coloree';

export default function ColorBuilder({ colors, onSliceAdd }) {
  const maxSlicePercentage = useMemo(() => getRemainingPct(colors), [colors]);
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

  return (
    <Card body>
      <Card.Title>Puzzle Builder</Card.Title>
      <Form>
        <Form.Group className="mb-2">
          <Form.Label>Color</Form.Label>
          <SketchPicker
            className="ms-auto me-auto"
            color={selectedColor}
            onChange={handleSliceColorChange}
            presetColors={[]}
            disableAlpha
          />
        </Form.Group>
        <Form.Group className="mb-2">
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
        </Form.Group>
        <Form.Group className="text-center">
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
  );
}

ColorBuilder.propTypes = {
  colors: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSliceAdd: PropTypes.func.isRequired
};
