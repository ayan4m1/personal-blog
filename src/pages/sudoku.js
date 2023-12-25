import { useState } from 'react';
import { Container, Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import { getSudoku } from 'sudoku-gen';

import Layout from 'components/layout';
import SEO from 'components/seo';
import SudokuBoard from 'components/sudokuBoard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faFloppyDisk,
  faFolderOpen,
  faQuestionCircle,
  faRecycle
} from '@fortawesome/free-solid-svg-icons';

export default function SudokuPage() {
  const [puzzle, setPuzzle] = useState(getSudoku('easy'));

  return (
    <Layout>
      <SEO title="Sudoku" />
      <Container>
        <Row>
          <Col xs={12}>
            <h1>Sudoku</h1>
          </Col>
        </Row>
        <Row className="mb-2">
          <Col xs={12}>
            <ButtonGroup>
              <Button onClick={() => setPuzzle(getSudoku('easy'))}>
                <FontAwesomeIcon icon={faRecycle} /> New Board
              </Button>
              <Button disabled>
                <FontAwesomeIcon icon={faFloppyDisk} /> Save
              </Button>
              <Button disabled>
                <FontAwesomeIcon icon={faFolderOpen} /> Load
              </Button>
              <Button disabled>
                <FontAwesomeIcon icon={faQuestionCircle} /> Get Hint
              </Button>
              <Button variant="success">
                <FontAwesomeIcon icon={faCheckCircle} /> Check Answer
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-center">
            <SudokuBoard {...puzzle} />
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}
