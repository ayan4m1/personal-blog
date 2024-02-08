import { Link, graphql } from 'gatsby';
import PropTypes from 'prop-types';
import { format, parseISO } from 'date-fns';
import { Container, Row, Col, Table } from 'react-bootstrap';

import NotFoundPage from 'pages/404';
import Layout from 'components/layout';

export default function ArticleCategory({ data }) {
  if (!data) {
    return <NotFoundPage />;
  }

  const {
    articleCategoriesJson,
    allMarkdownRemark: { nodes },
    allMdx: { nodes: mdxNodes }
  } = data;

  if (!articleCategoriesJson) {
    return <NotFoundPage />;
  }

  const { title, description } = articleCategoriesJson;
  const allNodes = [...nodes, ...mdxNodes];

  return (
    <Layout title={title} description={description}>
      <Container>
        <Row>
          <Col xs={12}>
            <h1>{title} Articles</h1>
            <h2>{description}</h2>
            {allNodes.length ? (
              <Table
                className="mt-4 p-2 rounded"
                style={{ overflow: 'hidden' }}
              >
                <thead>
                  <tr>
                    <th className="py-md-4 ps-4">Title</th>
                    <th className="py-md-4">Published</th>
                  </tr>
                </thead>
                <tbody>
                  {allNodes.map((node) => (
                    <tr key={node.id}>
                      <td className="ps-4">
                        <Link to={node.frontmatter.path}>
                          {node.frontmatter.title}
                        </Link>
                      </td>
                      <td>
                        {format(parseISO(node.frontmatter.date), 'yyyy-MM-dd')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <h2>There are no articles in this category yet.</h2>
            )}
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

ArticleCategory.propTypes = {
  data: PropTypes.shape({
    articleCategoriesJson: PropTypes.object,
    allMarkdownRemark: PropTypes.shape({
      nodes: PropTypes.arrayOf(PropTypes.object)
    }),
    allMdx: PropTypes.shape({
      nodes: PropTypes.arrayOf(PropTypes.object)
    })
  })
};

export const pageQuery = graphql`
  query ($pathPrefix: String!, $categoryName: String!) {
    articleCategoriesJson(name: { eq: $categoryName }) {
      title
      description
    }

    allMarkdownRemark(
      filter: { frontmatter: { path: { glob: $pathPrefix } } }
      sort: [{ frontmatter: { date: DESC } }]
    ) {
      nodes {
        id
        frontmatter {
          date
          path
          title
        }
      }
    }

    allMdx(
      filter: { frontmatter: { path: { glob: $pathPrefix } } }
      sort: [{ frontmatter: { date: ASC } }]
    ) {
      nodes {
        id
        frontmatter {
          date
          path
          title
        }
      }
    }
  }
`;
