import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import authority from '../../control-plane/instrument-platform/H_EARTH_INSTRUMENT_PLATFORM_AUTHORITY.v1.mjs';
import toolRegistry from '../../tools/instrument-platform/tool-registry.mjs';
import { createProjectContext } from '../../tools/instrument-platform/project-context.mjs';
import sceneRegistry from '../../tools/instrument-platform/permanent-scene-registry.mjs';
import { buildEvidenceEnvelope, verifyEvidenceEnvelope } from '../../tools/instrument-platform/evidence-envelope.mjs';
import { createCrossToolSessionLedger } from '../../tools/instrument-platform/session-ledger.mjs';
import { evaluateAuthorityTransition } from '../../tools/instrument-platform/authority-state-machine.mjs';
import { assembleBoundedCandidate } from '../../tools/instrument-platform/bounded-candidate-assembler.mjs';
import { recordUserDifferential, evaluateDefaultPromotion } from '../../tools/instrument-platform/terminal-controllers.mjs';
import { buildInstrumentPlatformPacket, serializeInstrumentPlatformPacket } from '../../tools/instrument-platform/export-platform-packet.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');
const RECEIPT_PATH = path.join(HERE, 'h-earth.instrument-platform.receipt.v1.json');
const EVIDENCE_DIR = path.join(HERE, 'evidence');
const HARNESS_URL = process.env.H_EARTH_INSTRUMENT_PLATFORM_URL ?? 'http://127.0.0.1:4185/h-earth-3d/tools/instrument-platform/index.html';
const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const fixedClock = () => new Date('2026-07-30T20:00:00.000Z');
const checks = [];
const failures = [];
const check = (id, passed, detail = null) => {
  const record = { id, passed: Boolean(passed), status: passed ? 'PASS' : 'FAIL', detail };
  checks.push(record);
  if (!passed) failures.push(record);
};

const startedAt = new Date().toISOString();
const head = git('rev-parse', 'HEAD');
const changedPaths = git('diff', '--name-only', `${authority.controllingBaseHead}..${head}`).split(/\r?\n/).filter(Boolean).sort();
const expectedPaths = [...authority.exactPathScope].sort();
check('EXACT_PLATFORM_BASE', git('merge-base', authority.controllingBaseHead, head) === authority.controllingBaseHead, { base: authority.controllingBaseHead, head });
check('EXACT_PLATFORM_PATH_SCOPE', JSON.stringify(changedPaths) === JSON.stringify(expectedPaths), { changedPaths, expectedPaths });
check('NO_LIVE_OR_PRODUCT_PATH_MUTATION', changedPaths.every((entry) => !entry.startsWith('showroom/') && !entry.startsWith('gauges/') && !entry.startsWith('h-earth-3d/terrain/')), { changedPaths });
check('ALL_EXPECTED_PATHS_EXIST', expectedPaths.every((entry) => fs.existsSync(path.join(ROOT, entry))));

check('EXACT_FOUR_REGISTERED_INSTRUMENTS', toolRegistry.tools.length === authority.fixedGates.exactToolCount, { toolIds: toolRegistry.tools.map((tool) => tool.toolId) });
check('EXACT_EIGHT_PERMANENT_SCENES', sceneRegistry.scenes.length === authority.fixedGates.exactPermanentSceneCount, { sceneIds: sceneRegistry.scenes.map((scene) => scene.id) });
check('SCENE_REGISTRY_DIGEST_FROZEN', sceneRegistry.registryDigest === authority.permanentSceneRegistryDigest, { actual: sceneRegistry.registryDigest, expected: authority.permanentSceneRegistryDigest });
check('TOOL_REGISTRY_DIGEST_FROZEN', toolRegistry.registryDigest === authority.toolRegistryDigest, { actual: toolRegistry.registryDigest, expected: authority.toolRegistryDigest });

