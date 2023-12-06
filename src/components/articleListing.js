import { Link, graphql } from 'gatsby';
import PropTypes from 'prop-types';
import { format, parseISO } from 'date-fns';
import { Container, Row, Col, Table } from 'react-bootstrap';

import SEO from 'components/seo';
import NotFoundPage from 'pages/404';
import Layout from 'components/layout';

export default function ArticleListing({ data }) {
  if (!data || !data.allMarkdownRemark) {
    return <NotFoundPage />;
  }

  const {
    articlesJson,
    allMarkdownRemark: { nodes }
  } = data;

  const { title, description } = articlesJson;

  return (
    <Layout>
      <SEO title={title} description={description} />
      <Container>
        <Row>
          <Col md="12">
            <h1>{title}</h1>
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
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

ArticleListing.propTypes = {
  data: PropTypes.shape({
    articlesJson: PropTypes.object,
    allMarkdownRemark: PropTypes.arrayOf(PropTypes.object)
  })
};

export const pageQuery = graphql`
  query ($pathPrefix: String!, $articleName: String!) {
    articlesJson(name: { eq: $articleName }) {
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
