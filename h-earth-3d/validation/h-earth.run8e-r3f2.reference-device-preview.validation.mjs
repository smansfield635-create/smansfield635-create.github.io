import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { chromium } from 'playwright';
import { evaluateHEarthRun8ER3Control } from '../control-plane/run-8/recovery/h-earth.run8e-r3.live-gpu-presentation-recovery.js';
import {
  H_EARTH_RUN_8E_R3F2_CONTROL,
  evaluateHEarthRun8ER3F2Control
} from '../control-plane/run-8/recovery/h-earth.run8e-r3f2.reference-device-immutable-preview-and-physical-execution.js';
import { loadHEarthRepositoryRegistryValidatorDependencies } from '../registry/h-earth.repository-registry.validator-engine.loader.js';
import {
  H_EARTH_RUN_8E_R3F2_NODE,
  H_EARTH_RUN_8E_R3F2_PATHS
} from '../registry/accepted-amendments/h-earth.repository-registry.run8e-r3f2-reference-device-preview.js';

const outputDirectory = process.env.H_EARTH_RUN8E_R3F2_OUTPUT ?? '/tmp/h-earth-run8e-r3f2';
const previewHead = process.env.H_EARTH_RUN8E_R3F2_PREVIEW_HEAD ?? process.env.GITHUB_SHA;
const repository = 'smansfield635-create/smansfield635-create.github.io';
const sourceHead = '548672ae99cd406805f0c8ca576cc650baf7ed18';
const publicHtmlGitBlob = '0daedf61f7e19af095f4db5fc47563a9cd786837';
const publicOrchestratorGitBlob = '2b0a916b3a6d11da84316925f8abd8a3a1447445';
const launcherPath = 'h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3f2.reference-device-evidence-launcher.html';
const launcherScriptPath = 'h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3f2.reference-device-evidence-launcher.js';
const routeUrl = `https://cdn.jsdelivr.net/gh/${repository}@${sourceHead}/showroom/globe/h-earth/index.html`;
const launcherUrl = `https://cdn.jsdelivr.net/gh/${repository}@${previewHead}/${launcherPath}`;

fs.mkdirSync(outputDirectory, { recursive: true });
const assert = (condition, code) => { if (!condition) throw new Error(code); };
const writeJson = (filename, value) => fs.writeFileSync(path.join(outputDirectory, filename), `${JSON.stringify(value, null, 2)}\n`);
const sha256 = (value) => `sha256:${crypto.createHash('sha256').update(value).digest('hex')}`;
const descriptor = `${previewHead}|${sourceHead}|${publicHtmlGitBlob}|${publicOrchestratorGitBlob}`;
const descriptorDigest = sha256(descriptor);

assert(/^[0-9a-f]{40}$/.test(previewHead ?? ''), 'R3F2_PREVIEW_HEAD_INVALID');
const parent = evaluateHEarthRun8ER3Control();
const child = evaluateHEarthRun8ER3F2Control();
assert(parent.eligible === true && parent.status === 'RUN_8E_R3F2_PARENT_PREVIEW_CONSTRUCTION_ELIGIBLE', `R3F2_PARENT_REJECTED:${parent.issues.join(',')}`);
assert(child.eligible === true && child.status === 'RUN_8E_R3F2_PREVIEW_CONSTRUCTION_ELIGIBLE', `R3F2_CHILD_REJECTED:${child.issues.join(',')}`);

const predecessorPath = 'h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3f1.pass-closed.receipt.json';
assert(fs.existsSync(predecessorPath), 'R3F2_R3F1_RECEIPT_MISSING');
const predecessor = JSON.parse(fs.readFileSync(predecessorPath, 'utf8'));
assert(predecessor?.eligible === true && predecessor?.status === 'RUN_8E_R3F1_PASS_CLOSED', 'R3F2_R3F1_RECEIPT_INVALID');
assert(predecessor?.receiptPath === '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3f1.pass-closed.receipt.json', 'R3F2_R3F1_RECEIPT_PATH_INVALID');

