import {
  GRATITUDE_DEVELOPMENT_FRAME,
  GRATITUDE_GEOGRAPHY_ADAPTER_ID,
  resolveSiteAnchor,
  sampleGratitudeWorld
} from './gratitude-geography.adapter.mjs';
import {
  CARDINAL_CHARACTER_BY_SITE,
  CARDINAL_SITE_IDS,
  applyCardinalSceneEvent,
  synchronizeCardinalStoryState
} from './cardinal-scene-state.mjs';
import {
  CARDINAL_DISCOVERIES,
  CARDINAL_SITE_RECORDS,
  getCardinalSiteDiscoveries
} from './cardinal-scenes.data.mjs';
import { buildCardinalSiteGeometry } from './cardinal-scene-geometry.mjs';
import { applyGratitudeCoastMapAction, buildGratitudeCoastMap } from './coast-map.mjs';
import { deriveEncounterCard } from './encounter-card.mjs';
import {
  dispatchKnowledgeCardInput,
  deriveKnowledgeCardPresentation,
  resolveKnowledgeCardFooterActions
} from './knowledge-card.mjs';
import {
  CINEMATIC_RUNTIME_MS,
  CINEMATIC_INTRO_BEAT_IDS,
  applyCinematicIntroEvent,
  buildMirrorlandCinematicOpening,
  createCinematicIntroState,
  enterCanonicalCardinalWorld,
  resolvePendingSurveyPath,
  sampleSurveyPath
} from './cinematic-intro.mjs';
import {
  GRATITUDE_COAST_NIGHT,
  NIGHT_FRAGMENT_SHADER,
  nightUniforms
} from './night-renderer.mjs';

const $ = (selector) => document.querySelector(selector);
const html = document.documentElement;
const canvas = $('#scene');
const worldStage = $('#world-stage');
const worldHeading = $('#world-heading');
const signalLayer = $('#signal-layer');
const worldStatus = $('#world-status');
const mapToggle = $('#map-toggle');
const returnMap = $('#return-map');
const introLayer = $('#intro-layer');
const introEyebrow = $('#intro-eyebrow');
const introStep = $('#intro-step');
const introHeading = $('#intro-heading');
const introCopy = $('#intro-copy');
const introContinue = $('#intro-continue');
const introSkip = $('#intro-skip');
const cinematicProgressBar = $('#cinematic-progress-bar');
const replayPrimer = $('#replay-primer');
const encounterPanel = $('#encounter-panel');
const encounterKicker = $('#encounter-kicker');
const encounterTitle = $('#encounter-title');
const encounterCopy = $('#encounter-copy');
const encounterPresence = $('#encounter-presence');
const enterScene = $('#enter-scene');
const continueSurveying = $('#continue-surveying');
const arrivalPanel = $('#arrival-panel');
const arrivalCharacter = $('#arrival-character');
const arrivalTitle = $('#arrival-title');
const arrivalLaw = $('#arrival-law');
const arrivalPresence = $('#arrival-presence');
const beginInspection = $('#begin-inspection');
const inspectionPanel = $('#inspection-panel');
const inspectionTitle = $('#inspection-title');
const closeInspection = $('#close-inspection');
const discoveryList = $('#discovery-list');
const knowledgeLayer = $('#knowledge-layer');
const knowledgeCard = $('#knowledge-card');
const cardPlace = $('#card-place');
const cardCount = $('#card-count');
const cardFaceLabel = $('#card-face-label');
const cardTitle = $('#card-title');
const cardText = $('#card-text');
const cardInstruction = $('#card-instruction');
const cardFooter = $('#card-footer');
const mapPanel = $('#coast-map');
const mapClose = $('#map-close');
const mapGeography = $('#map-geography');
const mapMarkers = $('#map-markers');
const runtimeFallback = $('#runtime-fallback');

const reducedMotionMedia = matchMedia('(prefers-reduced-motion: reduce)');
const compactMedia = matchMedia('(max-width: 720px)');
let reducedMotion = reducedMotionMedia.matches;
let compact = compactMedia.matches;

const SITE_NAMES = Object.freeze({
  WATCHFIRE_OVERLOOK: 'Watchfire Overlook',
  WATERLINE_STATION: 'Waterline Station',
  SIGNAL_LANTERN_FIELD: 'Signal Lantern Field',
  RESTORATION_BOUNDARY: 'Restoration Boundary'
});

const CHARACTER_NAMES = Object.freeze({
  ALARIC_AXION: 'Alaric',
  TARIAN_MERROW: 'Tarian',
  ELARA_SYLENE: 'Elara',
  SOREN_SEVRIN: 'Soren'
});

const RELATION_DISCOVERY_BY_SITE = Object.freeze({
  WATCHFIRE_OVERLOOK: 'ALARIC_FOUR_WAY_SIGHTLINE',
  WATERLINE_STATION: 'TARIAN_CONFLUENCE_JUNCTION',
  SIGNAL_LANTERN_FIELD: 'ELARA_RELATION_ARRAY',
  RESTORATION_BOUNDARY: 'SOREN_FOUR_BEARING_JUNCTION'
});

const PUBLIC_STORY_STATE = Object.freeze({
  storyReceiptId: 'TASK20_CINEMATIC_PRIMER_PUBLIC_COMPOSITION_v1',
  chronologyState: 'TASK18_FROZEN_ARCHITECTURE_PUBLIC_COMPOSITION',
  presenceBySite: Object.freeze(Object.fromEntries(CARDINAL_SITE_IDS.map((siteId) => [siteId, Object.freeze({ state: 'SITE_ONLY' })]))),
  discoveryAvailabilityById: Object.freeze(Object.fromEntries(CARDINAL_DISCOVERIES.map((discovery) => [discovery.id, Object.freeze({
    state: 'AVAILABLE',
    predicateReceiptId: `TASK20_PRESERVED_DISCOVERY_AVAILABLE:${discovery.id}`,
    chronologyState: 'TASK18_FROZEN_ARCHITECTURE_PUBLIC_COMPOSITION'
  })])))
});

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const mix = (left, right, amount) => left + (right - left) * amount;
const smooth = (amount) => amount * amount * (3 - 2 * amount);
const vector = ({ x, y, z }) => [x, y, z];
const mixVector = (left, right, amount) => left.map((value, index) => mix(value, right[index], amount));
const subtract = (left, right) => left.map((value, index) => value - right[index]);
const scale = (value, amount) => value.map((item) => item * amount);
const dot = (left, right) => left[0] * right[0] + left[1] * right[1] + left[2] * right[2];
const cross = (left, right) => [
  left[1] * right[2] - left[2] * right[1],
  left[2] * right[0] - left[0] * right[2],
  left[0] * right[1] - left[1] * right[0]
];
const normalize = (value) => {
  const length = Math.hypot(...value) || 1;
  return scale(value, 1 / length);
};

