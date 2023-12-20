// eslint-disable-next-line no-unused-vars
import React from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import { MDXProvider } from '@mdx-js/react';

import NotFoundPage from 'pages/404';
import ArticleContainer from './articleContainer';

export default function MdxArticle({ data, children }) {
  if (!data || !data.mdx) {
    return <NotFoundPage />;
  }

  const {
    mdx: { frontmatter }
  } = data;

  return (
    <ArticleContainer {...frontmatter}>
      <MDXProvider>{children}</MDXProvider>
    </ArticleContainer>
  );
}

MdxArticle.propTypes = {
  data: PropTypes.shape({
    mdx: PropTypes.shape({
      frontmatter: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        date: PropTypes.string
      })
    })
  }),
  children: PropTypes.node.isRequired
};

export const pageQuery = graphql`
  query ($path: String!) {
    mdx(frontmatter: { path: { eq: $path } }) {
      frontmatter {
        title
        description
        date
      }
    }
  }
`;
