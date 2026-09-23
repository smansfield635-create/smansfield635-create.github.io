import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import platformAuthority from '../../control-plane/instrument-platform/H_EARTH_INSTRUMENT_PLATFORM_AUTHORITY.v1.mjs';
import proofAuthority from '../../control-plane/instrument-platform/H_EARTH_POST_MERGE_ENGINEERING_PROOF_001.v1.mjs';
import toolRegistry from '../../tools/instrument-platform/tool-registry.mjs';
import { createProjectContext } from '../../tools/instrument-platform/project-context.mjs';
import sceneRegistry from '../../tools/instrument-platform/permanent-scene-registry.mjs';
import { buildEvidenceEnvelope, verifyEvidenceEnvelope } from '../../tools/instrument-platform/evidence-envelope.mjs';
import { createCrossToolSessionLedger } from '../../tools/instrument-platform/session-ledger.mjs';
import { evaluateAuthorityTransition } from '../../tools/instrument-platform/authority-state-machine.mjs';
import { assembleBoundedCandidate } from '../../tools/instrument-platform/bounded-candidate-assembler.mjs';
import { routeChangeClass } from '../../tools/instrument-platform/change-class-router.mjs';
import { recordUserDifferential, evaluateDefaultPromotion } from '../../tools/instrument-platform/terminal-controllers.mjs';
import { buildInstrumentPlatformPacket, serializeInstrumentPlatformPacket } from '../../tools/instrument-platform/export-platform-packet.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');
const RECEIPT_PATH = path.join(HERE, 'h-earth.instrument-platform.receipt.v1.json');
const EVIDENCE_DIR = path.join(HERE, 'evidence');
const HARNESS_URL = process.env.H_EARTH_INSTRUMENT_PLATFORM_URL ?? 'http://127.0.0.1:4185/h-earth-3d/tools/instrument-platform/index.html';
const PUBLIC_VERIFY = process.env.H_EARTH_PUBLIC_VERIFY === 'true';
const PUBLIC_PLATFORM_URL = process.env.H_EARTH_PUBLIC_PLATFORM_URL ?? 'https://smansfield635-create.github.io/h-earth-3d/tools/instrument-platform/index.html';
const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const fileSha256 = (repositoryPath) => sha256(fs.readFileSync(path.join(ROOT, repositoryPath)));
const fixedClock = () => new Date('2026-07-30T20:00:00.000Z');
const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const checks = [];
const failures = [];
const check = (id, passed, detail = null) => {
  const record = { id, passed: Boolean(passed), status: passed ? 'PASS' : 'FAIL', detail };
  checks.push(record);
  if (!passed) failures.push(record);
};

const startedAt = new Date().toISOString();
const head = git('rev-parse', 'HEAD');
const changedPaths = git('diff', '--name-only', `${proofAuthority.controllingBaseHead}..${head}`).split(/\r?\n/).filter(Boolean).sort();
const expectedPaths = [...proofAuthority.exactPathScope].sort();
check('EXACT_POST_MERGE_BASE', git('merge-base', proofAuthority.controllingBaseHead, head) === proofAuthority.controllingBaseHead, { base: proofAuthority.controllingBaseHead, head });
check('EXACT_POST_MERGE_PATH_SCOPE', JSON.stringify(changedPaths) === JSON.stringify(expectedPaths), { changedPaths, expectedPaths });
check('NO_H_EARTH_PRODUCT_PATH_MUTATION', changedPaths.every((entry) => !entry.startsWith('showroom/') && !entry.startsWith('gauges/') && !entry.startsWith('h-earth-3d/terrain/')), { changedPaths });
check('ALL_POST_MERGE_PATHS_EXIST', expectedPaths.every((entry) => fs.existsSync(path.join(ROOT, entry))));
const headRef = process.env.GITHUB_HEAD_REF || null;
check('ASSEMBLER_BRANCH_RELATION', !headRef || headRef === proofAuthority.candidateAssembly.isolatedBranch, { actualHeadRef: headRef, expected: proofAuthority.candidateAssembly.isolatedBranch });

