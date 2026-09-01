const WORLD_CANVAS = document.querySelector('[data-h-earth-map-wide-canvas]');
const PLANET_RADIUS = 6200;
const PLANET_CENTER = Object.freeze([0, -PLANET_RADIUS, 0]);
const PLANET_NORTH_AXIS = Object.freeze([0, 0.5, -0.8660254037844386]);
const ACCEPTED_INITIAL_SUN = Object.freeze([0.42, 0.78, 0.46]);
const PRIMARY_MOON_DIRECTION = Object.freeze([0.15, 0.66, -0.74]);
const SECONDARY_MOON_DIRECTION = Object.freeze([-0.58, 0.48, -0.66]);
const CANONICAL_DAY_SECONDS = 86400;
const CHECKPOINT = 'AUDRALIA_CELESTIAL_CONTEXT_v2';
const query = new URLSearchParams(window.location.search);
const requestedRate = Number(query.get('celestialRate'));
const requestedHour = Number(query.get('celestialHour'));

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const norm = vector => {
  const length = Math.hypot(...vector) || 1;
  return vector.map(value => value / length);
};
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0]
];
const add = (a, b) => a.map((value, index) => value + b[index]);
const sub = (a, b) => a.map((value, index) => value - b[index]);
const scale = (vector, amount) => vector.map(value => value * amount);
const wrapDay = seconds => ((seconds % CANONICAL_DAY_SECONDS) + CANONICAL_DAY_SECONDS) % CANONICAL_DAY_SECONDS;

function rotateAroundAxis(vector, axis, angle) {
  const unitAxis = norm(axis);
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  const axial = scale(unitAxis, dot(unitAxis, vector) * (1 - cosine));
  return norm(add(add(scale(vector, cosine), scale(cross(unitAxis, vector), sine)), axial));
}

const INITIAL_SUN = Object.freeze(norm(ACCEPTED_INITIAL_SUN));
const MOON_A = Object.freeze(norm(PRIMARY_MOON_DIRECTION));
const MOON_B = Object.freeze(norm(SECONDARY_MOON_DIRECTION));
const clock = {
  canonicalSeconds: Number.isFinite(requestedHour) ? wrapDay(requestedHour * 3600) : 0,
  presentationMultiplier: Number.isFinite(requestedRate) ? clamp(requestedRate, 0, 2880) : 1,
  paused: query.get('celestialPaused') === '1',
  anchorMs: performance.now()
};

function currentWorldSeconds(now = performance.now()) {
  if (clock.paused || clock.presentationMultiplier === 0) return wrapDay(clock.canonicalSeconds);
  return wrapDay(clock.canonicalSeconds + (now - clock.anchorMs) / 1000 * clock.presentationMultiplier);
}

function commitClock(now = performance.now()) {
  clock.canonicalSeconds = currentWorldSeconds(now);
  clock.anchorMs = now;
}

function setWorldSeconds(seconds) {
  clock.canonicalSeconds = wrapDay(Number(seconds) || 0);
  clock.anchorMs = performance.now();
  requestRender(true);
}

function setPaused(paused) {
  commitClock();
  clock.paused = Boolean(paused);
  requestRender(true);
}

function setPresentationMultiplier(multiplier) {
  commitClock();
  clock.presentationMultiplier = clamp(Number(multiplier) || 0, 0, 2880);
  requestRender(true);
}

function solarVectorAt(seconds = currentWorldSeconds()) {
  const theta = Math.PI * 2 * wrapDay(seconds) / CANONICAL_DAY_SECONDS;
  return rotateAroundAxis(INITIAL_SUN, PLANET_NORTH_AXIS, -theta);
}

function tangentDirection(u, v) {
  const radius = Math.hypot(u, v);
  if (radius < 1e-9) return [0, 1, 0];
  const angle = radius / PLANET_RADIUS;
  const sine = Math.sin(angle);
  const cosine = Math.cos(angle);
  return norm([sine * u / radius, cosine, sine * v / radius]);
}

