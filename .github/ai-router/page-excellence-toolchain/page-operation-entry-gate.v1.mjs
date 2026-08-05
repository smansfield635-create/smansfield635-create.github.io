#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const TOOL_ROOT = '.github/ai-router/page-excellence-toolchain';
const BUNDLE = `${TOOL_ROOT}/toolset.bundle.v1.json`;
const ROUTER = 'tools/repository-ai-entry-router.mjs';
const HEX40 = /^[0-9a-f]{40}$/;

class GateError extends Error { constructor(code, detail = null) { super(detail ? `${code}:${detail}` : code); this.code = code; this.detail = detail; } }
const fail = (code, detail = null) => { throw new GateError(code, detail); };
const stable = value => Array.isArray(value) ? value.map(stable) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])])) : value;
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

function die(error, code = 1, extra = {}) {
  const message = error instanceof Error ? error.message : String(error);
  const errorCode = error instanceof GateError ? error.code : message.split(':')[0];
  const receipt = { schema: 'MANDATORY_PAGE_OPERATION_GATE_FAILURE_v2', result: 'BLOCK', errorCode, error: message, ...extra };
  process.stderr.write(`${JSON.stringify(receipt, null, 2)}\n`);
  process.exit(code);
}

function parseArgs(argv) {
  const result = { paths: [], pathsFile: null, task: '', mutationIntent: false, output: null, pagePhase: null, receiptBundle: null, selfTest: false, delegateArgs: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--path') { const value = argv[++i] ?? ''; result.paths.push(value); result.delegateArgs.push('--path', value); }
    else if (token === '--paths-file') { const value = argv[++i] ?? ''; result.pathsFile = value; result.delegateArgs.push('--paths-file', value); }
    else if (token === '--task') { const value = argv[++i] ?? ''; result.task = value; result.delegateArgs.push('--task', value); }
    else if (token === '--mutation-intent') { result.mutationIntent = true; result.delegateArgs.push(token); }
    else if (token === '--output') { const value = argv[++i] ?? ''; result.output = value; result.delegateArgs.push('--output', value); }
    else if (token === '--page-phase') result.pagePhase = (argv[++i] ?? '').toUpperCase();
    else if (token === '--page-receipt-bundle') result.receiptBundle = argv[++i] ?? null;
    else if (token === '--self-test') result.selfTest = true;
    else if (token === '--help') {
      process.stdout.write('Usage: node page-operation-entry-gate.v1.mjs --mutation-intent --path <path> --page-phase <ARCHITECTURE|IMPLEMENTATION|RUNTIME|ADOPTION> --page-receipt-bundle <bundle.json> [router options]\n');
      process.exit(0);
    } else fail('UNKNOWN_ARGUMENT', token);
  }
  return result;
}

function discoverRoot(start) {
  let current = path.resolve(start);
  while (true) {
    if (fs.existsSync(path.join(current, 'AI_ENTRYPOINT.json'))) return current;
    const parent = path.dirname(current);
    if (parent === current) fail('REPOSITORY_ROOT_NOT_FOUND');
    current = parent;
  }
}
function readJson(root, relative) { const absolute = path.join(root, relative); if (!fs.existsSync(absolute)) fail('MISSING_REQUIRED_FILE', relative); return JSON.parse(fs.readFileSync(absolute, 'utf8')); }
function normalize(value) { return String(value ?? '').trim().replaceAll('\\', '/').replace(/^\.\/+/, '').replace(/\/+/g, '/'); }

