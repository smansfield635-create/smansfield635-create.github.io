import {
  H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY as HYDRO,
  resolveHEarthMapWideShorelineZ,
  sampleHEarthMapWideEnvironmentTerrainCandidate as sampleTerrain
} from '../../../../h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js';

const canvas = document.querySelector('[data-h-earth-map-wide-canvas]');
const statusNode = document.querySelector('[data-h-earth-status]');
const loader = document.querySelector('[data-audralia-loader]');
const loaderStage = document.querySelector('[data-audralia-loader-stage]');
const focusButton = document.querySelector('[data-fit-world]');

const PLANET_RADIUS = 6200;
const PLANET_CENTER = [0, -PLANET_RADIUS, 0];
const LOCAL_CENTER_Z = -128;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const norm = v => { const l = Math.hypot(...v) || 1; return v.map(x => x / l); };
const add = (a, b) => a.map((v, i) => v + b[i]);
const sub = (a, b) => a.map((v, i) => v - b[i]);
const scale = (a, s) => a.map(v => v * s);
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

const setStatus = (text, state = text) => {
  if (!statusNode) return;
  statusNode.textContent = text;
  statusNode.dataset.status = state;
};

function normalizedLocalElevation(raw) {
  const delta = raw - HYDRO.seaLevelY;
  if (delta <= 22) return raw;
  const t = clamp((delta - 22) / 54, 0, 1);
  const s = t * t * (3 - 2 * t);
  return HYDRO.seaLevelY + delta * (1 + (.60 - 1) * s);
}

function sampleCanonicalSurface(u, v) {
  const z = v + LOCAL_CENTER_Z;
  const terrain = sampleTerrain(u, z);
  if (terrain?.valid !== true) return Object.freeze({ valid: false, u, v, z, elevation: HYDRO.seaLevelY, inside: false });
  const shoreline = resolveHEarthMapWideShorelineZ(u);
  const inside = z <= shoreline;
  const elevation = inside ? normalizedLocalElevation(terrain.presentationElevation) : HYDRO.seaLevelY;
  return Object.freeze({ valid: true, u, v, z, elevation, inside, terrain });
}

function tangentDirection(u, v) {
  const radius = Math.hypot(u, v);
  if (radius < 1e-9) return [0, 1, 0];
  const angle = radius / PLANET_RADIUS;
  const sine = Math.sin(angle);
  const cosine = Math.cos(angle);
  return norm([sine * u / radius, cosine, sine * v / radius]);
}

function tangentPosition(u, v, elevation = 0) {
  const direction = tangentDirection(u, v);
  const radius = PLANET_RADIUS + elevation;
  return [PLANET_CENTER[0] + direction[0] * radius, PLANET_CENTER[1] + direction[1] * radius, PLANET_CENTER[2] + direction[2] * radius];
}

function cameraFrame(renderer) {
  const snapshot = renderer.getSnapshot();
  const pitch = clamp(snapshot.pitch, .46, 1.49);
  const distance = clamp(snapshot.distance, 95, 5600);
  const yaw = snapshot.yaw;
  const targetU = snapshot.targetU;
  const targetV = snapshot.targetV;
  const direction = tangentDirection(targetU, targetV);
  const groundSample = sampleCanonicalSurface(targetU, targetV);
  const ground = groundSample.inside ? groundSample.elevation : HYDRO.seaLevelY;
  const target = tangentPosition(targetU, targetV, ground);
  const pU1 = tangentPosition(targetU + 1, targetV);
  const pU0 = tangentPosition(targetU - 1, targetV);
  const pV1 = tangentPosition(targetU, targetV + 1);
  const pV0 = tangentPosition(targetU, targetV - 1);
  const eU = norm(sub(pU1, pU0));
  const eV = norm(sub(pV1, pV0));
  const horizontal = norm(add(scale(eU, Math.sin(yaw)), scale(eV, Math.cos(yaw))));
  const eye = add(add(target, scale(direction, distance * Math.sin(pitch) + 18)), scale(horizontal, distance * Math.cos(pitch)));
  const forward = norm(sub(target, eye));
  const right = norm(cross(forward, direction));
  const up = norm(cross(right, forward));
  return Object.freeze({ eye, target, forward, right, up, snapshot, groundSample });
}