function surfacePosition(direction, elevation = 0) {
  return [
    PLANET_CENTER[0] + direction[0] * (PLANET_RADIUS + elevation),
    PLANET_CENTER[1] + direction[1] * (PLANET_RADIUS + elevation),
    PLANET_CENTER[2] + direction[2] * (PLANET_RADIUS + elevation)
  ];
}

function tangentPosition(u, v) {
  return surfacePosition(tangentDirection(u, v), 0);
}

function cameraFrame(snapshot) {
  const pitch = clamp(snapshot.pitch, 0.46, 1.49);
  const distance = clamp(snapshot.distance, 95, 5600);
  const yaw = snapshot.yaw;
  const targetU = snapshot.targetU;
  const targetV = snapshot.targetV;
  const direction = tangentDirection(targetU, targetV);
  const target = surfacePosition(direction, 0);
  const pU1 = tangentPosition(targetU + 1, targetV);
  const pU0 = tangentPosition(targetU - 1, targetV);
  const pV1 = tangentPosition(targetU, targetV + 1);
  const pV0 = tangentPosition(targetU, targetV - 1);
  const eU = norm(sub(pU1, pU0));
  const eV = norm(sub(pV1, pV0));
  const horizontal = norm(add(scale(eU, Math.sin(yaw)), scale(eV, Math.cos(yaw))));
  const eye = add(add(target, scale(direction, distance * Math.sin(pitch) + 18)), scale(horizontal, distance * Math.cos(pitch)));
  const forward = norm(sub(target, eye));
  let right = cross(forward, direction);
  if (Math.hypot(...right) < 1e-5) right = eU;
  right = norm(right);
  const up = norm(cross(right, forward));
  return { eye, forward, right, up };
}

let renderer = null;
let overlay = null;
let gl = null;
let program = null;
let uniforms = null;
let running = true;
let forceRender = true;
let lastSignature = '';
let lastSolarRenderMs = 0;

function compileShader(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(`CELESTIAL_SHADER_COMPILE_FAILED:${gl.getShaderInfoLog(shader)}`);
  }
  return shader;
}

