import PropTypes from 'prop-types';
import { faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';

export default function ColorSolver({
  colors,
  choices,
  colorSimilarity,
  colorPalette,
  onResetClick,
  onColorChoiceAdd
}) {
  return (
    <Card body>
      <Card.Title className="mb-3">Solve the puzzle!</Card.Title>
      <Container>
        <Row>
          {colors.map((_, index) => (
            <Col key={index} xs={2} className="d-flex justify-content-center">
              <div
                style={{
                  height: 32,
                  width: 32,
                  backgroundColor: choices[index] ?? 'white',
                  border: '2px solid black'
                }}
              />
            </Col>
          ))}
          {choices.length === colors.length && (
            <Col xs={2} className="d-flex align-items-center">
              {colorSimilarity.toFixed(2)}%
            </Col>
          )}
          {choices.length === colors.length && colorSimilarity < 100 && (
            <Col xs={4}>
              <Button variant="danger" onClick={onResetClick}>
                <FontAwesomeIcon icon={faUndo} /> Reset
              </Button>
            </Col>
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
                onClick={() => onColorChoiceAdd(choice)}
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
      </Container>
    </Card>
  );
}

ColorSolver.propTypes = {
  colors: PropTypes.arrayOf(PropTypes.object),
  choices: PropTypes.arrayOf(PropTypes.string),
  colorSimilarity: PropTypes.number,
  colorPalette: PropTypes.arrayOf(PropTypes.string),
  onResetClick: PropTypes.func.isRequired,
  onColorChoiceAdd: PropTypes.func.isRequired
};