const opening = buildMirrorlandCinematicOpening();
const worldEntryFrame = opening.frames.at(-1);
let introState = createCinematicIntroState();
let introStartedAt = null;
let introRenderedBeat = null;
let sceneState = null;
let camera = { eye: vector(opening.frames[0].position), look: vector(opening.frames[0].lookAt) };
let cameraMotion = null;
let lastSurveyStage = null;
let priorFocus = null;
let pointerStart = null;
let suppressCardClick = false;
let cachedMapState = null;
let cachedMapModel = null;
let nightProgram;
let siteProgram;
let terrainMesh;
let waterMesh;
let renderedSites;
let planetTerrainMesh;
let planetOceanMesh;

knowledgeLayer.inert = true;
mapPanel.inert = true;
encounterPanel.inert = true;

function showStaticFallback() {
  html.classList.remove('webgl-ready');
  html.classList.add('static-mode');
  runtimeFallback.hidden = false;
  introLayer.hidden = true;
  runtimeFallback.querySelector('a')?.focus();
}

const gl = canvas.getContext('webgl2', {
  antialias: !compact,
  alpha: false,
  powerPreference: 'high-performance'
});

if (!gl) {
  showStaticFallback();
} else {
  try {
    initializeWorld(gl);
    html.classList.add('webgl-ready');
    worldStage.dataset.cinematicBeat = 'READY';
    introContinue.focus();
    requestAnimationFrame(render);
  } catch (error) {
    console.error(error);
    showStaticFallback();
  }
}

function perspective(fov, aspect, near, far) {
  const factor = 1 / Math.tan(fov / 2);
  const depth = 1 / (near - far);
  return new Float32Array([
    factor / aspect, 0, 0, 0,
    0, factor, 0, 0,
    0, 0, (far + near) * depth, -1,
    0, 0, 2 * far * near * depth, 0
  ]);
}

function lookAt(eye, target, up = [0, 1, 0]) {
  const z = normalize(subtract(eye, target));
  const x = normalize(cross(up, z));
  const y = cross(z, x);
  return new Float32Array([
    x[0], y[0], z[0], 0,
    x[1], y[1], z[1], 0,
    x[2], y[2], z[2], 0,
    -dot(x, eye), -dot(y, eye), -dot(z, eye), 1
  ]);
}

function multiply(left, right) {
  const result = new Float32Array(16);
  for (let column = 0; column < 4; column += 1) {
    for (let row = 0; row < 4; row += 1) {
      result[column * 4 + row] = left[row] * right[column * 4]
        + left[4 + row] * right[column * 4 + 1]
        + left[8 + row] * right[column * 4 + 2]
        + left[12 + row] * right[column * 4 + 3];
    }
  }
  return result;
}

function project(point, matrix, width, height) {
  const [x, y, z] = point;
  const clipX = matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12];
  const clipY = matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13];
  const clipZ = matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14];
  const clipW = matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15];
  if (clipW <= 0) return null;
  const normalizedX = clipX / clipW;
  const normalizedY = clipY / clipW;
  const normalizedZ = clipZ / clipW;
  if (normalizedX < -1.15 || normalizedX > 1.15 || normalizedY < -1.15 || normalizedY > 1.15 || normalizedZ < -1.15 || normalizedZ > 1.15) return null;
  return [(normalizedX * 0.5 + 0.5) * width, (1 - (normalizedY * 0.5 + 0.5)) * height, clipW];
}

function compileProgram(vertexSource, fragmentSource) {
  const compile = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
    return shader;
  };
  const program = gl.createProgram();
  gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  return program;
}

function makeMesh(positions, normals, indices) {
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  const interleaved = new Float32Array((positions.length / 3) * 6);
  for (let index = 0; index < positions.length / 3; index += 1) {
    interleaved.set(positions.slice(index * 3, index * 3 + 3), index * 6);
    interleaved.set(normals.slice(index * 3, index * 3 + 3), index * 6 + 3);
  }
  gl.bufferData(gl.ARRAY_BUFFER, interleaved, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12);
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indices), gl.STATIC_DRAW);
  return { vao, count: indices.length };
}