function buildProgram() {
  const vertex = `#version 300 es
precision highp float;
out vec2 vNdc;
void main(){
  vec2 p=gl_VertexID==0?vec2(-1.0,-1.0):(gl_VertexID==1?vec2(3.0,-1.0):vec2(-1.0,3.0));
  vNdc=p;
  gl_Position=vec4(p,0.0,1.0);
}`;

  const fragment = `#version 300 es
precision highp float;
in vec2 vNdc;
uniform vec3 uEye;
uniform vec3 uForward;
uniform vec3 uRight;
uniform vec3 uUp;
uniform vec3 uSunDir;
uniform vec3 uMoonA;
uniform vec3 uMoonB;
uniform float uAspect;
uniform float uTanHalfFov;
out vec4 outColor;
const float PI=3.141592653589793;
const vec3 CENTER=vec3(0.0,-6200.0,0.0);
const float RADIUS=6200.0;
const float ATMOSPHERE_RADIUS=6320.0;

float sphereHit(vec3 ro,vec3 rd,float radius){
  vec3 oc=ro-CENTER;
  float b=dot(oc,rd);
  float c=dot(oc,oc)-radius*radius;
  float h=b*b-c;
  if(h<0.0)return -1.0;
  float root=sqrt(h);
  float t=-b-root;
  if(t<=0.0)t=-b+root;
  return t>0.0?t:-1.0;
}

float smoothBand(float edge0,float edge1,float value){
  float t=clamp((value-edge0)/(edge1-edge0),0.0,1.0);
  return t*t*(3.0-2.0*t);
}

float hash21(vec2 p){
  p=fract(p*vec2(123.34,345.45));
  p+=dot(p,p+34.345);
  return fract(p.x*p.y);
}

vec3 starField(vec3 rd,float visibility){
  float lon=atan(rd.z,rd.x)/(2.0*PI)+0.5;
  float lat=asin(clamp(rd.y,-1.0,1.0))/PI+0.5;
  vec2 uv=vec2(lon,lat);
  vec3 color=vec3(0.0);

  vec2 gridA=uv*vec2(190.0,95.0);
  vec2 idA=floor(gridA);
  vec2 fA=fract(gridA)-0.5;
  vec2 jitterA=vec2(hash21(idA+vec2(1.7,9.2)),hash21(idA+vec2(7.3,2.1)))-0.5;
  float seedA=hash21(idA+11.7);
  float dA=length(fA-jitterA*0.72);
  float starA=(1.0-smoothstep(0.025,0.095,dA))*step(0.972,seedA);
  float brightA=mix(0.38,1.0,hash21(idA+31.2));
  vec3 tintA=mix(vec3(0.72,0.84,1.0),vec3(1.0,0.92,0.72),hash21(idA+18.4));
  color+=starA*brightA*tintA;

  vec2 gridB=uv*vec2(330.0,165.0);
  vec2 idB=floor(gridB);
  vec2 fB=fract(gridB)-0.5;
  vec2 jitterB=vec2(hash21(idB+vec2(3.4,5.8)),hash21(idB+vec2(8.1,1.2)))-0.5;
  float seedB=hash21(idB+41.9);
  float dB=length(fB-jitterB*0.78);
  float starB=(1.0-smoothstep(0.018,0.075,dB))*step(0.991,seedB);
  color+=starB*mix(0.45,1.25,hash21(idB+73.1))*vec3(0.92,0.96,1.0);

  return color*visibility;
}

vec3 moonBasisSeed(vec3 dir){
  return abs(dir.y)<0.86?vec3(0.0,1.0,0.0):vec3(1.0,0.0,0.0);
}

vec4 moonRender(vec3 rd,vec3 moonDir,float angularRadius,vec3 sunDir,vec3 baseColor){
  vec3 tangent=normalize(cross(moonBasisSeed(moonDir),moonDir));
  vec3 bitangent=normalize(cross(moonDir,tangent));
  float radiusSin=sin(angularRadius);
  float x=dot(rd,tangent)/radiusSin;
  float y=dot(rd,bitangent)/radiusSin;
  float r2=x*x+y*y;
  if(r2>1.14)return vec4(0.0);
  float disk=1.0-smoothstep(0.94,1.02,r2);
  float halo=(1.0-smoothstep(1.0,1.14,r2))*0.12;
  if(disk<=0.0 && halo<=0.0)return vec4(0.0);
  float z=sqrt(max(0.0,1.0-min(r2,1.0)));
  vec3 surfaceNormal=normalize(tangent*x+bitangent*y-moonDir*z);
  float lambert=max(dot(surfaceNormal,normalize(sunDir)),0.0);
  float earthshine=0.07+0.05*(1.0-lambert);
  float limbShade=mix(0.72,1.0,z);
  vec3 lit=baseColor*(earthshine+lambert*0.98)*limbShade;
  vec3 haloColor=baseColor*(0.28+0.35*lambert);
  return vec4(lit*disk+haloColor*halo,clamp(disk+halo,0.0,1.0));
}

vec4 sunRender(vec3 rd,vec3 sunDir){
  float alignment=clamp(dot(rd,normalize(sunDir)),0.0,1.0);
  float disc=smoothstep(cos(0.020),cos(0.010),alignment);
  float inner=smoothstep(cos(0.060),cos(0.020),alignment);
  float outer=smoothstep(cos(0.145),cos(0.040),alignment);
  vec3 core=vec3(1.0,0.965,0.78)*disc*1.35;
  vec3 glow=vec3(1.0,0.71,0.34)*(inner*0.30+outer*0.07);
  float alpha=clamp(disc+inner*0.44+outer*0.12,0.0,0.98);
  return vec4(core+glow,alpha);
}

void main(){
  vec3 rd=normalize(uForward+vNdc.x*uAspect*uTanHalfFov*uRight+vNdc.y*uTanHalfFov*uUp);
  vec3 sun=normalize(uSunDir);
  float planetT=sphereHit(uEye,rd,RADIUS);
  float shellT=sphereHit(uEye,rd,ATMOSPHERE_RADIUS);

  if(planetT>0.0){
    vec3 point=uEye+rd*planetT;
    vec3 n=normalize(point-CENTER);
    float solar=dot(n,sun);
    float night=smoothBand(0.075,-0.18,solar);
    float deepNight=smoothBand(-0.12,-0.52,solar);
    float twilight=exp(-abs(solar)*12.0);
    vec3 nightColor=mix(vec3(0.020,0.030,0.060),vec3(0.003,0.008,0.021),deepNight);
    vec3 twilightColor=vec3(0.19,0.065,0.035);
    vec3 color=mix(nightColor,twilightColor,twilight*0.28);
    float alpha=clamp(night*0.79+twilight*0.09,0.0,0.82);
    outColor=vec4(color,alpha);
    return;
  }

  if(shellT>0.0){
    vec3 point=uEye+rd*shellT;
    vec3 n=normalize(point-CENTER);
    float solar=dot(n,sun);
    float tangent=pow(1.0-abs(dot(n,-rd)),4.6);
    float twilight=exp(-abs(solar)*10.0);
    float night=smoothBand(0.04,-0.24,solar);
    vec3 warm=vec3(0.88,0.28,0.10);
    vec3 cool=vec3(0.12,0.32,0.64);
    vec3 color=mix(warm,cool,night*0.82);
    float alpha=tangent*(0.018+0.19*twilight+0.025*night);
    if(alpha<0.002)discard;
    outColor=vec4(color,alpha);
    return;
  }

  float altitude=max(0.0,length(uEye-CENTER)-RADIUS);
  vec3 localUp=normalize(uEye-CENTER);
  float observerDay=dot(localUp,sun);
  float atmosphericPresence=1.0-smoothstep(180.0,1350.0,altitude);
  float daylight=smoothstep(-0.16,0.24,observerDay);
  float solarProximity=smoothstep(0.90,0.9996,dot(rd,sun));
  float starVisibility=clamp(1.0-atmosphericPresence*daylight,0.0,1.0)*(1.0-solarProximity*0.96);

  vec3 sky=starField(rd,starVisibility);
  float skyAlpha=clamp(max(max(sky.r,sky.g),sky.b),0.0,0.90);

  vec4 moonA=moonRender(rd,normalize(uMoonA),0.030,sun,vec3(0.78,0.87,0.98));
  vec4 moonB=moonRender(rd,normalize(uMoonB),0.019,sun,vec3(0.96,0.79,0.61));
  vec4 visibleSun=sunRender(rd,sun);

  vec3 color=sky;
  float alpha=skyAlpha;
  color=mix(color,moonA.rgb,moonA.a);
  alpha=max(alpha,moonA.a);
  color=mix(color,moonB.rgb,moonB.a);
  alpha=max(alpha,moonB.a);
  color=mix(color,visibleSun.rgb,visibleSun.a);
  alpha=max(alpha,visibleSun.a);

  if(alpha<0.002)discard;
  outColor=vec4(color,alpha);
}`;

  program = gl.createProgram();
  gl.attachShader(program, compileShader(gl.VERTEX_SHADER, vertex));
  gl.attachShader(program, compileShader(gl.FRAGMENT_SHADER, fragment));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`CELESTIAL_PROGRAM_LINK_FAILED:${gl.getProgramInfoLog(program)}`);
  }
  const uniform = name => gl.getUniformLocation(program, name);
  uniforms = Object.freeze({
    eye: uniform('uEye'),
    forward: uniform('uForward'),
    right: uniform('uRight'),
    up: uniform('uUp'),
    sun: uniform('uSunDir'),
    moonA: uniform('uMoonA'),
    moonB: uniform('uMoonB'),
    aspect: uniform('uAspect'),
    tanHalfFov: uniform('uTanHalfFov')
  });
}

