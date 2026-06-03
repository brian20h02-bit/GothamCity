import * as THREE from 'three'

export const wetGlassVertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

export const wetGlassFragmentShader = /* glsl */ `
precision highp float;

uniform sampler2D uBackground;
uniform sampler2D uNormalMap;
uniform sampler2D uFlowMap;
uniform sampler2D uDistortionMap;
uniform vec2 uResolution;
uniform float uIntensity;

varying vec2 vUv;

vec2 refractGlass(vec2 uv) {
  vec3 n = texture2D(uNormalMap, uv).rgb * 2.0 - 1.0;
  vec2 flow = texture2D(uFlowMap, uv).rg * 2.0 - 1.0;
  float dist = texture2D(uDistortionMap, uv).r;

  vec2 offset = n.xy * (0.018 + dist * 0.042) * uIntensity;
  offset += flow * 0.007 * uIntensity;

  return clamp(uv + offset, 0.002, 0.998);
}

void main() {
  vec2 uv = vUv;
  vec2 ruv = refractGlass(uv);

  vec3 col = texture2D(uBackground, ruv).rgb;

  float wet = length(texture2D(uNormalMap, uv).rg - vec2(0.5)) * 2.4;
  wet = clamp(wet * uIntensity, 0.0, 1.0);

  float alpha = min(0.15, wet * 0.11 * uIntensity + length(ruv - uv) * 18.0);

  gl_FragColor = vec4(col, alpha);
}
`

export function createWetGlassMaterial(
  maps: {
    normal: THREE.Texture
    flow: THREE.Texture
    distortion: THREE.Texture
  },
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    glslVersion: THREE.GLSL1,
    vertexShader: wetGlassVertexShader,
    fragmentShader: wetGlassFragmentShader,
    uniforms: {
      uBackground: { value: null as THREE.Texture | null },
      uNormalMap: { value: maps.normal },
      uFlowMap: { value: maps.flow },
      uDistortionMap: { value: maps.distortion },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uIntensity: { value: 0.75 },
    },
    transparent: true,
    depthWrite: false,
    depthTest: false,
  })
}
