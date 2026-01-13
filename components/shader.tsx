import React, { useEffect, useRef } from 'react';

// =====================================================================
// 1. Shaders
// =====================================================================

const VERTEX_SHADER = `#version 300 es
in vec2 a_position;
out vec2 v_uv;

void main() {
    v_uv = a_position * 0.5 + 0.5; // 0..1
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

// =====================================================================
// CONFIGURATION (Hardcoded Parameters)
// =====================================================================

// Appearance & Mask
const float C_SOFTNESS      = 0.2;
const float C_INTENSITY     = 0.5;   // Mask edge intensity
const float C_NOISE_STR     = 0.1;   // Mask noise strength
const float C_SCALE         = 1.0;   // Global scale

// Fluid Motion & Content
const float C_SPEED         = 0.1;   // Animation speed multiplier
const float C_DISTORTION    = 0.66;  // Fluid distortion amount
const float C_SWIRL         = 0.14;  // Swirl amount
const float C_GRAIN_MIX     = 0.0;   // Texture grain mix
const float C_GRAIN_OVERLAY = 0.05;   // Extra grain overlay strength

// Transform
const float C_ROTATION      = 0.0;   // In degrees
const vec2  C_OFFSET        = vec2(0.5, 0.5); // Center offset

// =====================================================================
// UNIFORMS & INPUTS
// =====================================================================

uniform float u_time;
uniform vec2 u_resolution;
uniform vec4 u_colors[10]; // Support up to 10 colors
uniform int u_colorsCount;

in vec2 v_uv;
out vec4 fragColor;

// =====================================================================
// UTILS
// =====================================================================

#define PI 3.14159265359

// Rotation
vec2 rotate(vec2 v, float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return vec2(c * v.x - s * v.y, s * v.x + c * v.y);
}

// Hashing
float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

// Value Noise (Standard)
float valueNoise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// Simplex-like Noise for Mask (Simplified)
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ; m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

// Random for FBM
float randomR(vec2 p) {
    return fract(sin(dot(p ,vec2(12.9898,78.233))) * 43758.5453);
}

float valueNoiseR(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = randomR(i);
    float b = randomR(i + vec2(1.0, 0.0));
    float c = randomR(i + vec2(0.0, 1.0));
    float d = randomR(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// FBM for Mask Texture
vec4 fbmR(vec2 n0, vec2 n1, vec2 n2, vec2 n3) {
    float amplitude = 0.2;
    vec4 total = vec4(0.);
    for (int i = 0; i < 3; i++) {
        n0 = rotate(n0, 0.3); n1 = rotate(n1, 0.3);
        n2 = rotate(n2, 0.3); n3 = rotate(n3, 0.3);
        total.x += valueNoiseR(n0) * amplitude;
        total.y += valueNoiseR(n1) * amplitude;
        total.z += valueNoiseR(n2) * amplitude;
        total.w += valueNoiseR(n3) * amplitude; // Fixed index
        n0 *= 1.99; n1 *= 1.99; n2 *= 1.99; n3 *= 1.99;
        amplitude *= 0.6;
    }
    return total;
}

// =====================================================================
// LOGIC
// =====================================================================

vec2 getPosition(int i, float t) {
  float a = float(i) * .37;
  float b = .6 + fract(float(i) / 3.) * .9;
  float c = .8 + fract(float(i + 1) / 4.);
  float x = sin(t * b + a);
  float y = cos(t * c + a * 1.5);
  return .5 + .5 * vec2(x, y);
}

float getCornersMask(vec2 uv, vec2 resolution) {
  const float firstFrameOffset = 7.;
  float t = .1 * (u_time * C_SPEED * 10.0 + firstFrameOffset); // Scale time for mask

  float r = C_ROTATION * PI / 180.;
  vec2 graphicOffset = vec2(-C_OFFSET.x, C_OFFSET.y);
  
  // Shape UV
  vec2 shape_uv = uv - vec2(0.5, 0.3);
  
  // Grain UV calculation
  vec2 grain_uv = shape_uv;
  grain_uv = rotate(grain_uv, -r); // Inverse rotate
  grain_uv *= C_SCALE;
  grain_uv -= graphicOffset;
  grain_uv *= resolution;
  grain_uv *= .7;

  // Base Shape
  shape_uv *= .6;
  vec2 outer = vec2(.5);
  
  // Bottom-Left
  vec2 bl = smoothstep(vec2(0.), outer, shape_uv + vec2(.1 + .1 * sin(3. * t), .2 - .1 * sin(5.25 * t)));
  vec2 tr = smoothstep(vec2(0.), outer, 1. - shape_uv);
  float shape = 1. - bl.x * bl.y * tr.x * tr.y;

  // Subtract logic
  vec2 shape_uv_neg = -shape_uv;
  bl = smoothstep(vec2(0.), outer, shape_uv_neg + vec2(.1 + .1 * sin(3. * t), .2 - .1 * cos(5.25 * t)));
  tr = smoothstep(vec2(0.), outer, 1. - shape_uv_neg);
  shape -= bl.x * bl.y * tr.x * tr.y;

  shape = 1. - smoothstep(0., 1., shape);

  // Noise/Texture
  float baseNoise = snoise(grain_uv * .5) * C_GRAIN_OVERLAY;
  vec4 fbmVals = fbmR(
    .002 * grain_uv + 10.,
    .003 * grain_uv,
    .001 * grain_uv,
    rotate(.4 * grain_uv, 2.)
  );
  
  float grainDist = baseNoise * snoise(grain_uv * .2) - fbmVals.x - fbmVals.y;
  float rawNoise = .75 * baseNoise - fbmVals.w - fbmVals.z;
  float noiseVal = clamp(rawNoise, 0., 1.);
  
  float floatColorsCount = float(u_colorsCount);
  shape += C_INTENSITY * 2. / floatColorsCount * (grainDist + .5);
  shape += C_NOISE_STR * 10. / floatColorsCount * noiseVal;

  float aa = fwidth(shape);
  shape = clamp(shape - .5 / floatColorsCount, 0., 1.);
  
  return smoothstep(0., C_SOFTNESS + 2. * aa, clamp(shape * floatColorsCount, 0., 1.));
}

vec4 getMeshContent(vec2 uv) {
  vec2 grainUV = uv * 1000.;
  float grain = valueNoise(grainUV + vec2(0.)); // simplified noise call
  float mixerGrain = .4 * C_GRAIN_MIX * (grain - .5);

  const float firstFrameOffset = 41.5;
  float t = .5 * (u_time * C_SPEED * 10.0 + firstFrameOffset);

  // Distortion
  float radius = smoothstep(0., 1., length(uv - .5));
  float center = 1. - radius;
  
  // Unroll loop manually for performance or keep loop
  for (float i = 1.; i <= 2.; i++) {
    uv.x += C_DISTORTION * center / i * sin(t + i * .4 * smoothstep(.0, 1., uv.y)) * cos(.2 * t + i * 2.4 * smoothstep(.0, 1., uv.y));
    uv.y += C_DISTORTION * center / i * cos(t + i * 2. * smoothstep(.0, 1., uv.x));
  }

  // Swirl
  vec2 uvRotated = uv - vec2(.5);
  float angle = 3. * C_SWIRL * radius;
  uvRotated = rotate(uvRotated, -angle);
  uvRotated += vec2(.5);

  // Color Mixing
  vec3 color = vec3(0.);
  float opacity = 0.;
  float totalWeight = 0.;

  for (int i = 0; i < 10; i++) {
    if (i >= u_colorsCount) break;

    vec2 pos = getPosition(i, t) + mixerGrain;
    // Parse vec4 color from uniform
    vec3 colorFraction = u_colors[i].rgb * u_colors[i].a;
    float opacityFraction = u_colors[i].a;

    float dist = length(uvRotated - pos);
    dist = pow(dist, 3.5);
    
    float weight = 1. / (dist + 1e-3);
    color += colorFraction * weight;
    opacity += opacityFraction * weight;
    totalWeight += weight;
  }

  color /= max(1e-4, totalWeight);
  opacity /= max(1e-4, totalWeight);

  return vec4(color, opacity);
}

void main() {
  float mask = getCornersMask(v_uv, u_resolution);
  
  // Performance optimization: discard if mask is basically invisible
  if (mask < 0.001) {
      discard;
  }

  vec4 content = getMeshContent(v_uv);
  fragColor = vec4(content.rgb * mask, mask);
}
`;

