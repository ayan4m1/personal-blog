import { useMemo } from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faDocker, faJs, faUsb } from '@fortawesome/free-brands-svg-icons';

import Layout from 'components/layout';
import GridCard from 'components/gridCard';

import minecraftLogo from 'images/icons/minecraft.svg';

const categories = [
  {
    id: 'js-lib',
    name: 'JavaScript Libraries',
    icon: faJs,
    bgColor: '#ebde34'
  },
  {
    id: 'web-app',
    name: 'Web Applications',
    icon: faGlobe,
    bgColor: '#3486eb'
  },
  {
    id: 'hardware',
    name: 'Hardware',
    icon: faUsb,
    bgColor: '#eb9a31'
  },
  {
    id: 'docker',
    name: 'Cloud Infrastructure',
    icon: faDocker,
    bgColor: '#31dbeb'
  },
  {
    id: 'minecraft',
    name: 'Minecraft',
    svgIcon: minecraftLogo,
    bgColor: '#55db48'
  }
];

export default function ProjectsPage({ data }) {
  const sorted = useMemo(() => {
    const newArr = [...data.projects.nodes];

    newArr.sort((a, b) => a.name.localeCompare(b.name));

    return newArr;
  }, [data]);

  return (
    <Layout
      title="My Projects"
      description="A list of my past and present projects."
    >
      <Container>
        <Row>
          <Col>
            <h1>My Projects</h1>
            <p>This is a list of my past and present projects.</p>
          </Col>
        </Row>
        <Row>
          {sorted.map((project) => {
            const category = categories.find(
              (cat) => cat.id === project.category
            );

            return (
              <Col xs={4} key={project.name}>
                <GridCard
                  category={category.name}
                  title={project.name}
                  icon={category.icon}
                  svgIcon={category.svgIcon}
                  githubUrl={`https://github.com/ayan4m1/${project.name}`}
                  url={project.url}
                >
                  <p style={{ minHeight: 50 }}>{project.description}</p>
                </GridCard>
              </Col>
            );
          })}
        </Row>
      </Container>
    </Layout>
  );
}

ProjectsPage.propTypes = {
  data: PropTypes.object.isRequired
};

export const pageQuery = graphql`
  query {
    projects: allProjectsJson {
      nodes {
        category
        description
        name
        url
      }
    }
  }
`;
