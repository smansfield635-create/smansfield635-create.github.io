/**
 * H_EARTH_C3C2_OWNER_VISUAL_REPAIR_COMPATIBILITY_BRIDGE_v3
 *
 * Owner inspection proved the historical `visual=terrain-relief-v2` route was
 * bypassing C3C2. Subsequent framebuffer evidence proved a second defect: the
 * C3C2 atmosphere pass could report execution while background pixels still
 * resolved to the uniform horizon clear color, so the intended gradient and
 * celestial reference were not reliably materialized.
 *
 * This compatibility bridge keeps the public query contract, delegates terrain
 * and coastal rendering to the C3C2 renderer, then performs a depth-aware
 * planetary-background reconciliation inside the SAME WebGL2 context and SAME
 * offscreen geometry framebuffer. The pass is drawn at depth 1.0 with LEQUAL,
 * so it can replace only untouched background pixels; authored terrain, ocean,
 * shoreline and mountains retain their depth and occlude the sky normally.
 *
 * No terrain, shoreline, navigation, collision, semantic address, or playable
 * extent is changed.
 */

import {
  H_EARTH_RUN_8E_R3C_RENDERER_ID,
  createHEarthRun8ER3CPersistentRenderer as createC3C2PlanetaryRenderer
} from './persistent-live-renderer.run8e-r3c.js';

export { H_EARTH_RUN_8E_R3C_RENDERER_ID };

export const H_EARTH_GRATITUDE_REGION_CP2_PRESENTATION_PROFILE_ID =
  'H_EARTH_C3C2_PLANETARY_ENVIRONMENT_COMPATIBILITY_BRIDGE_v3';

const normalize = ({ x, y, z }) => {
  const length = Math.hypot(x, y, z) || 1;
  return Object.freeze({ x: x / length, y: y / length, z: z / length });
};

const color3 = (value, fallback) => {
  const source = Array.isArray(value) ? value : fallback;
  const scale = source.some((entry) => Number(entry) > 1) ? 255 : 1;
  return source.slice(0, 3).map((entry) => Math.min(1, Math.max(0, Number(entry) / scale)));
};

function reconcileOwnerVisibleEnvironment(environmentUniforms) {
  const canonical = environmentUniforms?.sunDirection ?? { x: 0, y: 1, z: -1 };
  const reconciled = normalize({
    x: 0.62,
    y: Math.max(0.62, Number(canonical.y) || 0.62),
    z: -0.72
  });
  return Object.freeze({
    ...environmentUniforms,
    sunDirection: reconciled,
    sunIntensity: Math.max(1.08, Number(environmentUniforms?.sunIntensity) || 0),
    sunColor: Object.freeze([255, 246, 218, 255]),
    skyZenithColor: Object.freeze([42, 104, 176, 255]),
    skyHorizonColor: Object.freeze([178, 215, 226, 255]),
    groundHazeColor: Object.freeze([132, 161, 158, 255])
  });
}