function createOverlay() {
  if (!(WORLD_CANVAS instanceof HTMLCanvasElement)) throw new Error('AUDRALIA_CELESTIAL_WORLD_CANVAS_MISSING');
  const parent = WORLD_CANVAS.parentElement;
  if (!(parent instanceof HTMLElement)) throw new Error('AUDRALIA_CELESTIAL_STAGE_MISSING');
  overlay = document.createElement('canvas');
  overlay.setAttribute('aria-hidden', 'true');
  overlay.dataset.audraliaCelestialContext = '2';
  Object.assign(overlay.style, {
    position: 'absolute',
    inset: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: '4',
    background: 'transparent'
  });
  parent.appendChild(overlay);
  gl = overlay.getContext('webgl2', {
    alpha: true,
    antialias: false,
    premultipliedAlpha: false,
    powerPreference: 'high-performance'
  });
  if (!gl) throw new Error('AUDRALIA_CELESTIAL_WEBGL2_UNAVAILABLE');
  buildProgram();
}

function resizeOverlay() {
  const rect = WORLD_CANVAS.getBoundingClientRect();
  const area = Math.max(1, rect.width * rect.height);
  const dprScale = Math.min(1, Math.max(0.62, (window.devicePixelRatio || 1) * 0.34));
  const capScale = Math.sqrt(210000 / area);
  const renderScale = Math.max(0.42, Math.min(dprScale, capScale));
  const width = Math.max(1, Math.round(rect.width * renderScale));
  const height = Math.max(1, Math.round(rect.height * renderScale));
  if (overlay.width !== width || overlay.height !== height) {
    overlay.width = width;
    overlay.height = height;
  }
  gl.viewport(0, 0, width, height);
  overlay.dataset.renderScale = renderScale.toFixed(3);
  overlay.dataset.renderPixels = String(width * height);
}