function pageClassification(paths, task, standard) {
  const detection = standard.pageOperationDetection;
  const upperTask = String(task || '').toUpperCase();
  const taskMatch = detection.taskTokens.some(token => upperTask.includes(token));
  const matches = [];
  for (const raw of paths) {
    const filePath = normalize(raw);
    if (detection.excludedPrefixes.some(prefix => filePath.startsWith(prefix))) continue;
    const extensionMatch = detection.extensions.some(ext => filePath.toLowerCase().endsWith(ext));
    const prefixMatch = detection.interfacePrefixes.some(prefix => filePath.startsWith(prefix));
    const scriptUnderInterface = prefixMatch && /\.(?:js|mjs|cjs|ts)$/.test(filePath.toLowerCase());
    const namedSurface = /(?:^|\/)(?:index|page|showroom|interface|dashboard|app)\.(?:js|mjs|ts)$/.test(filePath.toLowerCase());
    if (extensionMatch || scriptUnderInterface || namedSurface || (taskMatch && prefixMatch)) matches.push(filePath);
  }
  return { isPageOperation: matches.length > 0 || (taskMatch && paths.some(p => !detection.excludedPrefixes.some(prefix => normalize(p).startsWith(prefix)))), matchedPaths: [...new Set(matches)].sort(), taskMatch };
}

function validateToolset(root) {
  const bundle = readJson(root, BUNDLE), locator = bundle.locator, registry = bundle.instrumentRegistry, gates = bundle.phaseGates, scoring = bundle.scoringModel, standard = bundle.universalStandard, contextual = bundle.implementationClassRouting;
  if (bundle.status !== 'ACTIVE_VERSION_BOUND') fail('TOOLSET_NOT_ACTIVE', bundle.status);
  if (bundle.version !== '1.1.0') fail('TOOLSET_VERSION_BINDING_MISMATCH', bundle.version);
  if (locator.status !== 'ACTIVE_VERSION_BOUND' || locator.version !== bundle.version) fail('LOCATOR_VERSION_BINDING_MISMATCH');
  if (registry.status !== 'ACTIVE_VERSION_BOUND' || registry.toolsetVersion !== bundle.version) fail('TOOLSET_VERSION_BINDING_MISMATCH');
  if (!registry.closedWorld || registry.instruments.length !== 9 || registry.requiredInstrumentCount !== 9) fail('TOOLSET_NOT_CLOSED_WORLD');
  for (const instrument of registry.instruments) {
    if (instrument.status !== 'ACTIVE_VERSION_BOUND') fail('INSTRUMENT_NOT_ACTIVE', instrument.id);
    if (instrument.version !== bundle.version) fail('INSTRUMENT_VERSION_MISMATCH', instrument.id);
    if (!instrument.thresholdsRef) fail('MISSING_REQUIRED_THRESHOLDS', instrument.id);
  }
  if (!registry.instruments.some(item => item.id === 'contextualArchitectureConformanceInstrument')) fail('CONTEXTUAL_ARCHITECTURE_INSTRUMENT_NOT_REGISTERED');
  if (contextual?.status !== 'ACTIVE_FAIL_CLOSED' || contextual.hardGatePrecedesScoring !== true) fail('CONTEXTUAL_ARCHITECTURE_POLICY_NOT_ACTIVE');
  if (scoring.status !== 'FROZEN_BEFORE_EVALUATION') fail('SCORING_MODEL_NOT_FROZEN');
  if (!scoring.hardGates.includes('CONTEXTUAL_ARCHITECTURE_CONFORMANCE')) fail('CONTEXTUAL_ARCHITECTURE_HARD_GATE_MISSING');
  return { bundle, locator, registry, gates, scoring, standard, contextual };
}

