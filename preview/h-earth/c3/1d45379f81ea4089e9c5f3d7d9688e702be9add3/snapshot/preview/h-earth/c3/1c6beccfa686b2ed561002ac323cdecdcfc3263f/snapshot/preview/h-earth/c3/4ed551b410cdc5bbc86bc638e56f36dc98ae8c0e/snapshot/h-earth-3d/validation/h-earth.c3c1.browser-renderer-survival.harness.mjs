import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { getHEarthOW01CanonicalLiveRenderPackageOccurrence } from '../../showroom/globe/h-earth/render/live-render-package.run8e-r2.canonical.js';

const origin = process.env.CP3D_ORIGIN ?? 'http://127.0.0.1:4173';
const route = `${origin}/showroom/globe/h-earth/`;
const moduleUrl = `${origin}/showroom/globe/h-earth/render/live-render-package.run8e-r2.canonical.js`;
const evidenceDirectory = process.env.CP3D_EVIDENCE_DIR ?? 'h-earth-3d/validation/evidence/cp3d';
const occurrenceId = 'H_EARTH_OW01_GRATITUDE_COASTAL_ENTRY_LIVE_RENDER_PACKAGE_OCCURRENCE_001';
const identityPrefix = 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_';
await mkdir(evidenceDirectory, { recursive: true });

const nodePackage = getHEarthOW01CanonicalLiveRenderPackageOccurrence();
assert.equal(nodePackage?.eligible, true, `C3C1_NODE_PACKAGE_REJECTED:${nodePackage?.issues?.join('|') ?? 'UNKNOWN'}`);
assert.equal(nodePackage?.packageOccurrenceId, occurrenceId, 'C3C1_NODE_OCCURRENCE_MISMATCH');
assert.equal(nodePackage?.packageIdentity?.startsWith(identityPrefix), true, 'C3C1_NODE_IDENTITY_CLASS_MISMATCH');

const browser = await chromium.launch({ headless: true, args: ['--enable-webgl','--ignore-gpu-blocklist','--use-gl=swiftshader','--disable-dev-shm-usage'] });
const page = await browser.newPage({ viewport: { width: 694, height: 747 }, deviceScaleFactor: 1.5, isMobile: true, hasTouch: true });
const consoleMessages = [];
const pageErrors = [];
page.on('console', (m) => consoleMessages.push({type:m.type(),text:m.text()}));
page.on('pageerror', (e) => pageErrors.push({name:e.name,message:e.message}));

