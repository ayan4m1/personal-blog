import Prism from 'prismjs';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import SEO from 'components/seo';
import NotFoundPage from 'pages/404';
import Layout from 'components/layout';

export default function Article({ data }) {
  if (!data || !data.markdownRemark) {
    return <NotFoundPage />;
  }

  const {
    markdownRemark: {
      html,
      frontmatter: { title, description }
    }
  } = data;

  useEffect(() => {
    Prism.manual = true;
    Prism.highlightAll();
  }, []);

  return (
    <Layout>
      <SEO title={title} description={description} />
      <Container>
        <Row>
          {title && (
            <Col md="12">
              <h1>{title}</h1>
            </Col>
          )}
          <Col md="12" dangerouslySetInnerHTML={{ __html: html }} />
        </Row>
      </Container>
    </Layout>
  );
}

Article.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      html: PropTypes.string.isRequired,
      frontmatter: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string
      })
    })
  })
};

export const pageQuery = graphql`
  query ($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        title
        description
      }
    }
  }
`;
