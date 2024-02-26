import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';

import ColorPicker from 'components/coloree/colorPicker';
import ColorSolver from 'components/coloree/colorSolver';
import ColorViewer from 'components/coloree/colorViewer';
import ColorBuilder from 'components/coloree/colorBuilder';
import {
  getRemainingPct,
  createRandomPuzzle,
  createColorPalette,
  combineColorChoices,
  combineColors,
  getColorSimilarity,
  getSolveUrl
} from 'utils/coloree';

export default function ColoreeGame() {
  const { width, height } = useWindowSize();
  const [colors, setColors] = useState([]);
  const [currentGuess, setCurrentGuess] = useState([]);
  const [guessHistory, setGuessHistory] = useState([]);
  const [colorPalette, setColorPalette] = useState([]);
  const [solved, setSolved] = useState(false);
  const [failed, setFailed] = useState(false);
  const [solving, setSolving] = useState(false);

  const finalColor = useMemo(
    () =>
      solved || failed || !solving || currentGuess.length !== colors.length
        ? combineColors(colors)
        : combineColors(combineColorChoices(colors, currentGuess)),
    [solved, failed, solving, currentGuess, colors]
  );
  const pieColors = useMemo(
    () =>
      solved || failed || !solving
        ? colors
        : colors.map(({ pct }, index) => ({
            color: currentGuess[index] ?? '#666',
            pct
          })),
    [solved, failed, solving, currentGuess, colors]
  );
  const sideComponent = useMemo(() => {
    let result = 'builder';

    if (getRemainingPct(colors) <= 0) {
      result = !solving ? 'viewer' : 'solver';
    }

    return result;
  }, [colors, solving]);

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
        } else if (prevVal.length === 4) {
          setFailed(true);
        }

        const finalColor = combineColors(combineColorChoices(colors, guess));

        return [
          ...prevVal,
          {
            finalColor,
            colorSimilarity: getColorSimilarity(
              finalColor,
              combineColors(colors)
            ),
            guess: guess.map((color, index) => {
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
          }
        ];
      }),
    [colors, colorPalette, handleColorEliminate]
  );
  const handleGuessRemove = useCallback(
    () => setCurrentGuess((prevVal) => prevVal.slice(0, prevVal.length - 1)),
    []
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
  const handleGameReset = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.location.replace('/games/coloree');
  }, []);
  const handleBuilderReset = useCallback(() => setColors([]), []);
  const handleSoloPlayClick = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.location.href = getSolveUrl(createRandomPuzzle());
  }, []);

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
    if (!colors.length) {
      return;
    }

    setColorPalette(createColorPalette(colors));
  }, [colors]);

  const getComponent = useCallback(() => {
    switch (sideComponent) {
      case 'builder':
        return (
          <ColorBuilder
            colors={colors}
            pieColors={pieColors}
            finalColor={finalColor}
            onSliceAdd={handleColorAdd}
            onSoloPlayClick={handleSoloPlayClick}
            width={width}
          />
        );
      case 'viewer':
        return (
          <ColorViewer
            colors={colors}
            finalColor={finalColor}
            onResetClick={handleBuilderReset}
          />
        );
      case 'solver':
        return (
          <ColorSolver
            colors={colors}
            colorPalette={colorPalette}
            currentGuess={currentGuess}
            guessHistory={guessHistory}
            solved={solved}
            failed={failed}
            onGuessAdd={handleGuessAdd}
            onGuessRemove={handleGuessRemove}
            onGameReset={handleGameReset}
          />
        );
    }
  }, [
    colors,
    pieColors,
    finalColor,
    colorPalette,
    currentGuess,
    guessHistory,
    handleBuilderReset,
    handleColorAdd,
    handleGameReset,
    handleGuessAdd,
    handleGuessRemove,
    handleSoloPlayClick,
    sideComponent,
    solved,
    failed,
    width
  ]);

  return (
    <Fragment>
      {solved && <Confetti width={width} height={height} />}
      {Boolean(solving) && (
        <ColorPicker
          diameter={Math.min(300, width / 2 - 24)}
          pieColors={pieColors}
          finalColor={finalColor}
        />
      )}
      {getComponent()}
    </Fragment>
  );
}