function buildTerrainMesh() {
  const envelope = GRATITUDE_DEVELOPMENT_FRAME.envelope;
  const density = compact ? 72 : 108;
  const positions = [];
  const normals = [];
  const indices = [];
  const sampleHeight = (x, z) => sampleGratitudeWorld(
    clamp(x, envelope.xMinimum, envelope.xMaximum),
    clamp(z, envelope.zMinimum, envelope.zMaximum)
  ).source.elevation;
  for (let row = 0; row <= density; row += 1) {
    const z = mix(envelope.zMinimum, envelope.zMaximum, row / density);
    for (let column = 0; column <= density; column += 1) {
      const x = mix(envelope.xMinimum, envelope.xMaximum, column / density);
      const y = sampleHeight(x, z);
      const epsilon = 4;
      const dx = sampleHeight(x + epsilon, z) - sampleHeight(x - epsilon, z);
      const dz = sampleHeight(x, z + epsilon) - sampleHeight(x, z - epsilon);
      positions.push(x, y, z);
      normals.push(...normalize([-dx, epsilon * 2, -dz]));
    }
  }
  const stride = density + 1;
  for (let row = 0; row < density; row += 1) {
    for (let column = 0; column < density; column += 1) {
      const a = row * stride + column;
      const b = a + 1;
      const c = a + stride;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }
  return makeMesh(positions, normals, indices);
}

function buildWaterMesh() {
  const envelope = GRATITUDE_DEVELOPMENT_FRAME.envelope;
  const y = envelope.seaLevelY - 1.5;
  return makeMesh([
    envelope.xMinimum, y, envelope.zMinimum,
    envelope.xMaximum, y, envelope.zMinimum,
    envelope.xMinimum, y, envelope.zMaximum,
    envelope.xMaximum, y, envelope.zMaximum
  ], [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0], [0, 2, 1, 1, 2, 3]);
}

function buildAudraliaPlanetMeshes() {
  const authority = window.DGBAudraliaPlanetGeometry;
  if (!authority?.createGeometry || authority.worldSeed !== 'AUDRALIA_G1_WORLD_SEED' || authority.seamlessGeodesicTopology !== true) {
    throw new Error('AUDRALIA_GEODESIC_PLANET_AUTHORITY_UNAVAILABLE');
  }
  const packet = authority.createGeometry({ terrainLevel: compact ? 3 : 4, oceanLevel: compact ? 3 : 4, cloudLevel: 1, atmosphereLevel: 2, includeHydrology: false });
  const center = worldEntryFrame.lookAt;
  const radius = compact ? 205 : 255;
  const transform = (source, scaleFactor = 1) => {
    const positions = new Float32Array(source.positions.length);
    for (let index = 0; index < source.positions.length; index += 3) {
      positions[index] = center.x + source.positions[index] * radius * scaleFactor;
      positions[index + 1] = center.y + source.positions[index + 1] * radius * scaleFactor;
      positions[index + 2] = center.z + source.positions[index + 2] * radius * scaleFactor;
    }
    return positions;
  };
  const landIndices = [];
  for (let index = 0; index < packet.terrain.indices.length; index += 3) {
    const a = packet.terrain.indices[index];
    const b = packet.terrain.indices[index + 1];
    const c = packet.terrain.indices[index + 2];
    if (packet.terrain.landMasks[a] || packet.terrain.landMasks[b] || packet.terrain.landMasks[c]) landIndices.push(a, b, c);
  }
  return {
    terrain: makeMesh(transform(packet.terrain, 1.012), packet.terrain.normals, landIndices),
    ocean: makeMesh(transform(packet.ocean), packet.ocean.normals, packet.ocean.indices),
    receipt: { worldSeed: packet.worldSeed, topologyHash: packet.topology.hash, geometryHash: packet.geometryHash }
  };
}

function buildRenderedSite(siteId, lod) {
  const geometry = buildCardinalSiteGeometry(siteId, lod);
  const anchor = geometry.geography.canonicalWorldReference;
  return geometry.components.map((component) => {
    const source = component.mesh;
    const positions = [];
    for (let index = 0; index < source.positions.length; index += 3) {
      positions.push(
        source.positions[index] + anchor.x,
        source.positions[index + 1] + anchor.y,
        source.positions[index + 2] + anchor.z
      );
    }
    return {
      componentId: component.componentId,
      mesh: makeMesh(positions, source.normals, source.indices),
      material: source.lightingResponse
    };
  });
}

function initializeWorld() {
  const vertexShader = `#version 300 es
precision highp float;
layout(location=0) in vec3 aPos;
layout(location=1) in vec3 aNormal;
uniform mat4 uVP;
out vec3 vPos;
out vec3 vNormal;
out float vH;
void main(){vPos=aPos;vNormal=aNormal;vH=aPos.y;gl_Position=uVP*vec4(aPos,1.0);}`;
  const siteFragment = `#version 300 es
precision highp float;
in vec3 vNormal;
uniform vec3 uBaseColor;
uniform float uEmissive;
out vec4 outColor;
void main(){
  vec3 n=normalize(vNormal);
  vec3 moon=normalize(vec3(-.34,.84,.42));
  float light=.24+.76*max(dot(n,moon),0.0);
  vec3 color=uBaseColor*light+uBaseColor*uEmissive*.38;
  outColor=vec4(color,1.0);
}`;
  nightProgram = compileProgram(vertexShader, NIGHT_FRAGMENT_SHADER);
  siteProgram = compileProgram(vertexShader, siteFragment);
  terrainMesh = buildTerrainMesh();
  waterMesh = buildWaterMesh();
  const audralia = buildAudraliaPlanetMeshes();
  planetTerrainMesh = audralia.terrain;
  planetOceanMesh = audralia.ocean;
  worldStage.dataset.planetTopology = audralia.receipt.topologyHash;
  renderedSites = Object.fromEntries(CARDINAL_SITE_IDS.map((siteId) => [siteId, {
    REGIONAL: buildRenderedSite(siteId, 'REGIONAL'),
    LOCAL: buildRenderedSite(siteId, 'LOCAL')
  }]));
  gl.enable(gl.DEPTH_TEST);
  gl.disable(gl.CULL_FACE);
  buildSignalControls();
  bindInterfaceEvents();
}

function buildSignalControls() {
  for (const siteId of CARDINAL_SITE_IDS) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'world-signal';
    button.dataset.siteId = siteId;
    button.dataset.state = 'UNSEEN';
    button.hidden = true;
    button.setAttribute('aria-label', 'Select distant signal');
    const label = document.createElement('span');
    label.textContent = 'Distant signal';
    button.append(label);
    button.addEventListener('click', () => selectSite(siteId));
    signalLayer.append(button);
  }
}

function bindInterfaceEvents() {
  introContinue.addEventListener('click', playIntro);
  introSkip.addEventListener('click', skipIntro);
  replayPrimer.addEventListener('click', replayIntro);
  enterScene.addEventListener('click', beginSceneEntry);
  continueSurveying.addEventListener('click', closeEncounterAndContinue);
  mapToggle.addEventListener('click', openMap);
  mapClose.addEventListener('click', closeMapPanel);
  returnMap.addEventListener('click', () => returnToCoast({ openMapAfter: true }));
  beginInspection.addEventListener('click', openInspection);
  closeInspection.addEventListener('click', hideInspection);

  knowledgeCard.addEventListener('click', () => {
    if (suppressCardClick) { suppressCardClick = false; return; }
    handleCardInput({ kind: 'CLICK_FACE', reducedMotion });
  });
  knowledgeCard.addEventListener('keydown', (event) => {
    if (!['Enter', ' ', 'Spacebar'].includes(event.key)) return;
    event.preventDefault();
    handleCardInput({ kind: 'KEYBOARD', key: event.key, reducedMotion });
  });
  knowledgeCard.addEventListener('pointerdown', (event) => {
    pointerStart = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
  });
  knowledgeCard.addEventListener('pointerup', (event) => {
    if (!pointerStart || pointerStart.pointerId !== event.pointerId) return;
    const interpretation = handleCardInput({
      kind: 'POINTER_GESTURE',
      startX: pointerStart.x,
      startY: pointerStart.y,
      endX: event.clientX,
      endY: event.clientY,
      reducedMotion
    });
    suppressCardClick = interpretation?.accepted === true;
    pointerStart = null;
  });
  knowledgeCard.addEventListener('pointercancel', () => { pointerStart = null; });

  window.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (knowledgeLayer.classList.contains('is-open')) dismissCard();
    else if (mapPanel.classList.contains('is-open')) closeMapPanel();
    else if (encounterPanel.classList.contains('is-open')) closeEncounterAndContinue();
    else if (!inspectionPanel.hidden) hideInspection();
    else if (sceneState && sceneState.phase !== 'SURVEY_HUB') returnToCoast();
    else if (!introLayer.hidden) skipIntro();
  });
  reducedMotionMedia.addEventListener('change', (event) => {
    reducedMotion = event.matches;
    if (reducedMotion && CINEMATIC_INTRO_BEAT_IDS.includes(introState.phase)) skipIntro('REDUCED_MOTION');
  });
  compactMedia.addEventListener('change', (event) => { compact = event.matches; });
}

