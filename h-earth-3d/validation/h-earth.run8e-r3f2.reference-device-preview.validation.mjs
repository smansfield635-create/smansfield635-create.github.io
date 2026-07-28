import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { buildHEarthRun8ER3F2SignedOfflinePackage } from './h-earth.run8e-r3f2.signed-offline-package.builder.mjs';
import { evaluateHEarthRun8ER3Control } from '../control-plane/run-8/recovery/h-earth.run8e-r3.live-gpu-presentation-recovery.js';
import { evaluateHEarthRun8ER3F2Control } from '../control-plane/run-8/recovery/h-earth.run8e-r3f2.reference-device-immutable-preview-and-physical-execution.js';
import { loadHEarthRepositoryRegistryValidatorDependencies } from '../registry/h-earth.repository-registry.validator-engine.loader.js';
import { H_EARTH_RUN_8E_R3F2_NODE, H_EARTH_RUN_8E_R3F2_PATHS } from '../registry/accepted-amendments/h-earth.repository-registry.run8e-r3f2-reference-device-preview.js';

const outputDirectory = process.env.H_EARTH_RUN8E_R3F2_OUTPUT ?? '/tmp/h-earth-run8e-r3f2';
const previewHead = process.env.H_EARTH_RUN8E_R3F2_PREVIEW_HEAD ?? process.env.GITHUB_SHA;
fs.mkdirSync(outputDirectory, { recursive: true });
const assert = (condition, code) => { if (!condition) throw new Error(code); };
const writeJson = (filename, value) => fs.writeFileSync(path.join(outputDirectory, filename), `${JSON.stringify(value, null, 2)}\n`);
const sha256 = (value) => `sha256:${crypto.createHash('sha256').update(value).digest('hex')}`;

assert(/^[0-9a-f]{40}$/.test(previewHead ?? ''), 'R3F2_PREVIEW_HEAD_INVALID');
const parent = evaluateHEarthRun8ER3Control();
const child = evaluateHEarthRun8ER3F2Control();
assert(parent.eligible === true && parent.status === 'RUN_8E_R3F2_PARENT_PREVIEW_CONSTRUCTION_ELIGIBLE', `R3F2_PARENT_REJECTED:${parent.issues.join(',')}`);
assert(child.eligible === true && child.status === 'RUN_8E_R3F2_PREVIEW_CONSTRUCTION_ELIGIBLE', `R3F2_CHILD_REJECTED:${child.issues.join(',')}`);

const predecessorPath = 'h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3f1.pass-closed.receipt.json';
const failurePaths = [1, 2, 3, 4].map((number) => `h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3f2.attempt-00${number}.failure.receipt.json`);
const predecessor = JSON.parse(fs.readFileSync(predecessorPath, 'utf8'));
assert(predecessor?.eligible === true && predecessor?.status === 'RUN_8E_R3F1_PASS_CLOSED', 'R3F2_R3F1_RECEIPT_INVALID');
const failedAttempts = failurePaths.map((receiptPath, index) => {
  assert(fs.existsSync(receiptPath), `R3F2_ATTEMPT_00${index + 1}_FAILURE_RECEIPT_MISSING`);
  const receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
  assert(receipt?.eligible === true && receipt?.publicSourceDefectEstablished === false, `R3F2_ATTEMPT_00${index + 1}_FAILURE_RECEIPT_INVALID`);
  return receipt;
});
assert(failedAttempts[2].authorizedCorrection === 'CONSTRUCT_SIGNED_SELF_CONTAINED_OFFLINE_PACKAGE_AND_VALIDATE_BY_LOOPBACK', 'R3F2_OFFLINE_PACKAGE_NOT_AUTHORIZED');
assert(failedAttempts[3].failureClass === 'CROSS_REALM_CANVAS_INSTANCEOF_MISCLASSIFICATION', 'R3F2_ATTEMPT_004_FAILURE_CLASS_INVALID');
assert(failedAttempts[3].authorizedCorrection === 'REPLACE_PARENT_REALM_INSTANCEOF_WITH_TAG_OR_IFRAME_REALM_CANVAS_CHECK', 'R3F2_REALM_CHECK_CORRECTION_NOT_AUTHORIZED');

const registry = loadHEarthRepositoryRegistryValidatorDependencies();
assert(registry.identityVerified === true, 'R3F2_REGISTRY_LOADER_IDENTITY_FAILED');
const registeredNode = registry.registryFacade.getHEarthRepositoryRegistryNode(H_EARTH_RUN_8E_R3F2_NODE.nodeId);
assert(registeredNode?.nodeId === H_EARTH_RUN_8E_R3F2_NODE.nodeId, 'R3F2_REGISTRY_NODE_MISSING');
assert(registeredNode.lifecycleStatus === H_EARTH_RUN_8E_R3F2_NODE.lifecycleStatus, 'R3F2_REGISTRY_NODE_STATE_MISMATCH');
for (const repositoryPath of H_EARTH_RUN_8E_R3F2_PATHS) {
  const resolution = registry.registryFacade.resolveHEarthRepositoryRegistryPath(repositoryPath);
  assert(resolution?.resolved === true, `R3F2_REGISTRY_PATH_UNRESOLVED:${repositoryPath}`);
}

