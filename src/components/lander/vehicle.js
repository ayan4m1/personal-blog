import PropTypes from 'prop-types';
import { Vector3 } from 'three';
import { useBox } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useKeyboardControls } from '@react-three/drei';
import { useEffect, useState } from 'react';

import FireCone from './fireCone';

export const dryMass = 6845;
export const wetMass = 15103;
export const initialPosition = [0, 87600, 0];

export default function LanderVehicle({
  onAltitudeUpdate,
  onMassUpdate,
  onVelocityUpdate
}) {
  const [thrusting, setThrusting] = useState(false);
  const [landerMass, setLanderMass] = useState(wetMass);
  const [landerPosition, setLanderPosition] = useState([0, 0, 0]);
  const [landerVelocity, setLanderVelocity] = useState([0, 0, 0]);
  const [landerRef, api] = useBox(() => ({
    mass: wetMass,
    args: [9.07, 7.4, 9.07],
    position: initialPosition
  }));
  const model = useGLTF('/assets/lander.gltf');
  const [thrustPressed, leftPressed, rightPressed] = useKeyboardControls(
    (state) => [state.thrust, state.left, state.right]
  );

  useFrame((state) => {
    const interval = state.clock.getDelta();

    setThrusting(thrustPressed);
    if (thrustPressed) {
      api.applyLocalForce([0, 45000, 0], [0, 0, 0]);

      const newMass = landerMass - 23 * interval;

      api.mass.set(newMass);
      setLanderMass(newMass);
    }

    if (leftPressed) {
      api.applyTorque([500000, 0, 0]);
    } else if (rightPressed) {
      api.applyTorque([-500000, 0, 0]);
    }

    state.camera.position.set(
      landerPosition[0] + 10,
      landerPosition[1] + 5,
      landerPosition[2] - 10
    );
    state.camera.lookAt(new Vector3(...landerPosition));
    state.camera.updateProjectionMatrix();
  });

  useEffect(() => api.velocity.subscribe(setLanderVelocity), []);
  useEffect(() => api.position.subscribe(setLanderPosition), []);
  useEffect(() => api.mass.subscribe(setLanderMass), []);

  useEffect(() => {
    onAltitudeUpdate(landerPosition[1] - 87400);
  }, [landerPosition]);
  useEffect(() => {
    onVelocityUpdate(landerVelocity);
  }, [landerVelocity]);
  useEffect(() => {
    onMassUpdate(landerMass);
  }, [landerMass]);

  return (
    <group ref={landerRef}>
      <primitive object={model.scene} />
      {thrusting && <FireCone />}
    </group>
  );
}

LanderVehicle.propTypes = {
  onAltitudeUpdate: PropTypes.func.isRequired,
  onMassUpdate: PropTypes.func.isRequired,
  onVelocityUpdate: PropTypes.func.isRequired
};
