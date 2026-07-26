import fs from 'node:fs';

const runtimePath = 'showroom/index.crystals.js';
const sourcePath = 'showroom/index.crystals.source.js';
const compositorPath = 'showroom/index.compositor.js';
const htmlPath = 'showroom/index.html';

function once(text, from, to, label) {
  const count = text.split(from).length - 1;
  if (count === 0 && text.includes(to)) return text;
  if (count !== 1) throw new Error(`${label}: expected one match, found ${count}`);
  return text.replace(from, to);
}

function regexOnce(text, pattern, replacement, marker, label) {
  if (text.includes(marker)) return text;
  if (!pattern.test(text)) throw new Error(`${label}: no match`);
  return text.replace(pattern, replacement);
}

function patchCrystals(text) {
  text = once(text, 'Showroom canonical crystal corridor with viewport-safe spatial integration.', 'Showroom canonical crystal corridor with restored Main/Laws glow and presentation envelope.', 'header');
  text = once(text, '"SHOWROOM_CANONICAL_CRYSTAL_SPATIAL_INTEGRATION_v2"', '"SHOWROOM_CANONICAL_CRYSTAL_GLOW_AND_PRESENTATION_v3"', 'contract');
  text = regexOnce(text, /  const QUALITY = Object\.freeze\(\{[\s\S]*?\n\}\);\n\n  const CARDINAL_BASE_POSITIONS/, `  const QUALITY = Object.freeze({\n  maximumDeltaSeconds: 0.05,\n  interpolationSpeed: 8.2,\n  reducedMotionInterpolationSpeed: 26,\n  ambientFrameIntervalMs: 1000 / 30,\n  cardinalHitRadius: 76,\n  roomHitRadius: 48,\n  visibleOpacityThreshold: 0.025,\n  haloPassEnabled: true,\n  haloDisableWidth: 0,\n  cardinalDepthRadius: 1.16,\n  roomDepthRadius: 1.04\n});\n\n  const CARDINAL_BASE_POSITIONS`, 'haloPassEnabled: true', 'quality');
  text = regexOnce(text, /  const CARDINAL_BASE_POSITIONS = Object\.freeze\(\{[\s\S]*?\n\}\);\n\nconst ROOM_BASE_POSITIONS = Object\.freeze\(\{[\s\S]*?\n\}\);\n\n  const PALETTES/, `  const CARDINAL_BASE_POSITIONS = Object.freeze({\n  north: Object.freeze([0, 1.34, 0]),\n  east: Object.freeze([1.50, 0, 0]),\n  south: Object.freeze([0, -1.34, 0]),\n  west: Object.freeze([-1.50, 0, 0])\n});\n\nconst ROOM_BASE_POSITIONS = Object.freeze({\n  1: Object.freeze([0, 0.42155918243834756, -0.9713677415028749]),\n  2: Object.freeze([1.3178909481432288, 0.29135821915396054, 0]),\n  3: Object.freeze([0, -0.5073345276802548, 0.9389695242664297]),\n  4: Object.freeze([-1.351990798995593, -0.12787386777498447, 0])\n});\n\n  const PALETTES`, 'north: Object.freeze([0, 1.34, 0])', 'positions');
  text = regexOnce(text, /  const MATERIALS = Object\.freeze\(\{[\s\S]*?\n\}\);\n\n  const state =/, `  const MATERIALS = Object.freeze({\n  CARDINAL_IDLE: Object.freeze({ scale: 0.96, specular: 1.18, rim: 1.02, emissive: 0.17, alpha: 0.90, sparkle: 0.26, halo: 0.82, contrast: 1.16 }),\n  CARDINAL_FOCUSED: Object.freeze({ scale: 1.30, specular: 1.50, rim: 1.30, emissive: 0.24, alpha: 0.96, sparkle: 0.36, halo: 1.18, contrast: 1.24 }),\n  ROOM_IDLE: Object.freeze({ scale: 0.88, specular: 1.04, rim: 0.90, emissive: 0.15, alpha: 0.88, sparkle: 0.22, halo: 0.64, contrast: 1.10 }),\n  ROOM_PRIMARY: Object.freeze({ scale: 1.12, specular: 1.24, rim: 1.08, emissive: 0.21, alpha: 0.94, sparkle: 0.30, halo: 0.86, contrast: 1.17 })\n});\n\n  const state =`, 'CARDINAL_FOCUSED: Object.freeze({ scale: 1.30', 'materials');
  text = once(text, `    const haloEnabled =\n      QUALITY.haloPassEnabled === true;`, `    const haloEnabled =\n      QUALITY.haloPassEnabled === true &&\n      finiteNumber(payload.frame.viewport.cssWidth, 0) >\n        QUALITY.haloDisableWidth;`, 'halo gate');
  text = text.replaceAll('cardinalPositionsMovedOutward:\n          true', 'cardinalPositionsUseCanonicalMainRadius:\n          true');
  text = text.replaceAll('roomPositionsMovedOutward:\n          true', 'roomPositionsUseCanonicalMainCluster:\n          true');
  text = text.replaceAll('positionsMovedOutward:\n          true', 'canonicalPresentationEnvelopeRestored:\n          true');
  text = text.replaceAll('the detached additive full-mesh halo draw is retired;', 'the accepted additive full-mesh halo draw is restored;');
  text = text.replaceAll('cardinal and room crystals use bounded viewport-safe scales;', 'cardinal and room crystals use the accepted Main/Laws scale hierarchy;');
  return text;
}

