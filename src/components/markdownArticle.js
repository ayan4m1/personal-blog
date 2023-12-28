import { graphql } from 'gatsby';
import PropTypes from 'prop-types';

import NotFoundPage from 'pages/404';
import ArticleContainer from 'components/articleContainer';

export default function MarkdownArticle({ data }) {
  if (!data || !data.markdownRemark) {
    return <NotFoundPage />;
  }

  const {
    markdownRemark: { html, frontmatter }
  } = data;

  return (
    <ArticleContainer {...frontmatter}>
      <span dangerouslySetInnerHTML={{ __html: html }} />
    </ArticleContainer>
  );
}

MarkdownArticle.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      html: PropTypes.string.isRequired,
      frontmatter: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        date: PropTypes.string
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
        date
      }
    }
  }
`;
