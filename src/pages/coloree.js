import { Col, Container, Row } from 'react-bootstrap';

import Layout from 'components/layout';
import SEO from 'components/seo';
import ColoreeGame from 'components/coloree/game';

export default function ColoreePage() {
  return (
    <Layout>
      <SEO title="Coloree" />
      <Container>
        <Row>
          <Col>
            <h1>Coloree</h1>
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
