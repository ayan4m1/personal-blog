import { useSphere } from '@react-three/cannon';
import { useTexture } from '@react-three/drei';

export default function LanderTerrain() {
  const [ref] = useSphere(() => ({
    mass: 0,
    args: [174000],
    position: [0, -87000, 0]
  }));
  const [map, aoMap, normalMap, roughnessMap] = useTexture([
    '/assets/Rock035_2K-JPG_Color.jpg',
    '/assets/Rock035_2K-JPG_AmbientOcclusion.jpg',
    '/assets/Rock035_2K-JPG_NormalGL.jpg',
    '/assets/Rock035_2K-JPG_Roughness.jpg'
  ]);

  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <sphereGeometry args={[174000, 512, 512]} />
      <meshPhysicalMaterial
        map={map}
        aoMap={aoMap}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
      />
    </mesh>
  );
}
