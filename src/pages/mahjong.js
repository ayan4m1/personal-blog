import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { useCallback, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import Layout from 'components/layout';
import SEO from 'components/seo';
import MahjongTile from 'components/mahjongTile';
import { getTileImagePath, generateTurtle } from 'utils/mahjong';

export default function MahjongPage({ data }) {
  const { images } = data;
  const [turtle] = useState(generateTurtle());
  const [activeTile, setActiveTile] = useState(null);
  const handleTileClick = useCallback(
    (id) => setActiveTile((prevVal) => (prevVal === id ? null : id)),
    [setActiveTile]
  );

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
            {turtle.map((tile) => (
              <MahjongTile
                key={tile.index}
                tile={tile}
                x={tile.x}
                y={tile.y}
                layer={tile.layer}
                active={activeTile === tile.index}
                image={images.nodes.find((node) =>
                  node.relativePath.endsWith(getTileImagePath(tile))
                )}
                onClick={handleTileClick}
              />
            ))}
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
