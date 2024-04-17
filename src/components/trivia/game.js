import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Fragment, useEffect, useState } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelopeOpen,
  faFastForward
} from '@fortawesome/free-solid-svg-icons';

import Layout from 'components/layout';

export default function TriviaGame({ data }) {
  const { show } = data;
  const [node] = show.nodes;
  const { showNumber, questions } = node;
  const [categories, setCategories] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(
    () =>
      setCategories((prevVal) => {
        const newVal = [...prevVal];

        for (const question of questions.filter(
          (question) => question.round === 'Jeopardy!'
        )) {
          const category = newVal.find(
            (category) => category.name === question.category
          );

          question.value = parseInt(question.value.replace(/[$,]/g, ''), 10);

          if (!category) {
            newVal.push({
              name: question.category,
              questions: [question]
            });
          } else {
            category.questions.push(question);
          }
        }

        return newVal;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Layout title="Trivia Game">
      <Container>
        <Row>
          <h1>Trivia - Show {showNumber}</h1>
        </Row>
        <Row>
          {Boolean(selectedQuestion) && (
            <Col xs={12} className="trivia-question">
              <Container fluid>
                <Row>
                  <Col>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: selectedQuestion.question
                      }}
                    ></p>
                  </Col>
                </Row>
                {revealed ? (
                  <Fragment>
                    <Row>
                      <Col>
                        <p>Answer: {selectedQuestion.answer}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Button
                          variant="success"
                          onClick={() => {
                            setSelectedQuestion((prevVal) => {
                              prevVal.value = -1;
                              return null;
                            });
                            setRevealed(false);
                          }}
                        >
                          <FontAwesomeIcon icon={faFastForward} /> Proceed
                        </Button>
                      </Col>
                    </Row>
                  </Fragment>
                ) : (
                  <Row>
                    <Col>
                      <Button
                        variant="warning"
                        className="text-dark"
                        onClick={() => setRevealed(true)}
                      >
                        <FontAwesomeIcon icon={faEnvelopeOpen} /> Reveal
                      </Button>
                    </Col>
                  </Row>
                )}
              </Container>
            </Col>
          )}
          {!selectedQuestion &&
            categories?.map(({ name, questions }) => (
              <Col key={name}>
                <Row>
                  <Col xs={12} className="trivia-category">
                    {name}
                  </Col>
                  {questions.map((question, index) => (
                    <Col
                      xs={12}
                      key={index}
                      className={classNames('trivia-card')}
                      onClick={() =>
                        setSelectedQuestion((prevVal) => {
                          if (!prevVal?.value) {
                            return question;
                          } else {
                            return null;
                          }
                        })
                      }
                    >
                      {question.value > 0 && `$${question.value}`}
                    </Col>
                  ))}
                </Row>
              </Col>
            ))}
        </Row>
      </Container>
    </Layout>
  );
}

TriviaGame.propTypes = {
  data: PropTypes.object.isRequired
};

export const pageQuery = graphql`
  query ($showNumber: String!) {
    show: allShowsJson(
      filter: { showNumber: { eq: $showNumber } }
      sort: [{ questions: { category: ASC } }, { questions: { value: ASC } }]
    ) {
      nodes {
        showNumber
        questions {
          round
          category
          value
          question
          answer
        }
      }
    }
  }
`;
