import PropTypes from 'prop-types';
import { SketchPicker } from 'react-color';
import { useState, useCallback } from 'react';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Form, InputGroup, Button } from 'react-bootstrap';

import { randomColor } from 'utils/coloree';

export default function ColorBuilder({ maxSlicePercentage, onSliceAdd }) {
  const [selectedColor, setSelectedColor] = useState(randomColor());
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

  return (
    <Card body>
      <Card.Title>Color Builder</Card.Title>
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
          <Button
            variant="success"
            onClick={() => onSliceAdd(selectedColor, slicePercentage / 100)}
          >
            <FontAwesomeIcon icon={faPlusCircle} /> Add
          </Button>
        </Form.Group>
      </Form>
    </Card>
  );
}

ColorBuilder.propTypes = {
  maxSlicePercentage: PropTypes.number,
  onSliceAdd: PropTypes.func.isRequired
};
