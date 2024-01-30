import { faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  ProgressBar,
  Button
} from 'react-bootstrap';

import SolverChoice from 'components/coloree/solverChoice';

const totalGuesses = 5;

export default function ColorSolver({
  colors,
  colorPalette,
  currentGuess,
  guessHistory,
  solved,
  failed,
  onGuessAdd,
  onGuessRemove,
  onGameReset
}) {
  const remainingGuesses = useMemo(
    () => totalGuesses - guessHistory.length,
    [guessHistory]
  );
  const guessPercentage = useMemo(
    () => (remainingGuesses / totalGuesses) * 100,
    [remainingGuesses]
  );

  return (
    <Card body>
      <Container>
        <Row className="mb-3">
          <Col xs={8}>
            <h5 className="mb-0">{remainingGuesses} Guesses Left</h5>
          </Col>
          <Col xs={4} className="d-flex align-items-center">
            <ProgressBar
              className="w-100"
              variant={solved ? 'success' : failed ? 'danger' : 'info'}
              min={0}
              max={100}
              now={guessPercentage > 0 ? guessPercentage : 100}
              label={
                solved
                  ? 'You Win!'
                  : failed
                    ? 'You Lost!'
                    : `${guessPercentage}%`
              }
            />
          </Col>
        </Row>
        {guessHistory.map(
          ({ finalColor, colorSimilarity, guess }, guessIndex) => (
            <Row key={guessIndex}>
              {guess.map(({ color, type }, colorIndex) => (
                <SolverChoice key={colorIndex} color={color} type={type} />
              ))}
              <SolverChoice
                color={finalColor}
                style={{ width: 70, maxWidth: 70 }}
              >
                {colorSimilarity.toFixed(1)}%
              </SolverChoice>
            </Row>
          )
        )}
        {remainingGuesses > 0 && (
          <Row>
            {colors.map((_, index) => (
              <SolverChoice key={index} color={currentGuess[index]} />
            ))}
            {Boolean(currentGuess.length) && (
              <Col
                xs={2}
                className="my-2 d-flex justify-content-center align-items-center"
              >
                <Button
                  className="h-100"
                  variant="danger"
                  onClick={onGuessRemove}
                >
                  <FontAwesomeIcon icon={faUndo} />
                </Button>
              </Col>
            )}
          </Row>
        )}
        {solved && (
          <Row>
            <Col xs={12} className="d-flex justify-content-end">
              <Button variant="success">
                <FontAwesomeIcon icon={faUndo} onClick={onGameReset} /> New Game
              </Button>
            </Col>
          </Row>
        )}
        <hr />
        <Row>
          <Col xs={12}>
            <h5 className="mb-3">Color Palette</h5>
          </Col>
          {colorPalette.map(({ color, eliminated }, index) => (
            <SolverChoice
              key={index}
              color={color}
              eliminated={eliminated}
              disabled={remainingGuesses === 0 || eliminated}
              onClick={() => onGuessAdd(color)}
              button
            />
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
  guessHistory: PropTypes.arrayOf(PropTypes.object).isRequired,
  solved: PropTypes.bool.isRequired,
  failed: PropTypes.bool.isRequired,
  onGuessAdd: PropTypes.func.isRequired,
  onGuessRemove: PropTypes.func.isRequired,
  onGameReset: PropTypes.func.isRequired
};