// =====================================================================
// 2. React Component
// =====================================================================

interface FluidMaskedGradientProps {
  colors?: string[]; // Only dynamic prop remaining
  style?: React.CSSProperties;
  className?: string;
  dpi?: number;
}

const hexToRgba = (hex: string): number[] => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b, 1.0];
};

export const FluidMaskedGradient: React.FC<FluidMaskedGradientProps> = ({
  colors = ['#ff0000', '#00ff00', '#0000ff'],
  style,
  className,
  dpi = 1.5,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', { alpha: true, antialias: true });
    if (!gl) return;

    // --- Shader Boilerplate ---
    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader Error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vert = createShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const frag = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vert || !frag) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    gl.useProgram(program);

    // --- Geometry ---
    const vertices = new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // --- Uniform Locations ---
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uColors = gl.getUniformLocation(program, 'u_colors');
    const uColorsCount = gl.getUniformLocation(program, 'u_colorsCount');
    let w = 0;
    let h = 0;

    // --- Resize ---
    const handleResize = () => {
      const pixelRatio = window.devicePixelRatio || 1;
      const targetDpi = Math.min(pixelRatio, dpi);
      const rect = canvas.getBoundingClientRect();
      w = Math.floor(rect.width * targetDpi);
      h = Math.floor(rect.height * targetDpi);

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    // --- Animation Loop ---
    const render = (time: number) => {
      // 1. Time (Seconds)
      gl.uniform1f(uTime, time * 0.001);
      gl.uniform2f(uResolution, w, h);

      // 2. Colors (Flattened)
      const flatColors: number[] = [];
      colors.slice(0, 10).forEach((c) => flatColors.push(...hexToRgba(c)));
      // gl.uniform4fv handles the array automatically if we pass the Float32Array
      gl.uniform4fv(uColors, new Float32Array(flatColors));
      gl.uniform1i(uColorsCount, colors.length);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestRef.current = requestAnimationFrame(render);
    };

    requestRef.current = requestAnimationFrame(render);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      window.removeEventListener('resize', handleResize);
      gl.deleteProgram(program);
    };
  }, [colors, dpi]); // Dependencies strictly limited

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%', display: 'block', ...style }}
    />
  );
};