function syncIntroCopy() {
  const index = CINEMATIC_INTRO_BEAT_IDS.indexOf(introState.phase);
  if (index < 0) return;
  const frame = opening.frames[index];
  introEyebrow.textContent = frame.copy.eyebrow;
  introStep.textContent = `${index + 1} of ${opening.frames.length}`;
  introHeading.textContent = frame.copy.heading;
  introCopy.textContent = frame.copy.body;
  introStep.textContent = `${Math.round(frame.startMs / 1000)}–${Math.round(frame.endMs / 1000)} seconds`;
  worldStatus.textContent = frame.copy.heading;
  worldStage.dataset.cinematicBeat = frame.beatId;
  introLayer.dataset.cinematicState = 'playing';
  introRenderedBeat = frame.beatId;
}

function tweenCamera(toEye, toLook, duration, onComplete) {
  if (reducedMotion || duration <= 0) {
    camera = { eye: [...toEye], look: [...toLook] };
    onComplete?.();
    return;
  }
  cameraMotion = {
    kind: 'TWEEN',
    startedAt: performance.now(),
    duration,
    fromEye: [...camera.eye],
    fromLook: [...camera.look],
    toEye: [...toEye],
    toLook: [...toLook],
    onComplete
  };
}

function playIntro() {
  if (introState.phase !== 'READY') return;
  if (reducedMotion) {
    skipIntro('REDUCED_MOTION');
    return;
  }
  const result = applyCinematicIntroEvent(introState, { type: 'PLAY_INTRO' });
  if (!result.receipt.accepted) return;
  introState = result.state;
  introStartedAt = performance.now();
  cameraMotion = null;
  camera = { eye: vector(opening.frames[0].position), look: vector(opening.frames[0].lookAt) };
  syncIntroCopy();
}

function skipIntro(reason = 'VISITOR_SKIP') {
  if (['COMPLETE', 'SKIPPED'].includes(introState.phase)) return;
  const result = applyCinematicIntroEvent(introState, { type: 'SKIP_INTRO' });
  if (!result.receipt.accepted) return;
  introState = result.state;
  introLayer.dataset.resolution = reason;
  cameraMotion = null;
  camera = { eye: vector(worldEntryFrame.position), look: vector(worldEntryFrame.lookAt) };
  enterWorld();
}

function replayIntro() {
  const reset = applyCinematicIntroEvent(introState, { type: 'REPLAY_INTRO' });
  introState = reset.state;
  introStartedAt = null;
  introRenderedBeat = null;
  cameraMotion = null;
  introLayer.hidden = false;
  introLayer.dataset.cinematicState = 'ready';
  introEyebrow.textContent = 'Mirrorland · cinematic primer';
  introStep.textContent = '28 seconds · silent';
  introHeading.textContent = 'Cross into Audralia.';
  introCopy.textContent = 'One autonomous film introduces the world, Gratitude Harbor, Mirror Manor, the Clock, and four character environments. No intermediate clicks are required.';
  cinematicProgressBar.style.width = '0%';
  replayPrimer.hidden = true;
  if (sceneState?.phase && sceneState.phase !== 'SURVEY_HUB') applySceneEvent({ type: 'RETURN_TO_HUB' });
  hideLocalPanels();
  closeEncounterPanel();
  closeMapPanel({ restoreFocus: false });
  introContinue.focus();
}

function updateIntroTimeline(now) {
  if (introStartedAt === null || !CINEMATIC_INTRO_BEAT_IDS.includes(introState.phase)) return;
  const elapsedMs = Math.min(CINEMATIC_RUNTIME_MS, now - introStartedAt);
  const locatedIndex = opening.frames.findIndex((frame) => elapsedMs < frame.endMs);
  const frameIndex = locatedIndex < 0 ? opening.frames.length - 1 : locatedIndex;
  const frame = opening.frames[frameIndex];
  if (introRenderedBeat !== frame.beatId) {
    introState = applyCinematicIntroEvent(introState, { type: 'TICK_INTRO', elapsedMs: frame.startMs }).state;
    syncIntroCopy();
  }
  const next = opening.frames[Math.min(opening.frames.length - 1, frameIndex + 1)];
  const progress = smooth(clamp((elapsedMs - frame.startMs) / frame.durationMs, 0, 1));
  camera.eye = mixVector(vector(frame.position), vector(next.position), progress);
  camera.look = mixVector(vector(frame.lookAt), vector(next.lookAt), progress);
  cinematicProgressBar.style.width = `${(elapsedMs / CINEMATIC_RUNTIME_MS) * 100}%`;
  if (elapsedMs >= CINEMATIC_RUNTIME_MS) {
    introState = applyCinematicIntroEvent(introState, { type: 'TICK_INTRO', elapsedMs: CINEMATIC_RUNTIME_MS }).state;
    introStartedAt = null;
    camera = { eye: vector(worldEntryFrame.position), look: vector(worldEntryFrame.lookAt) };
    enterWorld();
  }
}

function enterWorld() {
  if (!sceneState) sceneState = enterCanonicalCardinalWorld(introState, { storyState: PUBLIC_STORY_STATE });
  introLayer.hidden = true;
  introLayer.dataset.cinematicState = 'complete';
  worldHeading.hidden = false;
  worldStatus.textContent = 'Choose one of four distant signals.';
  replayPrimer.hidden = false;
  syncInterface();
  mapToggle.focus();
}

function applySceneEvent(event) {
  const result = applyCardinalSceneEvent(sceneState, event);
  if (result.receipt.accepted) sceneState = result.state;
  return result.receipt;
}

