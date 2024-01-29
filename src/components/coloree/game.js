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
  const [currentGuess, setCurrentGuess] = useState([]);
  const [guessHistory, setGuessHistory] = useState([]);
  const [colorPalette, setColorPalette] = useState([]);
  const [solved, setSolved] = useState(false);
  const [solving, setSolving] = useState(false);

  const finalColor = useMemo(
    () =>
      !solving || currentGuess.length !== colors.length
        ? combineColors(colors)
        : combineColors(combineColorChoices(colors, currentGuess)),
    [solving, currentGuess, colors]
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
  const handleColorEliminate = useCallback(
    (paletteIndex) =>
      setColorPalette((prevVal) => {
        const newArr = [...prevVal];
        const newVal = newArr[paletteIndex];

        newVal.eliminated = true;
        newArr.splice(paletteIndex, 1, newVal);

        return newArr;
      }),
    []
  );
  const handleGuessComplete = useCallback(
    (guess) =>
      setGuessHistory((prevVal) => {
        if (colors.every(({ color }, index) => guess[index] === color)) {
          setSolved(true);
        }

        return [
          ...prevVal,
          guess.map((color, index) => {
            let type = 'unused';

            const colorExists = colors.some(
              ({ color: testColor }) => testColor === color
            );
            const colorCorrectPlace = colors[index].color === color;

            if (colorExists && !colorCorrectPlace) {
              type = 'wrongPlace';
            } else if (colorCorrectPlace) {
              type = 'correctPlace';
            }

            if (type === 'unused') {
              handleColorEliminate(
                colorPalette.findIndex(
                  ({ color: testColor }) => testColor === color
                )
              );
            }

            return {
              color,
              type
            };
          })
        ];
      }),
    [colors, colorPalette]
  );
  const handleGuessAdd = useCallback(
    (color) =>
      setCurrentGuess((prevVal) => {
        if (prevVal.includes(color)) {
          return prevVal;
        }

        const newVal = [...prevVal, color];

        if (prevVal.length + 1 === colors.length) {
          handleGuessComplete(newVal);
          return [];
        } else {
          return newVal;
        }
      }),
    [colors, handleGuessComplete]
  );
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
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    setColorPalette(createColorPalette(colors));
  }, [colors]);

  return (
    <Fragment>
      {solved && <Confetti width={width} height={height} />}
      <Row>
        <Col xs={12} md={6} className="d-flex justify-content-center mb-2">
          <ColorPicker
            diameter={Math.min(400, width / 2 - 24)}
            pieColors={
              solving
                ? colors.map(({ pct }, index) => ({
                    color: currentGuess[index] ?? '#666',
                    pct
                  }))
                : colors
            }
            finalColor={finalColor}
          />
        </Col>
        <Col xs={12} md={6} className="mb-2">
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
              colorPalette={colorPalette}
              currentGuess={currentGuess}
              guessHistory={guessHistory}
              onGuessAdd={handleGuessAdd}
            />
          )}
        </Col>
      </Row>
    </Fragment>
  );
}
