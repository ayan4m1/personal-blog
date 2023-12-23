// eslint-disable-next-line no-unused-vars
import React from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import { MDXProvider } from '@mdx-js/react';

import NotFoundPage from 'pages/404';
import ArticleContainer from './articleContainer';
import CodeBrowser from './codeBrowser';
import SnippetProvider from './snippetProvider';

export default function MdxArticle({ data, children }) {
  if (!data || !data.mdx) {
    return <NotFoundPage />;
  }

  const {
    mdx: { frontmatter },
    allFile: { nodes: snippets }
  } = data;

  return (
    <ArticleContainer {...frontmatter}>
      <MDXProvider components={{ CodeBrowser }}>
        <SnippetProvider
          snippets={snippets.map((snippet) => ({
            ...snippet,
            path: snippet.path.replace(`${frontmatter.path.substring(1)}/`, '')
          }))}
        >
          {children}
        </SnippetProvider>
      </MDXProvider>
    </ArticleContainer>
  );
}

MdxArticle.propTypes = {
  data: PropTypes.shape({
    mdx: PropTypes.shape({
      frontmatter: PropTypes.shape({
        path: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        date: PropTypes.string
      })
    }),
    allFile: PropTypes.shape({
      nodes: PropTypes.arrayOf(
        PropTypes.shape({
          path: PropTypes.string.isRequired,
          code: PropTypes.shape({
            content: PropTypes.string.isRequired
          })
        })
      )
    })
  }),
  children: PropTypes.node.isRequired
};

export const pageQuery = graphql`
  query ($path: String!, $pathGlob: String!) {
    mdx(frontmatter: { path: { eq: $path } }) {
      frontmatter {
        path
        title
        description
        date
      }
    }

    allFile(
      filter: {
        sourceInstanceName: { eq: "snippets" }
        relativeDirectory: { glob: $pathGlob }
      }
    ) {
      nodes {
        path: relativePath
        code: childSourceCode {
          ... on SourceCode {
            content
          }
        }
      }
    }
  }
`;
