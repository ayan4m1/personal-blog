import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { Container, Row, Col, Card, ProgressBar } from 'react-bootstrap';

import {
  getColorSimilarity,
  combineColorChoices,
  combineColors
} from 'utils/coloree';

export default function ColorSolver({
  colors,
  colorPalette,
  currentGuess,
  guessHistory,
  onGuessAdd
}) {
  const remainingGuesses = useMemo(
    () => 5 - guessHistory.length,
    [guessHistory]
  );

  return (
    <Card body>
      <Container>
        <Row>
          <Col xs={8}>
            <h5 className="mb-3">{remainingGuesses} Guesses Left</h5>
          </Col>
          <Col xs={4} className="d-flex align-items-center">
            <ProgressBar
              className="w-100"
              variant="success"
              min={0}
              max={100}
              now={(remainingGuesses / 5) * 100}
            />
          </Col>
        </Row>
        {guessHistory.map((guess, guessIndex) => (
          <Row key={guessIndex}>
            {guess.map(({ color, type }, colorIndex) => (
              <Col
                xs={2}
                key={colorIndex}
                className="my-2 d-flex justify-content-center"
              >
                <div
                  className={`color-solver-choice color-solver-choice--${type}`}
                  style={{
                    backgroundColor: color
                  }}
                />
              </Col>
            ))}
            <Col xs={2} className="my-2 d-flex align-items-center">
              {getColorSimilarity(
                combineColors(
                  combineColorChoices(
                    colors,
                    guess.map(({ color }) => color)
                  )
                ),
                combineColors(colors)
              ).toFixed(2)}
              %
            </Col>
          </Row>
        ))}
        {remainingGuesses > 0 && (
          <Row>
            {colors.map((_, index) => (
              <Col
                key={index}
                xs={2}
                className="my-2 d-flex justify-content-center"
              >
                <div
                  className="color-solver-choice"
                  style={{
                    backgroundColor: currentGuess[index] ?? 'white'
                  }}
                />
              </Col>
            ))}
          </Row>
        )}
        <hr />
        <Row>
          <Col xs={12}>
            <h5 className="mb-3">Color Palette</h5>
          </Col>
          {colorPalette.map(({ color, eliminated }, index) => (
            <Col
              xs={2}
              key={index}
              className="my-2 d-flex justify-content-center"
            >
              <button
                disabled={remainingGuesses === 0 || eliminated}
                onClick={() => onGuessAdd(color)}
                className={classNames(
                  'color-solver-choice',
                  eliminated && 'color-solver-choice--eliminated'
                )}
                style={{
                  backgroundColor: color
                }}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </Card>
  );
}

ColorSolver.propTypes = {
  colors: PropTypes.arrayOf(PropTypes.object).isRequired,
  colorPalette: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentGuess: PropTypes.arrayOf(PropTypes.string).isRequired,
  guessHistory: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object))
    .isRequired,
  onGuessAdd: PropTypes.func.isRequired
};