function getSunDirection() {
  return window.__AUDRALIA_CELESTIAL_STATE__?.getSolarVector?.() || [.42, .78, .46];
}

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(`TABLET_ATMOSPHERE_SHADER_COMPILE_FAILED:${gl.getShaderInfoLog(shader)}`);
  return shader;
}

function makeProgram(gl, vs, fs) {
  const program = gl.createProgram();
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, vs));
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(`TABLET_ATMOSPHERE_PROGRAM_LINK_FAILED:${gl.getProgramInfoLog(program)}`);
  return program;
}

const ATMOSPHERE_VS = `#version 300 es
precision highp float;
out vec2 vNdc;
void main(){
  vec2 p=gl_VertexID==0?vec2(-1.0,-1.0):(gl_VertexID==1?vec2(3.0,-1.0):vec2(-1.0,3.0));
  vNdc=p;
  gl_Position=vec4(p,1.0,1.0);
}`;

const ATMOSPHERE_FS = `#version 300 es
precision highp float;
in vec2 vNdc;
out vec4 outColor;
uniform vec3 uEye;
uniform vec3 uForward;
uniform vec3 uRight;
uniform vec3 uUp;
uniform vec3 uSunDir;
uniform float uAspect;
uniform float uTanHalfFov;
const vec3 CENTER=vec3(0.0,-6200.0,0.0);
const float R=6200.0;
float sstep(float a,float b,float v){float t=clamp((v-a)/(b-a),0.0,1.0);return t*t*(3.0-2.0*t);}
float planetHit(vec3 ro,vec3 rd){
  vec3 oc=ro-CENTER;
  float b=dot(oc,rd);
  float c=dot(oc,oc)-R*R;
  float h=b*b-c;
  if(h<0.0)return -1.0;
  float root=sqrt(h);
  float t=-b-root;
  if(t>0.0)return t;
  t=-b+root;
  return t>0.0?t:-1.0;
}
void main(){
  vec3 rd=normalize(uForward+uRight*(vNdc.x*uAspect*uTanHalfFov)+uUp*(vNdc.y*uTanHalfFov));
  if(planetHit(uEye,rd)>0.0)discard;
  vec3 localUp=normalize(uEye-CENTER);
  vec3 sun=normalize(uSunDir);
  float altitude=max(0.0,length(uEye-CENTER)-R);
  float viewUp=clamp(dot(rd,localUp),-.12,1.0);
  float mu=clamp(viewUp,0.0,1.0);
  float horizon=pow(1.0-mu,2.15);
  float nearHorizon=exp(-pow(mu/.115,2.0));
  float sunHeight=dot(localUp,sun);
  float daylight=sstep(-.20,.16,sunHeight);
  float civilTwilight=(1.0-sstep(-.26,-.02,sunHeight))*sstep(-.32,.08,sunHeight);
  float twilight=exp(-abs(sunHeight)*7.0)*(1.0-daylight*.30);
  float sunAlignment=max(dot(rd,sun),0.0);
  float solarHalo=pow(sunAlignment,10.0);
  float solarCore=pow(sunAlignment,72.0);
  float antiSolar=pow(max(dot(rd,-sun),0.0),4.0);
  float airmass=1.0/(.20+.80*max(mu,.015));
  vec3 dayZenith=vec3(.045,.205,.48);
  vec3 dayMid=vec3(.20,.47,.72);
  vec3 dayHorizon=vec3(.62,.79,.93);
  vec3 nightZenith=vec3(.004,.010,.032);
  vec3 nightMid=vec3(.014,.030,.072);
  vec3 nightHorizon=vec3(.045,.070,.125);
  vec3 dayBase=mix(dayZenith,dayMid,sstep(.18,.72,horizon));
  dayBase=mix(dayBase,dayHorizon,sstep(.62,1.0,horizon));
  vec3 nightBase=mix(nightZenith,nightMid,sstep(.18,.74,horizon));
  nightBase=mix(nightBase,nightHorizon,sstep(.68,1.0,horizon));
  vec3 color=mix(nightBase,dayBase,daylight);
  vec3 horizonScatter=vec3(.44,.64,.82)*nearHorizon*(.08+.12*daylight)*clamp(airmass*.22,0.0,.72);
  vec3 warmTwilight=vec3(.98,.34,.095)*twilight*horizon*(.18+.34*nearHorizon);
  vec3 twilightGold=vec3(1.0,.60,.25)*civilTwilight*solarHalo*horizon*.12;
  vec3 sunHaze=vec3(1.0,.84,.58)*solarHalo*(.018+.085*horizon)*daylight;
  vec3 sunDiskGlow=vec3(1.0,.93,.76)*solarCore*(.016+.035*daylight);
  vec3 antiSolarCool=vec3(.018,.035,.065)*antiSolar*horizon*(.35+.30*(1.0-daylight));
  color+=horizonScatter+warmTwilight+twilightGold+sunHaze+sunDiskGlow-antiSolarCool;
  float surfacePresence=1.0-sstep(380.0,1800.0,altitude);
  float upperPresence=1.0-sstep(1450.0,5400.0,altitude);
  float spaceMix=sstep(1200.0,5200.0,altitude);
  color=mix(color,color*vec3(.42,.52,.70),spaceMix*.34);
  float upperLimb=upperPresence*horizon*(.09+.38*(1.0-sstep(1700.0,4300.0,altitude)));
  float alpha=clamp(surfacePresence*.988+(1.0-surfacePresence)*upperLimb,0.0,.988);
  if(alpha<.002)discard;
  outColor=vec4(max(color,vec3(0.0)),1.0);
}`;