for (const [repositoryPath, expected] of Object.entries(proofAuthority.expectedSourceSha256)) {
  const actual = fileSha256(repositoryPath);
  check(`FETCH_BACK_SHA256_${repositoryPath.replace(/[^A-Za-z0-9]+/g, '_').toUpperCase()}`, actual === expected, { repositoryPath, expected, actual });
}

check('PLATFORM_AUTHORITY_REMAINS_PASS_CLOSED', platformAuthority.result === 'H_EARTH_INSTRUMENT_PLATFORM_PASS_CLOSED');
check('EXACT_FOUR_REGISTERED_INSTRUMENTS', toolRegistry.tools.length === platformAuthority.fixedGates.exactToolCount, { toolIds: toolRegistry.tools.map((tool) => tool.toolId) });
check('EXACT_EIGHT_PERMANENT_SCENES', sceneRegistry.scenes.length === platformAuthority.fixedGates.exactPermanentSceneCount, { sceneIds: sceneRegistry.scenes.map((scene) => scene.id) });
check('SCENE_REGISTRY_DIGEST_FROZEN', sceneRegistry.registryDigest === proofAuthority.sceneRegistryDigest, { actual: sceneRegistry.registryDigest, expected: proofAuthority.sceneRegistryDigest });
check('TOOL_REGISTRY_DIGEST_FROZEN', toolRegistry.registryDigest === proofAuthority.toolRegistryDigest, { actual: toolRegistry.registryDigest, expected: proofAuthority.toolRegistryDigest });

const routedChange = routeChangeClass(proofAuthority.changeClass);
check('CHANGE_ROUTED_AS_PUBLIC_CANDIDATE', routedChange.changeClass === 'PUBLIC_ROUTE_CHANGE' && routedChange.liveAdmissionRequired === true && routedChange.userDifferentialRequired === true, routedChange);
check('BOUNDED_CANDIDATE_ASSEMBLER_AUTHORIZED_REAL_OPERATION', proofAuthority.candidateAssembly.authorized === true, proofAuthority.candidateAssembly);
check('CANDIDATE_ASSEMBLY_EXACT_SCOPE', JSON.stringify([...proofAuthority.candidateAssembly.exactChangedPaths].sort()) === JSON.stringify(expectedPaths), proofAuthority.candidateAssembly);
check('ROLLBACK_RELATION_EXACT', proofAuthority.candidateAssembly.rollbackRelation.baseHead === proofAuthority.controllingBaseHead && proofAuthority.candidateAssembly.rollbackRelation.rollbackTarget === proofAuthority.controllingBaseHead, proofAuthority.candidateAssembly.rollbackRelation);

const context = createProjectContext({ sourceHead: head });
const ledger = createCrossToolSessionLedger({ projectContext: context, objective: proofAuthority.operationId, sessionId: 'H_EARTH_POST_MERGE_ENGINEERING_PROOF_001_VERIFY_SESSION', clock: fixedClock });
for (const tool of toolRegistry.tools) {
  const envelope = buildEvidenceEnvelope({
    projectContextId: context.projectContextId,
    sessionId: ledger.sessionId,
    toolId: tool.toolId,
    operationId: `${tool.toolId}_POST_MERGE_STATIC_VERIFY`,
    changeClass: 'EVIDENCE_ONLY_OPERATION',
    authorityClass: 'DIAGNOSTIC_ONLY',
    sourceHead: head,
    executedHead: head,
    sceneRegistryVersion: sceneRegistry.schemaVersion,
    checks: [{ checkId: 'POST_MERGE_STATIC_KERNEL_VERIFY', passed: true }],
    authorityEstablished: tool.authorityProduced,
    stopBoundary: 'STOP_AFTER_POST_MERGE_STATIC_KERNEL_VERIFY',
    payload: { route: tool.route }
  }, { clock: fixedClock });
  check(`ENVELOPE_${tool.toolId}`, verifyEvidenceEnvelope(envelope).valid, envelope);
  ledger.recordToolInvocation({ toolId: tool.toolId, action: 'POST_MERGE_STATIC_VERIFY', result: 'PASS' });
  ledger.admitEvidence(envelope);
}
check('CROSS_TOOL_LEDGER_ADMITS_ALL_FOUR', ledger.snapshot().evidenceEnvelopes.length === 4, { count: ledger.snapshot().evidenceEnvelopes.length });

