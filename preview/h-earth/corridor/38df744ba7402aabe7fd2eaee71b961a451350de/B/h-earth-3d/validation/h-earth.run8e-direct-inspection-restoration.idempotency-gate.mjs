import fs from 'node:fs';

const htmlPath = 'showroom/globe/h-earth/index.html';
const integrationPath =
  'showroom/globe/h-earth/functional-landscape/environment-integration.js';
const directPath =
  'showroom/globe/h-earth/functional-landscape/direct-manipulation.js';
const controllerPath =
  'showroom/globe/h-earth/functional-landscape/mobile-navigation-controls.js';
const markerPath = '/tmp/h-earth-run8e-direct-inspection-already-restored';

const html = fs.readFileSync(htmlPath, 'utf8');
const integration = fs.readFileSync(integrationPath, 'utf8');
const restored =
  fs.existsSync(directPath) &&
  !fs.existsSync(controllerPath) &&
  !html.includes('data-h-earth-stage-contains-controls="true"') &&
  html.includes('direct-manipulation.js?v=run8e-direct-inspection-restoration-001') &&
  html.includes('Two-finger slide to move') &&
  !integration.includes('mobile-navigation-controls.js') &&
  integration.includes('requestRun8ERender') &&
  integration.includes('coalescedRenderRequestCount');

if (restored) {
  fs.writeFileSync(markerPath, 'RESTORED\n');
  console.log('Exact direct-inspection restoration already materialized.');
} else {
  if (fs.existsSync(markerPath)) fs.unlinkSync(markerPath);
  console.log('Direct-inspection restoration requires materialization.');
}
