import Prism from 'prismjs';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { format, parseISO } from 'date-fns';
import { Container, Row, Col } from 'react-bootstrap';

import Layout from 'components/layout';

const formatDate = (date) => format(parseISO(date), 'MMMM dd, yyyy');

export default function ArticleContainer({
  title,
  description,
  date,
  editDate,
  children
}) {
  useEffect(() => {
    Prism.manual = true;
    Prism.highlightAll();
  }, []);

  return (
    <Layout title={title} description={description}>
      <Container className="article-container">
        <Row>
          <Col md="12" className="mb-2">
            <h1>{title}</h1>
            {Boolean(date) && <h4>Published on {formatDate(date)}</h4>}
            {Boolean(editDate) && <h4>Edited on {formatDate(editDate)}</h4>}
          </Col>
          <hr />
          <Col xs={12}>{children}</Col>
        </Row>
      </Container>
    </Layout>
  );
}

ArticleContainer.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  date: PropTypes.string,
  editDate: PropTypes.string,
  children: PropTypes.node.isRequired
};
