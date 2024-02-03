import { useFrame, Canvas, useLoader } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { BoxGeometry, TextureLoader } from 'three';

export const useCardPack = () => {
  const Box = (props: JSX.IntrinsicElements['mesh']) => {
    const ref = useRef<THREE.Mesh>(null!);
    const [hovered, setHover] = useState(false);
    const [active, setActive] = useState(false);
    useFrame((state, delta) => (ref.current.rotation.y += 0.01));

    const colorMap = useLoader(TextureLoader, 'main.svg');

    return (
      <mesh
        {...props}
        ref={ref}
        onClick={(event) => setActive(!active)}
        onPointerOver={(event) => setHover(true)}
        onPointerOut={(event) => setHover(false)}
      >
        <boxGeometry args={[2.5, 4.2, 0.05]} />
        <meshStandardMaterial map={colorMap} />
      </mesh>
    );
  };

  return (
    <Canvas
      style={{
        width: 50 + 'vw',
        height: 100 + 'vh',
        position: 'fixed',
        top: 0,
        left: 0,
      }}
    >
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Box position={[0, 0, 0]} />
    </Canvas>
  );
};
