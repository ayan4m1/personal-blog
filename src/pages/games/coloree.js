import { Col, Container, Row } from 'react-bootstrap';

import Layout from 'components/layout';
import SEO from 'components/seo';
import ColoreeGame from 'components/coloree/game';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaintBrush } from '@fortawesome/free-solid-svg-icons';

export default function ColoreePage() {
  return (
    <Layout>
      <SEO title="Coloree" />
      <Container>
        <Row>
          <Col>
            <h1>
              <FontAwesomeIcon icon={faPaintBrush} /> Coloree
            </h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <ColoreeGame />
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}