const context = createProjectContext({ sourceHead: head });
const ledger = createCrossToolSessionLedger({ projectContext: context, objective: 'VERIFY_PLATFORM_KERNEL', sessionId: 'H_EARTH_INSTRUMENT_PLATFORM_VERIFY_SESSION', clock: fixedClock });
for (const tool of toolRegistry.tools) {
  const envelope = buildEvidenceEnvelope({
    projectContextId: context.projectContextId,
    sessionId: ledger.sessionId,
    toolId: tool.toolId,
    operationId: `${tool.toolId}_STATIC_VERIFY`,
    changeClass: 'EVIDENCE_ONLY_OPERATION',
    authorityClass: 'DIAGNOSTIC_ONLY',
    sourceHead: head,
    executedHead: head,
    sceneRegistryVersion: sceneRegistry.schemaVersion,
    checks: [{ checkId: 'STATIC_KERNEL_VERIFY', passed: true }],
    authorityEstablished: tool.authorityProduced,
    stopBoundary: 'STOP_AFTER_STATIC_KERNEL_VERIFY',
    payload: { route: tool.route }
  }, { clock: fixedClock });
  check(`ENVELOPE_${tool.toolId}`, verifyEvidenceEnvelope(envelope).valid, envelope);
  ledger.recordToolInvocation({ toolId: tool.toolId, action: 'STATIC_VERIFY', result: 'PASS' });
  ledger.admitEvidence(envelope);
}
check('CROSS_TOOL_LEDGER_ADMITS_ALL_FOUR', ledger.snapshot().evidenceEnvelopes.length === 4, { count: ledger.snapshot().evidenceEnvelopes.length });

const sourceTransition = evaluateAuthorityTransition({ from: 'SPECIFIED', to: 'SOURCE_IMPLEMENTED', evidence: { written: true, committed: true, fetchedBack: true, exactRepositoryVerified: true } });
const invalidJump = evaluateAuthorityTransition({ from: 'ENGINEERING_PASS', to: 'ACCEPTED', evidence: {} });
check('SOURCE_IMPLEMENTED_REQUIRES_EXACT_CONVEYOR', sourceTransition.allowed === true, sourceTransition);
check('ENGINEERING_PASS_CANNOT_SKIP_TO_ACCEPTED', invalidJump.allowed === false, invalidJump);

const candidateRefusal = assembleBoundedCandidate({
  operationId: 'VERIFY_REFUSAL',
  exactProjectContext: context,
  establishedDiagnosis: { status: 'ESTABLISHED', statement: 'DIAGNOSIS' },
  perceptualTarget: { status: 'NOT_ESTABLISHED', statement: 'UNRESOLVED' },
  causalTarget: { status: 'NOT_ESTABLISHED', statement: 'UNRESOLVED' },
  authorizedMutationManifest: { changeClass: 'MATERIAL_OR_LIGHTING_CHANGE', exactChangedPaths: [] },
  protectedAuthoritySet: [],
  requiredVerificationMatrix: [],
  rollbackRelation: { baseHead: head, rollbackTarget: head },
  stopBoundary: 'STOP'
});
const candidatePass = assembleBoundedCandidate({
  operationId: 'VERIFY_BOUNDED_SOURCE_CANDIDATE',
  exactProjectContext: context,
  establishedDiagnosis: { status: 'ESTABLISHED', statement: 'ONE_SOURCE_MARKER_IS_INCORRECT' },
  perceptualTarget: { status: 'ESTABLISHED', statement: 'NO_VISUAL_CHANGE' },
  causalTarget: { status: 'ESTABLISHED', statement: 'ONE_CONTROL_FILE' },
  authorizedMutationManifest: { changeClass: 'SOURCE_ONLY_CONTROL_CHANGE', exactChangedPaths: ['h-earth-3d/control-plane/example.mjs'], expectedBlobIdentities: {} },
  protectedAuthoritySet: [{ authorityId: 'ACCEPTED_RENDERER', paths: [context.acceptedRenderer.path] }],
  requiredVerificationMatrix: [{ checkId: 'EXACT_FETCH_BACK', authorityClass: 'SOURCE_AUTHORITY' }],
  rollbackRelation: { baseHead: head, rollbackTarget: head },
  stopBoundary: 'STOP_AFTER_SOURCE_VERIFICATION',
  presumesUserAcceptance: false
});
check('CANDIDATE_ASSEMBLER_REFUSES_UNRESOLVED_TARGET', candidateRefusal.authorized === false && candidateRefusal.refusalReasons.includes('PERCEPTUAL_TARGET_UNRESOLVED'), candidateRefusal);
check('CANDIDATE_ASSEMBLER_AUTHORIZES_COMPLETE_BOUNDED_PLAN', candidatePass.authorized === true, candidatePass);