function snapshotSignature(snapshot) {
  return [snapshot.yaw, snapshot.pitch, snapshot.distance, snapshot.targetU, snapshot.targetV]
    .map(value => Number(value).toFixed(4))
    .join('|');
}

function requestRender(force = false) {
  forceRender = forceRender || force;
}

function render(now = performance.now()) {
  if (!renderer || !gl || !program) return;
  resizeOverlay();
  const snapshot = renderer.getSnapshot();
  const frame = cameraFrame(snapshot);
  const seconds = currentWorldSeconds(now);
  const sun = solarVectorAt(seconds);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.useProgram(program);
  gl.uniform3fv(uniforms.eye, frame.eye);
  gl.uniform3fv(uniforms.forward, frame.forward);
  gl.uniform3fv(uniforms.right, frame.right);
  gl.uniform3fv(uniforms.up, frame.up);
  gl.uniform3fv(uniforms.sun, sun);
  gl.uniform3fv(uniforms.moonA, MOON_A);
  gl.uniform3fv(uniforms.moonB, MOON_B);
  gl.uniform1f(uniforms.aspect, overlay.width / Math.max(1, overlay.height));
  gl.uniform1f(uniforms.tanHalfFov, Math.tan(55 * Math.PI / 360));
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  gl.disable(gl.BLEND);
  overlay.dataset.worldSeconds = seconds.toFixed(2);
  overlay.dataset.sunVector = sun.map(value => value.toFixed(6)).join(',');
  lastSolarRenderMs = now;
  forceRender = false;
}

