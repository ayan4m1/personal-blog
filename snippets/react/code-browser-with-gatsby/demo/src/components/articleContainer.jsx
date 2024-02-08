import Prism from 'prismjs';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { format, parseISO } from 'date-fns';
import { Container, Row, Col } from 'react-bootstrap';

import Layout from 'components/layout';

export default function ArticleContainer({
  title,
  description,
  date,
  children
}) {
  useEffect(() => {
    Prism.manual = true;
    Prism.highlightAll();
  }, []);

  return (
    <Layout title={title} description={description}>
      <Container>
        <Row>
          <Col md="12" className="mb-2">
            <h1>{title}</h1>
            {Boolean(date) && (
              <h4>Published on {format(parseISO(date), 'yyyy-MM-dd')}</h4>
            )}
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
  children: PropTypes.node.isRequired
};
