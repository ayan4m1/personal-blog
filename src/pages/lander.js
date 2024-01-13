import { Suspense, useMemo, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Canvas } from '@react-three/fiber';
import { Debug, Physics } from '@react-three/cannon';
import {
  KeyboardControls,
  Environment,
  OrbitControls
} from '@react-three/drei';

import Layout from 'components/layout';
import SEO from 'components/seo';
import LanderVehicle from 'components/lander/vehicle';
import LanderTerrain from 'components/lander/terrain';

export default function LanderPage() {
  const [landerMass, setLanderMass] = useState(0);
  const [landerVelocity, setLanderVelocity] = useState([0, 0]);
  const [landerAltitude, setLanderAltitude] = useState(0);

  const keyControls = useMemo(
    () => [
      { name: 'thrust', keys: ['ArrowUp', 'KeyW'] },
      { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
      { name: 'right', keys: ['ArrowRight', 'KeyD'] }
    ],
    []
  );

  return (
    <Layout>
      <SEO title="Lander" />
      <Container>
        <Suspense>
          <div style={{ position: 'fixed', height: '80vh', zIndex: 1000 }}>
            <p>{landerMass.toFixed(2)} kg</p>
            <p>{landerAltitude.toFixed(2)} m ASL</p>
            <p>{landerVelocity[0].toFixed(2)} m/s H</p>
            <p>{landerVelocity[1].toFixed(2)} m/s V</p>
          </div>
          <Canvas style={{ height: '80vh' }} camera={{ near: 1, far: 200000 }}>
            <ambientLight />
            <Environment files="/assets/bg.hdr" background />
            <KeyboardControls map={keyControls}>
              <Physics gravity={[0, -1.62, 0]}>
                <Debug color="red">
                  <LanderVehicle
                    onMassUpdate={setLanderMass}
                    onAltitudeUpdate={setLanderAltitude}
                    onVelocityUpdate={setLanderVelocity}
                  />
                  <LanderTerrain />
                </Debug>
              </Physics>
            </KeyboardControls>
            <OrbitControls
              makeDefault
              position={[200, 87600, 200]}
              target={[0, 87400, 0]}
            />
          </Canvas>
        </Suspense>
      </Container>
    </Layout>
  );
}