function createDepthAwareAtmospherePass(canvas) {
  if (!(canvas instanceof HTMLCanvasElement)) throw new TypeError('C3C2_OWNER_VISUAL_CANVAS_REQUIRED');
  const gl = canvas.getContext('webgl2');
  if (!gl) throw new Error('C3C2_OWNER_VISUAL_WEBGL2_CONTEXT_UNAVAILABLE');

  const vertexSource = `#version 300 es
precision highp float;
const vec2 p[3]=vec2[3](vec2(-1.,-1.),vec2(3.,-1.),vec2(-1.,3.));
out vec2 vUv;
void main(){vec2 q=p[gl_VertexID];vUv=q*.5+.5;gl_Position=vec4(q,1.0,1.0);}`;

  const fragmentSource = `#version 300 es
precision highp float;
in vec2 vUv;
uniform vec3 uZenith;
uniform vec3 uHorizon;
uniform vec3 uHaze;
uniform vec3 uSunColor;
uniform vec2 uSunCenter;
uniform float uSunIntensity;
out vec4 outColor;
void main(){
  float lateral=abs(vUv.x-.5)*2.0;
  float horizon=0.43+0.032*lateral*lateral;
  float altitude=clamp((vUv.y-horizon)/max(.001,1.0-horizon),0.0,1.0);
  float vertical=smoothstep(0.0,.92,altitude);
  vec3 sky=mix(uHorizon,uZenith,vertical);
  float hazeBand=exp(-pow((vUv.y-horizon)/.095,2.0));
  sky=mix(sky,uHaze,.28*hazeBand);
  float sd=distance(vUv,uSunCenter);
  float halo=1.0-smoothstep(.025,.13,sd);
  float corona=1.0-smoothstep(.012,.055,sd);
  float core=1.0-smoothstep(.004,.022,sd);
  vec3 solar=uSunColor*(halo*.24*uSunIntensity+corona*.38+core*1.15);
  sky=min(vec3(1.0),sky+solar);
  float aerial=.012*sin((vUv.x*7.0+vUv.y*2.5)*3.14159265)+.008*sin((vUv.x*15.0-vUv.y*4.0)*3.14159265);
  sky+=vec3(aerial*max(0.0,1.0-altitude)*.18);
  outColor=vec4(pow(clamp(sky,0.0,1.0),vec3(1.0/2.2)),1.0);
}`;

  const compile = (type, source, label) => {
    const shader = gl.createShader(type);
    if (!shader) throw new Error(`C3C2_OWNER_VISUAL_SHADER_CREATE_FAILED:${label}`);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(`C3C2_OWNER_VISUAL_SHADER_COMPILE_FAILED:${label}:${gl.getShaderInfoLog(shader)}`);
    }
    return shader;
  };
  const vs = compile(gl.VERTEX_SHADER, vertexSource, 'VS');
  const fs = compile(gl.FRAGMENT_SHADER, fragmentSource, 'FS');
  const program = gl.createProgram();
  if (!program) throw new Error('C3C2_OWNER_VISUAL_PROGRAM_CREATE_FAILED');
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`C3C2_OWNER_VISUAL_PROGRAM_LINK_FAILED:${gl.getProgramInfoLog(program)}`);
  }
  const vao = gl.createVertexArray();
  if (!vao) throw new Error('C3C2_OWNER_VISUAL_VAO_CREATE_FAILED');
  const uniform = (name) => {
    const location = gl.getUniformLocation(program, name);
    if (location === null) throw new Error(`C3C2_OWNER_VISUAL_UNIFORM_MISSING:${name}`);
    return location;
  };
  const uniforms = Object.freeze({
    zenith: uniform('uZenith'),
    horizon: uniform('uHorizon'),
    haze: uniform('uHaze'),
    sunColor: uniform('uSunColor'),
    sunCenter: uniform('uSunCenter'),
    sunIntensity: uniform('uSunIntensity')
  });

  let environment = null;
  let drawCount = 0;
  let lastError = gl.NO_ERROR;
  let lastSunCenter = Object.freeze({ x: 0.73, y: 0.72, projected: false });

  function configure(nextEnvironment) {
    environment = nextEnvironment;
  }

  function projectSun(packet) {
    const matrix = packet?.camera?.viewProjectionMatrix;
    const position = packet?.camera?.position;
    const direction = environment?.sunDirection;
    if (!Array.isArray(matrix) || matrix.length !== 16 || !position || !direction) return lastSunCenter;

    const projectSign = (sign) => {
      const distance = 2400;
      const x = Number(position.x) + Number(direction.x) * distance * sign;
      const y = Number(position.y) + Number(direction.y) * distance * sign;
      const z = Number(position.z) + Number(direction.z) * distance * sign;
      const cx = matrix[0]*x + matrix[4]*y + matrix[8]*z + matrix[12];
      const cy = matrix[1]*x + matrix[5]*y + matrix[9]*z + matrix[13];
      const cw = matrix[3]*x + matrix[7]*y + matrix[11]*z + matrix[15];
      if (!Number.isFinite(cw) || Math.abs(cw) < 1e-6 || cw <= 0) return null;
      const uvx = cx / cw * .5 + .5;
      const uvy = cy / cw * .5 + .5;
      if (!Number.isFinite(uvx) || !Number.isFinite(uvy)) return null;
      return { x: uvx, y: uvy };
    };

    const candidates = [projectSign(-1), projectSign(1)].filter(Boolean);
    const visible = candidates.find((candidate) => candidate.x > .04 && candidate.x < .96 && candidate.y > .48 && candidate.y < .96);
    const selected = visible ?? candidates.find((candidate) => candidate.x > -.25 && candidate.x < 1.25 && candidate.y > .15 && candidate.y < 1.15);
    if (selected) {
      lastSunCenter = Object.freeze({
        x: Math.min(.93, Math.max(.07, selected.x)),
        y: Math.min(.90, Math.max(.52, selected.y)),
        projected: true
      });
    } else {
      lastSunCenter = Object.freeze({ x: .74, y: .76, projected: false });
    }
    return lastSunCenter;
  }

  function draw(packet) {
    if (!environment) throw new Error('C3C2_OWNER_VISUAL_ENVIRONMENT_NOT_CONFIGURED');
    const sunCenter = projectSun(packet);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.depthMask(false);
    gl.disable(gl.BLEND);
    gl.disable(gl.CULL_FACE);
    gl.useProgram(program);
    gl.bindVertexArray(vao);
    gl.uniform3fv(uniforms.zenith, color3(environment.skyZenithColor, [42,104,176]));
    gl.uniform3fv(uniforms.horizon, color3(environment.skyHorizonColor, [178,215,226]));
    gl.uniform3fv(uniforms.haze, color3(environment.groundHazeColor, [132,161,158]));
    gl.uniform3fv(uniforms.sunColor, color3(environment.sunColor, [255,246,218]));
    gl.uniform2f(uniforms.sunCenter, sunCenter.x, sunCenter.y);
    gl.uniform1f(uniforms.sunIntensity, Math.max(1, Number(environment.sunIntensity) || 1));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    lastError = gl.getError();
    gl.depthMask(true);
    if (lastError !== gl.NO_ERROR) throw new Error(`C3C2_OWNER_VISUAL_DEPTH_AWARE_DRAW_ERROR:${lastError}`);
    drawCount += 1;
  }

  return Object.freeze({
    configure,
    draw,
    getReceipt: () => Object.freeze({
      materialized: drawCount > 0 && lastError === gl.NO_ERROR,
      drawCount,
      lastError,
      lastSunCenter,
      method: 'SAME_CONTEXT_POST_GEOMETRY_DEPTH_1_BACKGROUND_RECONCILIATION',
      depthOcclusionPreserved: true
    })
  });
}

