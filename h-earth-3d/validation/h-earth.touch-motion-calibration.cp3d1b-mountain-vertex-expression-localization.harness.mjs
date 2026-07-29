import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { getHEarthRun8ER2ImmutableLiveRenderPackage } from '../../showroom/globe/h-earth/render/live-render-package.run8e-r2.js';
import { traceCP3D1BMountainVertex72Y } from './h-earth.touch-motion-calibration.cp3d1b-mountain-vertex-expression-probe.mjs';

const origin = process.env.CP3D_ORIGIN ?? 'http://127.0.0.1:4173';
const evidenceDirectory = process.env.CP3D_EVIDENCE_DIR ?? 'h-earth-3d/validation/evidence/cp3d';
const probeUrl = `${origin}/h-earth-3d/validation/h-earth.touch-motion-calibration.cp3d1b-mountain-vertex-expression-probe.mjs`;
await mkdir(evidenceDirectory, { recursive: true });

const packageRecord = getHEarthRun8ER2ImmutableLiveRenderPackage();
const x = packageRecord.buffers.positions[216];
const z = packageRecord.buffers.positions[218];
const nodeTrace = traceCP3D1BMountainVertex72Y(x, z, 'NODE');

const browser = await chromium.launch({ headless: true, args: ['--disable-dev-shm-usage'] });
let browserTrace;
try {
  const page = await browser.newPage();
  await page.goto(origin, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  browserTrace = await page.evaluate(async ({ url, x, z }) => {
    const module = await import(`${url}?stamp=${Date.now()}`);
    return module.traceCP3D1BMountainVertex72Y(x, z, 'BROWSER');
  }, { url: probeUrl, x, z });
} finally {
  await browser.close();
}

const bytes = value => {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setFloat64(0, value, true);
  return [...new Uint8Array(buffer)].map(item => item.toString(16).padStart(2, '0'));
};
const bits = value => {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setFloat64(0, value, false);
  return view.getBigUint64(0, false);
};

let firstDifference = null;
for (let index = 0; index < nodeTrace.steps.length; index += 1) {
  const nodeStep = nodeTrace.steps[index];
  const browserStep = browserTrace.steps[index];
  if (!browserStep || nodeStep.name !== browserStep.name || !Object.is(nodeStep.value, browserStep.value)) {
    const nodeValue = nodeStep?.value ?? null;
    const browserValue = browserStep?.value ?? null;
    firstDifference = {
      stepIndex: index,
      stepName: nodeStep?.name ?? browserStep?.name ?? null,
      expression: nodeStep?.expression ?? browserStep?.expression ?? null,
      nodeValue,
      browserValue,
      absoluteDelta: typeof nodeValue === 'number' && typeof browserValue === 'number' ? Math.abs(nodeValue - browserValue) : null,
      ulpDelta: typeof nodeValue === 'number' && typeof browserValue === 'number' ? String(bits(nodeValue) > bits(browserValue) ? bits(nodeValue) - bits(browserValue) : bits(browserValue) - bits(nodeValue)) : null,
      nodeFloat64LittleEndianBytes: typeof nodeValue === 'number' ? bytes(nodeValue) : null,
      browserFloat64LittleEndianBytes: typeof browserValue === 'number' ? bytes(browserValue) : null
    };
    break;
  }
}

const receipt = {
  receiptType: 'H_EARTH_TOUCH_MOTION_CP3D1B_MOUNTAIN_VERTEX_72_Y_SOURCE_EXPRESSION_LOCALIZATION_v1',
  checkpoint: 'CP3D_1B_MOUNTAIN_VERTEX_72_Y_SOURCE_EXPRESSION_LOCALIZATION',
  status: firstDifference ? 'FIRST_ARITHMETIC_DIVERGENCE_LOCALIZED' : 'NO_INTERMEDIATE_DIVERGENCE_FOUND',
  sourcePrimitiveId: 'H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_MOUNTAIN_NEUTRAL_PRIMITIVE_001',
  sourceLocalVertexIndex: 72,
  positionComponent: 'Y',
  worldX: x,
  worldZ: z,
  nodeFinalElevation: nodeTrace.elevation,
  browserFinalElevation: browserTrace.elevation,
  firstDifference,
  comparedStepCount: firstDifference ? firstDifference.stepIndex + 1 : nodeTrace.steps.length,
  stoppingBoundary: 'DO_NOT_INVESTIGATE_LATER_INTERMEDIATES_OR_APPLY_CORRECTION_UNTIL_FIRST_DIVERGENT_EXPRESSION_IS_CLASSIFIED'
};
await writeFile(`${evidenceDirectory}/cp3d1b-mountain-vertex-expression-localization.receipt.json`, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
if (!firstDifference) throw new Error('CP3D1B_NO_INTERMEDIATE_DIVERGENCE_FOUND');
throw new Error(`CP3D1B_LOCALIZATION_COMPLETE:${firstDifference.stepName}`);
