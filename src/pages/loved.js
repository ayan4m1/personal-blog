import { Container, Row, Col } from 'react-bootstrap';
import { faReact } from '@fortawesome/free-brands-svg-icons';
import { faAtomSimple } from '@fortawesome/pro-solid-svg-icons';

import Layout from 'components/layout';
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
      'An incredibly powerful framework for 3D rendering in the browser.'
  },
  {
    name: 'Electron',
    icon: faAtomSimple,
    url: 'https://www.electronjs.org/',
    description:
      'A desktop application framework powered by Chromium and Node.js.'
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
    <Layout title="Code I Love" description="Software and tooling I support.">
      <Container>
        <Row>
          <Col xs={12}>
            <h1>Code I Love</h1>
            <p>
              This is a list of software I would encourage you to support or
              take advantage of.
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
