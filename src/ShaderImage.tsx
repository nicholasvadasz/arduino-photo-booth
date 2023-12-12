import React from 'react';
import { Canvas } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { Plane } from '@react-three/drei';

const ShaderImage = ({ imagePath, version, variables }: { imagePath: string, version: string, variables: number[] }) => {

// [0.0, 2.0] values for brightness and saturation
const brightness = variables[0] / 500; 
const saturation = variables[1] / 500; 

const baseShader = {
  uniforms: {
    uTexture: { value: new TextureLoader().load(imagePath) },
    uBrightness: { value: brightness },
    uSaturation: { value: saturation },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
};

const adjustImage = `
  vec3 adjustBrightness(vec3 color, float brightness) {
    return color * brightness;
  }

  vec3 adjustSaturation(vec3 color, float saturation) {
    float gray = dot(color, vec3(0.299, 0.587, 0.114));
    return mix(vec3(gray), color, saturation);
  }
`;

const grayscale = {
  ...baseShader,
  fragmentShader: `
    precision mediump float;
    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float uBrightness;
    uniform float uSaturation;

    ${adjustImage}

    void main() {
      vec4 color = texture2D(uTexture, vUv);
      vec3 adjustedColor = adjustBrightness(color.rgb, uBrightness);
      adjustedColor = adjustSaturation(adjustedColor, uSaturation);
      float gray = dot(adjustedColor, vec3(0.299, 0.587, 0.114));
      gl_FragColor = vec4(vec3(gray), color.a);
    }
  `
};

const swirl = {
  ...baseShader,
  fragmentShader: `
    precision mediump float;
    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float uBrightness;
    uniform float uSaturation;

    ${adjustImage}

    void main() {
      vec2 center = vec2(0.5, 0.5);
      vec2 offset = vUv - center;
      float distance = length(offset);
      float angle = distance * 2.0;
      vec2 rotatedUv = vec2(
        cos(angle) * offset.x - sin(angle) * offset.y,
        sin(angle) * offset.x + cos(angle) * offset.y
      ) + center;
      vec4 color = texture2D(uTexture, rotatedUv);
      vec3 adjustedColor = adjustBrightness(color.rgb, uBrightness);
      adjustedColor = adjustSaturation(adjustedColor, uSaturation);
      gl_FragColor = vec4(adjustedColor, color.a);
    }
  `
};

const mirror = {
  ...baseShader,
  fragmentShader: `
    precision mediump float;
    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float uBrightness;
    uniform float uSaturation;

    ${adjustImage}

    void main() {
      float mirroredX = vUv.x > 0.5 ? 1.0 - vUv.x : vUv.x;
      vec2 mirroredUv = vec2(mirroredX, vUv.y);
      vec4 color = texture2D(uTexture, mirroredUv);
      vec3 adjustedColor = adjustBrightness(color.rgb, uBrightness);
      adjustedColor = adjustSaturation(adjustedColor, uSaturation);
      gl_FragColor = vec4(adjustedColor, color.a);
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