const sourceTransition = evaluateAuthorityTransition({ from: 'SPECIFIED', to: 'SOURCE_IMPLEMENTED', evidence: { written: true, committed: true, fetchedBack: true, exactRepositoryVerified: true } });
const invalidJump = evaluateAuthorityTransition({ from: 'ENGINEERING_PASS', to: 'ACCEPTED', evidence: {} });
check('SOURCE_IMPLEMENTED_REQUIRES_EXACT_CONVEYOR', sourceTransition.allowed === true, sourceTransition);
check('ENGINEERING_PASS_CANNOT_SKIP_TO_ACCEPTED', invalidJump.allowed === false, invalidJump);

const candidateReproduction = assembleBoundedCandidate(proofAuthority.candidateInput);
check('CANDIDATE_PLAN_DETERMINISTIC', candidateReproduction.authorized === true && candidateReproduction.planDigest === proofAuthority.candidateAssembly.planDigest && candidateReproduction.isolatedBranch === proofAuthority.candidateAssembly.isolatedBranch, { expected: proofAuthority.candidateAssembly, actual: candidateReproduction });
const differentialRefusal = recordUserDifferential({ currentAuthorityState: 'PUBLIC_CANDIDATE_VERIFIED', baselineId: proofAuthority.baselineId, candidateId: proofAuthority.candidateId, userDisposition: 'ACCEPT', observations: [], automatedSubstitution: true });
const differentialFixture = recordUserDifferential({ currentAuthorityState: 'PUBLIC_CANDIDATE_VERIFIED', baselineId: proofAuthority.baselineId, candidateId: proofAuthority.candidateId, userDisposition: 'ACCEPT', observations: ['FIXTURE_ONLY_NOT_PRODUCT_ACCEPTANCE'], automatedSubstitution: false });
const promotionRefusal = evaluateDefaultPromotion({ currentAuthorityState: 'ENGINEERING_PASS', candidateId: proofAuthority.candidateId, userDifferentialReceipt: differentialFixture, separatePromotionManifest: { separateOperation: true, targetDefaultRoute: proofAuthority.defaultRoute, targetBinding: proofAuthority.defaultRoute }, publicDefaultReverified: false });
check('AUTOMATION_CANNOT_SUBSTITUTE_FOR_USER_DIFFERENTIAL', differentialRefusal.authorized === false, differentialRefusal);
check('DEFAULT_PROMOTION_REMAINS_BLOCKED', promotionRefusal.authorized === false, promotionRefusal);

const packetA = buildInstrumentPlatformPacket({ projectContext: context, toolRegistry, sceneRegistry, sessionLedger: ledger.snapshot(), authorityState: 'SOURCE_IMPLEMENTED', candidateAssembly: proofAuthority.candidateAssembly, terminalReceipts: [] });
const packetB = buildInstrumentPlatformPacket({ projectContext: context, toolRegistry, sceneRegistry, sessionLedger: ledger.snapshot(), authorityState: 'SOURCE_IMPLEMENTED', candidateAssembly: proofAuthority.candidateAssembly, terminalReceipts: [] });
check('DETERMINISTIC_PLATFORM_EXPORT', serializeInstrumentPlatformPacket(packetA) === serializeInstrumentPlatformPacket(packetB), { digest: packetA.canonicalPacketDigest });

fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
const localConsoleErrors = [];
const localPageErrors = [];
const localHttpErrors = [];
const attachErrorCapture = (page) => {
  page.on('console', (message) => { if (message.type() === 'error') localConsoleErrors.push(message.text()); });
  page.on('pageerror', (error) => localPageErrors.push(error.message));
  page.on('response', (response) => { if (response.status() >= 400) localHttpErrors.push({ status: response.status(), url: response.url() }); });
};
let defaultRouteObservation = null;
let candidateRouteObservation = null;
let browserFixture = null;
let adapterResults = null;
let publicVerification = null;
try {
  const defaultPage = await browser.newPage({ viewport: { width: 1920, height: 1400 }, deviceScaleFactor: 1 });
  defaultPage.setDefaultTimeout(1800000);
  attachErrorCapture(defaultPage);
  await defaultPage.goto(`${HARNESS_URL}?head=${head}`, { waitUntil: 'domcontentloaded', timeout: 240000 });
  await defaultPage.waitForFunction(() => document.documentElement.dataset.instrumentPlatformReady === 'true', null, { timeout: 600000 });
  await defaultPage.waitForFunction(() => document.documentElement.dataset.postMergeProofReady === 'true', null, { timeout: 600000 });
  defaultRouteObservation = await defaultPage.evaluate(() => ({ mode: document.documentElement.dataset.postMergeProofMode, panelExists: Boolean(document.getElementById('post-merge-proof-panel')), panelHidden: document.getElementById('post-merge-proof-panel')?.hidden, proofReceipt: window.H_EARTH_INSTRUMENT_PLATFORM.getPostMergeProofReceipt() }));
  await defaultPage.screenshot({ path: path.join(EVIDENCE_DIR, 'h-earth-instrument-platform-default.png'), fullPage: true });
  await defaultPage.close();

  const candidatePage = await browser.newPage({ viewport: { width: 1920, height: 1400 }, deviceScaleFactor: 1 });
  candidatePage.setDefaultTimeout(1800000);
  attachErrorCapture(candidatePage);
  const candidateUrl = `${HARNESS_URL}?candidate=${encodeURIComponent(proofAuthority.candidateId)}&head=${head}`;
  await candidatePage.goto(candidateUrl, { waitUntil: 'domcontentloaded', timeout: 240000 });
  await candidatePage.waitForFunction(() => document.documentElement.dataset.instrumentPlatformReady === 'true', null, { timeout: 600000 });
  await candidatePage.waitForFunction(() => document.documentElement.dataset.postMergeProofReady === 'true', null, { timeout: 600000 });
  candidateRouteObservation = await candidatePage.evaluate(() => ({ mode: document.documentElement.dataset.postMergeProofMode, identityValid: document.documentElement.dataset.postMergeProofIdentityValid, panelHidden: document.getElementById('post-merge-proof-panel')?.hidden, proofReceipt: window.H_EARTH_INSTRUMENT_PLATFORM.getPostMergeProofReceipt() }));
  browserFixture = await candidatePage.evaluate(() => window.H_EARTH_INSTRUMENT_PLATFORM.runVerificationFixture());
  adapterResults = await candidatePage.evaluate(() => window.H_EARTH_INSTRUMENT_PLATFORM.verifyInstrumentAdapters({ executeTerrainFixture: true }));
  await candidatePage.screenshot({ path: path.join(EVIDENCE_DIR, 'h-earth-instrument-platform-post-merge-candidate.png'), fullPage: true });
  await candidatePage.close();

  if (PUBLIC_VERIFY) {
    const publicPage = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });
    publicPage.setDefaultTimeout(180000);
    let lastError = null;
    for (let attempt = 1; attempt <= 80; attempt += 1) {
      try {
        const version = `${head}-${attempt}-${Date.now()}`;
        await publicPage.goto(`${PUBLIC_PLATFORM_URL}?head=${head}&v=${encodeURIComponent(version)}`, { waitUntil: 'domcontentloaded', timeout: 120000 });
        await publicPage.waitForFunction(() => document.documentElement.dataset.instrumentPlatformReady === 'true', null, { timeout: 120000 });
        const publicDefault = await publicPage.evaluate(() => ({ mode: document.documentElement.dataset.postMergeProofMode, ready: document.documentElement.dataset.postMergeProofReady, panelHidden: document.getElementById('post-merge-proof-panel')?.hidden ?? null }));
        await publicPage.goto(`${PUBLIC_PLATFORM_URL}?candidate=${encodeURIComponent(proofAuthority.candidateId)}&head=${head}&v=${encodeURIComponent(version)}`, { waitUntil: 'domcontentloaded', timeout: 120000 });
        await publicPage.waitForFunction(() => document.documentElement.dataset.instrumentPlatformReady === 'true', null, { timeout: 120000 });
        await publicPage.waitForFunction(() => document.documentElement.dataset.postMergeProofReady === 'true', null, { timeout: 120000 });
        const publicCandidate = await publicPage.evaluate(() => ({ mode: document.documentElement.dataset.postMergeProofMode, identityValid: document.documentElement.dataset.postMergeProofIdentityValid, panelHidden: document.getElementById('post-merge-proof-panel')?.hidden ?? null, receipt: window.H_EARTH_INSTRUMENT_PLATFORM.getPostMergeProofReceipt() }));
        const verified = publicDefault.mode === 'false' && publicDefault.panelHidden === true && publicCandidate.mode === 'true' && publicCandidate.panelHidden === false && publicCandidate.identityValid === 'true' && publicCandidate.receipt?.valid === true && publicCandidate.receipt?.executedSourceHead === head;
        if (verified) {
          publicVerification = { verified: true, attempt, publicDefault, publicCandidate, candidateUrl: `${PUBLIC_PLATFORM_URL}?candidate=${encodeURIComponent(proofAuthority.candidateId)}&head=${head}` };
          await publicPage.screenshot({ path: path.join(EVIDENCE_DIR, 'h-earth-instrument-platform-public-candidate.png'), fullPage: true });
          break;
        }
        lastError = { attempt, publicDefault, publicCandidate };
      } catch (error) {
        lastError = { attempt, error: String(error?.message || error) };
      }
      await sleep(15000);
    }
    if (!publicVerification) publicVerification = { verified: false, lastError };
    await publicPage.close();
  }
} finally {
  await browser.close();
}

