import { useCallback, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Table,
  InputGroup,
  Button,
  Form
} from 'react-bootstrap';
import { faDiceD20, faFunction } from '@fortawesome/pro-solid-svg-icons';
import { faHistory } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Layout from 'components/layout';
import { parseExpressions } from 'utils/dice';
import useDiceHistory from 'hooks/useDiceHistory';
import DiceResult from 'components/dice-roller/result';

export default function DiceRollerPage() {
  const [expression, setExpression] = useState('');
  const { diceRolls, appendRoll, clearRolls } = useDiceHistory();

  const handleExpressionChange = useCallback(
    (event) => setExpression(event.target.value),
    []
  );
  const handleExpressionEvaluate = useCallback(() => {
    const rolls = parseExpressions(expression);

    if (!rolls) {
      // set error state
      return;
    }

    for (const roll of rolls) {
      appendRoll(roll);
    }
  }, [expression, appendRoll]);
  const handleExpressionKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        handleExpressionEvaluate();
      }
    },
    [handleExpressionEvaluate]
  );

  return (
    <Layout title="Dice Roller" description="Roll dice for RPGs">
      <Container>
        <Row>
          <Col>
            <h1>
              <FontAwesomeIcon icon={faDiceD20} /> Dice Roller
            </h1>
          </Col>
        </Row>
        <Row>
          <Col className="mb-2 text-end">
            <Button variant="danger" onClick={() => clearRolls()}>
              <FontAwesomeIcon fixedWidth icon={faHistory} /> Clear History
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <InputGroup>
              <Form.Control
                type="text"
                name="expression"
                onKeyDown={handleExpressionKeyDown}
                onChange={handleExpressionChange}
                value={expression}
              />
              <Button onClick={handleExpressionEvaluate}>
                <FontAwesomeIcon fixedWidth icon={faFunction} />
              </Button>
            </InputGroup>
          </Col>
        </Row>
        {Boolean(diceRolls.length) && (
          <Row>
            <Col>
              <Table>
                <thead>
                  <tr>
                    <th>Input</th>
                    <th>Rolls</th>
                    <th className="text-center">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {diceRolls.map((roll) => (
                    <tr key={roll.id}>
                      <td>
                        <pre>{roll.expression}</pre>
                      </td>
                      <td className="d-flex">
                        {Boolean(roll.values.length) &&
                          roll.values.map((value, i) => (
                            <DiceResult
                              key={`${roll.id}.id}-${i}`}
                              sides={roll.sides}
                              value={value}
                            />
                          ))}
                      </td>
                      <td className="text-center">
                        {roll.values.reduce((curr, prev) => curr + prev, 0)}
                        {/* {roll.comparison === null ? (
                          'N/A'
                        ) : (
                          <FontAwesomeIcon
                            fixedWidth
                            icon={roll.comparison ? faCheckCircle : faX}
                          />
                        )} */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        )}
      </Container>
    </Layout>
  );
}
