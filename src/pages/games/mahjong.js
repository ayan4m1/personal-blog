import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Container, Row, Col } from 'react-bootstrap';

import Layout from 'components/layout';
import MahjongBoard from 'components/mahjong/board';

export default function MahjongPage({ data }) {
  const { images } = data;

  return (
    <Layout title="Mahjong" description="Play Mahjong solitaire!">
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
