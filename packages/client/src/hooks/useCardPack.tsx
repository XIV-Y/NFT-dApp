import { useFrame, Canvas, useLoader } from '@react-three/fiber';
import { useRef } from 'react';
import { TextureLoader } from 'three';
import * as THREE from 'three';

const SphereShaderMaterial = {
  uniforms: {
    u_time: { type: 'f', value: 0 },
    u_texture: { type: 'f', value: null },
  },
  vertexShader: `
    precision mediump float;
    varying vec2 vUv;
    void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
        gl_Position = projectionMatrix * mvPosition;
        vUv = uv;
    }
  `,
  fragmentShader: `
    varying vec2 vUv;

    uniform float u_time;
    uniform sampler2D u_texture;      

    void main() {
      vec2 uv = vUv;
      
      gl_FragColor = texture2D(u_texture, uv); 
    }
  `,
};

export const useCardPack = () => {
  const Box = (props: JSX.IntrinsicElements['mesh']) => {
    const ref = useRef<THREE.Mesh>(null!);
    // useFrame((state, delta) => (ref.current.rotation.y += 0.01));

    const colorMap = useLoader(TextureLoader, 'main.svg');

    useFrame(({ clock }) => {
      ref.current.rotation.y += 0.01;
      (ref.current.material as any).uniforms.u_time.value =
        clock.oldTime * 0.00005;
    });

    SphereShaderMaterial.uniforms.u_texture.value = colorMap;

    return (
      <mesh {...props} ref={ref}>
        <boxGeometry args={[2.5, 4.2, 0.05]} />
        <meshStandardMaterial map={colorMap} />
        <shaderMaterial attach="material" args={[SphereShaderMaterial]} />
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
