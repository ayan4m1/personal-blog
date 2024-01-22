import { useState } from 'react';
import { Container, Row, Col, ButtonGroup, Button } from 'react-bootstrap';

import Layout from 'components/layout';
import SEO from 'components/seo';
import SudokuBoard from 'components/sudoku/board';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faDoorOpen } from '@fortawesome/free-solid-svg-icons';

export default function SudokuPage() {
  const [gameMode, setGameMode] = useState(null);

  return (
    <Layout>
      <SEO title="Sudoku" description="Play Sudoku for free!" />
      <Container>
        <Row>
          <Col className="d-flex justify-content-center">
            {gameMode ? (
              <SudokuBoard mode={gameMode} />
            ) : (
              <ButtonGroup className="w-100">
                <Button variant="success" onClick={() => setGameMode('free')}>
                  <FontAwesomeIcon
                    icon={faDoorOpen}
                    size="2x"
                    className="mt-2"
                  />
                  <h3 className="mt-2">Free Play</h3>
                  <p>Play at your own pace.</p>
                </Button>
                <Button variant="danger" onClick={() => setGameMode('timed')}>
                  <FontAwesomeIcon icon={faClock} size="2x" className="mt-2" />
                  <h3 className="mt-2">Timed</h3>
                  <p>Try and complete the puzzle as quickly as possible.</p>
                </Button>
              </ButtonGroup>
            )}
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}