function buildStateReceipt() {
  const seconds = currentWorldSeconds();
  return Object.freeze({
    schema: CHECKPOINT,
    authorityClass: 'CELESTIAL_STATE_WITH_PRODUCT_SKY_CONSUMERS',
    canonicalDaySeconds: CANONICAL_DAY_SECONDS,
    presentationMultiplier: clock.presentationMultiplier,
    paused: clock.paused,
    worldTimeSeconds: seconds,
    rotationAxis: Object.freeze([...PLANET_NORTH_AXIS]),
    initialSunDirection: Object.freeze([...INITIAL_SUN]),
    solarDirection: Object.freeze(solarVectorAt(seconds)),
    primaryMoonDirection: Object.freeze([...MOON_A]),
    secondaryMoonDirection: Object.freeze([...MOON_B]),
    worldCoordinatesMutated: false,
    gratitudeCoordinatesMutated: false,
    coastlineMutated: false,
    observerMotionIndependentOfWorldTime: true,
    publicTimeControls: false,
    starsConstructed: true,
    visibleSunConstructed: true,
    moonsConstructed: 2,
    moonIlluminationUsesSolarAuthority: true,
    seasonsConstructed: false,
    orbitalMechanicsConstructed: false
  });
}

function tick(now) {
  if (!running) return;
  if (!document.hidden && renderer) {
    const snapshot = renderer.getSnapshot();
    const signature = snapshotSignature(snapshot);
    const cameraChanged = signature !== lastSignature;
    const solarCadence = clock.paused || clock.presentationMultiplier === 0 ? 1200 : (clock.presentationMultiplier >= 60 ? 90 : 650);
    if (forceRender || cameraChanged || now - lastSolarRenderMs >= solarCadence) {
      lastSignature = signature;
      render(now);
    }
  }
  requestAnimationFrame(tick);
}

function installInternalApi() {
  const api = Object.freeze({
    schema: CHECKPOINT,
    getState: buildStateReceipt,
    getSolarVector: () => Object.freeze(solarVectorAt(currentWorldSeconds())),
    requestRender: () => requestRender(true),
    destroy: () => {
      running = false;
      overlay?.remove();
    }
  });
  const testApi = Object.freeze({
    setWorldSeconds,
    setPaused,
    setPresentationMultiplier
  });
  window.__AUDRALIA_CELESTIAL_STATE__ = api;
  window.__AUDRALIA_CELESTIAL_INTERNAL_TEST__ = testApi;
  window.__AUDRALIA_CELESTIAL_CONTEXT_RECEIPT__ = buildStateReceipt();
  window.dispatchEvent(new CustomEvent('AUDRALIA_CELESTIAL_CONTEXT_READY', { detail: buildStateReceipt() }));
}

function findRenderer() {
  const candidate = window.__H_EARTH_AUDRALIA_OPEN_WORLD_OW01_PREVIEW__?.renderer;
  if (candidate && typeof candidate.getSnapshot === 'function') return candidate;
  return null;
}

async function initialize() {
  try {
    if (!(WORLD_CANVAS instanceof HTMLCanvasElement)) throw new Error('AUDRALIA_CELESTIAL_WORLD_CANVAS_MISSING');
    const started = performance.now();
    while (!renderer && performance.now() - started < 30000) {
      renderer = findRenderer();
      if (!renderer) await new Promise(resolve => setTimeout(resolve, 80));
    }
    if (!renderer) throw new Error('AUDRALIA_CELESTIAL_RENDERER_AUTHORITY_TIMEOUT');
    if (window.__AUDRALIA_CANVAS_FALLBACK_ACTIVE__) {
      installInternalApi();
      return;
    }
    createOverlay();
    installInternalApi();
    render();
    window.addEventListener('resize', () => requestRender(true), { passive: true });
    requestAnimationFrame(tick);
  } catch (error) {
    console.error('AUDRALIA_CELESTIAL_CONTEXT_FAILED', error);
    window.__AUDRALIA_CELESTIAL_CONTEXT_ERROR__ = Object.freeze({
      schema: CHECKPOINT,
      message: error instanceof Error ? error.message : String(error)
    });
  }
}

initialize();