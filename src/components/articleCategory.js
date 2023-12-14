import { Link, graphql } from 'gatsby';
import PropTypes from 'prop-types';
import { format, parseISO } from 'date-fns';
import { Container, Row, Col, Table } from 'react-bootstrap';

import SEO from 'components/seo';
import NotFoundPage from 'pages/404';
import Layout from 'components/layout';

export default function ArticleCategory({ data }) {
  if (!data || !data.allMarkdownRemark) {
    return <NotFoundPage />;
  }

  const {
    articleCategoriesJson,
    allMarkdownRemark: { nodes }
  } = data;

  if (!articleCategoriesJson) {
    return <NotFoundPage />;
  }

  const { title, description } = articleCategoriesJson;

  return (
    <Layout>
      <SEO title={title} description={description} />
      <Container>
        <Row>
          <Col md="12">
            <h1>{title} Articles</h1>
            <h2>{description}</h2>
            {nodes.length ? (
              <Table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Posted On</th>
                  </tr>
                </thead>
                <tbody>
                  {nodes.map((node) => (
                    <tr key={node.id}>
                      <td>
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
    allMarkdownRemark: PropTypes.arrayOf(PropTypes.object)
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
