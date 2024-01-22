import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { color as createColor, rgb } from 'd3-color';
import { shuffle } from 'lodash-es';
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';
import { diff, rgb_to_lab } from 'color-diff';

import ColorPicker from 'components/coloree/colorPicker';
import ColorSolver from 'components/coloree/colorSolver';
import ColorViewer from 'components/coloree/colorViewer';
import ColorBuilder from 'components/coloree/colorBuilder';
import { randomColor } from 'utils/coloree';

const combineColors = (colors) => {
  if (!colors.length) {
    return 'transparent';
  }

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
  if (!colors.length) {
    return 'transparent';
  }

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

const getColorSimilarity = (a, b) => 100 - diff(getLabColor(a), getLabColor(b));

const getRemainingPct = (colors) =>
  Math.round(
    Math.max(0, (1 - colors.reduce((prev, curr) => prev + curr.pct, 0)) * 100)
  );

const combineColorChoices = (colors, choices) =>
  choices.map((color, index) => ({
    color,
    pct: colors[index].pct
  }));

export default function ColoreeGame() {
  const { width, height } = useWindowSize();
  const [slices, setSlices] = useState([]);
  const [solving, setSolving] = useState(false);
  const [solved, setSolved] = useState(false);
  const [colorPalette, setColorPalette] = useState([]);
  const [colorChoices, setColorChoices] = useState([]);
  const [colorSimilarity, setColorSimilarity] = useState(0);

  const maxSlicePercentage = useMemo(() => getRemainingPct(slices), [slices]);
  const gradient = useMemo(
    () =>
      solving
        ? createConicGradient(combineColorChoices(slices, colorChoices))
        : createConicGradient(slices),
    [solving, colorChoices, slices]
  );
  const correctColor = useMemo(() => combineColors(slices), [slices]);
  const finalColor = useMemo(
    () =>
      !solving || colorChoices.length !== slices.length
        ? combineColors(slices)
        : combineColors(combineColorChoices(slices, colorChoices)),
    [solving, colorChoices, slices]
  );

  const handleColorChoiceAdd = useCallback(
    (color) => setColorChoices((prevVal) => [...prevVal, color]),
    []
  );
  const handleAddSlice = useCallback(
    (color, pct) => {
      setSlices((prevSlices) => [...prevSlices, { color, pct }]);
    },
    [maxSlicePercentage]
  );
  const handleChoicesReset = useCallback(() => setColorChoices([]), []);
  const handleReset = useCallback(() => {
    setSlices([]);
    setColorChoices([]);
    setColorPalette([]);
    setColorSimilarity(0);
  }, []);

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

    if (slices.every(({ color }, index) => colorChoices[index] === color)) {
      setSolved(true);
      setColorSimilarity(100);
    } else {
      setColorSimilarity(
        getColorSimilarity(
          combineColors(combineColorChoices(slices, colorChoices)),
          correctColor
        )
      );
    }
  }, [colorChoices, slices, solving, correctColor]);

  return (
    <Fragment>
      {solved && <Confetti width={width} height={height} />}
      <Row className="mb-4">
        <Col xs={6} className="d-flex justify-content-center">
          <ColorPicker pieGradient={gradient} displayColor={finalColor} />
        </Col>
        <Col xs={6}>
          {maxSlicePercentage > 0 ? (
            <ColorBuilder
              maxSlicePercentage={maxSlicePercentage}
              onSliceAdd={handleAddSlice}
            />
          ) : !solving ? (
            <ColorViewer
              colors={slices}
              finalColor={finalColor}
              onResetClick={handleReset}
            />
          ) : (
            <ColorSolver
              colors={slices}
              choices={colorChoices}
              colorSimilarity={colorSimilarity}
              colorPalette={colorPalette}
              onResetClick={handleChoicesReset}
              onColorChoiceAdd={handleColorChoiceAdd}
            />
          )}
        </Col>
      </Row>
    </Fragment>
  );
}
