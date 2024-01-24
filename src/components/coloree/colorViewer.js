import PropTypes from 'prop-types';
import {
  Button,
  ButtonGroup,
  Card,
  Col,
  Container,
  Row,
  Table
} from 'react-bootstrap';
import { useCallback } from 'react';
import ColorNamer from 'color-namer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faUndo } from '@fortawesome/free-solid-svg-icons';

export default function ColorViewer({ colors, finalColor, onResetClick }) {
  const handleUrlCopyClick = useCallback(
    () =>
      navigator.clipboard.writeText(
        `${window.location.href}?mode=solve#${btoa(JSON.stringify(colors))}`
      ),
    [colors]
  );

  return (
    <Card body>
      <Card.Title className="mb-3">Your puzzle is ready to share!</Card.Title>
      <Container>
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
                {colors.map(({ color, pct }) => (
                  <tr key={`${color}${pct}`}>
                    <td>
                      {ColorNamer(color).pantone[0].name} ({color})
                    </td>
                    <td>{Math.round(pct * 100)}%</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th>
                    {ColorNamer(finalColor).pantone[0].name} ({finalColor})
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
              <Button variant="danger" onClick={onResetClick}>
                <FontAwesomeIcon icon={faUndo} /> Start Over
              </Button>
              <Button variant="success" onClick={handleUrlCopyClick}>
                <FontAwesomeIcon icon={faLink} /> Copy URL
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Container>
    </Card>
  );
}

ColorViewer.propTypes = {
  colors: PropTypes.arrayOf(PropTypes.object),
  finalColor: PropTypes.string,
  onResetClick: PropTypes.func.isRequired
};