const generic404ConsoleErrors = localConsoleErrors.filter((message) => /Failed to load resource:.*404/i.test(message));
const unexpectedConsoleErrors = localConsoleErrors.filter((message) => !/Failed to load resource:.*404/i.test(message));
const platformOwnedHttpErrors = localHttpErrors.filter((entry) => {
  const pathname = new URL(entry.url).pathname;
  return pathname.startsWith('/h-earth-3d/tools/instrument-platform/') || pathname.startsWith('/h-earth-3d/tools/terrain-workbench/') || pathname.startsWith('/h-earth-3d/control-plane/instrument-platform/');
});
check('BROWSER_EXECUTION_CLEAN', unexpectedConsoleErrors.length === 0 && localPageErrors.length === 0 && platformOwnedHttpErrors.length === 0, { localConsoleErrors, generic404ConsoleErrors, unexpectedConsoleErrors, localPageErrors, localHttpErrors, platformOwnedHttpErrors });
check('DEFAULT_ROUTE_NONREGRESSION', defaultRouteObservation?.mode === 'false' && defaultRouteObservation?.panelExists === true && defaultRouteObservation?.panelHidden === true && defaultRouteObservation?.proofReceipt === null, defaultRouteObservation);
check('CANDIDATE_ROUTE_PANEL_RENDER', candidateRouteObservation?.mode === 'true' && candidateRouteObservation?.panelHidden === false, candidateRouteObservation);
check('CANDIDATE_RUNTIME_SOURCE_IDENTITY', candidateRouteObservation?.identityValid === 'true' && candidateRouteObservation?.proofReceipt?.valid === true && candidateRouteObservation?.proofReceipt?.executedSourceHead === head, candidateRouteObservation?.proofReceipt);
check('BROWSER_FIXTURE_TOOL_COUNT', browserFixture?.toolCount === 4, browserFixture);
check('BROWSER_FIXTURE_SCENE_COUNT', browserFixture?.sceneCount === 8, browserFixture);
check('BROWSER_FIXTURE_FOUR_ENVELOPES', browserFixture?.evidenceEnvelopeCount === 4, browserFixture);
check('BROWSER_FIXTURE_STATE_SEPARATION', browserFixture?.sourceTransitionPass === true && browserFixture?.prematureAcceptanceRefused === true, browserFixture);
check('BROWSER_FIXTURE_CANDIDATE_REFUSAL_AND_PASS', browserFixture?.candidateRefusalPass === true && browserFixture?.candidateAuthorizationPass === true, browserFixture);
check('BROWSER_FIXTURE_USER_DIFFERENTIAL_SEPARATION', browserFixture?.automatedDifferentialRefused === true && browserFixture?.userDifferentialPass === true, browserFixture);
check('BROWSER_FIXTURE_DETERMINISTIC_EXPORT', browserFixture?.deterministicExport === true, browserFixture);
check('ALL_FOUR_SAME_ORIGIN_INSTRUMENTS_PROBED', Array.isArray(adapterResults) && adapterResults.length === 4 && new Set(adapterResults.map((entry) => entry.toolId)).size === 4, adapterResults?.map((entry) => entry.toolId));
const terrainExecution = adapterResults?.find((entry) => entry.toolId === 'TERRAIN_INTELLIGENCE_AND_PERCEPTUAL_WORKBENCH')?.execution?.result;
check('TERRAIN_WORKBENCH_DETERMINISTIC_IN_UNIFIED_PLATFORM', terrainExecution?.deterministic === true, terrainExecution);
check('CP2_H_COLOR_EQUIVALENCE_8_OF_8', terrainExecution?.diagnostics?.hOfficialColorEquivalenceSceneCount === 8, terrainExecution?.diagnostics);
check('CP2_DEPTH_EQUIVALENCE_8_OF_8', terrainExecution?.diagnostics?.hOfficialDepthEquivalenceSceneCount === 8, terrainExecution?.diagnostics);
check('DIAGNOSTIC_PASSES_AND_ABLATIONS_COMPLETE', terrainExecution?.diagnostics?.diagnosticPassCount === 9 && terrainExecution?.diagnostics?.familyCount === 7, terrainExecution?.diagnostics);
if (PUBLIC_VERIFY) check('PUBLIC_CANDIDATE_VERIFIED', publicVerification?.verified === true, publicVerification);

