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

const data = [
  {
    name: 'minestat-es',
    category: 'js-lib',
    description: 'A simple Minecraft server status library for Node.js'
  },
  {
    name: 'paypal-fee',
    category: 'js-lib',
    description: 'A complete PayPal fee calculator for Node.js and the browser'
  },
  {
    name: 'generator-reackt',
    category: 'js-lib',
    description: 'A Yeoman generator for a modern React application'
  },
  {
    name: 'generator-noder',
    category: 'js-lib',
    description: 'A Yeoman generator for a modern Node.js application'
  },
  {
    name: 'leaf-decay',
    category: 'minecraft',
    description: 'Minecraft Fabric mod to clear leaf litter quickly'
  },
  {
    name: 'filacalc',
    category: 'web-app',
    url: 'https://filacalc.andrewdelisa.com',
    description: 'Calculators and filament database for 3D printing hobbyists'
  },
  {
    name: 'coilz',
    category: 'web-app',
    url: 'https://coilz.andrewdelisa.com',
    description: 'Calculators for vape hobbyists'
  },
  {
    name: 'bom-sheet-maker',
    category: 'web-app',
    description: 'Tool for PCB designers to lay their components out on paper'
  },
  {
    name: 'cable-tester',
    category: 'hardware',
    description: 'USB/TRRS cable tester PCB'
  },
  {
    name: 'docker-maven-node',
    category: 'docker',
    description: 'Maven + Node in one small Docker image'
  },
  {
    name: 'campigs',
    category: 'web-app',
    description: 'Live streaming guinea pigs!',
    url: 'https://campigs.xyz'
  },
  {
    name: 'leela-the-beagle',
    category: 'web-app',
    description: 'A memorial site for my pet beagle.',
    url: 'https://leelathebeagle.com'
  },
  {
    name: 'battery-safety',
    category: 'web-app',
    description: 'LiPo battery safety/reliability research data.',
    url: 'https://batterysafety.andrewdelisa.com'
  },
  {
    name: 'modemania',
    category: 'web-app',
    description: 'WIP phone/modem sound simulator using WebAudio',
    url: 'https://modemania.andrewdelisa.com'
  },
  {
    name: 'tonality',
    category: 'web-app',
    description: 'WIP modular synthesizer using WebAudio and WebMIDI',
    url: 'https://tonality.andrewdelisa.com'
  }
];

export default function ProjectsPage() {
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
          {data.map((project) => {
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
