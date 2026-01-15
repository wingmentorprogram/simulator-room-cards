import React, { useEffect, useRef } from 'react';

const SmokeBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    // Vertex shader: Simple full-screen quad
    const vsSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment shader: Volumetric Light & Occlusion Smoke
    const fsSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;

      // Pseudo-random function
      float random(in vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      // Noise function
      float noise(in vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      // FBM for cloud/smoke texture
      float fbm(in vec2 st) {
        float value = 0.0;
        float amplitude = 0.5;
        // Shift to create flow
        vec2 shift = vec2(100.0);
        // Rotate to reduce axial bias
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
        
        for (int i = 0; i < 5; i++) {
          value += amplitude * noise(st);
          st = rot * st * 2.0 + shift;
          amplitude *= 0.5;
        }
        return value;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        // Correct aspect ratio
        uv.x *= u_resolution.x / u_resolution.y;

        // Light source position (Top Center, slowly moving)
        vec2 lightPos = vec2(0.5 * (u_resolution.x / u_resolution.y), 0.9);
        lightPos.x += sin(u_time * 0.1) * 0.2; 

        // Current pixel position relative to light
        vec2 toLight = lightPos - uv;
        float distToLight = length(toLight);
        
        // --- 1. Generate Base Smoke (Density) ---
        // Animate the domain for smoke movement
        vec2 q = vec2(0.);
        q.x = fbm(uv + 0.1 * u_time);
        q.y = fbm(uv + vec2(1.0));
        
        vec2 r = vec2(0.);
        r.x = fbm(uv + 1.0 * q + vec2(1.7, 9.2) + 0.15 * u_time);
        r.y = fbm(uv + 1.0 * q + vec2(8.3, 2.8) + 0.126 * u_time);
        
        float smokeDensity = fbm(uv + r);
        
        // --- 2. Occlusion Raymarching (Volumetric Light) ---
        // March towards the light to accumulate density (shadows)
        float occlusion = 0.0;
        int steps = 16;
        float stepSize = distToLight / float(steps);
        vec2 rayDir = normalize(toLight);
        
        // Dither starting position to reduce banding
        float dither = random(uv + fract(u_time));
        vec2 currentPos = uv + rayDir * stepSize * dither;
        
        float accumDensity = 0.0;
        
        for(int i = 0; i < 16; i++) {
             // Sample density at this point along the ray
             // We use a simpler noise call here for performance during raymarch
             float d = fbm(currentPos * 0.5 + vec2(0.0, u_time * 0.2)); 
             accumDensity += d;
             currentPos += rayDir * stepSize;
        }
        
        // Calculate light intensity based on accumulated density
        // If accumulated density is high, less light gets through (shadow)
        float lightIntensity = 1.0 / (1.0 + accumDensity * 0.3);
        
        // Add a radial falloff for the light
        lightIntensity *= smoothstep(1.5, 0.0, distToLight);
        
        // --- 3. Composition ---
        
        // Base color (Deep dark grey/blue)
        vec3 col = vec3(0.05, 0.05, 0.08);
        
        // Add the smoke visual itself (White/Grey smoke)
        col = mix(col, vec3(0.6, 0.65, 0.7), smoothstep(0.0, 1.0, smokeDensity) * 0.4);
        
        // Add the volumetric light shafts (White light)
        vec3 lightColor = vec3(1.0, 0.98, 0.95);
        col += lightColor * lightIntensity * 0.5 * smoothstep(0.0, 1.0, smokeDensity * 1.5);
        
        // Soft vignette
        float vignette = 1.0 - length((gl_FragCoord.xy / u_resolution.xy) - 0.5) * 1.2;
        col *= clamp(vignette + 0.2, 0.0, 1.0);
        
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    // Shader compilation helpers
    const compileShader = (gl: WebGLRenderingContext, source: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(gl, vsSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fsSource, gl.FRAGMENT_SHADER);
    
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Buffer setup
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const timeLocation = gl.getUniformLocation(program, "u_time");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");

    let animationFrameId: number;
    const startTime = Date.now();

    const render = () => {
      const currentTime = (Date.now() - startTime) / 1000;
      gl.uniform1f(timeLocation, currentTime);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener('resize', resize);
    resize();
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Removed opacity-60 to make the raytracing effect more visible and dramatic
  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" />;
};

export default SmokeBackground;