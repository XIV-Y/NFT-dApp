import { useFrame, Canvas, useLoader } from '@react-three/fiber';
import { useCallback, useRef, useState } from 'react';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { PACK_1 } from '@/utils/consts';

const SphereShaderMaterial = {
  uniforms: {
    u_time: { type: 'f', value: 0 },
    u_texture: { type: 'f', value: null },
  },
  vertexShader: `
  varying vec2 vUv;

  uniform float u_time;

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

        p = position;
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

const packPartsShaderMaterial = {
  uniforms: {
    u_time: { type: 'f', value: 80.0 },
    u_texture: { type: 'f', value: null },
    u_degreeOfOpening: { type: 'f', value: 0.0 },
  },
  vertexShader: `
    varying vec2 vUv;

    uniform float u_time;
    uniform float u_degreeOfOpening;

    void main() {
      vUv = uv;

      float theta;
      float tx, ty, tz;
      vec3 p;
      
      if (position.x < 0.0) {
          // 左側だけを折り曲げる
          theta = position.x / u_time;
          tx = u_time * sin(theta);
          ty = position.y;
          tz = u_time * (1.0 - cos(theta));
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
  const [open, setOpen] = useState(false);

  const PackParts = (props: JSX.IntrinsicElements['mesh']) => {
    const ref = useRef<THREE.Mesh>(null!);
    const texture = useLoader(TextureLoader, PACK_1.parts);

    // 初期値を50.0に設定
    let value = 50.0;

    // ターゲット値を0.3に設定
    const targetValue = 0.3;

    // 減少する速度を設定
    const decreaseSpeed = 0.06;

    useFrame(({ clock }) => {
      if (!open) return;

      if (value >= 5.5) {
        value -= 3;
      } else {
        value -= decreaseSpeed;
      }
      // 50.0から0.3まで減少させる

      // 最小値を0.3に制限
      value = Math.max(value, targetValue);

      (packPartsShaderMaterial.uniforms as any).u_time.value = value;

      // 値をコンソールに表示（必要に応じて他の処理をここに追加）
      console.log(value);
    });

    (packPartsShaderMaterial.uniforms as any).u_texture.value = texture;

    return (
      <mesh {...props} ref={ref}>
        <planeGeometry args={[2.5, 0.22, 10, 12]} />
        <shaderMaterial
          attach="material"
          args={[packPartsShaderMaterial]}
          side={THREE.DoubleSide}
          // wireframe={true}
          transparent={true}
          blending={THREE.NormalBlending}
        />
      </mesh>
    );
  };

  const Box = (props: JSX.IntrinsicElements['mesh']) => {
    const ref = useRef<THREE.Mesh>(null!);
    // useFrame((state, delta) => (ref.current.rotation.y += 0.01));

    const colorMap = useLoader(TextureLoader, PACK_1.opendPack);

    useFrame(({ clock }) => {
      //ref.current.rotation.y += 0.005;
      // ref.current.rotation.x = 1.4;
      // ref.current.rotation.y = 12;
      // ref.current.rotation.x = 1.4;
      // ref.current.rotation.y = 12;
      (ref.current.material as any).uniforms.u_time.value =
        clock.oldTime * 10 - 1.301;
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
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{ position: 'absolute', left: '1000px' }}
      >
        Button
      </button>
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
        <PackParts position={[0, 1.99, 0]} />
      </Canvas>
    </>
  );
};