function currentMapModel() {
  if (cachedMapState !== sceneState) {
    cachedMapState = sceneState;
    cachedMapModel = buildGratitudeCoastMap(sceneState);
  }
  return cachedMapModel;
}

function selectSite(siteId) {
  if (!sceneState || cameraMotion || sceneState.phase !== 'SURVEY_HUB') return;
  const selected = applyGratitudeCoastMapAction(sceneState, { type: 'SELECT_SITE', siteId });
  if (!selected.receipt.accepted) return;
  sceneState = selected.state;
  closeMapPanel({ restoreFocus: false });
  renderEncounter();
  syncInterface();
}

function renderEncounter() {
  const card = deriveEncounterCard(sceneState);
  encounterKicker.textContent = card.kicker;
  encounterTitle.textContent = card.placeName;
  encounterCopy.textContent = card.introduction;
  encounterPresence.textContent = card.presenceStatement;
  priorFocus = document.activeElement;
  encounterPanel.classList.add('is-open');
  encounterPanel.setAttribute('aria-hidden', 'false');
  encounterPanel.inert = false;
  enterScene.focus();
}

function closeEncounterPanel({ restoreFocus = false } = {}) {
  encounterPanel.classList.remove('is-open');
  encounterPanel.setAttribute('aria-hidden', 'true');
  encounterPanel.inert = true;
  if (restoreFocus) priorFocus?.focus?.();
}

function closeEncounterAndContinue() {
  if (sceneState?.phase !== 'ENCOUNTER_PREVIEW') return;
  const receipt = applySceneEvent({ type: 'CONTINUE_SURVEYING' });
  if (!receipt.accepted) return;
  closeEncounterPanel();
  worldStatus.textContent = `Survey hub · ${SITE_NAMES[sceneState.selectedSiteId]} remains selected`;
  syncInterface();
  mapToggle.focus();
}

function beginSceneEntry() {
  if (sceneState?.phase !== 'ENCOUNTER_PREVIEW' || cameraMotion) return;
  if (!applySceneEvent({ type: 'ENTER_CHARACTER_SCENE' }).accepted) return;
  const path = resolvePendingSurveyPath(sceneState);
  closeEncounterPanel();
  hideLocalPanels();
  worldStage.classList.add('is-local');
  returnMap.hidden = true;
  lastSurveyStage = null;
  const first = sampleSurveyPath(path, 0);
  if (reducedMotion) {
    const arrival = sampleSurveyPath(path, 1, { reducedMotion: true });
    camera = { eye: vector(arrival.position), look: vector(arrival.lookAt) };
    worldStatus.textContent = `Character scene · ${SITE_NAMES[sceneState.selectedSiteId]}`;
    completeArrival();
    return;
  }
  cameraMotion = {
    kind: 'SCENE_ENTRY',
    startedAt: performance.now(),
    preludeMs: 620,
    duration: path.totalDurationMs,
    fromEye: [...camera.eye],
    fromLook: [...camera.look],
    firstEye: vector(first.position),
    firstLook: vector(first.lookAt),
    path
  };
  worldStatus.textContent = `Entering ${SITE_NAMES[sceneState.selectedSiteId]}.`;
  syncInterface();
}

function completeArrival() {
  const receipt = applySceneEvent({ type: 'COMPLETE_SCENE_ENTRY' });
  if (!receipt.accepted) return;
  renderArrival();
  syncInterface();
  beginInspection.focus();
}

function renderArrival() {
  const siteId = sceneState.activeSiteId;
  if (!siteId) { arrivalPanel.hidden = true; return; }
  const site = CARDINAL_SITE_RECORDS[siteId];
  const characterName = CHARACTER_NAMES[site.characterId];
  const presence = sceneState.story.presenceBySite[siteId];
  arrivalCharacter.textContent = `Permanent place · ${characterName}`;
  arrivalTitle.textContent = SITE_NAMES[siteId];
  arrivalLaw.textContent = `${site.arrivalState.replaceAll('_', ' ').toLowerCase()}. ${site.environmentalLaw.map((law) => law.replaceAll('_', ' ').toLowerCase()).join(' · ')}.`;
  arrivalPresence.textContent = presence.state === 'SITE_ONLY'
    ? `The place is present. ${characterName} is not inferred to be physically here.`
    : presence.state === 'CHARACTER_TRACE'
      ? `${characterName}'s source-authorized trace is present; the character is not shown.`
      : `${characterName}'s presence is source-authorized for this story state.`;
  beginInspection.textContent = sceneState.phase === 'LOCAL_INSPECTION' ? 'Resume inspection' : 'Inspect this place';
  arrivalPanel.hidden = false;
  returnMap.hidden = false;
}

function openInspection() {
  if (!sceneState?.activeSiteId || cameraMotion) return;
  if (sceneState.phase === 'CHARACTER_SCENE') {
    const receipt = applySceneEvent({ type: 'BEGIN_LOCAL_INSPECTION' });
    if (!receipt.accepted) return;
  }
  if (sceneState.phase !== 'LOCAL_INSPECTION') return;
  arrivalPanel.hidden = true;
  inspectionPanel.hidden = false;
  renderInspection();
  discoveryList.querySelector('button')?.focus();
}

function hideInspection() {
  if (inspectionPanel.hidden) return;
  inspectionPanel.hidden = true;
  renderArrival();
  beginInspection.focus();
}

function renderInspection() {
  const siteId = sceneState.activeSiteId;
  inspectionTitle.textContent = SITE_NAMES[siteId];
  discoveryList.replaceChildren();
  const discoveries = getCardinalSiteDiscoveries(siteId);
  for (const discovery of discoveries) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'discovery-button';
    if (sceneState.discoveredIds.includes(discovery.id)) button.classList.add('is-seen');
    const ordinal = document.createElement('span');
    ordinal.className = 'discovery-ordinal';
    ordinal.textContent = String(discovery.ordinal).padStart(2, '0');
    const title = document.createElement('b');
    title.textContent = discovery.anchorId.replaceAll('_', ' ').toLowerCase();
    const state = document.createElement('small');
    state.textContent = sceneState.discoveredIds.includes(discovery.id) ? 'Seen' : discovery.domain.replaceAll('_', ' ').toLowerCase();
    button.append(ordinal, title, state);
    button.addEventListener('click', () => openDiscovery(discovery.id));
    discoveryList.append(button);
  }

  const relations = Object.values(sceneState.story.relations).filter((relation) => relation.fromSiteId === siteId);
  if (relations.length) {
    const heading = document.createElement('p');
    heading.className = 'kicker';
    heading.textContent = 'Revealed routes';
    discoveryList.append(heading);
    for (const relation of relations) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'discovery-button relation-button';
      button.textContent = `Follow the route to ${SITE_NAMES[relation.toSiteId]}`;
      button.addEventListener('click', () => followRelation(relation.toSiteId));
      discoveryList.append(button);
    }
  }
}