const built = await buildHEarthRun8ER3F2SignedOfflinePackage({ outputDirectory, packageHead: previewHead });
const manifest = built.manifest;
assert(manifest.packageClass === 'SIGNED_OFFLINE_PACKAGE', 'R3F2_PACKAGE_CLASS_INVALID');
assert(manifest.signatureClass === 'GIT_COMMIT_AND_SHA256_CONTENT_BINDING', 'R3F2_SIGNATURE_CLASS_INVALID');
assert(manifest.packageHead === previewHead, 'R3F2_PACKAGE_HEAD_MISMATCH');
assert(manifest.sourceHead === '548672ae99cd406805f0c8ca576cc650baf7ed18', 'R3F2_PACKAGE_SOURCE_HEAD_MISMATCH');
assert(manifest.publicHtmlGitBlob === '0daedf61f7e19af095f4db5fc47563a9cd786837', 'R3F2_PACKAGE_HTML_BLOB_MISMATCH');
assert(manifest.publicOrchestratorGitBlob === '2b0a916b3a6d11da84316925f8abd8a3a1447445', 'R3F2_PACKAGE_ORCHESTRATOR_BLOB_MISMATCH');
assert(manifest.packageByteCount > 100000, 'R3F2_PACKAGE_UNEXPECTEDLY_SMALL');
assert(manifest.packageSha256 === sha256(fs.readFileSync(built.packagePath)), 'R3F2_PACKAGE_DIGEST_MISMATCH');
assert(built.packageDocument.includes('H_EARTH_RUN8E_R3F2_SIGNED_OFFLINE_PACKAGE'), 'R3F2_PACKAGE_MARKER_MISSING');
assert(!built.packageDocument.includes('src="./functional-landscape/public-live-gpu-integration'), 'R3F2_EXTERNAL_MODULE_REMAINED');
assert(!built.packageDocument.includes('href="./functional-landscape/index.css'), 'R3F2_EXTERNAL_FUNCTIONAL_CSS_REMAINED');

async function inspectPackage(page, url, evidenceClass, screenshotName) {
  const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  if (url.startsWith('http:')) assert(response?.status() === 200, 'R3F2_LOOPBACK_PACKAGE_HTTP_NOT_200');
  await page.locator('#deviceModel').waitFor({ state: 'visible', timeout: 30000 });
  await page.fill('#deviceModel', `CI_${evidenceClass}`);
  await page.fill('#attestation', 'Supplemental signed-offline package validation only; not physical acceptance.');
  await page.click('#startButton');
  await page.waitForFunction(() => document.getElementById('routeFrame')?.contentWindow?.H_EARTH_RUN8E_PUBLIC_ROUTE?.ready === true, null, { timeout: 60000 });
  await page.waitForFunction(() => {
    const notice = document.getElementById('phaseNotice')?.textContent ?? '';
    return notice.startsWith('Physical session active')
      || notice.startsWith('Ten-minute minimum complete')
      || notice.startsWith('Instrumentation failed:');
  }, null, { timeout: 30000 });
  const result = await page.evaluate(() => {
    const frame = document.getElementById('routeFrame');
    const api = frame?.contentWindow?.H_EARTH_RUN8E_PUBLIC_ROUTE;
    const receipt = api?.getSnapshot?.();
    const canvas = frame?.contentDocument?.getElementById('h-earth-functional-landscape-canvas');
    return {
      routeApiReady: api?.ready === true,
      sameOriginAccess: Boolean(frame?.contentDocument && api),
      launcherInstrumentationReady: canvas?.tagName === 'CANVAS'
        && canvas?.dataset?.r3f2EvidenceInstrumented === 'true'
        && Boolean(receipt?.intake && receipt?.liveGpu),
      instrumentationMarker: canvas?.dataset?.r3f2EvidenceInstrumented === 'true',
      phaseNotice: document.getElementById('phaseNotice')?.textContent ?? null,
      routeIntegrationId: api?.integrationId ?? null,
      initialAcceptedProposalCount: receipt?.intake?.counters?.acceptedNavigationProposalCount ?? null,
      initialVisibleFrameCount: receipt?.liveGpu?.counters?.gpuFramebufferPresentationCount ?? null,
      activeWebGL2ContextCount: receipt?.runtimeExclusivity?.activeWebGL2ContextCount ?? null,
      packageClass: window.H_EARTH_R3F2_OFFLINE_PACKAGE_METADATA?.packageClass ?? null,
      packageHead: window.H_EARTH_R3F2_OFFLINE_PACKAGE_METADATA?.packageHead ?? null,
      webCryptoAvailable: Boolean(globalThis.crypto?.subtle)
    };
  });
  assert(result.routeApiReady === true, `R3F2_${evidenceClass}_ROUTE_API_NOT_READY`);
  assert(result.sameOriginAccess === true, `R3F2_${evidenceClass}_SAME_ORIGIN_ACCESS_FAILED`);
  assert(result.launcherInstrumentationReady === true, `R3F2_${evidenceClass}_INSTRUMENTATION_NOT_READY`);
  assert(result.instrumentationMarker === true, `R3F2_${evidenceClass}_INSTRUMENTATION_MARKER_MISSING`);
  assert(!result.phaseNotice?.startsWith('Instrumentation failed:'), `R3F2_${evidenceClass}_INSTRUMENTATION_FAILED:${result.phaseNotice}`);
  assert(result.phaseNotice?.startsWith('Physical session active') || result.phaseNotice?.startsWith('Ten-minute minimum complete'), `R3F2_${evidenceClass}_PHASE_NOTICE_INVALID:${result.phaseNotice}`);
  assert(result.activeWebGL2ContextCount === 1, `R3F2_${evidenceClass}_WEBGL2_CONTEXT_COUNT_INVALID`);
  assert(result.packageClass === 'SIGNED_OFFLINE_PACKAGE' && result.packageHead === previewHead, `R3F2_${evidenceClass}_PACKAGE_IDENTITY_INVALID`);
  assert(result.webCryptoAvailable === true, `R3F2_${evidenceClass}_WEB_CRYPTO_UNAVAILABLE`);
  await page.screenshot({ path: path.join(outputDirectory, screenshotName), fullPage: true });
  return result;
}

