import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const outputDirectory = process.env.H_EARTH_RUN8E_R1_OUTPUT ?? '/tmp/h-earth-run8e-r1';
const targetUrl = process.env.H_EARTH_RUN8E_R1_URL ??
  'http://127.0.0.1:4173/showroom/globe/h-earth/diagnostic/run8e-r1/';
fs.mkdirSync(outputDirectory, { recursive: true });

const chromiumArgs = Object.freeze([
  '--use-gl=angle',
  '--use-angle=swiftshader-webgl',
  '--enable-unsafe-swiftshader',
  '--enable-webgl',
  '--ignore-gpu-blocklist'
]);

const writeJson = (filename, value) => {
  fs.writeFileSync(
    path.join(outputDirectory, filename),
    `${JSON.stringify(value, null, 2)}\n`
  );
};

const assert = (condition, code) => {
  if (!condition) throw new Error(code);
};

let browser = null;
let page = null;
let architecture = null;
let emulation = null;
let ciWebGL2Capability = null;
let ciWebGL2Classification = 'NOT_EXECUTED';
const browserEvents = {
  consoleErrors: [],
  pageErrors: [],
  requestFailures: []
};

try {
  browser = await chromium.launch({
    headless: true,
    args: chromiumArgs
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
  page = await context.newPage();
  page.setDefaultTimeout(120000);

  page.on('console', (message) => {
    if (message.type() === 'error') {
      browserEvents.consoleErrors.push(message.text());
    }
  });
  page.on('pageerror', (error) => {
    browserEvents.pageErrors.push(error.message);
  });
  page.on('requestfailed', (request) => {
    browserEvents.requestFailures.push({
      url: request.url(),
      errorText: request.failure()?.errorText ?? 'FAILED'
    });
  });

  await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 120000 });
  await page.waitForFunction(
    () => Boolean(window.H_EARTH_RUN8E_R1_PROFILER),
    null,
    { timeout: 120000 }
  );
  await page.waitForFunction(
    () => !document.getElementById('start-physical')?.disabled,
    null,
    { timeout: 120000 }
  );

  ciWebGL2Capability = await page.evaluate((launchArguments) => {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    let contextLostEventObserved = false;
    canvas.addEventListener('webglcontextlost', (event) => {
      contextLostEventObserved = true;
      event.preventDefault();
    });
    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      depth: true,
      preserveDrawingBuffer: false
    });
    if (!gl) {
      return {
        contextCreated: false,
        contextLost: null,
        contextLostEventObserved,
        vendor: null,
        renderer: null,
        unmaskedVendor: null,
        unmaskedRenderer: null,
        version: null,
        shadingLanguageVersion: null,
        launchArguments,
        softwareRendererExpected: true
      };
    }
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    return {
      contextCreated: true,
      contextLost: gl.isContextLost(),
      contextLostEventObserved,
      vendor: gl.getParameter(gl.VENDOR),
      renderer: gl.getParameter(gl.RENDERER),
      unmaskedVendor: debugInfo
        ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
        : null,
      unmaskedRenderer: debugInfo
        ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        : null,
      version: gl.getParameter(gl.VERSION),
      shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
      launchArguments,
      softwareRendererExpected: true
    };
  }, chromiumArgs);

  // Schedule the probe after this evaluation returns. The probe begins with
  // synchronous world construction, so awaiting a normal Playwright click can
  // incorrectly time out while the page is lawfully occupied by the probe.
  await page.evaluate(() => {
    const button = document.getElementById('run-probes');
    if (!button) throw new Error('R1_RUN_PROBES_CONTROL_MISSING');
    window.setTimeout(() => button.click(), 0);
    return true;
  });

  await page.waitForFunction(
    () => Boolean(window.H_EARTH_RUN8E_R1_ARCHITECTURE_RECEIPT),
    null,
    { timeout: 600000 }
  );
  architecture = await page.evaluate(
    () => window.H_EARTH_RUN8E_R1_ARCHITECTURE_RECEIPT
  );

  ciWebGL2Classification =
    architecture?.candidateC?.available === true &&
    architecture?.candidateC?.results?.length === 5
      ? 'PASS'
      : ciWebGL2Capability.contextCreated !== true
        ? 'ENVIRONMENT_UNAVAILABLE'
        : 'IMPLEMENTATION_FAILURE';

  architecture.ciWebGL2Capability = ciWebGL2Capability;
  architecture.candidateC.ciClassification = ciWebGL2Classification;
  architecture.candidateC.ciPerformanceAuthority = false;
  architecture.candidateC.physicalSamsungExecutionRequired = true;

  assert(architecture.fixedCameraStateCount === 5, 'R1_FIXED_CAMERA_COUNT_INVALID');
  assert(architecture.staticPipeline.primitiveCount === 35, 'R1_PRIMITIVE_COUNT_INVALID');
  assert(architecture.candidateA.results.length === 5, 'R1_CANDIDATE_A_RESULT_COUNT_INVALID');
  assert(architecture.candidateB.available === true, 'R1_CANDIDATE_B_UNAVAILABLE');
  assert(architecture.candidateB.results.length === 5, 'R1_CANDIDATE_B_RESULT_COUNT_INVALID');
  assert(
    ciWebGL2Classification !== 'IMPLEMENTATION_FAILURE',
    'R1_CANDIDATE_C_WEBGL2_IMPLEMENTATION_FAILURE'
  );
  if (ciWebGL2Classification === 'PASS') {
    assert(architecture.candidateC.results.length === 5, 'R1_CANDIDATE_C_RESULT_COUNT_INVALID');
  } else {
    assert(architecture.candidateC.results.length === 0, 'R1_CANDIDATE_C_ENVIRONMENT_RESULT_INVALID');
  }
  assert(
    ['WEBGL_2', 'WEBGL_2_REQUIRES_DEVICE_SUPPORT_REVIEW'].includes(
      architecture.architectureDisposition.realtimeLiveRendererPrimaryCandidate
    ),
    'R1_WEBGL2_DISPOSITION_MISSING'
  );

  await page.evaluate(() => {
    const button = document.getElementById('start-physical');
    if (!button) throw new Error('R1_START_PHYSICAL_CONTROL_MISSING');
    button.click();
  });
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

  await page.evaluate(() => {
    const button = document.getElementById('stop-physical');
    if (!button) throw new Error('R1_STOP_PHYSICAL_CONTROL_MISSING');
    button.click();
  });
  await page.waitForFunction(
    () => Boolean(window.H_EARTH_RUN8E_R1_PHYSICAL_RECEIPT),
    null,
    { timeout: 30000 }
  );
  emulation = await page.evaluate(
    () => window.H_EARTH_RUN8E_R1_PHYSICAL_RECEIPT
  );

  assert(emulation.interaction.pointerMoveCount > 0, 'R1_POINTER_MOVES_NOT_CAPTURED');
  assert(emulation.interaction.previewTransformMutationCount > 0, 'R1_BITMAP_PREVIEW_NOT_OBSERVED');
  assert(
    emulation.failureClassification.truthfulContinuousRealtimeInteractionEstablished === false,
    'R1_FAILURE_CLASSIFICATION_INVALID'
  );
  assert(emulation.failureClassification.run8EPassClosed === false, 'R1_RUN8E_CLOSED_INCORRECTLY');

  const dispositionedConsoleErrors = ciWebGL2Classification === 'ENVIRONMENT_UNAVAILABLE'
    ? browserEvents.consoleErrors.filter((message) => /webgl|swiftshader|context/i.test(message))
    : [];
  const undispositionedConsoleErrors = browserEvents.consoleErrors.filter(
    (message) => !dispositionedConsoleErrors.includes(message)
  );
  assert(browserEvents.pageErrors.length === 0,
    `R1_PAGE_ERRORS:${browserEvents.pageErrors.join('|')}`);
  assert(browserEvents.requestFailures.length === 0,
    `R1_REQUEST_FAILURES:${JSON.stringify(browserEvents.requestFailures)}`);
  assert(undispositionedConsoleErrors.length === 0,
    `R1_CONSOLE_ERRORS:${undispositionedConsoleErrors.join('|')}`);

  writeJson('h-earth.run8e-r1.architecture-probes.json', architecture);
  writeJson('h-earth.run8e-r1.samsung-emulation-profile.json', emulation);
  writeJson('h-earth.run8e-r1.ci-webgl2-capability.json', {
    classification: ciWebGL2Classification,
    capability: ciWebGL2Capability,
    dispositionedConsoleErrors,
    ciPerformanceAuthority: false,
    physicalSamsungExecutionRequired: true
  });

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
    ciWebGL2Classification,
    ciWebGL2ContextCreated: ciWebGL2Capability.contextCreated,
    ciWebGL2PerformanceAuthority: false,
    physicalSamsungExecution: false,
    samsungEmulationSupportingEvidence: true,
    run8ER1PassClosed: false,
    browserEvents
  };
  writeJson('h-earth.run8e-r1.repository-package.summary.json', summary);
  console.log(JSON.stringify(summary, null, 2));
} catch (error) {
  const failure = {
    status: 'RUN_8E_R1_REPOSITORY_PROFILING_PACKAGE_FAIL',
    errorName: error instanceof Error ? error.name : 'UnknownError',
    errorMessage: error instanceof Error ? error.message : String(error),
    errorStack: error instanceof Error ? error.stack : null,
    ciWebGL2Classification,
    ciWebGL2Capability,
    architecture,
    emulation,
    browserEvents,
    chromiumArgs
  };
  writeJson('h-earth.run8e-r1.harness-failure.json', failure);
  if (page) {
    try {
      await page.screenshot({
        path: path.join(outputDirectory, 'h-earth.run8e-r1.failure.png'),
        fullPage: true,
        timeout: 30000
      });
    } catch {
      // The JSON failure receipt remains controlling if screenshot capture fails.
    }
  }
  console.error(JSON.stringify(failure, null, 2));
  throw error;
} finally {
  if (browser) await browser.close();
}