function revealRelationsFromDiscoveredCards() {
  const revealedRelations = [];
  for (const [fromSiteId, discoveryId] of Object.entries(RELATION_DISCOVERY_BY_SITE)) {
    if (!sceneState.discoveredIds.includes(discoveryId)) continue;
    for (const toSiteId of CARDINAL_SITE_IDS) {
      if (toSiteId === fromSiteId) continue;
      revealedRelations.push({
        fromSiteId,
        toSiteId,
        sourceEventId: `DISCOVERY_REVEALED_RELATION:${discoveryId}`,
        chronologyState: PUBLIC_STORY_STATE.chronologyState
      });
    }
  }
  sceneState = synchronizeCardinalStoryState(sceneState, {
    ...PUBLIC_STORY_STATE,
    revealedRelations
  });
}

function openDiscovery(discoveryId) {
  const receipt = applySceneEvent({ type: 'OPEN_DISCOVERY_CARD', discoveryId });
  if (!receipt.accepted) return;
  revealRelationsFromDiscoveredCards();
  priorFocus = document.activeElement;
  inspectionPanel.hidden = true;
  knowledgeLayer.classList.add('is-open');
  knowledgeLayer.setAttribute('aria-hidden', 'false');
  knowledgeLayer.inert = false;
  renderCard();
  knowledgeCard.focus();
}

function renderCard() {
  const presentation = deriveKnowledgeCardPresentation(sceneState, { reducedMotion });
  const discoveries = getCardinalSiteDiscoveries(presentation.siteId);
  const discovery = CARDINAL_DISCOVERIES.find((entry) => entry.id === presentation.discoveryId);
  cardPlace.textContent = SITE_NAMES[presentation.siteId];
  cardCount.textContent = `${discovery.ordinal} of ${discoveries.length}`;
  cardFaceLabel.textContent = presentation.visibleFace.label;
  cardTitle.textContent = discovery.anchorId.replaceAll('_', ' ').toLowerCase();
  cardText.textContent = presentation.visibleFace.text;
  cardInstruction.textContent = `${presentation.faceInstruction}. Tap, click, press Enter, or swipe sideways.`;
  knowledgeCard.setAttribute('aria-label', presentation.accessibleName);
  renderCardFooter();
}

function renderCardFooter() {
  const footer = resolveKnowledgeCardFooterActions(sceneState);
  cardFooter.replaceChildren();
  for (const item of footer.actions) {
    if (item.destination?.href) {
      const link = document.createElement('a');
      link.href = item.destination.href;
      link.className = `card-footer-tab ${item.variant.styleToken}`;
      link.textContent = item.label;
      link.setAttribute('aria-label', item.description);
      cardFooter.append(link);
      continue;
    }
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `card-footer-tab ${item.variant.styleToken}`;
    button.textContent = item.label;
    button.setAttribute('aria-label', item.description);
    if (item.eventType === 'DISMISS_DISCOVERY_CARD') button.addEventListener('click', dismissCard);
    if (item.eventType === 'RETURN_TO_MAP' || item.eventType === 'RETURN_TO_HUB') button.addEventListener('click', () => returnToCoast({ openMapAfter: true }));
    cardFooter.append(button);
  }

  const compass = document.createElement('a');
  compass.href = '/';
  compass.className = 'card-footer-tab card-footer-tab--cross-estate';
  compass.setAttribute('aria-label', 'Return to Compass; leaves Mirrorland');
  compass.textContent = '↗ Compass · Leaves Mirrorland';
  cardFooter.append(compass);

  if (!footer.actions.some((item) => item.id === 'TALK_TO_CHARACTER')) {
    const held = document.createElement('p');
    held.className = 'conversation-held';
    held.textContent = footer.presenceState === 'CHARACTER_PRESENT'
      ? 'Conversation doorway held until a verified destination exists.'
      : 'Conversation doorway closed while the character is not present.';
    cardFooter.append(held);
  }
}

function handleCardInput(input) {
  if (!knowledgeLayer.classList.contains('is-open')) return null;
  const result = dispatchKnowledgeCardInput(sceneState, input);
  if (!result.interpretation.accepted) return result.interpretation;
  sceneState = result.state;
  if (result.interpretation.sceneEvent.type === 'DISMISS_DISCOVERY_CARD') {
    closeCardLayer();
    return result.interpretation;
  }
  if (!reducedMotion) {
    knowledgeCard.classList.remove('is-turning');
    void knowledgeCard.offsetWidth;
    knowledgeCard.classList.add('is-turning');
  }
  renderCard();
  return result.interpretation;
}

function dismissCard() {
  if (!knowledgeLayer.classList.contains('is-open')) return;
  handleCardInput({ kind: 'DISMISS_CONTROL', reducedMotion });
}

function closeCardLayer() {
  knowledgeLayer.classList.remove('is-open');
  knowledgeLayer.setAttribute('aria-hidden', 'true');
  knowledgeLayer.inert = true;
  inspectionPanel.hidden = false;
  renderInspection();
  priorFocus?.focus?.();
}

function followRelation(toSiteId) {
  const fromSiteId = sceneState.activeSiteId;
  const result = applyGratitudeCoastMapAction(sceneState, { type: 'FOLLOW_RELATION', toSiteId });
  if (!result.receipt.accepted) return;
  sceneState = result.state;
  const path = resolvePendingSurveyPath(sceneState);
  hideLocalPanels();
  const first = sampleSurveyPath(path, 0);
  if (reducedMotion) {
    const arrival = sampleSurveyPath(path, 1, { reducedMotion: true });
    camera = { eye: vector(arrival.position), look: vector(arrival.lookAt) };
    completeArrival();
    return;
  }
  cameraMotion = {
    kind: 'SCENE_ENTRY',
    startedAt: performance.now(),
    preludeMs: 320,
    duration: path.totalDurationMs,
    fromEye: [...camera.eye],
    fromLook: [...camera.look],
    firstEye: vector(first.position),
    firstLook: vector(first.lookAt),
    path
  };
  worldStatus.textContent = `Following the revealed route from ${SITE_NAMES[fromSiteId]}.`;
  syncInterface();
}

