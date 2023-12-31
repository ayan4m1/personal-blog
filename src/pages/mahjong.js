import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Container, Row, Col } from 'react-bootstrap';

import Layout from 'components/layout';
import SEO from 'components/seo';
import MahjongBoard from 'components/mahjongBoard';

export default function MahjongPage({ data }) {
  const { images } = data;

  return (
    <Layout>
      <SEO title="Mahjong" description="Play Mahjong solitaire for free." />
      <Container>
        <Row>
          <Col>
            <h1>Mahjong</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <MahjongBoard images={images} />
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

MahjongPage.propTypes = {
  data: PropTypes.object
};

export const pageQuery = graphql`
  query {
    images: allFile(
      filter: { absolutePath: { regex: "/.*images/mahjong/.*\\.svg/" } }
    ) {
      nodes {
        relativePath
        publicURL
      }
    }
  }
`;