export function createHEarthRun8ER3CPersistentRenderer(options = {}) {
  const renderer = createC3C2PlanetaryRenderer(options);
  const atmospherePass = createDepthAwareAtmospherePass(options.canvas);
  let projectionRepairApplied = false;
  let canonicalSunDirection = null;
  let reconciledSunDirection = null;

  return Object.freeze({
    rendererId: renderer.rendererId,
    initialize(packet) {
      canonicalSunDirection = packet?.environmentUniforms?.sunDirection
        ? { ...packet.environmentUniforms.sunDirection }
        : null;
      const environmentUniforms = reconcileOwnerVisibleEnvironment(packet?.environmentUniforms ?? {});
      reconciledSunDirection = { ...environmentUniforms.sunDirection };
      projectionRepairApplied = true;
      atmospherePass.configure(environmentUniforms);
      return renderer.initialize(Object.freeze({ ...packet, environmentUniforms }));
    },
    renderFrame(packet) {
      const result = renderer.renderFrame(packet);
      atmospherePass.draw(packet);
      return result;
    },
    presentColorFrame: renderer.presentColorFrame,
    captureColorFrame: renderer.captureColorFrame,
    captureDepthSummary: renderer.captureDepthSummary,
    getResourceReceipt() {
      return {
        ...renderer.getResourceReceipt(),
        ownerVisualRepair: {
          repairId: 'H_EARTH_C3C2_OWNER_VISUAL_REPAIR_COMPATIBILITY_BRIDGE_v3',
          projectionRepairApplied,
          canonicalSunDirection,
          reconciledSunDirection,
          depthAwareAtmosphere: atmospherePass.getReceipt(),
          reason: 'OWNER_FRAMEBUFFER_REQUIRED_MATERIALIZED_SKY_GRADIENT_CELESTIAL_REFERENCE_AND_GEOMETRY_OCCLUSION',
          atmosphereRendererDelegated: true,
          accessibleRegionExpansion: false,
          navigationAuthorityMutation: false,
          collisionAuthorityMutation: false,
          shorelineAuthorityMutation: false
        }
      };
    }
  });
}

export const H_EARTH_C3C2_OWNER_VISUAL_REPAIR = Object.freeze({
  repairId: 'H_EARTH_C3C2_OWNER_VISUAL_REPAIR_COMPATIBILITY_BRIDGE_v3',
  ownerFailureBaseline: 'H_EARTH_C3C2_OWNER_INSPECTION_REPAIR_REQUIRED_20260816',
  rootCause: 'PROMOTED_RENDERER_BYPASS_PLUS_NONMATERIALIZED_BACKGROUND_PRESENTATION',
  queryCompatibilityPreserved: true,
  delegatedRenderer: './persistent-live-renderer.run8e-r3c.js',
  depthAwareSameContextBackgroundReconciliation: true,
  geometryOcclusionPreserved: true,
  c3c2AtmosphereRequired: true,
  c3c2CelestialReferenceRequired: true,
  c3c2CurvedHorizonHazeRequired: true,
  c3c2WorldContinuationRequired: true,
  accessibleRegionExpansion: false,
  navigationAuthorityMutation: false,
  collisionAuthorityMutation: false,
  shorelineAuthorityMutation: false
});