try {
  await page.goto(origin, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  const browserPackage = await page.evaluate(async ({url}) => {
    const module = await import(`${url}?c3c1=${Date.now()}`);
    const p = module.getHEarthOW01CanonicalLiveRenderPackageOccurrence();
    return { eligible:p?.eligible === true, occurrence:p?.packageOccurrenceId ?? null, identity:p?.packageIdentity ?? null, digest:p?.contentDigest ?? null, primitiveCount:p?.primitiveCount ?? null, vertexCount:p?.vertexCount ?? null, indexCount:p?.indexCount ?? null };
  }, {url:moduleUrl});
  assert.equal(browserPackage.eligible, true, 'C3C1_BROWSER_PACKAGE_REJECTED');
  assert.equal(browserPackage.occurrence, occurrenceId, 'C3C1_BROWSER_OCCURRENCE_MISMATCH');
  assert.equal(browserPackage.identity, nodePackage.packageIdentity, 'C3C1_CROSS_RUNTIME_IDENTITY_MISMATCH');
  assert.equal(browserPackage.digest, nodePackage.contentDigest, 'C3C1_CROSS_RUNTIME_DIGEST_MISMATCH');

  const response = await page.goto(route, { waitUntil:'domcontentloaded', timeout:60_000 });
  assert.ok(response && response.status() >= 200 && response.status() < 400, `C3C1_ROUTE_HTTP:${response?.status()}`);
  const readiness = await Promise.race([
    page.waitForFunction(() => globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE?.ready === true, null, {timeout:90_000}).then(() => 'READY'),
    page.waitForFunction(() => globalThis.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.getReceipt?.()?.firstFailureStage, null, {timeout:90_000}).then(() => 'FAILED')
  ]);
  if (readiness === 'FAILED') {
    const failure = await page.evaluate(() => globalThis.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.getReceipt?.() ?? null);
    throw new Error(`C3C1_RENDERER_STARTUP_FAILURE:${failure?.firstFailureStage ?? 'UNKNOWN'}:${failure?.exception?.message ?? failure?.failureClass ?? 'UNKNOWN'}`);
  }
  await page.waitForFunction(() => Number(globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE?.getSnapshot?.()?.liveGpu?.counters?.gpuFramebufferPresentationCount ?? 0) >= 1, null, {timeout:90_000});

  const initial = await page.evaluate(() => {
    const r = globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE.getSnapshot();
    const c = document.getElementById('h-earth-functional-landscape-canvas');
    return { eligible:r?.eligible === true, status:r?.status, presentations:Number(r?.liveGpu?.counters?.gpuFramebufferPresentationCount ?? 0), initialized:r?.liveGpu?.resources?.initialized === true, contextCount:r?.runtimeExclusivity?.activeWebGL2ContextCount, rendererCount:r?.runtimeExclusivity?.activePersistentRendererCount, canvas: c instanceof HTMLCanvasElement ? {width:c.width,height:c.height,clientWidth:c.clientWidth,clientHeight:c.clientHeight} : null };
  });
  assert.equal(initial.eligible, true, 'C3C1_PUBLIC_RUNTIME_NOT_ELIGIBLE');
  assert.equal(initial.initialized, true, 'C3C1_RENDERER_NOT_INITIALIZED');
  assert.ok(initial.presentations >= 1, 'C3C1_FIRST_FRAME_NOT_PRESENTED');
  assert.equal(initial.contextCount, 1, 'C3C1_WEBGL_CONTEXT_COUNT_INVALID');
  assert.equal(initial.rendererCount, 1, 'C3C1_RENDERER_COUNT_INVALID');
  assert.ok(initial.canvas?.width > 0 && initial.canvas?.height > 0, 'C3C1_CANVAS_INVALID');

  const interaction = await page.evaluate(async () => {
    const api = globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE;
    const canvas = document.getElementById('h-earth-functional-landscape-canvas');
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const count = () => Number(api.getSnapshot()?.liveGpu?.counters?.gpuFramebufferPresentationCount ?? 0);
    const b = canvas.getBoundingClientRect();
    const x = b.left + b.width * 0.5;
    const y0 = b.top + b.height * 0.7;
    const y1 = b.top + b.height * 0.48;
    const emit = (type,y,buttons) => canvas.dispatchEvent(new PointerEvent(type,{bubbles:true,cancelable:true,pointerId:501,pointerType:'touch',isPrimary:true,clientX:x,clientY:y,buttons,pressure:buttons?0.5:0}));
    const before = count();
    emit('pointerdown',y0,1); emit('pointermove',y1,1); await sleep(700);
    const active = count();
    emit('pointerup',y1,0); await sleep(180); const settled = count(); await sleep(350); const after = count();
    return {before,active,settled,after};
  });
  assert.ok(interaction.active > interaction.before, 'C3C1_TOUCH_DID_NOT_PRESENT_NEW_FRAME');
  assert.equal(interaction.after, interaction.settled, 'C3C1_MOTION_CONTINUED_AFTER_RELEASE');

  await page.screenshot({path:`${evidenceDirectory}/c3c1-browser-renderer-survival.png`,fullPage:true});
  const receipt = { receiptType:'H_EARTH_C3C1_BROWSER_RENDERER_SURVIVAL_v1', eligible:true, status:'C3C1_BROWSER_RENDERER_SURVIVAL_PASS', route, packageOccurrenceId:occurrenceId, packageIdentity:nodePackage.packageIdentity, contentDigest:nodePackage.contentDigest, browserPackage, initial, interaction, consoleErrors:consoleMessages.filter((m)=>m.type==='error'), pageErrors, productMergeAuthorized:false, directUserInspectionStillRequired:true };
  await writeFile(`${evidenceDirectory}/c3c1-browser-renderer-survival.receipt.json`, `${JSON.stringify(receipt,null,2)}\n`);
  console.log(JSON.stringify(receipt,null,2));
} finally { await browser.close(); }
