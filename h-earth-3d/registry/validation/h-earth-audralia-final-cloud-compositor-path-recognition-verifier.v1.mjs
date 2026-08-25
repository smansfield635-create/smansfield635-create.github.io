#!/usr/bin/env node
import cp from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const BASE_HEAD = '8df17b219c277b1a1c181431686b000352d60594';
const TARGET = 'showroom/globe/audralia/final-cloud-shader-composition-v1.mjs';
const TARGET_REGISTRY_PATH = `/${TARGET}`;
const TARGET_GIT_BLOB = 'e5bcbe65abb051fc5648a3c8bf1e16a4ecc2837e';
const TARGET_SHA256 = '8dd2dcb76f090b6e7f4520160d5ec7d2c5c52c7fe59f422ddfad2a5ed156c4e2';
const TARGET_BYTE_COUNT = 12035;
const ROOT_ROUTER_PATH = '.github/ai-router/router.v1.json';
const PROJECT_ENTRYPOINT_PATH = '.github/ai-router/projects/h-earth/entrypoint.v1.json';
const WORKFLOW_PATH = '.github/workflows/h-earth-repository-registry-preflight.yml';
const AMENDMENT_PATH = 'h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.audralia-final-cloud-compositor-path-recognition.js';
const LOADER_PATH = 'h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js';
const VERIFIER_PATH = 'h-earth-3d/registry/validation/h-earth-audralia-final-cloud-compositor-path-recognition-verifier.v1.mjs';
const GAP_REGISTRY_PATH = '.github/ai-router/system-continuity/gap-registry.v1.json';
const ANCHOR_GATE_PATH = 'tools/h-earth-experience-anchor-gate.mjs';
const ANCHOR_WORKFLOW_PATH = '.github/workflows/h-earth-experience-anchor-gate.yml';
const ANCHOR_MANIFEST_PATH = 'h-earth-3d/experience-anchor/H_EARTH_EXPERIENCE_ANCHOR_v1.json';
const ALLOWED_PATHS = Object.freeze([
  ROOT_ROUTER_PATH,
  PROJECT_ENTRYPOINT_PATH,
  WORKFLOW_PATH,
  AMENDMENT_PATH,
  LOADER_PATH,
  VERIFIER_PATH
].sort());

function parseArgs(argv) {
  const args = {verify: false, role: null, output: null};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--verify') args.verify = true;
    else if (token === '--role') args.role = argv[++index] ?? null;
    else if (token === '--output') args.output = argv[++index] ?? null;
    else throw new Error(`UNKNOWN_ARGUMENT:${token}`);
  }
  return args;
}

function requireCondition(value, code) {
  if (!value) throw new Error(code);
}

function git(args, options = {}) {
  return cp.execFileSync('git', args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options
  }).trim();
}

function stableStringify(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function read(pathname) {
  return fs.readFileSync(pathname, 'utf8');
}

function readJson(pathname) {
  return JSON.parse(read(pathname));
}

function countValue(values, expected) {
  return values.filter((value) => value === expected).length;
}

function inspectRegistry() {
  const script = `
    import path from 'node:path';
    import { pathToFileURL } from 'node:url';
    const amendment = await import(pathToFileURL(path.resolve(${JSON.stringify(AMENDMENT_PATH)})).href);
    const loader = await import(pathToFileURL(path.resolve(${JSON.stringify(LOADER_PATH)})).href);
    const amendmentVerification = amendment.verifyHEarthAudraliaFinalCloudCompositorPathRecognition();
    const dependencies = loader.loadHEarthRepositoryRegistryValidatorDependencies();
    process.stdout.write(JSON.stringify({
      amendmentVerification,
      loaderId: dependencies.loaderId,
      identityVerified: dependencies.identityVerified,
      inheritedIdentityPreserved: dependencies.inheritedIdentityPreserved,
      successorIntegrityVerified: dependencies.successorIntegrityVerified,
      finalCloudCompositorLoaded: dependencies.stoppingCondition?.audraliaFinalCloudCompositorPathRecognitionLoaded,
      finalCloudCompositorSuccessorIntegrityVerified: dependencies.stoppingCondition?.audraliaFinalCloudCompositorPathRecognitionSuccessorIntegrityVerified,
      finalCloudCompositorVerification: dependencies.audraliaFinalCloudCompositorPathRecognitionVerification,
      registryId: dependencies.registryInstance?.registryId,
      registryVersion: dependencies.registryInstance?.registryVersion,
      schemaId: dependencies.registryInstance?.schemaId,
      schemaVersion: dependencies.registryInstance?.schemaVersion,
      boundary: dependencies.boundary,
      stoppingCondition: dependencies.stoppingCondition
    }));
  `;
  const stdout = cp.execFileSync(process.execPath, ['--input-type=module', '--eval', script], {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  });
  return JSON.parse(stdout);
}

function executeJson(command, args, options = {}) {
  const result = cp.spawnSync(command, args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    env: {...process.env, ...(options.env ?? {})}
  });
  requireCondition(result.status === 0, `CHILD_COMMAND_FAILURE:${command}:${result.status}:${result.stderr.trim()}`);
  return JSON.parse(result.stdout);
}

