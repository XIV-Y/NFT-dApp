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
  varying vec2 vUv;

  uniform float u_time;
  float PI = 3.1415926535897932384626433832795;

  void main() {
    vUv = uv;

    float theta;
    float tx, ty, tz;
    vec3 p;
    
    if (position.x < 0.0) {
        // 左側だけを折り曲げる
        theta = position.x / 0.49;
        tx = 0.49 * sin(theta);
        ty = position.y;
        tz = 0.49 * (1.0 - cos(theta));
        p = vec3(tx, ty, tz);
    } else {
        // 右側は変更なし
        p = position;
    }
  
    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;
}
  `,
  fragmentShader: `
    varying vec2 vUv;

    uniform float u_time;
    uniform sampler2D u_texture;      

    void main() {
      gl_FragColor = texture2D(u_texture, vUv);
    }
  `,
};

export const useCardPack = () => {
  const Box = (props: JSX.IntrinsicElements['mesh']) => {
    const ref = useRef<THREE.Mesh>(null!);
    // useFrame((state, delta) => (ref.current.rotation.y += 0.01));

    const colorMap = useLoader(TextureLoader, 'main.svg');

    useFrame(({ clock }) => {
      // ref.current.rotation.x = 1.4;
      // ref.current.rotation.y = 12;
      (ref.current.material as any).uniforms.u_time.value =
        clock.oldTime * 10.101;
      // console.log(SphereShaderMaterial.uniforms.u_time.value);
    });

    console.log(SphereShaderMaterial.uniforms.u_time.value);

    SphereShaderMaterial.uniforms.u_texture.value = colorMap;

    return (
      <mesh {...props} ref={ref}>
        <planeGeometry args={[2.5, 4.2, 16, 32]} />
        <shaderMaterial
          attach="material"
          args={[SphereShaderMaterial]}
          side={THREE.DoubleSide}
          // wireframe={true}
          transparent={true}
          blending={THREE.NormalBlending}
        />
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
