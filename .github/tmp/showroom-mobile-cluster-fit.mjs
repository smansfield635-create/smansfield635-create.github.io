import fs from 'node:fs';

const paths = [
  'showroom/index.crystals.js',
  'showroom/index.crystals.source.js'
];

function once(text, from, to, label) {
  const count = text.split(from).length - 1;
  if (count === 0 && text.includes(to)) return text;
  if (count !== 1) throw new Error(`${label}: expected one match, found ${count}`);
  return text.replace(from, to);
}

let baseline = fs.readFileSync(paths[0], 'utf8');
if (baseline !== fs.readFileSync(paths[1], 'utf8')) throw new Error('crystal runtime/source mismatch');

baseline = once(
  baseline,
  `  roomDepthRadius: 1.04\n});`,
  `  roomDepthRadius: 1.04,\n  mobileClusterWidthThreshold: 520,\n  mobileClusterHorizontalScale: 0.62\n});`,
  'mobile cluster quality fields'
);

baseline = once(
  baseline,
  `    return [\n      node.current.x,\n      node.current.y +\n        floatOffset,\n      node.current.z\n    ];`,
  `    const fieldWidth =\n      state.field\n        ? state.field.getBoundingClientRect().width\n        : Number.POSITIVE_INFINITY;\n    const mobileClusterFit =\n      node.kind === NODE_KINDS.ROOM &&\n      displayMode(state.controllerFrame) === DISPLAY_MODES.CLUSTER &&\n      fieldWidth <= QUALITY.mobileClusterWidthThreshold;\n    const horizontalScale =\n      mobileClusterFit\n        ? QUALITY.mobileClusterHorizontalScale\n        : 1;\n\n    return [\n      node.current.x * horizontalScale,\n      node.current.y +\n        floatOffset,\n      node.current.z\n    ];`,
  'mobile cluster node projection'
);

baseline = baseline.replaceAll(
  '"SHOWROOM_CANONICAL_CRYSTAL_GLOW_AND_PRESENTATION_v3"',
  '"SHOWROOM_CANONICAL_CRYSTAL_GLOW_AND_PRESENTATION_v4"'
);

for (const path of paths) fs.writeFileSync(path, baseline);

const htmlPath = 'showroom/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');
html = html.replaceAll(
  'SHOWROOM_MIRRORLAND_IMMERSIVE_MISSION_CONTEXT_HTML_TNT_v17_12_GLOW_PRESENTATION_ENVELOPE_REFINED',
  'SHOWROOM_MIRRORLAND_IMMERSIVE_MISSION_CONTEXT_HTML_TNT_v17_13_MOBILE_CLUSTER_FIT'
);
html = html.replaceAll(
  'SHOWROOM_GLOW_PRESENTATION_ENVELOPE_20260726L',
  'SHOWROOM_GLOW_PRESENTATION_ENVELOPE_20260726M'
);
fs.writeFileSync(htmlPath, html);
