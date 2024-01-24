import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';

import ColorPicker from 'components/coloree/colorPicker';
import ColorSolver from 'components/coloree/colorSolver';
import ColorViewer from 'components/coloree/colorViewer';
import ColorBuilder from 'components/coloree/colorBuilder';
import {
  getRemainingPct,
  createColorPalette,
  combineColorChoices,
  combineColors
} from 'utils/coloree';

export default function ColoreeGame() {
  const { width, height } = useWindowSize();
  const [colors, setColors] = useState([]);
  const [colorPalette, setColorPalette] = useState([]);
  const [colorChoices, setColorChoices] = useState([]);
  const [solved, setSolved] = useState(false);
  const [solving, setSolving] = useState(false);

  const finalColor = useMemo(
    () =>
      !solving || colorChoices.length !== colors.length
        ? combineColors(colors)
        : combineColors(combineColorChoices(colors, colorChoices)),
    [solving, colorChoices, colors]
  );

  const handleColorChoiceAdd = useCallback(
    (color) => setColorChoices((prevVal) => [...prevVal, color]),
    []
  );
  const handleColorAdd = useCallback(
    (color, pct) =>
      setColors((prevSlices) => {
        if (prevSlices.some(({ color: sliceColor }) => sliceColor === color)) {
          return prevSlices;
        }

        return [...prevSlices, { color, pct }];
      }),
    []
  );
  const handleChoicesReset = useCallback(() => setColorChoices([]), []);
  const handleBuilderReset = useCallback(() => setColors([]), []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.location.hash) {
      return;
    }

    try {
      const params = new URL(window.location).searchParams;

      if (params.has('mode') && params.get('mode') === 'solve') {
        const colorData = JSON.parse(atob(window.location.hash.substring(1)));

        setColors(colorData);
        setSolving(true);
        setColorPalette(createColorPalette(colorData));
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (!solving || colorChoices.length !== colors.length) {
      return;
    }

    setSolved(
      colors.every(({ color }, index) => colorChoices[index] === color)
    );
  }, [colorChoices, colors, solving]);

  return (
    <Fragment>
      {solved && <Confetti width={width} height={height} />}
      <Row className="mb-4">
        <Col xs={6} className="d-flex justify-content-center">
          <ColorPicker
            colors={colors}
            colorChoices={colorChoices}
            displayColor={finalColor}
            solving={solving}
          />
        </Col>
        <Col xs={6}>
          {getRemainingPct(colors) > 0 ? (
            <ColorBuilder colors={colors} onSliceAdd={handleColorAdd} />
          ) : !solving ? (
            <ColorViewer
              colors={colors}
              finalColor={finalColor}
              onResetClick={handleBuilderReset}
            />
          ) : (
            <ColorSolver
              colors={colors}
              choices={colorChoices}
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
