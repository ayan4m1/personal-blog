import { Container, Row, Col } from 'react-bootstrap';

import Layout from 'components/layout';

export default function NotFoundPage() {
  return (
    <Layout title="Page Not Found" description="Sorry, this URL is not valid.">
      <Container>
        <Row>
          <Col md="12">
            <h1>Page Not Found</h1>
            <p>Sorry, this URL is not valid.</p>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}
