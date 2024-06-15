import { Col, Container, Row } from 'react-bootstrap';
import { faSwatchbook } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Layout from 'components/layout';
import ColoreeGame from 'components/coloree/game';

export default function ColoreePage() {
  return (
    <Layout
      title="Coloree"
      description="Play a color matching game alone or with friends!"
    >
      <Container>
        <Row>
          <Col>
            <h1 className="mb-4">
              <FontAwesomeIcon icon={faSwatchbook} /> Coloree
            </h1>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex">
            <ColoreeGame />
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}