function nonempty(value) { return typeof value === 'string' && value.trim().length > 0; }
function validateContextualArchitecture(findings, policy) {
  if (!findings || findings.schema !== 'CONTEXTUAL_ARCHITECTURE_FINDINGS_v1') fail('IMPLEMENTATION_CLASS_UNRESOLVED', 'missing-findings');
  const implementationClass = findings.implementationClass;
  if (!policy.allowedClasses.includes(implementationClass)) fail('IMPLEMENTATION_CLASS_UNRESOLVED', implementationClass ?? 'missing');
  if (!nonempty(findings.classificationRationale)) fail('IMPLEMENTATION_CLASS_UNRESOLVED', 'missing-rationale');
  const search = findings.existingConstructSearch;
  if (!search || search.executed !== true || !Array.isArray(search.searchedScopes) || search.searchedScopes.length === 0) fail('EXISTING_CONSTRUCT_SEARCH_NOT_EXECUTED');
  if (!Array.isArray(findings.prohibitedSubstituteArchitectures) || findings.prohibitedSubstituteArchitectures.length === 0) fail('PROHIBITED_SUBSTITUTE_ARCHITECTURES_UNBOUND');
  if (!Array.isArray(findings.requiredRuntimeConditions) || findings.requiredRuntimeConditions.length === 0) fail('REQUIRED_RUNTIME_CONDITIONS_MISSING');
  const authority = findings.visualArchitectureAuthority;
  if (!authority || !nonempty(authority.authorityHolder) || typeof authority.contentAdapterMayDefineVisualArchitecture !== 'boolean') fail('VISUAL_ARCHITECTURE_AUTHORITY_AMBIGUOUS');
  const sources = Array.isArray(findings.exactSourceConstructIdentities) ? findings.exactSourceConstructIdentities : [];
  const matrix = Array.isArray(findings.adoptionMatrix) ? findings.adoptionMatrix : [];
  if (implementationClass === 'EXISTING_CONSTRUCT_ADOPTION') {
    if (sources.length === 0 || sources.some(source => !nonempty(source.sourceId) || !nonempty(source.path) || !HEX40.test(source.commitSha ?? '') || !HEX40.test(source.gitBlobSha ?? '') || source.adoptionDisposition !== 'ADOPT_IMPLEMENTATION_SOURCE')) fail('SOURCE_CONSTRUCT_IDENTITY_UNBOUND');
    if (matrix.length === 0 || matrix.some(row => !nonempty(row.sourceId) || !sources.some(source => source.sourceId === row.sourceId) || !Array.isArray(row.adoptedCapabilities) || row.adoptedCapabilities.length === 0 || !Array.isArray(row.adaptations) || !Array.isArray(row.exclusions) || row.sourceRelation === 'INSPIRATION_ONLY')) fail('ADOPTION_MATRIX_MISSING_OR_INCOMPLETE');
    if (authority.contentAdapterMayDefineVisualArchitecture !== false || !['EXISTING_SOURCE_CONSTRUCTS','EXISTING_SOURCE_CONSTRUCTS_WITH_BOUNDED_ADAPTER'].includes(authority.authorityHolder)) fail('VISUAL_ARCHITECTURE_AUTHORITY_AMBIGUOUS');
  }
  if (implementationClass === 'NEW_CONSTRUCT_SEPARATELY_AUTHORIZED') {
    const grant = findings.separateNewConstructAuthority;
    if (!grant || !nonempty(grant.authorityId) || !HEX40.test(grant.exactGoverningHead ?? '')) fail('NEW_CONSTRUCT_AUTHORITY_MISSING');
  }
  if (implementationClass === 'NONVISUAL_CONTENT_ONLY') {
    if (authority.authorityHolder !== 'NONE' || authority.contentAdapterMayDefineVisualArchitecture !== false) fail('VISUAL_ARCHITECTURE_AUTHORITY_AMBIGUOUS');
  }
  return stable({ implementationClass, searchExecuted: true, exactSourceCount: sources.length, adoptionRowCount: matrix.length, prohibitedSubstituteCount: findings.prohibitedSubstituteArchitectures.length, requiredRuntimeConditionCount: findings.requiredRuntimeConditions.length, scoreCompensationAllowed: false });
}