function returnToCoast({ openMapAfter = false } = {}) {
  if (!sceneState || cameraMotion) return;
  if (sceneState.phase !== 'SURVEY_HUB') applySceneEvent({ type: 'RETURN_TO_HUB' });
  closeEncounterPanel();
  closeCardLayerSilently();
  hideLocalPanels();
  worldStage.classList.remove('is-local');
  returnMap.hidden = true;
  const finish = () => {
    worldStatus.textContent = sceneState.discoveredIds.length
      ? `Gratitude Coast · ${sceneState.discoveredIds.length} discoveries witnessed`
      : 'Choose one of four distant signals.';
    syncInterface();
    if (openMapAfter) openMap();
    else mapToggle.focus();
  };
  tweenCamera(vector(worldEntryFrame.position), vector(worldEntryFrame.lookAt), 1200, finish);
}

function hideLocalPanels() {
  arrivalPanel.hidden = true;
  inspectionPanel.hidden = true;
}

function closeCardLayerSilently() {
  knowledgeLayer.classList.remove('is-open');
  knowledgeLayer.setAttribute('aria-hidden', 'true');
  knowledgeLayer.inert = true;
}

function openMap() {
  if (!sceneState || cameraMotion) return;
  if (sceneState.phase !== 'SURVEY_HUB') {
    returnToCoast({ openMapAfter: true });
    return;
  }
  priorFocus = document.activeElement;
  renderMap();
  mapPanel.classList.add('is-open');
  mapPanel.setAttribute('aria-hidden', 'false');
  mapPanel.inert = false;
  const firstMarker = mapPanel.querySelector('.map-marker:not(.map-marker--context)');
  (firstMarker ?? mapClose).focus();
  syncSignals();
}

function closeMapPanel({ restoreFocus = true } = {}) {
  mapPanel.classList.remove('is-open');
  mapPanel.setAttribute('aria-hidden', 'true');
  mapPanel.inert = true;
  if (restoreFocus) priorFocus?.focus?.();
  syncSignals();
}

function mapPoint(map) {
  return { x: 42 + map.u * 916, y: 34 + map.v * 572 };
}

function renderMap() {
  const model = currentMapModel();
  mapGeography.replaceChildren();
  mapMarkers.replaceChildren();
  const namespace = 'http://www.w3.org/2000/svg';
  const coast = document.createElementNS(namespace, 'polyline');
  coast.classList.add('map-coastline');
  coast.setAttribute('points', model.coastline.points.map((point) => {
    const projected = mapPoint(point.map);
    return `${projected.x},${projected.y}`;
  }).join(' '));
  mapGeography.append(coast);
  for (const relation of model.relationPaths) {
    const path = document.createElementNS(namespace, 'polyline');
    path.classList.add('map-relation');
    path.setAttribute('points', relation.points.map((point) => {
      const projected = mapPoint(point.map);
      return `${projected.x},${projected.y}`;
    }).join(' '));
    mapGeography.append(path);
  }
  for (const marker of model.siteMarkers) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'map-marker';
    button.dataset.state = marker.qualitativeState;
    button.style.left = `${marker.map.u * 100}%`;
    button.style.top = `${marker.map.v * 100}%`;
    button.setAttribute('aria-label', `Travel to ${marker.label.primary}`);
    const label = document.createElement('span');
    label.textContent = marker.label.primary;
    button.append(label);
    button.addEventListener('click', () => selectSite(marker.siteId));
    mapMarkers.append(button);
  }
  for (const marker of model.contextMarkers) {
    const context = document.createElement('div');
    context.className = 'map-marker map-marker--context';
    context.style.left = `${marker.map.u * 100}%`;
    context.style.top = `${marker.map.v * 100}%`;
    context.setAttribute('aria-label', `${marker.label}; harbor context`);
    const label = document.createElement('span');
    label.textContent = marker.label;
    context.append(label);
    mapMarkers.append(context);
  }
}

function syncInterface() {
  if (!sceneState) return;
  returnMap.hidden = sceneState.phase === 'SURVEY_HUB' || sceneState.phase === 'ENCOUNTER_PREVIEW';
  syncSignals();
  if (mapPanel.classList.contains('is-open')) renderMap();
}

function syncSignals(viewProjection = null) {
  const buttons = signalLayer.querySelectorAll('.world-signal');
  if (!sceneState) {
    for (const button of buttons) button.hidden = true;
    return;
  }
  const model = currentMapModel();
  for (const button of buttons) {
    const marker = model.siteMarkers.find((entry) => entry.siteId === button.dataset.siteId);
    button.dataset.state = marker.qualitativeState;
    button.setAttribute('aria-label', `Select ${marker.label.primary}`);
    button.querySelector('span').textContent = marker.label.primary;
    const modalOpen = mapPanel.classList.contains('is-open') || encounterPanel.classList.contains('is-open') || knowledgeLayer.classList.contains('is-open') || !introLayer.hidden;
    if (!viewProjection || modalOpen || cameraMotion || sceneState.phase !== 'SURVEY_HUB') {
      button.hidden = true;
      continue;
    }
    const anchor = resolveSiteAnchor(marker.siteId).world;
    const position = project([anchor.x, anchor.y + 28, anchor.z], viewProjection, innerWidth, innerHeight);
    if (!position) { button.hidden = true; continue; }
    button.hidden = false;
    button.style.left = `${position[0]}px`;
    button.style.top = `${position[1]}px`;
  }
}

function updateCameraMotion(now) {
  if (!cameraMotion) return;
  if (cameraMotion.kind === 'TWEEN') {
    const progress = clamp((now - cameraMotion.startedAt) / cameraMotion.duration, 0, 1);
    const eased = smooth(progress);
    camera.eye = mixVector(cameraMotion.fromEye, cameraMotion.toEye, eased);
    camera.look = mixVector(cameraMotion.fromLook, cameraMotion.toLook, eased);
    if (progress >= 1) {
      const complete = cameraMotion.onComplete;
      cameraMotion = null;
      complete?.();
    }
    return;
  }
  if (cameraMotion.kind === 'SCENE_ENTRY') {
    const elapsed = now - cameraMotion.startedAt;
    if (elapsed < cameraMotion.preludeMs) {
      const progress = smooth(clamp(elapsed / cameraMotion.preludeMs, 0, 1));
      camera.eye = mixVector(cameraMotion.fromEye, cameraMotion.firstEye, progress);
      camera.look = mixVector(cameraMotion.fromLook, cameraMotion.firstLook, progress);
      return;
    }
    const progress = clamp((elapsed - cameraMotion.preludeMs) / cameraMotion.duration, 0, 1);
    const sample = sampleSurveyPath(cameraMotion.path, progress);
    camera.eye = vector(sample.position);
    camera.look = vector(sample.lookAt);
    if (sample.stageId !== lastSurveyStage) {
      lastSurveyStage = sample.stageId;
      const labels = {
        SCENE_CUT: 'The survey hub gives way to a separate scene.',
        ENVIRONMENT_REVEAL: 'The environment becomes legible.',
        ARRIVAL_WITNESS: 'Arrival comes before interpretation.'
      };
      worldStatus.textContent = labels[sample.stageId];
    }
    if (progress >= 1) {
      cameraMotion = null;
      completeArrival();
    }
  }
}

