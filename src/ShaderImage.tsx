import React from 'react';
import { Canvas } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { Plane } from '@react-three/drei';

const ShaderImage = ({ imagePath, version }: { imagePath: string, version: string }) => {

const grayscale = {
    uniforms: {
      uTexture: { value: new TextureLoader().load(imagePath) },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision mediump float;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      void main() {
        vec4 color = texture2D(uTexture, vUv);
        float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
        gl_FragColor = vec4(vec3(gray), color.a);
      }
    `
  };

  const swirl = {
    uniforms: {
      uTexture: { value: new TextureLoader().load(imagePath) },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision mediump float;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      void main() {
        vec2 center = vec2(0.5, 0.5);
        vec2 offset = vUv - center;
        float distance = length(offset);
        float angle = distance * 10.0;
        vec2 rotatedUv = vec2(
          cos(angle) * offset.x - sin(angle) * offset.y,
          sin(angle) * offset.x + cos(angle) * offset.y
        ) + center;
        vec4 color = texture2D(uTexture, rotatedUv);
        gl_FragColor = color;
      }
    `
  };

  const mirror = {
    uniforms: {
      uTexture: { value: new TextureLoader().load(imagePath) }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision mediump float;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      void main() {
        float mirroredX = vUv.x > 0.5 ? 1.0 - vUv.x : vUv.x;
        vec2 mirroredUv = vec2(mirroredX, vUv.y);
        vec4 color = texture2D(uTexture, mirroredUv);
        gl_FragColor = color;
      }
    `
  };

  var shader = grayscale;
  switch (version) {
    case "grayscale":
      shader = grayscale;
      break;
    case "swirl":
      shader = swirl;
      break;
    case "mirror":
      shader = mirror;
      break;
    default:
      shader = swirl;
  }

  return (
    <Canvas>
      <Plane args={[11, 7.5, 1, 1]} position={[0, 0, 0]}>
        <shaderMaterial attach="material" {...shader} />
      </Plane>
    </Canvas>
  );
};

export default ShaderImage;