function validateBundle(root, filePath, subjectHead, phase, toolset) {
  if (!filePath) fail('MISSING_A_VALID_RECEIPT');
  const absolute = path.resolve(root, filePath);
  if (!fs.existsSync(absolute)) fail('MISSING_A_VALID_RECEIPT', filePath);
  const text = fs.readFileSync(absolute, 'utf8'), bundle = JSON.parse(text);
  if (bundle.schema !== 'MANDATORY_PAGE_PHASE_RECEIPT_BUNDLE_v1') fail('INVALID_RECEIPT_SCHEMA');
  if (bundle.toolsetId !== toolset.locator.toolsetId || bundle.toolsetVersion !== toolset.locator.version) fail('RECEIPT_TOOLSET_VERSION_MISMATCH');
  if (subjectHead && bundle.subjectHead !== subjectHead) fail('RECEIPT_SUBJECT_HEAD_MISMATCH');
  const gate = toolset.gates.gates[phase];
  if (!gate) fail('UNKNOWN_PAGE_PHASE', phase);
  const byPhase = new Map(bundle.phaseReceipts.map(receipt => [receipt.phase, receipt]));
  let contextualArchitecture = null;
  for (const required of gate.requiredReceiptPhases) {
    const receipt = byPhase.get(required);
    if (!receipt) fail('MISSING_PHASE_RECEIPT', required);
    if (!toolset.gates.allowedReceiptResults.includes(receipt.result)) fail('PHASE_RECEIPT_NOT_PASSING', `${required}:${receipt.result}`);
    if (!receipt.receiptDigest || receipt.receiptDigest.length < 16) fail('INVALID_PHASE_RECEIPT_DIGEST', required);
    for (const instrument of toolset.registry.instruments) if (receipt.instrumentVersions?.[instrument.id] !== instrument.version) fail('RECEIPT_INSTRUMENT_VERSION_MISMATCH', `${required}:${instrument.id}`);
    if (required === 'ARCHITECTURE') contextualArchitecture = validateContextualArchitecture(receipt.findings, toolset.contextual);
  }
  return { bundleDigest: sha256(text), receiptPhases: gate.requiredReceiptPhases, contextualArchitecture };
}

function fixtureFindings(overrides = {}) {
  const base = {
    schema: 'CONTEXTUAL_ARCHITECTURE_FINDINGS_v1', implementationClass: 'EXISTING_CONSTRUCT_ADOPTION', classificationRationale: 'Adopt exact existing interaction and spatial implementation sources.',
    existingConstructSearch: { executed: true, searchedScopes: ['showroom/compass/', 'h-earth-3d/', 'showroom/globe/h-earth/'], candidates: ['COMPASS_KERNEL','H_EARTH_RUNTIME'] },
    exactSourceConstructIdentities: [
      { sourceId: 'COMPASS_KERNEL', path: 'showroom/compass/kernel.js', commitSha: '1'.repeat(40), gitBlobSha: '2'.repeat(40), adoptionDisposition: 'ADOPT_IMPLEMENTATION_SOURCE' },
      { sourceId: 'H_EARTH_RUNTIME', path: 'showroom/globe/h-earth/runtime.js', commitSha: '3'.repeat(40), gitBlobSha: '4'.repeat(40), adoptionDisposition: 'ADOPT_IMPLEMENTATION_SOURCE' }
    ],
    adoptionMatrix: [
      { sourceId: 'COMPASS_KERNEL', sourceRelation: 'IMPLEMENTATION_SOURCE', adoptedCapabilities: ['GESTURE','INERTIA'], adaptations: ['METHODS_DESTINATIONS'], exclusions: ['COMPASS_CONTENT'] },
      { sourceId: 'H_EARTH_RUNTIME', sourceRelation: 'IMPLEMENTATION_SOURCE', adoptedCapabilities: ['SCENE','CAMERA','DEPTH'], adaptations: ['METHODS_STATE'], exclusions: ['TERRAIN_SEMANTICS'] }
    ],
    visualArchitectureAuthority: { authorityHolder: 'EXISTING_SOURCE_CONSTRUCTS_WITH_BOUNDED_ADAPTER', contentAdapterMayDefineVisualArchitecture: false },
    prohibitedSubstituteArchitectures: ['PSEUDO_SPATIAL_CAROUSEL','VISIBLE_PREVIOUS_NEXT_PRIMARY_UI'], requiredRuntimeConditions: ['REAL_3D_ENVIRONMENT','PRIMARY_DIRECT_MANIPULATION'], separateNewConstructAuthority: null
  };
  return { ...base, ...overrides };
}
function expectedError(policy, findings, expected) { try { validateContextualArchitecture(findings, policy); return false; } catch (error) { return error instanceof GateError && error.code === expected; } }