function createTabletAtmospherePass(renderer) {
  const gl = canvas.getContext('webgl2');
  if (!gl) throw new Error('AUDRALIA_TABLET_PRIMARY_WEBGL2_CONTEXT_UNAVAILABLE');
  const program = makeProgram(gl, ATMOSPHERE_VS, ATMOSPHERE_FS);
  const uniforms = Object.freeze({
    eye: gl.getUniformLocation(program, 'uEye'),
    forward: gl.getUniformLocation(program, 'uForward'),
    right: gl.getUniformLocation(program, 'uRight'),
    up: gl.getUniformLocation(program, 'uUp'),
    sun: gl.getUniformLocation(program, 'uSunDir'),
    aspect: gl.getUniformLocation(program, 'uAspect'),
    tanHalfFov: gl.getUniformLocation(program, 'uTanHalfFov')
  });
  let renderCount = 0;
  function render() {
    if (gl.isContextLost()) return false;
    const camera = cameraFrame(renderer);
    const aspect = canvas.width / Math.max(1, canvas.height);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.depthMask(false);
    gl.disable(gl.BLEND);
    gl.useProgram(program);
    gl.uniform3fv(uniforms.eye, camera.eye);
    gl.uniform3fv(uniforms.forward, camera.forward);
    gl.uniform3fv(uniforms.right, camera.right);
    gl.uniform3fv(uniforms.up, camera.up);
    gl.uniform3fv(uniforms.sun, getSunDirection());
    gl.uniform1f(uniforms.aspect, aspect);
    gl.uniform1f(uniforms.tanHalfFov, Math.tan(55 * Math.PI / 360));
    gl.bindVertexArray(null);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.depthMask(true);
    gl.depthFunc(gl.LESS);
    renderCount++;
    return true;
  }
  return Object.freeze({
    schema: 'AUDRALIA_TABLET_ATMOSPHERE_PRIMARY_CONTEXT_PASS_v1',
    render,
    getEvidence: () => Object.freeze({
      sharedPrimaryWebGLContext: true,
      overlayCanvasCreated: false,
      framebufferAllocated: false,
      duplicatePlanetGeometryUploaded: false,
      duplicateGratitudeGeometryUploaded: false,
      analyticPlanetOcclusion: true,
      primaryDepthPreservedForTerrainOcclusion: true,
      renderCount,
      passOrder: 'PLANET_TERRAIN_THEN_ATMOSPHERE',
      cloudsDeferred: true,
      regionalWeatherDeferred: true,
      canonicalWeatherDeferred: true,
      celestialDeferred: true
    })
  });
}

