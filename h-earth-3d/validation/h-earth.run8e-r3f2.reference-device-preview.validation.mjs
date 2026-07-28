import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { chromium } from 'playwright';
import { evaluateHEarthRun8ER3Control } from '../control-plane/run-8/recovery/h-earth.run8e-r3.live-gpu-presentation-recovery.js';
import { evaluateHEarthRun8ER3F2Control } from '../control-plane/run-8/recovery/h-earth.run8e-r3f2.reference-device-immutable-preview-and-physical-execution.js';
import { loadHEarthRepositoryRegistryValidatorDependencies } from '../registry/h-earth.repository-registry.validator-engine.loader.js';
import { H_EARTH_RUN_8E_R3F2_NODE, H_EARTH_RUN_8E_R3F2_PATHS } from '../registry/accepted-amendments/h-earth.repository-registry.run8e-r3f2-reference-device-preview.js';

const outputDirectory = process.env.H_EARTH_RUN8E_R3F2_OUTPUT ?? '/tmp/h-earth-run8e-r3f2';
const previewHead = process.env.H_EARTH_RUN8E_R3F2_PREVIEW_HEAD ?? process.env.GITHUB_SHA;
const repository = 'smansfield635-create/smansfield635-create.github.io';
const sourceHead = '548672ae99cd406805f0c8ca576cc650baf7ed18';
const publicHtmlGitBlob = '0daedf61f7e19af095f4db5fc47563a9cd786837';
const publicOrchestratorGitBlob = '2b0a916b3a6d11da84316925f8abd8a3a1447445';
const launcherPath = 'h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3f2.reference-device-evidence-launcher.html';
const launcherScriptPath = 'h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3f2.reference-device-evidence-launcher.js';
const routePath = 'showroom/globe/h-earth/index.html';
const hostCandidates = ['rawcdn.githack.com', 'cdn.statically.io', 'raw.githack.com', 'cdn.jsdelivr.net'];

fs.mkdirSync(outputDirectory, { recursive: true });
const assert = (condition, code) => { if (!condition) throw new Error(code); };
const writeJson = (filename, value) => fs.writeFileSync(path.join(outputDirectory, filename), `${JSON.stringify(value, null, 2)}\n`);
const sha256 = (value) => `sha256:${crypto.createHash('sha256').update(value).digest('hex')}`;
const hostedUrl = (host, revision, repositoryPath) => {
  if (host === 'cdn.statically.io') return `https://${host}/gh/${repository}/${revision}/${repositoryPath}`;
  if (host === 'cdn.jsdelivr.net') return `https://${host}/gh/${repository}@${revision}/${repositoryPath}`;
  return `https://${host}/${repository}/${revision}/${repositoryPath}`;
};

assert(/^[0-9a-f]{40}$/.test(previewHead ?? ''), 'R3F2_PREVIEW_HEAD_INVALID');
const parent = evaluateHEarthRun8ER3Control();
const child = evaluateHEarthRun8ER3F2Control();
assert(parent.eligible === true && parent.status === 'RUN_8E_R3F2_PARENT_PREVIEW_CONSTRUCTION_ELIGIBLE', `R3F2_PARENT_REJECTED:${parent.issues.join(',')}`);
assert(child.eligible === true && child.status === 'RUN_8E_R3F2_PREVIEW_CONSTRUCTION_ELIGIBLE', `R3F2_CHILD_REJECTED:${child.issues.join(',')}`);

