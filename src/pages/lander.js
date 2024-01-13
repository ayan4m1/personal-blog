import { useCallback, useMemo, useState } from 'react';
import { Physics } from '@react-three/p2';
import { Alert, Container } from 'react-bootstrap';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls } from '@react-three/drei';

import Layout from 'components/layout';
import SEO from 'components/seo';
import LanderVehicle from 'components/lander/vehicle';
import LanderGround from 'components/lander/ground';

export default function LanderPage() {
  const [landerDistance, setLanderDistance] = useState(0);
  const [landerVelocity, setLanderVelocity] = useState([0, 0]);
  const [landerMass, setLanderMass] = useState(0);
  const [landed, setLanded] = useState(false);
  const [crashed, setCrashed] = useState(false);
  const keyControls = useMemo(
    () => [
      { name: 'thrust', keys: ['ArrowUp', 'KeyW'] },
      { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
      { name: 'right', keys: ['ArrowRight', 'KeyD'] }
    ],
    []
  );
  const handleLanded = useCallback((velocity) => {
    setLanded(true);
    setCrashed(velocity > 0.6);
  }, []);

  return (
    <Layout>
      <SEO title="Lander" />
      <Container>
        <h1>Lander</h1>
        {landed ? (
          <Alert variant="success">You landed!</Alert>
        ) : (
          <h2>
            {landerVelocity[0].toFixed(2)} m/s H |{' '}
            {landerVelocity[1].toFixed(2)} m/s V | {landerMass.toFixed(2)} kg |{' '}
            {landerDistance.toFixed(2)} m ASL
          </h2>
        )}
        {crashed && <Alert variant="danger">You are dead.</Alert>}
        <Canvas
          style={{ height: '80vh' }}
          orthographic
          camera={{
            position: [0, 0, 20],
            fov: 20,
            near: 1,
            far: 100,
            zoom: 20
          }}
        >
          <KeyboardControls map={keyControls}>
            <ambientLight />
            <Physics
              normalIndex={2}
              gravity={[0, -1.62]}
              iterations={300}
              quatNormalizeSkip
            >
              <LanderVehicle
                onDistanceUpdate={setLanderDistance}
                onVelocityUpdate={setLanderVelocity}
                onMassUpdate={setLanderMass}
                onLanded={handleLanded}
              />
              <LanderGround />
            </Physics>
          </KeyboardControls>
        </Canvas>
      </Container>
    </Layout>
  );
}