function resizeCanvas() {
  const ratio = Math.min(compact ? 1.2 : 1.55, devicePixelRatio || 1);
  const width = Math.max(1, Math.round(innerWidth * ratio));
  const height = Math.max(1, Math.round(innerHeight * ratio));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  gl.viewport(0, 0, width, height);
  return { width, height };
}

function drawNightMesh(mesh, water, viewProjection, time) {
  const uniforms = nightUniforms({ environment: {} });
  gl.useProgram(nightProgram);
  gl.uniformMatrix4fv(gl.getUniformLocation(nightProgram, 'uVP'), false, viewProjection);
  gl.uniform3fv(gl.getUniformLocation(nightProgram, 'uEye'), camera.eye);
  gl.uniform1f(gl.getUniformLocation(nightProgram, 'uTime'), reducedMotion ? 0 : time);
  gl.uniform1i(gl.getUniformLocation(nightProgram, 'uWater'), water ? 1 : 0);
  gl.uniform1f(gl.getUniformLocation(nightProgram, 'uLunarIntensity'), uniforms.lunarIntensity);
  gl.uniform1f(gl.getUniformLocation(nightProgram, 'uHorizonHaze'), uniforms.horizonHaze);
  gl.uniform1f(gl.getUniformLocation(nightProgram, 'uWaterMoonResponse'), uniforms.waterMoonResponse);
  gl.uniform1f(gl.getUniformLocation(nightProgram, 'uMoonPathX'), camera.look[0] + 250);
  gl.bindVertexArray(mesh.vao);
  gl.drawElements(gl.TRIANGLES, mesh.count, gl.UNSIGNED_INT, 0);
}

function drawSites(viewProjection) {
  gl.useProgram(siteProgram);
  gl.uniformMatrix4fv(gl.getUniformLocation(siteProgram, 'uVP'), false, viewProjection);
  const localSiteId = sceneState?.activeSiteId ?? sceneState?.selectedSiteId ?? null;
  for (const siteId of CARDINAL_SITE_IDS) {
    const lod = siteId === localSiteId ? 'LOCAL' : 'REGIONAL';
    for (const component of renderedSites[siteId][lod]) {
      gl.uniform3fv(gl.getUniformLocation(siteProgram, 'uBaseColor'), component.material.baseColor);
      gl.uniform1f(gl.getUniformLocation(siteProgram, 'uEmissive'), component.material.emissiveStrength);
      gl.bindVertexArray(component.mesh.vao);
      gl.drawElements(gl.TRIANGLES, component.mesh.count, gl.UNSIGNED_INT, 0);
    }
  }
}

function drawSolidMesh(mesh, viewProjection, color, emissive = 0) {
  gl.useProgram(siteProgram);
  gl.uniformMatrix4fv(gl.getUniformLocation(siteProgram, 'uVP'), false, viewProjection);
  gl.uniform3fv(gl.getUniformLocation(siteProgram, 'uBaseColor'), color);
  gl.uniform1f(gl.getUniformLocation(siteProgram, 'uEmissive'), emissive);
  gl.bindVertexArray(mesh.vao);
  gl.drawElements(gl.TRIANGLES, mesh.count, gl.UNSIGNED_INT, 0);
}

function drawAudraliaPlanet(viewProjection) {
  drawSolidMesh(planetOceanMesh, viewProjection, [0.055, 0.19, 0.28], 0.08);
  drawSolidMesh(planetTerrainMesh, viewProjection, [0.34, 0.42, 0.24], 0.16);
}

function render(now) {
  if (!gl || html.classList.contains('static-mode')) return;
  updateIntroTimeline(now);
  updateCameraMotion(now);
  const { width, height } = resizeCanvas();
  const viewProjection = multiply(perspective(52 * Math.PI / 180, width / height, 1, 6000), lookAt(camera.eye, camera.look));
  gl.clearColor(...GRATITUDE_COAST_NIGHT.sky.clear);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  if (introState.phase === 'AUDRALIA_GLOBE') {
    drawAudraliaPlanet(viewProjection);
  } else {
    drawNightMesh(waterMesh, true, viewProjection, now * 0.001);
    drawNightMesh(terrainMesh, false, viewProjection, now * 0.001);
    drawSites(viewProjection);
  }
  syncSignals(viewProjection);
  requestAnimationFrame(render);
}

export const TASK20_PAGE_RUNTIME = Object.freeze({
  geographyAuthority: GRATITUDE_GEOGRAPHY_ADAPTER_ID,
  introSequence: CINEMATIC_INTRO_BEAT_IDS,
  primerRuntimeMs: CINEMATIC_RUNTIME_MS,
  interactionArchitecture: 'SURVEY_HUB_TO_ENCOUNTER_PREVIEW_TO_SEPARATE_CHARACTER_SCENE_TO_EXACT_HUB_RETURN',
  standardSceneEntry: 'CINEMATIC_CUT_OR_SEMANTIC_ZOOM_NO_CONTINUOUS_PHYSICAL_TRAVEL_REQUIRED',
  inputProfiles: ['TOUCH', 'POINTER', 'KEYBOARD'],
  reducedMotion: 'SEMANTIC_STATIC_ARRIVAL_AND_CARD_FACE_REPLACEMENT',
  staticFallback: 'COMPLETE_PRIMER_SIGNAL_ENCOUNTER_SCENE_RETURN_AND_TWENTY_THREE_DISCOVERY_EQUIVALENT',
  externalNavigationDistinction: 'DOUBLE_BORDER_ASYMMETRIC_TAB_ROUTE_GLYPH_AND_EXPLICIT_LEAVES_MIRRORLAND_TEXT'
});
