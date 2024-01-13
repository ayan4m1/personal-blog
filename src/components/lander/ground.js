import { useBox } from '@react-three/p2';

const dims = [1000, 100];
const position = [0, -50];

export default function LanderGround() {
  const [ref] = useBox(() => ({
    mass: 0,
    args: dims,
    position
  }));

  return (
    <mesh ref={ref} position={[...position, 0]}>
      <boxGeometry args={[...dims, 1]} />
      <meshPhysicalMaterial color="brown" />
    </mesh>
  );
}