const predecessorPath = 'h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3f1.pass-closed.receipt.json';
const failurePaths = [
  'h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3f2.attempt-001.failure.receipt.json',
  'h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3f2.attempt-002.failure.receipt.json'
];
assert(fs.existsSync(predecessorPath), 'R3F2_R3F1_RECEIPT_MISSING');
const predecessor = JSON.parse(fs.readFileSync(predecessorPath, 'utf8'));
assert(predecessor?.eligible === true && predecessor?.status === 'RUN_8E_R3F1_PASS_CLOSED', 'R3F2_R3F1_RECEIPT_INVALID');
assert(predecessor?.receiptPath === '/h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3f1.pass-closed.receipt.json', 'R3F2_R3F1_RECEIPT_PATH_INVALID');
const failedAttempts = failurePaths.map((receiptPath, index) => {
  assert(fs.existsSync(receiptPath), `R3F2_ATTEMPT_00${index + 1}_FAILURE_RECEIPT_MISSING`);
  const receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
  assert(receipt?.eligible === true && receipt?.publicSourceDefectEstablished === false, `R3F2_ATTEMPT_00${index + 1}_FAILURE_RECEIPT_INVALID`);
  return receipt;
});
assert(failedAttempts[0].failureClass === 'HOSTED_LAUNCHER_NOT_RENDERED_AS_DOCUMENT', 'R3F2_ATTEMPT_001_FAILURE_CLASS_INVALID');
assert(failedAttempts[1].failureClass === 'HOSTED_LAUNCHER_DOM_NOT_OBSERVED_AFTER_TEXT_HTML_RESPONSE', 'R3F2_ATTEMPT_002_FAILURE_CLASS_INVALID');

const launcherHtml = fs.readFileSync(launcherPath, 'utf8');
const launcherScript = fs.readFileSync(launcherScriptPath, 'utf8');
for (const required of [sourceHead, publicHtmlGitBlob, publicOrchestratorGitBlob, '600000', 'PHYSICAL_LOCAL', 'IMMUTABLE_HOSTED_PREVIEW', 'cdn.statically.io', 'cdn.jsdelivr.net']) {
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

async function fetchWithRetry(url, attempts = 8) {
  let lastStatus = null;
  let lastError = null;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, { redirect: 'follow', cache: 'no-store' });
      lastStatus = response.status;
      if (response.ok) return { response, attempt };
    } catch (error) {
      lastError = error?.message ?? String(error);
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
  throw new Error(`HOSTED_URL_UNAVAILABLE:${lastStatus}:${lastError}`);
}

