import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useBox } from '@react-three/p2';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';

const dryMass = 6845;
const wetMass = 15103;
const dims = [3, 3];
const initialPosition = [0, 10];

export default function LanderVehicle({
  onDistanceUpdate,
  onVelocityUpdate,
  onMassUpdate,
  onLanded
}) {
  const [position, setPosition] = useState([]);
  const [, setMass] = useState(wetMass);
  const [thrustPressed, leftPressed, rightPressed] = useKeyboardControls(
    (state) => [state.thrust, state.left, state.right]
  );
  const [ref, api] = useBox(() => ({
    mass: wetMass,
    args: dims,
    position: initialPosition,
    onCollide: (e) => onLanded(e.contact.impactVelocity)
  }));

  useFrame((state) => {
    const interval = state.clock.getDelta();

    if (thrustPressed) {
      api.applyLocalForce([0, 45000], [0, -1.5]);
      setMass((prevVal) => {
        const newMass = Math.max(dryMass, prevVal - 23 * interval);

        api.mass.set(newMass);
        return newMass;
      });
    }

    if (leftPressed) {
      // api.angularVelocity.set(10);
    } else if (rightPressed) {
      // api.angularVelocity.set(-10);
    }

    state.camera.position.set(...position, 20);

    onDistanceUpdate(position[1] + 3);
  });

  useEffect(() => api.position.subscribe(setPosition), []);

  useEffect(
    () => api.velocity.subscribe((velocity) => onVelocityUpdate(velocity)),
    []
  );

  useEffect(() => api.mass.subscribe((mass) => onMassUpdate(mass)), []);

  return (
    <mesh ref={ref}>
      <boxGeometry args={[...dims, 1]} />
      <meshPhysicalMaterial color="hotpink" />
    </mesh>
  );
}

LanderVehicle.propTypes = {
  onDistanceUpdate: PropTypes.func.isRequired,
  onVelocityUpdate: PropTypes.func.isRequired,
  onMassUpdate: PropTypes.func.isRequired,
  onLanded: PropTypes.func.isRequired
};