function writeReceipt(output, receipt) {
  if (!output) return;
  fs.mkdirSync(path.dirname(output), {recursive: true});
  fs.writeFileSync(output, `${JSON.stringify(receipt, null, 2)}\n`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  requireCondition(args.verify === true, 'VERIFY_FLAG_REQUIRED');
  requireCondition(args.role === 'BUILDER' || args.role === 'ROLE_3', 'ROLE_MUST_BE_BUILDER_OR_ROLE_3');
  requireCondition(typeof args.output === 'string' && args.output.length > 0, 'OUTPUT_REQUIRED');

  const candidateHead = git(['rev-parse', 'HEAD']);
  git(['merge-base', '--is-ancestor', BASE_HEAD, candidateHead]);
  const changedPaths = git(['diff', '--name-only', `${BASE_HEAD}..${candidateHead}`])
    .split('\n')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .sort();
  requireCondition(
    stableStringify(changedPaths) === stableStringify(ALLOWED_PATHS),
    `EXACT_SIX_PATH_DIFF_MISMATCH:${JSON.stringify(changedPaths)}`
  );

  const baseBlob = git(['rev-parse', `${BASE_HEAD}:${TARGET}`]);
  const candidateBlob = git(['rev-parse', `${candidateHead}:${TARGET}`]);
  const targetBytes = fs.readFileSync(TARGET);
  requireCondition(baseBlob === TARGET_GIT_BLOB, 'BASE_TARGET_BLOB_MISMATCH');
  requireCondition(candidateBlob === TARGET_GIT_BLOB, 'FROZEN_C3_TARGET_BYTE_CHANGED');
  requireCondition(targetBytes.byteLength === TARGET_BYTE_COUNT, 'FROZEN_C3_TARGET_BYTE_COUNT_MISMATCH');
  requireCondition(sha256(targetBytes) === TARGET_SHA256, 'FROZEN_C3_TARGET_SHA256_MISMATCH');

  const rootRouter = readJson(ROOT_ROUTER_PATH);
  const rootHEarth = rootRouter.projects.find((project) => project.projectId === 'H_EARTH');
  const projectEntrypoint = readJson(PROJECT_ENTRYPOINT_PATH);
  requireCondition(rootHEarth != null, 'ROOT_H_EARTH_ROUTE_MISSING');
  requireCondition(countValue(rootHEarth.ownedExactPaths ?? [], TARGET) === 1, 'ROOT_EXACT_PATH_COUNT_MISMATCH');
  requireCondition(countValue(projectEntrypoint.ownedExactPaths ?? [], TARGET) === 1, 'PROJECT_EXACT_PATH_COUNT_MISMATCH');
  for (const prefixes of [rootHEarth.ownedPathPrefixes ?? [], projectEntrypoint.ownedPathPrefixes ?? []]) {
    requireCondition(!prefixes.includes('showroom/globe/audralia/'), 'PREFIX_WIDE_AUDRALIA_ROUTE_FORBIDDEN');
  }

  const registry = inspectRegistry();
  const registryChecks = registry.amendmentVerification?.checks ?? {};
  requireCondition(registry.amendmentVerification?.eligible === true, 'EXACT_PATH_REGISTRATION_FAILURE');
  for (const [check, code] of [
    ['exactTargetPathCount', 'TARGET_PATH_COUNT_MISMATCH'],
    ['targetPathResolves', 'TARGET_PATH_UNRESOLVED'],
    ['governingOccurrencePresent', 'TARGET_OCCURRENCE_IDENTITY_FAILURE'],
    ['exactPathOnly', 'TARGET_NOT_EXACT_PATH_ONLY'],
    ['noPrefixRegistration', 'PREFIX_WIDE_REGISTRATION_LEAK'],
    ['auditOnly', 'REGISTRATION_NOT_AUDIT_ONLY'],
    ['pathResolutionOnly', 'REGISTRATION_NOT_PATH_RESOLUTION_ONLY'],
    ['noProductRuntimeAuthority', 'PRODUCT_RUNTIME_AUTHORITY_LEAK'],
    ['noCloudEnvelopeAuthority', 'CLOUD_ENVELOPE_AUTHORITY_LEAK'],
    ['noRendererAuthority', 'RENDERER_AUTHORITY_LEAK'],
    ['noPrefixWideAuthority', 'PREFIX_WIDE_AUTHORITY_LEAK'],
    ['openGapPreserved', 'OPEN_GAP_CLOSURE_AUTHORITY_LEAK'],
    ['noAnchorWaiverAuthority', 'EXPERIENCE_ANCHOR_WAIVER_LEAK'],
    ['noPublicationAuthority', 'PUBLICATION_AUTHORITY_LEAK']
  ]) requireCondition(registryChecks[check] === true, code);
  requireCondition(registry.inheritedIdentityPreserved === true, 'LOADER_IDENTITY_REGRESSION');
  requireCondition(registry.successorIntegrityVerified === true, 'LOADER_SUCCESSOR_INTEGRITY_FAILURE');
  requireCondition(registry.finalCloudCompositorLoaded === true, 'FINAL_CLOUD_COMPOSITOR_RECOGNITION_NOT_LOADED');
  requireCondition(registry.finalCloudCompositorSuccessorIntegrityVerified === true, 'FINAL_CLOUD_COMPOSITOR_STOPPING_CONDITION_FAILURE');
  requireCondition(registry.finalCloudCompositorVerification?.eligible === true, 'LOADER_FINAL_CLOUD_COMPOSITOR_VERIFICATION_FAILURE');
  requireCondition(registry.loaderId === 'H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_DEPENDENCY_LOADER_v22_AUDRALIA_FINAL_CLOUD_COMPOSITOR_EXACT_PATH_RECOGNITION_SUCCESSOR', 'LOADER_ID_MISMATCH');
  for (const boundary of [
    'audraliaFinalCloudCompositorProductMutationAuthorityCreated',
    'audraliaFinalCloudCompositorCloudEnvelopeMutationAuthorityCreated',
    'audraliaFinalCloudCompositorRendererMutationAuthorityCreated',
    'audraliaFinalCloudCompositorPrefixWideRegistrationAuthorityCreated',
    'audraliaFinalCloudCompositorExecutionBackendAuthorityCreated',
    'audraliaFinalCloudCompositorOpenGapClosureAuthorityCreated',
    'audraliaFinalCloudCompositorExperienceAnchorWaiverAuthorityCreated',
    'audraliaFinalCloudCompositorDeploymentPublicationAuthorityCreated'
  ]) requireCondition(registry.boundary?.[boundary] === false, `LOADER_BOUNDARY_FAILURE:${boundary}`);

  const routerReceipt = executeJson(process.execPath, [
    'tools/repository-ai-entry-router.mjs',
    '--path', TARGET,
    '--task', 'Verify exact Audralia final cloud compositor registration',
    '--mutation-intent'
  ]);
  const targetRoute = routerReceipt.routes?.find((route) => route.path === TARGET);
  requireCondition(routerReceipt.disposition === 'PASS', 'ROOT_ROUTER_DISPOSITION_NOT_PASS');
  requireCondition(targetRoute?.projectId === 'H_EARTH', 'ROOT_ROUTER_PROJECT_MISMATCH');
  requireCondition(targetRoute?.routeClass === 'REGISTERED_PROJECT', 'ROOT_ROUTER_REGISTRATION_MISSING');
  requireCondition(targetRoute?.disposition === 'PASS', 'ROOT_ROUTER_TARGET_NOT_PASS');

  const preflightReceipt = executeJson(process.execPath, [
    'tools/h-earth-repository-registry-auto-preflight.mjs',
    '--path', TARGET,
    '--task', 'Verify exact Audralia final cloud compositor registration',
    '--mutation-intent'
  ]);
  const targetClassification = preflightReceipt.pathClassification?.classifications?.find(
    (entry) => entry.repositoryPath === TARGET_REGISTRY_PATH
  );
  requireCondition(targetClassification?.classification === 'REGISTERED_H_EARTH_PATH', 'H_EARTH_CLASSIFICATION_MISMATCH');
  requireCondition(targetClassification?.registered === true, 'H_EARTH_TARGET_NOT_REGISTERED');
  requireCondition(preflightReceipt.finalDisposition === 'PASS', 'H_EARTH_PREFLIGHT_NOT_PASS');
  requireCondition(preflightReceipt.mutationMayProceed === false, 'PREFLIGHT_CREATED_MUTATION_AUTHORITY');
  requireCondition(preflightReceipt.continuation === 'SEPARATE_MUTATION_AUTHORITY_REQUIRED_BEFORE_CHANGE', 'PREFLIGHT_BOUNDARY_MISMATCH');

  const workflow = read(WORKFLOW_PATH);
  requireCondition(workflow.split(`'${TARGET}'`).length - 1 === 2, 'AUTOMATIC_TARGET_TRIGGER_COUNT_MISMATCH');
  requireCondition(workflow.split(`'${VERIFIER_PATH}'`).length - 1 === 2, 'RECOVERY_VERIFIER_TRIGGER_COUNT_MISMATCH');
  requireCondition(workflow.split(`'${WORKFLOW_PATH}'`).length - 1 === 2, 'RECOVERY_WORKFLOW_SELF_TRIGGER_COUNT_MISMATCH');
  requireCondition(workflow.includes('showroom/globe/audralia/final-cloud-shader-composition-v1\\.mjs$'), 'AUTOMATIC_TARGET_CLASSIFIER_MISSING');
  for (const token of [
    VERIFIER_PATH,
    'agent/audralia-final-cloud-compositor-anchor-recovery-gen1716-20260825',
    'audralia-final-cloud-compositor-anchor-recovery-builder',
    'audralia-final-cloud-compositor-anchor-recovery-fresh-verifier',
    'audralia-final-cloud-compositor-anchor-recovery-fingerprint-match',
    'sparse-checkout-cone-mode: false',
    'contents: read'
  ]) requireCondition(workflow.includes(token), `WORKFLOW_CONTRACT_TOKEN_MISSING:${token}`);
  requireCondition(
    !workflow.includes('h-earth-3d/validation/h-earth-audralia-final-cloud-compositor-path-recognition-verifier'),
    'PRIOR_FALSE_EXPERIENCE_VERIFIER_PATH_PRESENT'
  );
  for (const forbidden of ['contents: write', 'issues: write', 'pull-requests: write', 'actions: write']) {
    requireCondition(!workflow.includes(forbidden), `WORKFLOW_WRITE_AUTHORITY_FORBIDDEN:${forbidden}`);
  }

  const gapRegistry = readJson(GAP_REGISTRY_PATH);
  const executionGap = gapRegistry.records?.find((gap) => gap.gapId === 'EXECUTION_ROUTE_DISCOVERY_ADOPTION_GAP');
  requireCondition(executionGap?.status === 'OPEN', 'EXECUTION_ROUTE_DISCOVERY_ADOPTION_GAP_NOT_PRESERVED_OPEN');
  requireCondition(executionGap?.authorityCreated === false, 'EXECUTION_ROUTE_DISCOVERY_ADOPTION_GAP_AUTHORITY_CREATED');

  const unchangedAnchorBlobs = {};
  for (const anchorPath of [ANCHOR_GATE_PATH, ANCHOR_WORKFLOW_PATH, ANCHOR_MANIFEST_PATH]) {
    const baseAnchorBlob = git(['rev-parse', `${BASE_HEAD}:${anchorPath}`]);
    const candidateAnchorBlob = git(['rev-parse', `${candidateHead}:${anchorPath}`]);
    requireCondition(candidateAnchorBlob === baseAnchorBlob, `EXPERIENCE_ANCHOR_SURFACE_CHANGED:${anchorPath}`);
    unchangedAnchorBlobs[anchorPath] = candidateAnchorBlob;
  }
  const anchorReceipt = executeJson(process.execPath, [ANCHOR_GATE_PATH], {
    env: {BASE_SHA: BASE_HEAD, HEAD_SHA: candidateHead}
  });
  requireCondition(anchorReceipt.result === 'PASS', 'HARD_ANCHOR_GATE_NOT_PASS');
  requireCondition(anchorReceipt.reason === 'NO_EXPERIENCE_SURFACE_CHANGE', 'HARD_ANCHOR_GATE_REASON_MISMATCH');
  requireCondition(
    anchorReceipt.anchorSha256 === '7757fb4fe731456b3058ec595369133f5c2136c99b282eb6b4df108600bca573',
    'HARD_ANCHOR_IDENTITY_MISMATCH'
  );

  const fileDigests = Object.fromEntries(ALLOWED_PATHS.map((pathname) => [pathname, sha256(read(pathname))]));
  const fingerprintDomain = {
    schema: 'H_EARTH_AUDRALIA_FINAL_CLOUD_COMPOSITOR_PATH_REGISTRATION_FINGERPRINT_DOMAIN_v1',
    baseHead: BASE_HEAD,
    candidateHead,
    exactChangedPaths: changedPaths,
    frozenC3Identity: {
      path: TARGET,
      gitBlobSha: candidateBlob,
      contentSha256: TARGET_SHA256,
      byteCount: TARGET_BYTE_COUNT
    },
    rootRouter: {
      schema: routerReceipt.schema,
      disposition: routerReceipt.disposition,
      projectId: targetRoute.projectId,
      routeClass: targetRoute.routeClass
    },
    hEarthPreflight: {
      activationStatus: preflightReceipt.activationStatus,
      classification: targetClassification.classification,
      finalDisposition: preflightReceipt.finalDisposition,
      mutationMayProceed: preflightReceipt.mutationMayProceed,
      continuation: preflightReceipt.continuation
    },
    registry: {
      registryId: registry.registryId,
      registryVersion: registry.registryVersion,
      schemaId: registry.schemaId,
      schemaVersion: registry.schemaVersion,
      amendmentStatus: registry.amendmentVerification.status,
      loaderId: registry.loaderId
    },
    experienceAnchor: {
      result: anchorReceipt.result,
      reason: anchorReceipt.reason,
      anchorSha256: anchorReceipt.anchorSha256,
      unchangedAnchorBlobs
    },
    preservedOpenGap: executionGap.gapId,
    fileDigests,
    authorityEffect: 'NONE'
  };
  const fingerprint = sha256(stableStringify(fingerprintDomain));
  const receipt = {
    schema: 'H_EARTH_AUDRALIA_FINAL_CLOUD_COMPOSITOR_PATH_REGISTRATION_VERIFICATION_RECEIPT_v1',
    result: 'PASS',
    role: args.role,
    baseHead: BASE_HEAD,
    candidateHead,
    exactChangedPaths: changedPaths,
    frozenC3Identity: fingerprintDomain.frozenC3Identity,
    checks: {
      exactSixPathDiff: true,
      frozenC3ProductBytesUnchanged: true,
      rootAndProjectExactPathRegisteredOnce: true,
      noPrefixWideRegistration: true,
      registryExactPathAndOccurrenceVerified: true,
      inheritedLoaderIdentityPreserved: true,
      rootRouterResolvesHEarthPass: true,
      hEarthPreflightResolvesRegisteredPass: true,
      noMutationMergeDeploymentPublicationOrAnchorWaiverAuthority: true,
      executionRouteDiscoveryAdoptionGapPreservedOpen: true,
      experienceAnchorSurfacesUnchanged: true,
      hardExperienceAnchorGatePassNoExperienceSurfaceChange: true,
      automaticPullRequestAndPushTriggersPresent: true,
      boundedSparseWorkingSetsPresent: true,
      operationSpecificIndependentVerifiersPresent: true
    },
    fingerprintDomain,
    fingerprint
  };
  writeReceipt(args.output, receipt);
  process.stdout.write(`${JSON.stringify(receipt)}\n`);
}

try {
  main();
} catch (error) {
  const args = (() => {
    try { return parseArgs(process.argv.slice(2)); } catch { return {role: null, output: null}; }
  })();
  const receipt = {
    schema: 'H_EARTH_AUDRALIA_FINAL_CLOUD_COMPOSITOR_PATH_REGISTRATION_VERIFICATION_RECEIPT_v1',
    result: 'FAIL',
    role: args.role,
    error: String(error?.message || error)
  };
  try { writeReceipt(args.output, receipt); } catch {}
  console.error(error?.stack || error);
  process.exit(1);
}