const launcherHtml = fs.readFileSync(launcherPath, 'utf8');
const launcherScript = fs.readFileSync(launcherScriptPath, 'utf8');
for (const required of [sourceHead, publicHtmlGitBlob, publicOrchestratorGitBlob, '600000', 'PHYSICAL_LOCAL', 'IMMUTABLE_HOSTED_PREVIEW']) {
  assert(launcherScript.includes(required), `R3F2_LAUNCHER_REQUIREMENT_MISSING:${required}`);
}
assert(launcherHtml.includes('h-earth.run8e-r3f2.reference-device-evidence-launcher.js'), 'R3F2_LAUNCHER_SCRIPT_LINK_MISSING');
assert(!launcherHtml.includes('/showroom/globe/h-earth/index.html'), 'R3F2_LAUNCHER_HTML_EMBEDS_MUTABLE_ROUTE');

const registry = loadHEarthRepositoryRegistryValidatorDependencies();
assert(registry.identityVerified === true, 'R3F2_REGISTRY_LOADER_IDENTITY_FAILED');
const registeredNode = registry.registryFacade.getHEarthRepositoryRegistryNode(H_EARTH_RUN_8E_R3F2_NODE.nodeId);
assert(registeredNode?.nodeId === H_EARTH_RUN_8E_R3F2_NODE.nodeId, 'R3F2_REGISTRY_NODE_MISSING');
assert(registeredNode.lifecycleStatus === H_EARTH_RUN_8E_R3F2_NODE.lifecycleStatus, 'R3F2_REGISTRY_NODE_STATE_MISMATCH');
for (const repositoryPath of H_EARTH_RUN_8E_R3F2_PATHS) {
  const resolution = registry.registryFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);
  assert(resolution?.resolved === true, `R3F2_REGISTRY_PATH_UNRESOLVED:${repositoryPath}`);
}

async function fetchWithRetry(url, attempts = 24) {
  let lastStatus = null;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, { redirect: 'follow', cache: 'no-store' });
      lastStatus = response.status;
      if (response.ok) return { response, attempt };
    } catch { }
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
  throw new Error(`R3F2_HOSTED_URL_UNAVAILABLE:${url}:${lastStatus}`);
}