function runSelfTest(root) {
  const toolset = validateToolset(root), standard = toolset.standard, valid = fixtureFindings();
  const classCases = [
    { id: 'VALID_EXISTING_CONSTRUCT_ADOPTION', pass: !!validateContextualArchitecture(valid, toolset.contextual) },
    { id: 'UNRESOLVED_IMPLEMENTATION_CLASS', pass: expectedError(toolset.contextual, { ...valid, implementationClass: 'UNRESOLVED', genericScore: 100 }, 'IMPLEMENTATION_CLASS_UNRESOLVED') },
    { id: 'SKIPPED_EXISTING_CONSTRUCT_SEARCH', pass: expectedError(toolset.contextual, { ...valid, existingConstructSearch: { executed: false, searchedScopes: [] } }, 'EXISTING_CONSTRUCT_SEARCH_NOT_EXECUTED') },
    { id: 'MISSING_EXACT_SOURCE_IDENTITY', pass: expectedError(toolset.contextual, { ...valid, exactSourceConstructIdentities: [] }, 'SOURCE_CONSTRUCT_IDENTITY_UNBOUND') },
    { id: 'MISSING_ADOPTION_MATRIX', pass: expectedError(toolset.contextual, { ...valid, adoptionMatrix: [] }, 'ADOPTION_MATRIX_MISSING_OR_INCOMPLETE') },
    { id: 'INSPIRATION_ONLY', pass: expectedError(toolset.contextual, { ...valid, adoptionMatrix: valid.adoptionMatrix.map((row, i) => i ? row : { ...row, sourceRelation: 'INSPIRATION_ONLY' }) }, 'ADOPTION_MATRIX_MISSING_OR_INCOMPLETE') },
    { id: 'CONTENT_ADAPTER_VISUAL_AUTHORITY', pass: expectedError(toolset.contextual, { ...valid, visualArchitectureAuthority: { authorityHolder: 'METHODS_CONTENT_ADAPTER', contentAdapterMayDefineVisualArchitecture: true } }, 'VISUAL_ARCHITECTURE_AUTHORITY_AMBIGUOUS') },
    { id: 'SUBSTITUTES_UNBOUND', pass: expectedError(toolset.contextual, { ...valid, prohibitedSubstituteArchitectures: [] }, 'PROHIBITED_SUBSTITUTE_ARCHITECTURES_UNBOUND') },
    { id: 'RUNTIME_CONDITIONS_MISSING', pass: expectedError(toolset.contextual, { ...valid, requiredRuntimeConditions: [] }, 'REQUIRED_RUNTIME_CONDITIONS_MISSING') },
    { id: 'NEW_CONSTRUCT_WITHOUT_AUTHORITY', pass: expectedError(toolset.contextual, { ...valid, implementationClass: 'NEW_CONSTRUCT_SEPARATELY_AUTHORIZED', exactSourceConstructIdentities: [], adoptionMatrix: [], visualArchitectureAuthority: { authorityHolder: 'NEW_CONSTRUCT_AUTHORITY', contentAdapterMayDefineVisualArchitecture: false }, separateNewConstructAuthority: null }, 'NEW_CONSTRUCT_AUTHORITY_MISSING') },
    { id: 'VALID_NEW_CONSTRUCT_AUTHORITY', pass: !!validateContextualArchitecture({ ...valid, implementationClass: 'NEW_CONSTRUCT_SEPARATELY_AUTHORIZED', exactSourceConstructIdentities: [], adoptionMatrix: [], visualArchitectureAuthority: { authorityHolder: 'NEW_CONSTRUCT_AUTHORITY', contentAdapterMayDefineVisualArchitecture: false }, separateNewConstructAuthority: { authorityId: 'SEPARATE_NEW_CONSTRUCT_AUTHORITY', exactGoverningHead: '5'.repeat(40) } }, toolset.contextual) }
  ];
  const routeCases = [
    { paths: ['laws/research/methods-and-models/index.html'], task: 'update page', expected: true },
    { paths: ['showroom/globe/h-earth/render.js'], task: 'interface work', expected: true },
    { paths: ['control-plane/page-excellence-toolchain/test.json'], task: 'page tool self test', expected: false },
    { paths: ['README.md'], task: 'documentation correction', expected: false }
  ].map(test => ({ ...test, actual: pageClassification(test.paths, test.task, standard).isPageOperation }));
  const pass = classCases.every(item => item.pass) && routeCases.every(item => item.actual === item.expected);
  const normalized = stable({ toolsetVersion: toolset.bundle.version, instrumentIds: toolset.registry.instruments.map(item => item.id), contextualPolicy: toolset.contextual, classCases, routeCases });
  return { schema: 'MANDATORY_PAGE_OPERATION_GATE_SELF_TEST_v2', result: pass ? 'PASS' : 'FAIL', toolsetVersion: toolset.bundle.version, instrumentCount: toolset.registry.instruments.length, classCases, routeCases, normalizedFingerprint: sha256(JSON.stringify(normalized)) };
}