const differentialRefusal = recordUserDifferential({ currentAuthorityState: 'PUBLIC_CANDIDATE_VERIFIED', baselineId: 'CP2', candidateId: 'C1', userDisposition: 'ACCEPT', observations: [], automatedSubstitution: true });
const differentialPass = recordUserDifferential({ currentAuthorityState: 'PUBLIC_CANDIDATE_VERIFIED', baselineId: 'CP2', candidateId: 'C1', userDisposition: 'ACCEPT', observations: ['USER_ACCEPTED_VISIBLE_DIFFERENCE'], automatedSubstitution: false });
const promotionRefusal = evaluateDefaultPromotion({ currentAuthorityState: 'ENGINEERING_PASS', candidateId: 'C1', userDifferentialReceipt: differentialPass, separatePromotionManifest: { separateOperation: true, targetDefaultRoute: '/x', targetBinding: '/y' }, publicDefaultReverified: false });
check('AUTOMATION_CANNOT_SUBSTITUTE_FOR_USER_DIFFERENTIAL', differentialRefusal.authorized === false, differentialRefusal);
check('USER_DIFFERENTIAL_RECORDED_SEPARATELY', differentialPass.authorized === true, differentialPass);
check('DEFAULT_PROMOTION_REQUIRES_ACCEPTED_STATE', promotionRefusal.authorized === false, promotionRefusal);

const packetA = buildInstrumentPlatformPacket({ projectContext: context, toolRegistry, sceneRegistry, sessionLedger: ledger.snapshot(), authorityState: 'SPECIFIED', candidateAssembly: candidatePass, terminalReceipts: [differentialPass] });
const packetB = buildInstrumentPlatformPacket({ projectContext: context, toolRegistry, sceneRegistry, sessionLedger: ledger.snapshot(), authorityState: 'SPECIFIED', candidateAssembly: candidatePass, terminalReceipts: [differentialPass] });
check('DETERMINISTIC_PLATFORM_EXPORT', serializeInstrumentPlatformPacket(packetA) === serializeInstrumentPlatformPacket(packetB), { digest: packetA.canonicalPacketDigest });

fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1400 }, deviceScaleFactor: 1 });
page.setDefaultTimeout(1800000);
const consoleErrors = [];
const pageErrors = [];
page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
page.on('pageerror', (error) => pageErrors.push(error.message));
let browserFixture = null;
let adapterResults = null;
try {
  await page.goto(`${HARNESS_URL}?head=${head}`, { waitUntil: 'domcontentloaded', timeout: 240000 });
  await page.waitForFunction(() => document.documentElement.dataset.instrumentPlatformReady === 'true', null, { timeout: 600000 });
  browserFixture = await page.evaluate(() => window.H_EARTH_INSTRUMENT_PLATFORM.runVerificationFixture());
  adapterResults = await page.evaluate(() => window.H_EARTH_INSTRUMENT_PLATFORM.verifyInstrumentAdapters({ executeTerrainFixture: true }));
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'h-earth-instrument-platform.png'), fullPage: true });
} finally {
  await browser.close();
}

check('BROWSER_EXECUTION_CLEAN', consoleErrors.length === authority.fixedGates.browserConsoleErrors && pageErrors.length === authority.fixedGates.pageErrors, { consoleErrors, pageErrors });
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

const receiptBody = {
  receiptType: 'H_EARTH_INSTRUMENT_PLATFORM_RECEIPT_v1',
  operation: authority.operation,
  deliverable: authority.deliverable,
  result: failures.length === 0 ? authority.result : 'H_EARTH_INSTRUMENT_PLATFORM_EXECUTION_FAIL',
  passClosed: failures.length === 0,
  baseHead: authority.controllingBaseHead,
  executedHead: head,
  startedAt,
  completedAt: new Date().toISOString(),
  changedPaths,
  checks,
  failureCount: failures.length,
  failures,
  kernel: {
    toolRegistryDigest: toolRegistry.registryDigest,
    sceneRegistryDigest: sceneRegistry.registryDigest,
    deterministicPacketDigest: packetA.canonicalPacketDigest,
    sessionLedgerDigest: ledger.snapshot().ledgerDigest
  },
  browser: { fixture: browserFixture, adapterToolIds: adapterResults?.map((entry) => entry.toolId) ?? [], consoleErrors, pageErrors },
  productMutationPerformed: false,
  liveStateChanged: false,
  userAcceptanceRecorded: false,
  publicDefaultChanged: false,
  stoppingBoundary: authority.boundaries.stop
};
const canonicalReceiptSha256 = sha256(JSON.stringify(receiptBody));
const receipt = { ...receiptBody, canonicalReceiptSha256 };
fs.writeFileSync(RECEIPT_PATH, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
if (failures.length) process.exit(1);