const browser = await chromium.launch({ headless: true });
const qualificationAttempts = [];
let selected = null;
for (const host of hostCandidates) {
  const launcherUrl = hostedUrl(host, previewHead, launcherPath);
  const routeUrl = hostedUrl(host, sourceHead, routePath);
  const attempt = { host, launcherUrl, routeUrl, passed: false };
  let page;
  try {
    const launcherFetch = await fetchWithRetry(launcherUrl);
    const routeFetch = await fetchWithRetry(routeUrl);
    attempt.launcherHttpStatus = launcherFetch.response.status;
    attempt.routeHttpStatus = routeFetch.response.status;
    attempt.launcherContentType = launcherFetch.response.headers.get('content-type') ?? '';
    attempt.routeContentType = routeFetch.response.headers.get('content-type') ?? '';
    const hostedLauncherHtml = await launcherFetch.response.text();
    const hostedRouteHtml = await routeFetch.response.text();
    attempt.launcherBytesMatched = hostedLauncherHtml.includes('H-Earth Run 8E');
    attempt.routeBytesMatched = hostedRouteHtml.includes('h-earth-functional-landscape-route');
    if (!attempt.launcherBytesMatched || !attempt.routeBytesMatched) throw new Error('HOSTED_BYTES_IDENTITY_NOT_OBSERVED');

    const context = await browser.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    page = await context.newPage();
    const response = await page.goto(launcherUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    attempt.browserLauncherHttpStatus = response?.status() ?? null;
    await page.locator('#deviceModel').waitFor({ state: 'visible', timeout: 15000 });
    attempt.launcherDomReady = true;
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
    Object.assign(attempt, hostedValidation);
    if (hostedValidation.routeApiReady !== true || hostedValidation.iframeSameOriginAccess !== true || hostedValidation.launcherInstrumentationReady !== true || hostedValidation.activeWebGL2ContextCount !== 1) {
      throw new Error('HOSTED_RUNTIME_QUALIFICATION_FAILED');
    }
    attempt.passed = true;
    await page.screenshot({ path: path.join(outputDirectory, 'h-earth.run8e-r3f2.hosted-launcher.png'), fullPage: true });
    selected = { host, launcherUrl, routeUrl, attempt };
    await context.close();
    qualificationAttempts.push(attempt);
    break;
  } catch (error) {
    attempt.error = error?.message ?? String(error);
    qualificationAttempts.push(attempt);
    if (page) await page.context().close().catch(() => {});
  }
}
await browser.close();
assert(selected !== null, `R3F2_NO_HOST_CANDIDATE_PASSED:${qualificationAttempts.map((entry) => `${entry.host}:${entry.error}`).join('|')}`);

const descriptor = `${selected.host}|${previewHead}|${sourceHead}|${publicHtmlGitBlob}|${publicOrchestratorGitBlob}`;
const descriptorDigest = sha256(descriptor);
const previewManifest = {
  manifestId: 'H_EARTH_RUN_8E_R3F2_IMMUTABLE_HOSTED_PREVIEW_MANIFEST_v1',
  transportClass: 'IMMUTABLE_HOSTED_PREVIEW',
  hostQualificationClass: 'BOUNDED_COMMIT_PINNED_HTML_EXECUTION_HOST_SET',
  hostCandidates,
  selectedHost: selected.host,
  previewPackageHead: previewHead,
  launcherUrl: selected.launcherUrl,
  routeUrl: selected.routeUrl,
  sourceHead,
  publicHtmlGitBlob,
  publicOrchestratorGitBlob,
  packageDescriptor: descriptor,
  packageDescriptorSha256: descriptorDigest,
  qualificationAttempts,
  failedAttemptCount: 2,
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
  predecessor: { path: `/${predecessorPath}`, status: predecessor.status, eligible: predecessor.eligible, expectedGitBlob: 'd8b5f3b4626014af6b62362d1bac26e120f50e60' },
  failedAttemptCustody: failedAttempts.map((receipt, index) => ({ path: `/${failurePaths[index]}`, attemptId: receipt.attemptId, head: receipt.head, workflowRun: receipt.workflowRun, workflowJob: receipt.workflowJob, artifactId: receipt.artifactId, artifactDigest: receipt.artifactDigest, failureClass: receipt.failureClass, publicSourceDefectEstablished: false })),
  previewManifest,
  hostedValidation: selected.attempt,
  registryAudit: { identityVerified: registry.identityVerified, nodeId: registeredNode.nodeId, lifecycleStatus: registeredNode.lifecycleStatus, registeredPathCount: H_EARTH_RUN_8E_R3F2_PATHS.length, allPathsResolved: true, loaderReadOnly: registry.boundary.readOnly },
  evidenceClass: 'SUPPLEMENTAL_HOSTED_BROWSER_VALIDATION_NOT_PHYSICAL_ACCEPTANCE',
  boundaries: { showroomSourceMutated: false, publicRouteMutated: false, publicRuntimeMutated: false, physicalReferenceDeviceExecuted: false, physicalReferenceDeviceAccepted: false, broaderMobileExecuted: false, productionDeployed: false, promoted: false, mainMerged: false, run8EPassClosed: false },
  nextState: 'RUN_8E_R3F2_PHYSICAL_EXECUTION_PENDING',
  stoppingBoundary: 'STOP_BEFORE_REFERENCE_DEVICE_PHYSICAL_EXECUTION_R3F2',
  issues: []
};
writeJson('h-earth.run8e-r3f2.host-qualification.attempts.json', qualificationAttempts);
writeJson('h-earth.run8e-r3f2.immutable-hosted-preview.manifest.json', previewManifest);
writeJson('h-earth.run8e-r3f2.immutable-hosted-preview.execution.receipt.json', executionReceipt);
console.log(JSON.stringify({ status: executionReceipt.status, previewPackageHead: previewHead, selectedHost: selected.host, launcherUrl: selected.launcherUrl, routeUrl: selected.routeUrl, packageDescriptorSha256: descriptorDigest, hostedValidation: selected.attempt, registeredPathCount: executionReceipt.registryAudit.registeredPathCount, boundaries: executionReceipt.boundaries, stoppingBoundary: executionReceipt.stoppingBoundary }, null, 2));