const args = parseArgs(process.argv.slice(2));
const root = discoverRoot(process.cwd());
try {
  if (args.selfTest) { const result = runSelfTest(root); process.stdout.write(`${JSON.stringify(result, null, 2)}\n`); process.exit(result.result === 'PASS' ? 0 : 1); }
  if (args.pathsFile) args.paths.push(...fs.readFileSync(path.resolve(args.pathsFile), 'utf8').split(/\r?\n/).filter(Boolean));
  if (!args.paths.length) fail('NO_PATHS_SUPPLIED');
  const toolset = validateToolset(root), classification = pageClassification(args.paths, args.task, toolset.standard);
  let mandatoryReceipt = null;
  if (args.mutationIntent && classification.isPageOperation) {
    if (!args.pagePhase) fail('NO_MANDATORY_TOOLSET_ROUTE');
    mandatoryReceipt = validateBundle(root, args.receiptBundle, process.env.PAGE_OPERATION_SUBJECT_HEAD || '', args.pagePhase, toolset);
  }
  const delegated = spawnSync(process.execPath, [path.join(root, ROUTER), ...args.delegateArgs], { cwd: root, encoding: 'utf8', env: process.env });
  const gateReceipt = { schema: 'MANDATORY_PAGE_OPERATION_GATE_RECEIPT_v2', result: delegated.status === 0 ? 'PASS' : 'BLOCK', toolsetId: toolset.locator.toolsetId, toolsetVersion: toolset.locator.version, pageOperation: classification.isPageOperation, matchedPaths: classification.matchedPaths, phase: classification.isPageOperation ? args.pagePhase : null, mandatoryReceipt, delegatedRouterStatus: delegated.status, delegatedRouterReceipt: delegated.stdout ? JSON.parse(delegated.stdout) : null, errors: delegated.stderr ? [delegated.stderr.trim()] : [] };
  process.stdout.write(`${JSON.stringify(gateReceipt, null, 2)}\n`);
  process.exit(delegated.status ?? 1);
} catch (error) { die(error, 1, { pagePhase: args.pagePhase, paths: args.paths }); }