function wire(renderer, renderExtras) {
  const pointers = new Map();
  let gesture = null;
  const safe = value => Math.max(-64, Math.min(64, Number(value) || 0));
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const midpoint = (a, b) => ({ x: (a.x + b.x) * .5, y: (a.y + b.y) * .5 });
  const ordered = () => [...pointers.entries()].sort((a, b) => Number(a[0]) - Number(b[0]));
  const redrawExtras = () => { try { renderExtras?.(); } catch (error) { console.warn('AUDRALIA_TABLET_ATMOSPHERE_PASS_RENDER_FAILED', error); } };
  const beginTwo = () => {
    const entries = ordered();
    if (entries.length !== 2) { gesture = null; return; }
    const a = { ...entries[0][1] }, b = { ...entries[1][1] };
    gesture = { ids: [entries[0][0], entries[1][0]], lastMid: midpoint(a, b), lastDistance: Math.max(1, distance(a, b)), mode: 'PENDING' };
  };
  canvas.addEventListener('pointerdown', event => {
    canvas.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size === 2) beginTwo();
  });
  canvas.addEventListener('pointermove', event => {
    const previous = pointers.get(event.pointerId);
    if (!previous) return;
    const next = { x: event.clientX, y: event.clientY };
    pointers.set(event.pointerId, next);
    if (pointers.size === 1) {
      renderer.orbit(safe(next.x - previous.x), safe(next.y - previous.y));
      redrawExtras();
      return;
    }
    if (pointers.size !== 2) return;
    if (!gesture) beginTwo();
    const a = pointers.get(gesture.ids[0]), b = pointers.get(gesture.ids[1]);
    if (!a || !b) return;
    const mid = midpoint(a, b), dist = Math.max(1, distance(a, b));
    const common = Math.hypot(mid.x - gesture.lastMid.x, mid.y - gesture.lastMid.y);
    const zoom = Math.abs(dist - gesture.lastDistance) * .5;
    if (gesture.mode === 'PENDING') {
      if (common >= 2.2 && common > zoom * 1.28) gesture.mode = 'TRAVEL';
      else if (zoom >= 2 && zoom > common * 1.2) gesture.mode = 'ZOOM';
      else return;
    }
    if (gesture.mode === 'TRAVEL') renderer.panScreen(safe((mid.x - gesture.lastMid.x) * 1.45), safe((mid.y - gesture.lastMid.y) * 1.45));
    else renderer.zoomByFactor(dist / Math.max(1, gesture.lastDistance));
    redrawExtras();
    gesture.lastMid = mid;
    gesture.lastDistance = dist;
  });
  const clear = event => {
    pointers.delete(event.pointerId);
    if (pointers.size === 2) beginTwo(); else gesture = null;
  };
  canvas.addEventListener('pointerup', clear);
  canvas.addEventListener('pointercancel', clear);
  canvas.addEventListener('lostpointercapture', clear);
  canvas.addEventListener('wheel', event => {
    event.preventDefault();
    renderer.zoom(event.deltaY);
    redrawExtras();
  }, { passive: false });
  canvas.addEventListener('dblclick', () => {
    renderer.focusGratitude();
    redrawExtras();
  });
  focusButton?.addEventListener('click', () => {
    renderer.focusGratitude();
    redrawExtras();
  });
  window.addEventListener('keydown', event => {
    const key = event.key.toLowerCase();
    if (['w', 'arrowup'].includes(key)) renderer.panScreen(0, -12);
    else if (['s', 'arrowdown'].includes(key)) renderer.panScreen(0, 12);
    else if (['a', 'arrowleft'].includes(key)) renderer.panScreen(12, 0);
    else if (['d', 'arrowright'].includes(key)) renderer.panScreen(-12, 0);
    else return;
    redrawExtras();
    event.preventDefault();
  });
  window.addEventListener('resize', () => {
    renderer.render();
    redrawExtras();
  });
}