const engineeringPass = failures.length === 0;
const publicCandidateVerified = PUBLIC_VERIFY && publicVerification?.verified === true && engineeringPass;
const receiptBody = {
  receiptType: 'H_EARTH_POST_MERGE_ENGINEERING_PROOF_001_RECEIPT_v1',
  operation: proofAuthority.operationId,
  candidateId: proofAuthority.candidateId,
  result: engineeringPass ? (publicCandidateVerified ? 'H_EARTH_POST_MERGE_ENGINEERING_PROOF_001_PUBLIC_CANDIDATE_VERIFIED' : 'H_EARTH_POST_MERGE_ENGINEERING_PROOF_001_ENGINEERING_PASS') : 'H_EARTH_POST_MERGE_ENGINEERING_PROOF_001_FAIL',
  engineeringPass,
  runtimeImplemented: engineeringPass,
  liveAvailable: publicCandidateVerified,
  publicCandidateVerified,
  userDifferentialRecorded: false,
  productAccepted: false,
  defaultPromoted: false,
  publicDefaultReverified: false,
  proofComplete: false,
  baseHead: proofAuthority.controllingBaseHead,
  executedHead: head,
  startedAt,
  completedAt: new Date().toISOString(),
  changedPaths,
  checks,
  failureCount: failures.length,
  failures,
  candidateAssembly: proofAuthority.candidateAssembly,
  kernel: { toolRegistryDigest: toolRegistry.registryDigest, sceneRegistryDigest: sceneRegistry.registryDigest, deterministicPacketDigest: packetA.canonicalPacketDigest, sessionLedgerDigest: ledger.snapshot().ledgerDigest },
  browser: { defaultRouteObservation, candidateRouteObservation, fixture: browserFixture, adapterToolIds: adapterResults?.map((entry) => entry.toolId) ?? [], localConsoleErrors, localPageErrors, localHttpErrors, unexpectedConsoleErrors, platformOwnedHttpErrors },
  publicVerification,
  hEarthProductMutationPerformed: false,
  hEarthProductLiveStateChanged: false,
  platformCandidateLiveStateChanged: publicCandidateVerified,
  userAcceptanceRecorded: false,
  publicDefaultChanged: false,
  stoppingBoundary: publicCandidateVerified ? 'STOP_AFTER_PUBLIC_CANDIDATE_VERIFICATION_AWAIT_USER_DIFFERENTIAL' : 'STOP_AFTER_ENGINEERING_PASS_BEFORE_BOUNDED_LIVE_ADMISSION'
};
const canonicalReceiptSha256 = sha256(JSON.stringify(receiptBody));
const receipt = { ...receiptBody, canonicalReceiptSha256 };
fs.writeFileSync(RECEIPT_PATH, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
if (failures.length) process.exit(1);
