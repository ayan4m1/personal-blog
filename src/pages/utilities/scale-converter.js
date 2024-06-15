import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRightLong,
  faMaximize
} from '@fortawesome/free-solid-svg-icons';
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row
} from 'react-bootstrap';

import Layout from 'components/layout';
import useDebounce from 'hooks/useDebounce';
import useScaleForm from 'hooks/useScaleForm';
import useScaleHistory from 'hooks/useScaleHistory';

export default function ScaleConverterPage() {
  const { entries, denominator, pushEntry, clearEntries, updateDenominator } =
    useScaleHistory();
  const { errors, values, handleSubmit, handleChange } =
    useScaleForm(pushEntry);
  const onChangeDenominator = useDebounce(
    (event) => {
      console.dir(event);
      const value = parseFloat(event.target.value);

      if (!value || isNaN(value)) {
        return false;
      } else {
        updateDenominator(value);
      }
    },
    250,
    [updateDenominator]
  );

  return (
    <Layout
      title="Scale Converter"
      description="Convert between units using a scaling factor/ratio."
    >
      <Container>
        <Row>
          <Col>
            <h1>
              <FontAwesomeIcon icon={faMaximize} /> Convert Scale
            </h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card body variant="info" className="my-2">
              Specify a scale, then enter one or more expressions. Each
              expression will be scaled appropriately. If you enter an
              expression such as &quot;100 mm in ft,&quot; the scaled value will
              be converted into the target unit.
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card body className="my-2">
              <Form onSubmit={handleSubmit}>
                <Form.Group as={Row} className="mb-2">
                  <Form.Label column sm={2} htmlFor="denominator">
                    Scale
                  </Form.Label>
                  <Col sm={10}>
                    <InputGroup style={{ width: 125 }}>
                      <InputGroup.Text>1 :</InputGroup.Text>
                      <Form.Control
                        id="denominator"
                        type="number"
                        onChange={onChangeDenominator}
                        defaultValue={denominator}
                        style={{ textAlign: 'right' }}
                      />
                    </InputGroup>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-2">
                  <Form.Label column sm={2} htmlFor="conversion">
                    Expression
                  </Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      id="conversion"
                      type="text"
                      name="conversion"
                      placeholder='"100 mm", "10 m in ft"'
                      onChange={handleChange}
                      value={values.conversion}
                      isInvalid={Boolean(errors.conversion)}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.conversion}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group className="d-flex justify-content-end">
                  <Button type="submit" variant="success">
                    Convert
                  </Button>
                </Form.Group>
              </Form>
            </Card>
            <Card body className="my-2">
              <Card.Title>
                <Row>
                  <Col xs={8}>History</Col>
                  <Col xs={4} className="d-flex justify-content-end">
                    <Button variant="danger" onClick={clearEntries}>
                      Clear
                    </Button>
                  </Col>
                </Row>
              </Card.Title>
              <Row>
                {entries.length ? (
                  entries.map((entry) => (
                    <Col xs={12} key={entry.id}>
                      <span>
                        {entry.value} {entry.unit}
                      </span>
                      <FontAwesomeIcon
                        icon={faArrowRightLong}
                        className="mx-3"
                      />
                      <span>
                        {entry.result.toFixed(2)} {entry.targetUnit}
                      </span>
                    </Col>
                  ))
                ) : (
                  <Col xs={12}>No entries.</Col>
                )}
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}
