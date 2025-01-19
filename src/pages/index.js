import {
  Container,
  Row,
  Col,
  Carousel,
  Card,
  Image,
  Button,
  ButtonGroup
} from 'react-bootstrap';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import {
  faArrowCircleRight,
  faArrowCircleLeft,
  faHeart
} from '@fortawesome/free-solid-svg-icons';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

import Layout from 'components/layout';
import BodyCard from 'components/bodyCard';
import FeaturedPost from 'components/featuredPost';

export default function IndexPage({ data }) {
  const {
    articles: { nodes: articles },
    images: { nodes: images }
  } = data;
  const findImage = (articleName) =>
    articleName
      ? getImage(
          images.find((image) =>
            image.relativePath.startsWith(`articles/${articleName}`)
          )?.childImageSharp?.gatsbyImageData
        )
      : {};

  return (
    <Layout title="Home">
      <Container>
        <BodyCard className="index-header">
          <Container fluid>
            <Row>
              <Col
                xs={12}
                sm={6}
                md={3}
                className="d-flex justify-content-start"
              >
                <Image
                  src="/profile.jpg"
                  alt="My face"
                  style={{ maxHeight: 128 }}
                  thumbnail
                />
              </Col>
              <Col
                xs={12}
                sm={6}
                md={4}
                className="d-flex flex-column justify-content-center ps-2"
              >
                <Card.Title as="h1" className="m-0">
                  Andrew DeLisa
                </Card.Title>
                <h2 className="m-0 mt-2">Hacker, Maker, Developer</h2>
              </Col>
              <Col
                xs={12}
                sm={12}
                md={5}
                className="mt-4 my-md-0 d-flex flex-column justify-content-center align-items-end"
              >
                <ButtonGroup className="d-flex flex-column">
                  <Button
                    variant="success"
                    as="a"
                    href="https://github.com/ayan4m1"
                  >
                    <FontAwesomeIcon icon={faGithub} /> GitHub
                  </Button>
                  <Button
                    variant="info"
                    as="a"
                    href="https://www.linkedin.com/in/ayan4m1"
                  >
                    <FontAwesomeIcon icon={faLinkedin} /> LinkedIn
                  </Button>
                  <Button
                    variant="primary"
                    as="a"
                    href="https://ko-fi.com/ayan4m1"
                  >
                    <FontAwesomeIcon icon={faHeart} /> Donate
                  </Button>
                </ButtonGroup>
              </Col>
            </Row>
          </Container>
        </BodyCard>
        <h1 className="mt-4">Recent Articles</h1>
        <Row className="justify-content-center">
          <Col md={10}>
            <Carousel
              indicators={false}
              className="mt-5"
              nextIcon={<FontAwesomeIcon icon={faArrowCircleRight} size="2x" />}
              prevIcon={<FontAwesomeIcon icon={faArrowCircleLeft} size="2x" />}
            >
              {articles.map(({ children: [article] }) => (
                <Carousel.Item key={article.frontmatter.title}>
                  <FeaturedPost
                    {...article.frontmatter}
                    image={
                      <GatsbyImage
                        image={findImage(article.parent?.relativeDirectory)}
                        alt={article.frontmatter.title}
                      />
                    }
                    excerpt={article.excerpt}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

IndexPage.propTypes = {
  data: PropTypes.object.isRequired
};

export const query = graphql`
  query {
    articles: allFile(
      filter: { sourceInstanceName: { eq: "articles" } }
      sort: { childrenMarkdownRemark: { frontmatter: { date: DESC } } }
      limit: 5
    ) {
      nodes {
        children {
          ... on Mdx {
            frontmatter {
              path
              title
              date
            }
            excerpt(pruneLength: 250)
            parent {
              ... on File {
                relativeDirectory
              }
            }
          }
          ... on MarkdownRemark {
            frontmatter {
              path
              title
              date
            }
            excerpt(pruneLength: 250)
            parent {
              ... on File {
                relativeDirectory
              }
            }
          }
        }
      }
    }

    images: allFile(
      filter: { absolutePath: { regex: "/.*images/articles/.*.(png|jpe?g)/" } }
    ) {
      nodes {
        relativePath
        childImageSharp {
          gatsbyImageData(layout: CONSTRAINED, width: 800)
        }
      }
    }
  }
`;
