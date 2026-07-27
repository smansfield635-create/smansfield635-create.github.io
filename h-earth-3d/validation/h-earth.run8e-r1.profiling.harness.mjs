import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const outputDirectory = process.env.H_EARTH_RUN8E_R1_OUTPUT ?? '/tmp/h-earth-run8e-r1';
const targetUrl = process.env.H_EARTH_RUN8E_R1_URL ??
  'http://127.0.0.1:4173/showroom/globe/h-earth/diagnostic/run8e-r1/';
fs.mkdirSync(outputDirectory, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist']
});
const context = await browser.newContext({
  viewport: { width: 412, height: 915 },
  deviceScaleFactor: 2.625,
  isMobile: true,
  hasTouch: true,
  userAgent:
    'Mozilla/5.0 (Linux; Android 16; SM-S948U) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36'
});
const page = await context.newPage();
const errors = [];
page.on('console', (message) => {
  if (message.type() === 'error') errors.push(`CONSOLE:${message.text()}`);
});
page.on('pageerror', (error) => errors.push(`PAGE:${error.message}`));
page.on('requestfailed', (request) =>
  errors.push(`REQUEST:${request.url()}:${request.failure()?.errorText ?? 'FAILED'}`));

await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 120000 });
await page.waitForFunction(() => Boolean(window.H_EARTH_RUN8E_R1_PROFILER), null, { timeout: 120000 });
await page.waitForFunction(() => !document.getElementById('start-physical')?.disabled, null, { timeout: 120000 });

await page.click('#run-probes');
await page.waitForFunction(
  () => Boolean(window.H_EARTH_RUN8E_R1_ARCHITECTURE_RECEIPT),
  null,
  { timeout: 600000 }
);
const architecture = await page.evaluate(() => window.H_EARTH_RUN8E_R1_ARCHITECTURE_RECEIPT);

const assert = (condition, code) => {
  if (!condition) throw new Error(code);
};
assert(architecture.fixedCameraStateCount === 5, 'R1_FIXED_CAMERA_COUNT_INVALID');
assert(architecture.staticPipeline.primitiveCount === 35, 'R1_PRIMITIVE_COUNT_INVALID');
assert(architecture.candidateA.results.length === 5, 'R1_CANDIDATE_A_RESULT_COUNT_INVALID');
assert(architecture.candidateB.available === true, 'R1_CANDIDATE_B_UNAVAILABLE');
assert(architecture.candidateB.results.length === 5, 'R1_CANDIDATE_B_RESULT_COUNT_INVALID');
assert(architecture.candidateC.available === true, 'R1_CANDIDATE_C_WEBGL2_UNAVAILABLE');
assert(architecture.candidateC.results.length === 5, 'R1_CANDIDATE_C_RESULT_COUNT_INVALID');
assert(
  architecture.architectureDisposition.realtimeLiveRendererPrimaryCandidate === 'WEBGL_2',
  'R1_WEBGL2_DISPOSITION_MISSING'
);

await page.click('#start-physical');
const frame = page.frames().find((candidate) =>
  candidate.url().includes('/showroom/globe/h-earth/') &&
  !candidate.url().includes('/diagnostic/run8e-r1/'));
assert(Boolean(frame), 'R1_PUBLIC_ROUTE_FRAME_MISSING');
await frame.waitForFunction(() =>
  window.H_EARTH_RUN8E_PUBLIC_ROUTE?.getSnapshot?.()?.ready === true &&
  window.H_EARTH_RUN8E_DIRECT_INSPECTION?.ready === true,
  null,
  { timeout: 180000 }
);

await frame.evaluate(async () => {
  const mount = document.getElementById('h-earth-functional-landscape-mount');
  const emit = (type, pointerId, x, y) => mount.dispatchEvent(new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    pointerId,
    pointerType: 'touch',
    isPrimary: pointerId === 1,
    clientX: x,
    clientY: y,
    buttons: type === 'pointerup' ? 0 : 1
  }));
  const pause = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

  emit('pointerdown', 1, 190, 390);
  for (let index = 0; index < 8; index += 1) {
    emit('pointermove', 1, 190 + index * 8, 390 - index * 3);
    await pause(18);
  }
  emit('pointerup', 1, 254, 366);
  await pause(1200);

  emit('pointerdown', 1, 160, 430);
  emit('pointerdown', 2, 250, 430);
  for (let index = 0; index < 8; index += 1) {
    emit('pointermove', 1, 160, 430 - index * 7);
    emit('pointermove', 2, 250, 430 - index * 7);
    await pause(18);
  }
  emit('pointerup', 1, 160, 374);
  emit('pointerup', 2, 250, 374);
  await pause(1200);

  emit('pointerdown', 1, 175, 430);
  emit('pointerdown', 2, 235, 430);
  for (let index = 0; index < 8; index += 1) {
    emit('pointermove', 1, 175 - index * 4, 430);
    emit('pointermove', 2, 235 + index * 4, 430);
    await pause(18);
  }
  emit('pointerup', 1, 143, 430);
  emit('pointerup', 2, 267, 430);
  await pause(1800);
});

await page.click('#stop-physical');
await page.waitForFunction(() => Boolean(window.H_EARTH_RUN8E_R1_PHYSICAL_RECEIPT), null, { timeout: 30000 });
const emulation = await page.evaluate(() => window.H_EARTH_RUN8E_R1_PHYSICAL_RECEIPT);
assert(emulation.interaction.pointerMoveCount > 0, 'R1_POINTER_MOVES_NOT_CAPTURED');
assert(emulation.interaction.previewTransformMutationCount > 0, 'R1_BITMAP_PREVIEW_NOT_OBSERVED');
assert(emulation.failureClassification.truthfulContinuousRealtimeInteractionEstablished === false,
  'R1_FAILURE_CLASSIFICATION_INVALID');
assert(emulation.failureClassification.run8EPassClosed === false, 'R1_RUN8E_CLOSED_INCORRECTLY');
assert(errors.length === 0, `R1_BROWSER_ERRORS:${errors.join('|')}`);

fs.writeFileSync(
  path.join(outputDirectory, 'h-earth.run8e-r1.architecture-probes.json'),
  `${JSON.stringify(architecture, null, 2)}\n`
);
fs.writeFileSync(
  path.join(outputDirectory, 'h-earth.run8e-r1.samsung-emulation-profile.json'),
  `${JSON.stringify(emulation, null, 2)}\n`
);
await page.screenshot({
  path: path.join(outputDirectory, 'h-earth.run8e-r1.profiler-page.png'),
  fullPage: true
});

const summary = {
  status: 'RUN_8E_R1_REPOSITORY_PROFILING_PACKAGE_PASS',
  fixedCameraStateCount: 5,
  candidateAResultCount: architecture.candidateA.results.length,
  candidateBResultCount: architecture.candidateB.results.length,
  candidateCResultCount: architecture.candidateC.results.length,
  webgl2Available: architecture.candidateC.available,
  physicalSamsungExecution: false,
  samsungEmulationSupportingEvidence: true,
  run8ER1PassClosed: false,
  errors
};
fs.writeFileSync(
  path.join(outputDirectory, 'h-earth.run8e-r1.repository-package.summary.json'),
  `${JSON.stringify(summary, null, 2)}\n`
);
console.log(JSON.stringify(summary, null, 2));
await browser.close();