export async function initializeAudraliaTabletSingleContext() {
  if (!(canvas instanceof HTMLCanvasElement)) throw new Error('AUDRALIA_SINGLE_CONTEXT_CANVAS_MISSING');
  setStatus('building…', 'AUDRALIA_SINGLE_CONTEXT_BUILDING');
  if (loaderStage) loaderStage.textContent = 'Building the Audralia world…';
  const rendererModule = await import('./renderer.precomputed.mjs');
  const renderer = rendererModule.createMapWideEnvironmentRenderer(canvas);
  renderer.render();

  let atmosphere = null;
  let atmosphereFailure = null;
  try {
    atmosphere = createTabletAtmospherePass(renderer);
    atmosphere.render();
  } catch (error) {
    atmosphereFailure = String(error?.message || error);
    console.warn('AUDRALIA_TABLET_ATMOSPHERE_PASS_DISABLED', error);
    renderer.render();
  }

  wire(renderer, atmosphere?.render);
  const activePasses = Object.freeze(atmosphere ? ['PLANET_TERRAIN', 'ATMOSPHERE'] : ['PLANET_TERRAIN']);
  const failures = Object.freeze(atmosphereFailure ? [`ATMOSPHERE_NONFATAL:${atmosphereFailure}`] : []);
  const runtime = Object.freeze({
    schema: 'AUDRALIA_TABLET_SINGLE_CONTEXT_RUNTIME_v2',
    renderer,
    atmosphere,
    renderingMode: 'EXACT_PRIMARY_WORLD_SINGLE_WEBGL_CONTEXT_ORDERED_PASSES',
    activePasses,
    deferredPasses: Object.freeze(['EXTERIOR_CLOUDS', 'REGIONAL_LOCAL_WEATHER', 'CELESTIAL']),
    fallbackActive: false,
    exactApprovedGeometry: true,
    optionalMultiContextEnrichmentDeferred: true,
    invariants: Object.freeze({
      pass: true,
      failures,
      singleWebGLContext: true,
      singleGeometryAuthority: true,
      atmosphereSharesPrimaryContext: Boolean(atmosphere),
      atmosphereFailureNonfatal: true
    }),
    getRuntime: () => runtime,
    getCameraFrame: () => cameraFrame(renderer),
    getAtmosphereEvidence: () => atmosphere?.getEvidence?.() || Object.freeze({ active: false, failure: atmosphereFailure })
  });
  window.__H_EARTH_AUDRALIA_OPEN_WORLD_OW01_PREVIEW__ = Object.freeze({
    operationId: runtime.schema,
    renderer,
    atmosphereEvidence: runtime.getAtmosphereEvidence(),
    fallbackActive: false
  });
  window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__ = runtime;
  window.__AUDRALIA_TABLET_SINGLE_CONTEXT__ = runtime;
  setStatus('Audralia ready', atmosphere ? 'AUDRALIA_SINGLE_CONTEXT_ATMOSPHERE_READY' : 'AUDRALIA_SINGLE_CONTEXT_READY');
  if (loaderStage) loaderStage.textContent = atmosphere ? 'Audralia atmosphere ready' : 'Audralia ready';
  if (loader) {
    loader.classList.add('is-ready');
    setTimeout(() => { loader.hidden = true; }, 420);
  }
  return runtime;
}

export default initializeAudraliaTabletSingleContext;
