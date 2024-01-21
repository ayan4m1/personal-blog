import PropTypes from 'prop-types';
import {
  faLink,
  faPlusCircle,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Table
} from 'react-bootstrap';
import { SketchPicker } from 'react-color';
import { color as createColor, rgb } from 'd3-color';
import { navigate } from 'gatsby-link';
import ColorNamer from 'color-namer';
import { shuffle } from 'lodash-es';
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';
import { diff, rgb_to_lab } from 'color-diff';

const randomColor = () =>
  rgb(
    Math.ceil(Math.random() * 255),
    Math.ceil(Math.random() * 255),
    Math.ceil(Math.random() * 255),
    1
  ).formatHex();

const combineColors = (colors) => {
  const mixed = [0, 0, 0];

  for (const { color, pct } of colors) {
    const { r, g, b } = createColor(color);

    mixed[0] += r * pct;
    mixed[1] += g * pct;
    mixed[2] += b * pct;
  }

  return rgb(...mixed, 1).formatHex();
};

const createConicGradient = (colors) => {
  let result = 'conic-gradient(from 0deg at 100% 50%, transparent 180deg, ';
  let currentAngle = 180;

  for (let i = 0; i < colors.length; i++) {
    const { color, pct } = colors[i];
    const start = currentAngle;
    const end = Math.ceil(start + pct * 180);
    const comma = i + 1 === colors.length ? '' : ',';

    result += `${color} ${start}deg ${end}deg${comma}`;

    currentAngle = end;
  }

  if (currentAngle < 360) {
    result += `, transparent ${currentAngle}deg 360deg`;
  }

  result += ')';

  return result;
};

const getLabColor = (hex) => {
  const color = createColor(hex);

  return rgb_to_lab({
    R: color.r,
    G: color.g,
    B: color.b
  });
};

const getColorSimilarity = (a, b) => diff(getLabColor(a), getLabColor(b));

