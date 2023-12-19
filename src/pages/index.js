import {
  faArrowCircleRight,
  faArrowCircleLeft,
  faHeart
} from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import PropTypes from 'prop-types';
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

import SEO from 'components/seo';
import Layout from 'components/layout';
import FeaturedPost from 'components/featuredPost';

import profilePic from 'images/profile.jpg';

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
    <Layout>
      <SEO title="Home" />
      <Container>
        <Card body bg="info" className="text-light">
          <Container fluid>
            <Row>
              <Col xs={6} md={2} className="d-flex justify-content-center">
                <Image
                  src={profilePic}
                  alt="My face"
                  style={{ maxHeight: 128 }}
                  rounded
                />
              </Col>
              <Col xs={6} className="d-flex flex-column">
                <Card.Title as="h1" className="m-0">
                  Andrew DeLisa
                </Card.Title>
                <h2 className="m-0 mt-auto">Hacker, Maker, Developer</h2>
              </Col>
              <Col
                xs={12}
                md={4}
                className="mt-4 my-md-0 d-flex flex-column h-100"
              >
                <ButtonGroup>
                  <Button
                    variant="success"
                    as="a"
                    href="https://github.com/ayan4m1"
                  >
                    <FontAwesomeIcon icon={faGithub} /> GitHub
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
        </Card>
        <h2>Recent Articles</h2>
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
