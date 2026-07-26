import fs from 'node:fs';

const compositorPath = 'showroom/index.compositor.js';
const htmlPath = 'showroom/index.html';

function once(text, from, to, label) {
  const count = text.split(from).length - 1;
  if (count === 0 && text.includes(to)) return text;
  if (count !== 1) throw new Error(`${label}: expected one match, found ${count}`);
  return text.replace(from, to);
}

let compositor = fs.readFileSync(compositorPath, 'utf8');
compositor = once(
  compositor,
  `  const PRESENTATION_CAMERA = Object.freeze({\n    mobileAspectThreshold: 0.82,\n    constellation: Object.freeze({ normalEye: Object.freeze([0, 0.76, 6.05]), mobileEye: Object.freeze([0, 0.76, 7.10]), target: Object.freeze([0, 0.03, 0.06]), normalFieldOfViewDegrees: 36, mobileFieldOfViewDegrees: 34 }),\n    cluster: Object.freeze({ normalEye: Object.freeze([0, 0.62, 6.28]), mobileEye: Object.freeze([0, 0.62, 7.68]), target: Object.freeze([0, 0.02, 0.04]), normalFieldOfViewDegrees: 36, mobileFieldOfViewDegrees: 34 })\n  });`,
  `  const PRESENTATION_CAMERA = Object.freeze({\n    mobileWidthThreshold: 520,\n    constellation: Object.freeze({ normalEye: Object.freeze([0, 0.76, 6.05]), mobileEye: Object.freeze([0, 0.76, 8.00]), target: Object.freeze([0, 0.03, 0.06]), normalFieldOfViewDegrees: 36, mobileFieldOfViewDegrees: 38 }),\n    cluster: Object.freeze({ normalEye: Object.freeze([0, 0.62, 4.60]), mobileEye: Object.freeze([0, 0.62, 4.80]), target: Object.freeze([0, 0.02, 0.04]), normalFieldOfViewDegrees: 36, mobileFieldOfViewDegrees: 36 })\n  });`,
  'presentation camera presets'
);
compositor = once(
  compositor,
  `    const mobile = aspect <= PRESENTATION_CAMERA.mobileAspectThreshold;`,
  `    const mobile = state.viewport.cssWidth <= PRESENTATION_CAMERA.mobileWidthThreshold;`,
  'mobile camera classifier'
);
fs.writeFileSync(compositorPath, compositor);

let html = fs.readFileSync(htmlPath, 'utf8');
html = html.replaceAll(
  'SHOWROOM_MIRRORLAND_IMMERSIVE_MISSION_CONTEXT_HTML_TNT_v17_11_GLOW_PRESENTATION_ENVELOPE',
  'SHOWROOM_MIRRORLAND_IMMERSIVE_MISSION_CONTEXT_HTML_TNT_v17_12_GLOW_PRESENTATION_ENVELOPE_REFINED'
);
html = html.replaceAll(
  'SHOWROOM_GLOW_PRESENTATION_ENVELOPE_20260726K',
  'SHOWROOM_GLOW_PRESENTATION_ENVELOPE_20260726L'
);
fs.writeFileSync(htmlPath, html);
