import { Container, Row, Col } from 'react-bootstrap';

import Layout from 'components/layout';
import SEO from 'components/seo';
import SudokuBoard from 'components/sudokuBoard';

export default function SudokuPage() {
  return (
    <Layout>
      <SEO title="Sudoku" />
      <Container>
        <Row>
          <Col xs={12}>
            <h1>Sudoku</h1>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-center">
            <SudokuBoard />
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}