const baseline = fs.readFileSync(runtimePath, 'utf8');
if (baseline !== fs.readFileSync(sourcePath, 'utf8')) throw new Error('runtime/source mismatch');
const crystals = patchCrystals(baseline);
fs.writeFileSync(runtimePath, crystals);
fs.writeFileSync(sourcePath, crystals);

let compositor = fs.readFileSync(compositorPath, 'utf8');
compositor = once(compositor, '/* SHOWROOM_CONSTELLATION_SINGLE_FRAME_COMPOSITOR_TNT_v6_REDUCED_COMPASS_OVERLOAD */', '/* SHOWROOM_CONSTELLATION_SINGLE_FRAME_COMPOSITOR_TNT_v6_CANONICAL_PRESENTATION_ENVELOPE */', 'compositor header');
compositor = once(compositor, `  const state = {`, `  const PRESENTATION_CAMERA = Object.freeze({\n    mobileAspectThreshold: 0.82,\n    constellation: Object.freeze({ normalEye: Object.freeze([0, 0.76, 6.05]), mobileEye: Object.freeze([0, 0.76, 7.10]), target: Object.freeze([0, 0.03, 0.06]), normalFieldOfViewDegrees: 36, mobileFieldOfViewDegrees: 34 }),\n    cluster: Object.freeze({ normalEye: Object.freeze([0, 0.62, 6.28]), mobileEye: Object.freeze([0, 0.62, 7.68]), target: Object.freeze([0, 0.02, 0.04]), normalFieldOfViewDegrees: 36, mobileFieldOfViewDegrees: 34 })\n  });\n\n  const state = {`, 'camera block');
compositor = once(compositor, `  function rebuildMatrices() {\n    const aspect =\n      state.viewport.cssWidth /\n      Math.max(\n        1,\n        state.viewport.cssHeight\n      );\n\n    const view =`, `  function applyPresentationCamera(aspect) {\n    const mode = String(state.controllerFrame && state.controllerFrame.presentationMode || "CONSTELLATION").toUpperCase();\n    const preset = mode === "CLUSTER" ? PRESENTATION_CAMERA.cluster : PRESENTATION_CAMERA.constellation;\n    const mobile = aspect <= PRESENTATION_CAMERA.mobileAspectThreshold;\n    state.camera.eye = (mobile ? preset.mobileEye : preset.normalEye).slice();\n    state.camera.target = preset.target.slice();\n    state.camera.fieldOfViewDegrees = mobile ? preset.mobileFieldOfViewDegrees : preset.normalFieldOfViewDegrees;\n  }\n\n  function rebuildMatrices() {\n    const aspect =\n      state.viewport.cssWidth /\n      Math.max(\n        1,\n        state.viewport.cssHeight\n      );\n\n    applyPresentationCamera(aspect);\n\n    const view =`, 'camera application');
fs.writeFileSync(compositorPath, compositor);

let html = fs.readFileSync(htmlPath, 'utf8');
html = html.replaceAll('SHOWROOM_MIRRORLAND_IMMERSIVE_MISSION_CONTEXT_HTML_TNT_v17_10_SPATIAL_COSMOS_CONTINUITY', 'SHOWROOM_MIRRORLAND_IMMERSIVE_MISSION_CONTEXT_HTML_TNT_v17_11_GLOW_PRESENTATION_ENVELOPE');
html = once(html, '/showroom/index.compositor.js?v=SHOWROOM_CONSTELLATION_SINGLE_FRAME_COMPOSITOR_TNT_v6', '/showroom/index.compositor.js?v=SHOWROOM_GLOW_PRESENTATION_ENVELOPE_20260726K', 'compositor cache');
html = once(html, '/showroom/index.crystals.js?v=SHOWROOM_COMPASS_SPATIAL_COSMOS_20260726J', '/showroom/index.crystals.js?v=SHOWROOM_GLOW_PRESENTATION_ENVELOPE_20260726K', 'crystal cache');
fs.writeFileSync(htmlPath, html);