export default function ColorPicker({ diameter = 400 }) {
  const { width, height } = useWindowSize();
  const [slices, setSlices] = useState([]);
  const [solving, setSolving] = useState(false);
  const [solved, setSolved] = useState(false);
  const [colorPalette, setColorPalette] = useState([]);
  const [colorChoices, setColorChoices] = useState([]);
  const [colorSimilarity, setColorSimilarity] = useState(0);
  const [selectedColor, setSelectedColor] = useState(randomColor());
  const [slicePercentage, setSlicePercentage] = useState(50);
  const radius = Math.floor(diameter / 2);
  const maxSlicePercentage = useMemo(
    () =>
      Math.max(
        0,
        (1 - slices.reduce((prev, curr) => prev + curr.pct, 0)) * 100
      ),
    [slices]
  );

  const handleAddColorChoice = useCallback(
    (color) => setColorChoices((prevVal) => [...prevVal, color]),
    []
  );
  const handleAddSlice = useCallback(() => {
    setSlices((prevSlices) => [
      ...prevSlices,
      { color: selectedColor, pct: slicePercentage / 100 }
    ]);
    setSlicePercentage((prevSlicePct) =>
      Math.min(prevSlicePct, maxSlicePercentage)
    );
  }, [selectedColor, slicePercentage, maxSlicePercentage]);
  const handleSlicePctChange = useCallback(
    (e) => setSlicePercentage(Math.round(parseFloat(e.target.value))),
    []
  );
  const handleClipboardCopy = useCallback(() => {
    navigator.clipboard.writeText(
      `${window.location.href.substring(
        0,
        window.location.href.indexOf('#')
      )}?mode=solve#${btoa(JSON.stringify(slices))}`
    );
  }, [slices]);
  const handleReset = useCallback(() => {
    setSlices([]);
    setSlicePercentage(50);
    setSelectedColor('#cccccc');
    navigate('/coloree');
  }, []);

  const gradient = useMemo(
    () =>
      solving || !slices.length ? 'transparent' : createConicGradient(slices),
    [slices]
  );
  const finalColor = useMemo(
    () => (!slices.length ? 'transparent' : combineColors(slices)),
    [slices]
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !window.location.hash) {
      return;
    }

    const params = new URL(window.location).searchParams;

    if (params.has('mode') && params.get('mode') === 'solve') {
      const sliceData = JSON.parse(atob(window.location.hash.substring(1)));

      setSlices(sliceData);
      setSolving(true);

      const newColorChoices = sliceData.map(({ color }) => color);

      for (let i = newColorChoices.length - 1; i < 17; i++) {
        newColorChoices.push(randomColor());
      }

      setColorPalette(shuffle(newColorChoices));
    }
  }, []);

  useEffect(() => {
    if (!solving || !colorChoices.length) {
      return;
    }

    if (colorChoices.every((color, index) => slices[index].color === color)) {
      setSolved(true);
      setColorSimilarity(100);
    } else {
      const choiceSet = colorChoices.map((color, index) => ({
        color,
        pct: slices[index].pct
      }));

      setColorSimilarity(
        getColorSimilarity(combineColors(choiceSet), finalColor)
      );
    }
  }, [colorChoices, slices, solving, finalColor]);

  return (
    <Fragment>
      {solved && <Confetti width={width} height={height} />}
      <Row className="mb-4">
        <Col xs={6} className="d-flex justify-content-center">
          <div
            style={{
              height: diameter,
              width: radius,
              border: '3px solid #ccc',
              borderRadius: `${radius}px`,
              borderBottomRightRadius: 0,
              borderTopRightRadius: 0,
              background: gradient,
              transform: 'scaleY(-1)'
            }}
          ></div>
          <div
            style={{
              height: diameter,
              width: radius,
              border: '3px solid #ccc',
              borderRadius: `${radius}px`,
              borderBottomLeftRadius: 0,
              borderTopLeftRadius: 0,
              backgroundColor: finalColor
            }}
          ></div>
        </Col>
        <Col xs={6}>
          <Card body>
            {maxSlicePercentage > 0 ? (
              <Fragment>
                <Card.Title>Color Builder</Card.Title>
                <Form>
                  <Form.Group className="mb-2">
                    <Form.Label>Color</Form.Label>
                    <SketchPicker
                      className="ms-auto me-auto"
                      color={selectedColor}
                      onChange={(color) => setSelectedColor(color.hex)}
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
                    <Button variant="success" onClick={handleAddSlice}>
                      <FontAwesomeIcon icon={faPlusCircle} /> Add
                    </Button>
                  </Form.Group>
                </Form>
              </Fragment>
            ) : (
              <Fragment>
                <Card.Title className="mb-3">
                  {solving
                    ? 'Solve the puzzle!'
                    : 'Your puzzle is ready to share!'}
                </Card.Title>
                <Container>
                  {!solving ? (
                    <Fragment>
                      <Row>
                        <Col xs={12}>
                          <Table>
                            <thead>
                              <tr>
                                <th>Color</th>
                                <th>%</th>
                              </tr>
                            </thead>
                            <tbody>
                              {slices.map(({ color, pct }) => (
                                <tr key={`${color}${pct}`}>
                                  <td>
                                    {ColorNamer(color).pantone[0].name} ({color}
                                    )
                                  </td>
                                  <td>{Math.round(pct * 100)}%</td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr>
                                <th>
                                  {ColorNamer(finalColor).pantone[0].name} (
                                  {finalColor})
                                </th>
                                <th>100%</th>
                              </tr>
                            </tfoot>
                          </Table>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="text-center">
                          <ButtonGroup>
                            <Button variant="danger" onClick={handleReset}>
                              <FontAwesomeIcon icon={faTrash} /> Start Over
                            </Button>
                            <Button
                              variant="success"
                              onClick={handleClipboardCopy}
                            >
                              <FontAwesomeIcon icon={faLink} /> Copy URL
                            </Button>
                          </ButtonGroup>
                        </Col>
                      </Row>
                    </Fragment>
                  ) : (
                    <Fragment>
                      <Row>
                        {slices.map((_, index) => (
                          <Col
                            key={index}
                            xs={2}
                            className="d-flex justify-content-center"
                          >
                            <div
                              style={{
                                height: 32,
                                width: 32,
                                backgroundColor: colorChoices[index] ?? 'white',
                                border: '2px solid black'
                              }}
                            />
                          </Col>
                        ))}
                        {colorChoices.length === slices.length && (
                          <Col xs={2}>{colorSimilarity.toFixed(2)}%</Col>
                        )}
                      </Row>
                      <hr />
                      <Row>
                        {colorPalette.map((choice, index) => (
                          <Col
                            xs={2}
                            key={index}
                            className="my-2 d-flex justify-content-center"
                          >
                            <button
                              onClick={() => handleAddColorChoice(choice)}
                              style={{
                                height: 32,
                                width: 32,
                                backgroundColor: choice,
                                border: '2px solid black'
                              }}
                            />
                          </Col>
                        ))}
                      </Row>
                    </Fragment>
                  )}
                </Container>
              </Fragment>
            )}
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
}

ColorPicker.propTypes = {
  diameter: PropTypes.number
};