const server = http.createServer((request, response) => {
  if (request.url === '/' || request.url === `/${manifest.packageFilename}`) {
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
    response.end(built.packageDocument);
    return;
  }
  response.writeHead(404).end();
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const address = server.address();
const loopbackUrl = `http://127.0.0.1:${address.port}/${manifest.packageFilename}`;
const fileUrl = pathToFileURL(built.packagePath).href;

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const loopbackPage = await context.newPage();
const loopbackValidation = await inspectPackage(loopbackPage, loopbackUrl, 'LOOPBACK', 'h-earth.run8e-r3f2.offline-package.loopback.png');
await loopbackPage.close();
const filePage = await context.newPage();
const fileValidation = await inspectPackage(filePage, fileUrl, 'FILE_URL', 'h-earth.run8e-r3f2.offline-package.file-url.png');
await filePage.close();
await context.close();
await browser.close();
await new Promise((resolve) => server.close(resolve));

const packageManifestSha256 = sha256(fs.readFileSync(path.join(outputDirectory, 'h-earth.run8e-r3f2.signed-offline-package.manifest.json')));
const executionReceipt = {
  receiptType: 'H_EARTH_RUN_8E_R3F2_SIGNED_OFFLINE_PACKAGE_VALIDATION_RECEIPT',
  eligible: true,
  status: 'RUN_8E_R3F2_PREVIEW_VALIDATION_PASS',
  parentControl: parent,
  childControl: child,
  predecessor: { path: `/${predecessorPath}`, status: predecessor.status, eligible: predecessor.eligible, expectedGitBlob: 'd8b5f3b4626014af6b62362d1bac26e120f50e60' },
  failedAttemptCustody: failedAttempts.map((receipt, index) => ({ path: `/${failurePaths[index]}`, attemptId: receipt.attemptId, head: receipt.head, workflowRun: receipt.workflowRun, workflowJob: receipt.workflowJob, artifactId: receipt.artifactId, artifactDigest: receipt.artifactDigest, failureClass: receipt.failureClass, publicSourceDefectEstablished: false })),
  packageManifest: manifest,
  packageManifestSha256,
  validation: { loopbackUrl, fileUrl, loopbackValidation, fileValidation },
  registryAudit: { identityVerified: registry.identityVerified, nodeId: registeredNode.nodeId, lifecycleStatus: registeredNode.lifecycleStatus, registeredPathCount: H_EARTH_RUN_8E_R3F2_PATHS.length, allPathsResolved: true, loaderReadOnly: registry.boundary.readOnly },
  evidenceClass: 'SUPPLEMENTAL_SIGNED_OFFLINE_PACKAGE_BROWSER_VALIDATION_NOT_PHYSICAL_ACCEPTANCE',
  boundaries: { showroomSourceMutated: false, publicRouteMutated: false, publicRuntimeMutated: false, physicalReferenceDeviceExecuted: false, physicalReferenceDeviceAccepted: false, broaderMobileExecuted: false, productionDeployed: false, promoted: false, mainMerged: false, run8EPassClosed: false },
  nextState: 'RUN_8E_R3F2_PHYSICAL_EXECUTION_PENDING',
  stoppingBoundary: 'STOP_BEFORE_REFERENCE_DEVICE_PHYSICAL_EXECUTION_R3F2',
  issues: []
};
writeJson('h-earth.run8e-r3f2.signed-offline-package.execution.receipt.json', executionReceipt);
console.log(JSON.stringify({ status: executionReceipt.status, packageFilename: manifest.packageFilename, packageByteCount: manifest.packageByteCount, packageSha256: manifest.packageSha256, packageManifestSha256, loopbackValidation, fileValidation, registeredPathCount: executionReceipt.registryAudit.registeredPathCount, boundaries: executionReceipt.boundaries, stoppingBoundary: executionReceipt.stoppingBoundary }, null, 2));
