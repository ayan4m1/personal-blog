// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react';
import Prism from 'prismjs';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import { MDXProvider } from '@mdx-js/react';
import { Container, Row, Col } from 'react-bootstrap';

import Layout from 'components/layout';
import SEO from 'components/seo';

export default function MdxArticle({ data, children }) {
  const {
    mdx: {
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
          <Col xs={12}>
            <MDXProvider>{children}</MDXProvider>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

MdxArticle.propTypes = {
  data: PropTypes.object,
  children: PropTypes.node
};

export const pageQuery = graphql`
  query ($path: String!) {
    mdx(frontmatter: { path: { eq: $path } }) {
      frontmatter {
        title
        description
      }
    }
  }
`;
