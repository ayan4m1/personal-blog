import { Container, Row, Col } from 'react-bootstrap';
import { faReact } from '@fortawesome/free-brands-svg-icons';

import Layout from 'components/layout';
import SEO from 'components/seo';
import GridCard from 'components/gridCard';

import gatsbyLogo from 'images/icons/gatsby.svg';
import pioLogo from 'images/icons/platformio.svg';

const data = [
  {
    name: 'React',
    icon: faReact,
    url: 'https://react.dev/',
    description:
      'The basis of the best modern web application development frameworks.'
  },
  {
    name: 'Gatsby',
    svgIcon: gatsbyLogo,
    url: 'https://gatsbyjs.com/',
    description:
      'A flexible, powerful static site generator. This blog is powered by Gatsby!'
  },
  {
    name: 'react-three-fiber',
    url: 'https://docs.pmnd.rs/react-three-fiber',
    description:
      'An incredibly powerful framework for rendering 3D in the browser.'
  },
  {
    name: 'gfx',
    url: 'https://honeythecodewitch.com/gfx/',
    description:
      'An embedded drawing library done the right way, with tons of supported hardware.'
  },
  {
    name: 'PlatformIO',
    svgIcon: pioLogo,
    url: 'https://platformio.org/',
    description:
      'A wonderful VS Code extension and CLI which makes embedded development faster and easier.'
  }
];

export default function LovePage() {
  return (
    <Layout>
      <SEO title="Things I Love" />
      <Container>
        <Row>
          <Col xs={12}>
            <h1>Things I Love</h1>
            <p>
              My wife and my dogs. But you came here for some links, didn&apos;t
              you?
            </p>
            <p>
              This is a list of projects, libraries, and other software-related
              things I would encourage you to support.
            </p>
          </Col>
        </Row>
        <Row>
          {data.map((item) => (
            <Col xs={4} key={item.name}>
              <GridCard
                title={item.name}
                icon={item.icon}
                svgIcon={item.svgIcon}
                url={item.url}
              >
                <p>{item.description}</p>
              </GridCard>
            </Col>
          ))}
        </Row>
      </Container>
    </Layout>
  );
}