const launcherFetch = await fetchWithRetry(launcherUrl);
const routeFetch = await fetchWithRetry(routeUrl);
assert(launcherFetch.response.status === 200, 'R3F2_LAUNCHER_HTTP_NOT_200');
assert(routeFetch.response.status === 200, 'R3F2_ROUTE_HTTP_NOT_200');
const hostedLauncherHtml = await launcherFetch.response.text();
const hostedRouteHtml = await routeFetch.response.text();
assert(hostedLauncherHtml.includes('H-Earth Run 8E'), 'R3F2_HOSTED_LAUNCHER_CONTENT_INVALID');
assert(hostedRouteHtml.includes('h-earth-functional-landscape-route'), 'R3F2_HOSTED_ROUTE_CONTENT_INVALID');

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const page = await context.newPage();
const launcherResponse = await page.goto(launcherUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
assert(launcherResponse?.status() === 200, 'R3F2_BROWSER_LAUNCHER_HTTP_NOT_200');
await page.fill('#deviceModel', 'CI_SUPPLEMENTAL_ANDROID_EMULATION');
await page.fill('#attestation', 'Supplemental hosted-preview validation only; not physical acceptance.');
await page.click('#startButton');
await page.waitForFunction(() => document.getElementById('routeFrame')?.contentWindow?.H_EARTH_RUN8E_PUBLIC_ROUTE?.ready === true, null, { timeout: 60000 });
const hostedValidation = await page.evaluate(() => {
  const frame = document.getElementById('routeFrame');
  const api = frame?.contentWindow?.H_EARTH_RUN8E_PUBLIC_ROUTE;
  const receipt = api?.getSnapshot?.();
  const canvas = frame?.contentDocument?.getElementById('h-earth-functional-landscape-canvas');
  return {
    routeApiReady: api?.ready === true,
    iframeSameOriginAccess: Boolean(frame?.contentDocument && api),
    launcherInstrumentationReady: canvas instanceof HTMLCanvasElement && Boolean(receipt?.intake && receipt?.liveGpu),
    routeIntegrationId: api?.integrationId ?? null,
    initialAcceptedProposalCount: receipt?.intake?.counters?.acceptedNavigationProposalCount ?? null,
    initialVisibleFrameCount: receipt?.liveGpu?.counters?.gpuFramebufferPresentationCount ?? null,
    activeWebGL2ContextCount: receipt?.runtimeExclusivity?.activeWebGL2ContextCount ?? null,
    publicRouteSource: frame?.src ?? null
  };
});
assert(hostedValidation.routeApiReady === true, 'R3F2_ROUTE_API_NOT_READY');
assert(hostedValidation.iframeSameOriginAccess === true, 'R3F2_IFRAME_NOT_SAME_ORIGIN');
assert(hostedValidation.launcherInstrumentationReady === true, 'R3F2_LAUNCHER_INSTRUMENTATION_NOT_READY');
assert(hostedValidation.activeWebGL2ContextCount === 1, 'R3F2_WEBGL2_CONTEXT_COUNT_INVALID');
await page.screenshot({ path: path.join(outputDirectory, 'h-earth.run8e-r3f2.hosted-launcher.png'), fullPage: true });
await browser.close();

const previewManifest = {
  manifestId: 'H_EARTH_RUN_8E_R3F2_IMMUTABLE_HOSTED_PREVIEW_MANIFEST_v1',
  transportClass: 'IMMUTABLE_HOSTED_PREVIEW',
  previewPackageHead: previewHead,
  launcherUrl,
  routeUrl,
  sourceHead,
  publicHtmlGitBlob,
  publicOrchestratorGitBlob,
  packageDescriptor: descriptor,
  packageDescriptorSha256: descriptorDigest,
  launcherHttpStatus: launcherFetch.response.status,
  routeHttpStatus: routeFetch.response.status,
  launcherFetchAttempt: launcherFetch.attempt,
  routeFetchAttempt: routeFetch.attempt,
  productionDeployment: false,
  physicalReferenceDeviceExecution: false,
  broaderMobileExecution: false
};
const executionReceipt = {
  receiptType: 'H_EARTH_RUN_8E_R3F2_IMMUTABLE_HOSTED_PREVIEW_VALIDATION_RECEIPT',
  eligible: true,
  status: 'RUN_8E_R3F2_PREVIEW_VALIDATION_PASS',
  parentControl: parent,
  childControl: child,
  predecessor: {
    path: `/${predecessorPath}`,
    status: predecessor.status,
    eligible: predecessor.eligible,
    expectedGitBlob: 'd8b5f3b4626014af6b62362d1bac26e120f50e60'
  },
  previewManifest,
  hostedValidation,
  registryAudit: {
    identityVerified: registry.identityVerified,
    nodeId: registeredNode.nodeId,
    lifecycleStatus: registeredNode.lifecycleStatus,
    registeredPathCount: H_EARTH_RUN_8E_R3F2_PATHS.length,
    allPathsResolved: true,
    loaderReadOnly: registry.boundary.readOnly
  },
  evidenceClass: 'SUPPLEMENTAL_HOSTED_BROWSER_VALIDATION_NOT_PHYSICAL_ACCEPTANCE',
  boundaries: {
    showroomSourceMutated: false,
    publicRouteMutated: false,
    publicRuntimeMutated: false,
    physicalReferenceDeviceExecuted: false,
    physicalReferenceDeviceAccepted: false,
    broaderMobileExecuted: false,
    productionDeployed: false,
    promoted: false,
    mainMerged: false,
    run8EPassClosed: false
  },
  nextState: 'RUN_8E_R3F2_PHYSICAL_EXECUTION_PENDING',
  stoppingBoundary: 'STOP_BEFORE_REFERENCE_DEVICE_PHYSICAL_EXECUTION_R3F2',
  issues: []
};
writeJson('h-earth.run8e-r3f2.immutable-hosted-preview.manifest.json', previewManifest);
writeJson('h-earth.run8e-r3f2.immutable-hosted-preview.execution.receipt.json', executionReceipt);
console.log(JSON.stringify({
  status: executionReceipt.status,
  previewPackageHead: previewHead,
  launcherUrl,
  routeUrl,
  packageDescriptorSha256: descriptorDigest,
  hostedValidation,
  registeredPathCount: executionReceipt.registryAudit.registeredPathCount,
  boundaries: executionReceipt.boundaries,
  stoppingBoundary: executionReceipt.stoppingBoundary
}, null, 2));
