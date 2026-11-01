#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const SCHEMA = 'WORKFLOW_APPLICABILITY_RECEIPT_v1';
const WORKFLOW_ID = 'H_EARTH_REPOSITORY_REGISTRY_PREFLIGHT';

function normalizeRepositoryPath(value) {
  return String(value || '')
    .trim()
    .replace(/\\/g, '/')
    .replace(/^\.\//, '')
    .replace(/^\//, '');
}

function uniqueSorted(values) {
  return [...new Set(values.map(normalizeRepositoryPath).filter(Boolean))].sort();
}

function parseArguments(argv) {
  const options = {
    workflow: WORKFLOW_ID,
    paths: [],
    pathsFile: null,
    output: null,
    selfTest: false,
    help: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--workflow') {
      const value = argv[index + 1];
      if (!value) throw new Error('MISSING_VALUE_FOR_WORKFLOW');
      options.workflow = value;
      index += 1;
    } else if (argument === '--path') {
      const value = argv[index + 1];
      if (!value) throw new Error('MISSING_VALUE_FOR_PATH');
      options.paths.push(value);
      index += 1;
    } else if (argument === '--paths-file') {
      const value = argv[index + 1];
      if (!value) throw new Error('MISSING_VALUE_FOR_PATHS_FILE');
      options.pathsFile = value;
      index += 1;
    } else if (argument === '--output') {
      const value = argv[index + 1];
      if (!value) throw new Error('MISSING_VALUE_FOR_OUTPUT');
      options.output = value;
      index += 1;
    } else if (argument === '--self-test') {
      options.selfTest = true;
    } else if (argument === '--help') {
      options.help = true;
    } else {
      throw new Error(`UNKNOWN_ARGUMENT:${argument}`);
    }
  }

  return options;
}

function readPathsFile(filePath) {
  return fs.readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .map((value) => value.trim())
    .filter(Boolean);
}

function isExplicitHEarthRegistryDependency(repositoryPath) {
  const value = normalizeRepositoryPath(repositoryPath);
  return (
    value === '.github/workflows/h-earth-repository-registry-preflight.yml' ||
    value === '.github/ai-router/page-mutation-proportionality-policy.v1.json' ||
    value === 'AI_ENTRYPOINT.json' ||
    value === 'tools/h-earth-repository-registry-auto-preflight.mjs' ||
    value === 'tools/workflow-applicability-gate.v1.mjs' ||
    value.startsWith('h-earth-3d/registry/')
  );
}

function isIgnoredHEarthAdministrativePath(repositoryPath) {
  const value = normalizeRepositoryPath(repositoryPath);
  return (
    value === 'h-earth-3d/AGENTS.md' ||
    value === 'showroom/globe/h-earth/AGENTS.md' ||
    value.startsWith('h-earth-3d/experience-anchor/evidence/') ||
    value.startsWith('h-earth-3d/experience-anchor/receipts/')
  );
}

function isKnownProductSemanticPath(repositoryPath) {
  const value = normalizeRepositoryPath(repositoryPath);
  return (
    value.startsWith('showroom/globe/h-earth/') ||
    value === 'showroom/globe/audralia/diagnostic/index.html' ||
    value === 'showroom/globe/audralia/diagnostic/index.controls.js' ||
    value === 'showroom/globe/audralia/diagnostic/index.inspection.lane.js' ||
    value === 'showroom/globe/audralia/final-cloud-shader-composition-v1.mjs'
  );
}

function isAmbiguousHEarthAuthorityScope(repositoryPath) {
  const value = normalizeRepositoryPath(repositoryPath);
  if (!value.startsWith('h-earth-3d/')) return false;
  if (isIgnoredHEarthAdministrativePath(value)) return false;
  if (isExplicitHEarthRegistryDependency(value)) return false;
  return true;
}


/* Gen3011: verify optional candidate scope against the ACTIVE canonical lock
 * and its original, hash-bound GitHub owner intake. No new authority is created.
 * On ANY missing/conflicting evidence, return no verified paths and retain
 * the pre-existing selected/fail-closed H-Earth registry gate. */
const stable = value => Array.isArray(value)
  ? value.map(stable)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]))
    : value;
const sha256 = value => createHash('sha256').update(value, 'utf8').digest('hex');
const isSha = value => typeof value === 'string' && /^[a-f0-9]{40}$/.test(value);
const expectedRepository = 'smansfield635-create/smansfield635-create.github.io';
const admissionMarker = 'CANONICAL_OPERATION_INTAKE_REQUEST_V1\n';
const admittedPathMatches = (entry, rule) => typeof rule === 'string' && (
  entry === rule ||
  (rule.endsWith('/**') && entry.startsWith(rule.slice(0, -2)))
);
const allWithinAdmission = (paths, allowed) =>
  Array.isArray(allowed) && allowed.length > 0 &&
  paths.every(entry => allowed.some(rule => admittedPathMatches(entry, rule)));
function verifyCanonicalLockPair(lock, packet, comment, expectedGeneration) {
  if (!lock || !packet || !comment || !Number.isInteger(expectedGeneration)) return false;
  const { operationRequest: request, constructionProcedure: procedure } = packet;
  const provenance = lock.authorityProvenance;
  const inv = provenance?.invocation;
  if (lock.schema !== 'REPOSITORY_OPERATION_LOCK_v1' ||
      !['ADMITTED_LOCKED', 'EXECUTING'].includes(lock.state) || lock.released !== false ||
      lock.lockGeneration !== expectedGeneration ||
      lock.scopeHash !== sha256(String(lock.lockScope).trim().toUpperCase()) ||
      provenance?.schema !== 'REPOSITORY_OPERATION_AUTHORITY_PROVENANCE_v1' ||
      provenance.origin !== 'CANONICAL_INTAKE' ||
      inv?.schema !== 'REPOSITORY_OPERATION_AUTHORITY_INVOCATION_v1' ||
      inv.repository !== expectedRepository ||
      inv.marker !== 'CANONICAL_OPERATION_INTAKE_REQUEST_V1' ||
      inv.commentAuthorAssociation !== 'OWNER' ||
      inv.commentAuthorLogin !== 'smansfield635-create' ||
      !Number.isInteger(inv.commentId) || inv.commentId <= 0 ||
      !Number.isInteger(inv.issueNumber) || inv.issueNumber <= 0 ||
      inv.commentBodySha256 !== sha256(comment.body) ||
      comment.user?.login !== inv.commentAuthorLogin ||
      comment.author_association !== 'OWNER' ||
      !String(comment.issue_url || '').endsWith('/' + inv.issueNumber) ||
      request?.schema !== 'REPOSITORY_OPERATION_REQUEST_v1' ||
      procedure?.schema !== 'REPOSITORY_CONSTRUCTION_PROCEDURE_v1' ||
      procedure.operationClass !== 'RUNTIME_OR_AUTHORITY' ||
      request.operationClass !== 'RUNTIME_OR_AUTHORITY' ||
      request.projectId !== 'H_EARTH' ||
      lock.operationId !== request.operationId ||
      request.lockScope !== lock.lockScope ||
      request.exactGoverningHead !== lock.governingHead ||
      !isSha(request.exactGoverningHead) ||
      procedure.exactGoverningHead !== lock.governingHead ||
      sha256(JSON.stringify(stable(request))) !== lock.requestDigest ||
      sha256(JSON.stringify(stable(procedure))) !== lock.procedureLocatorDigest ||
      JSON.stringify(request.allowedPaths) !== JSON.stringify(procedure.exactAllowedRepositoryPaths))
    return false;
  const identity = provenance.authorityIdentity;
  return identity?.operationId === lock.operationId &&
    identity.lockGeneration === lock.lockGeneration &&
    identity.scopeHash === lock.scopeHash &&
    identity.governingHead === lock.governingHead &&
    identity.requestDigest === lock.requestDigest &&
    identity.procedureLocatorDigest === lock.procedureLocatorDigest;
}
/* The branch name is derived from the canonical operation ID and its admitted
 * lock generation. Gen-prefixed aliases must not borrow the same lock. */
function admittedHEarthBranch(operationId, generation) {
  if (!Number.isSafeInteger(generation) || generation < 1 ||
      typeof operationId !== 'string') return null;
  const match = /^H_EARTH_([A-Z][A-Z0-9_]*)_(20[0-9]{6})_([0-9]{3})$/.exec(operationId);
  if (!match) return null;
  return 'h-earth/gen' + generation + '-' + match[1].toLowerCase().replaceAll('_', '-') +
    '-' + match[2];
}

/* A PR description is an UNTRUSTED operation locator, never admission.
 * The sole matching owner-signed packet and live lock supply authority. */
function singleHearthPrOperationLocator(body) {
  if (typeof body !== 'string') return null;
  const ids = [...new Set(body.match(/\bH_EARTH_[A-Z][A-Z0-9_]*_20[0-9]{6}_[0-9]{3}\b/g) || [])];
  return ids.length === 1 ? ids[0] : null;
}
function admittedCandidateBranch(lock, packet, observedBranch, prOperationLocator, fromPr) {
  const canonical = admittedHEarthBranch(lock.operationId, lock.lockGeneration);
  const named = packet.operationRequest?.subjectIdentity?.newCandidateBranch;
  // An explicit branch in the ORIGINAL authenticated intake takes precedence,
  // including over a generated alias for the same operation and generation.
  if (named != null && (typeof named !== 'string' || observedBranch !== named)) return null;
  if (observedBranch === canonical) return canonical;
  // A copied operation ID in an arbitrary PR never grants scope.
  if (!fromPr || prOperationLocator !== lock.operationId ||
      typeof named !== 'string' ||
      !/^h-earth\/[a-z0-9][a-z0-9/_-]*$/.test(named) ||
      observedBranch !== named) return null;
  return named;
}

async function authenticatedCandidateScope(changedPaths) {
  const none = Object.freeze({ paths: [], operationId: null, lockGeneration: null });
  const ambiguous = changedPaths.filter(isAmbiguousHEarthAuthorityScope);
  if (ambiguous.length === 0 ||
      process.env.GITHUB_REPOSITORY !== expectedRepository ||
      !process.env.GITHUB_TOKEN || !process.env.GITHUB_EVENT_PATH ||
      !['push', 'pull_request'].includes(process.env.GITHUB_EVENT_NAME)) return none;
  try {
    const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
    const fromPr = process.env.GITHUB_EVENT_NAME === 'pull_request';
    if (fromPr && (event.pull_request?.head?.repo?.full_name !== expectedRepository ||
                   event.pull_request?.base?.repo?.full_name !== expectedRepository)) return none;
    const branch = fromPr ? event.pull_request?.head?.ref : String(event.ref || '').replace(/^refs\/heads\//, '');
    const candidateHead = fromPr ? event.pull_request?.head?.sha : event.after;
    const branchIdentity = /^h-earth\/gen([0-9]+)-[a-z0-9-]+$/.exec(branch || '');
    // Noncanonical names are permitted ONLY when independently bound by the
    // original owner intake; PR body text selects a candidate, not an authority.
    const prOperationLocator = fromPr && !branchIdentity
      ? singleHearthPrOperationLocator(event.pull_request?.body) : null;
    if ((!branchIdentity && !prOperationLocator) || !isSha(candidateHead)) return none;
    // Current workflow checkout must actually contain the branch candidate.
    execFileSync('git', ['merge-base', '--is-ancestor', candidateHead, 'HEAD'], {stdio: 'ignore'});
    const headers = {Accept: 'application/vnd.github+json',
      Authorization: 'Bearer ' + process.env.GITHUB_TOKEN,
      'X-GitHub-Api-Version': '2022-11-28'};
    const getJson = async url => {
      const response = await fetch(url, {headers});
      if (!response.ok) throw Error('AUTHENTIC_SOURCE_UNAVAILABLE:' + response.status);
      return response.json();
    };
    const ref = await getJson('https://api.github.com/repos/' + expectedRepository +
      '/git/ref/heads/operation-locks/repository-operation-intake-v1');
    if (!isSha(ref?.object?.sha)) return none;
    // Ref is read once. The ledger is fetched at that IMMUTABLE commit.
    const rawResponse = await fetch('https://raw.githubusercontent.com/' + expectedRepository +
      '/' + ref.object.sha + '/.github/operation-intake/active-operation-ledger.v1.json', {
        headers: {Authorization: 'Bearer ' + process.env.GITHUB_TOKEN}
      });
    if (!rawResponse.ok) return none;
    const ledger = JSON.parse(await rawResponse.text());
    if (ledger?.schema !== 'REPOSITORY_ACTIVE_OPERATION_LEDGER_v1' ||
        !ledger.activeScopes || typeof ledger.activeScopes !== 'object') return none;
    const generation = branchIdentity ? Number(branchIdentity[1]) : null;
    if (branchIdentity && (!Number.isSafeInteger(generation) || generation < 1)) return none;
    const candidates = Object.entries(ledger.activeScopes)
      .filter(([key, lock]) =>
        (branchIdentity ? lock?.lockGeneration === generation :
          lock?.operationId === prOperationLocator) &&
        lock.lockScope?.startsWith('H_EARTH:') &&
        key === lock.scopeHash &&
        ['ADMITTED_LOCKED', 'EXECUTING'].includes(lock.state) &&
        lock.released === false);
    if (candidates.length !== 1) return none;
    const lock = candidates[0][1];
    if (!Number.isSafeInteger(lock.lockGeneration) || lock.lockGeneration < 1) return none;
    const inv = lock.authorityProvenance?.invocation;
    if (inv?.repository !== expectedRepository || !Number.isInteger(inv.commentId)) return none;
    const comment = await getJson('https://api.github.com/repos/' + expectedRepository +
      '/issues/comments/' + inv.commentId);
    if (!String(comment.body || '').startsWith(admissionMarker)) return none;
    const packet = JSON.parse(comment.body.slice(admissionMarker.length));
    if (packet.schema !== 'CANONICAL_OPERATION_INTAKE_TRANSPORT_REQUEST_v1' ||
        !verifyCanonicalLockPair(lock, packet, comment, lock.lockGeneration)) return none;
    // Only now may the owner-signed exact branch name replace the legacy
    // generated name. Require the live GitHub ref to match the PR head SHA.
    const admittedBranch = admittedCandidateBranch(
      lock, packet, branch, prOperationLocator, fromPr);
    if (!admittedBranch) return none;
    const candidateRef = await getJson('https://api.github.com/repos/' + expectedRepository +
      '/git/ref/heads/' + admittedBranch);
    if (candidateRef?.ref !== 'refs/heads/' + admittedBranch ||
        candidateRef.object?.sha !== candidateHead) return none;
    const allowed = packet.operationRequest.allowedPaths;
    if (!allWithinAdmission(changedPaths, allowed)) return none;
    // Do not give registry/control-plane changes a product-candidate exemption.
    if (changedPaths.some(isExplicitHEarthRegistryDependency)) return none;
    execFileSync('git', ['merge-base', '--is-ancestor', lock.governingHead, candidateHead],
      {stdio: 'ignore'});
    return Object.freeze({ paths: ambiguous, operationId: lock.operationId,
      lockGeneration: lock.lockGeneration });
  } catch {
    // Missing network, Git objects, authority, or malformed evidence = fail closed.
    return none;
  }
}

export function evaluateWorkflowApplicability({ workflow = WORKFLOW_ID, changedPaths = [], authenticatedCandidatePaths = [] } = {}) {
  if (workflow !== WORKFLOW_ID) {
    const error = new Error(`UNSUPPORTED_WORKFLOW:${workflow}`);
    error.code = 'UNSUPPORTED_WORKFLOW';
    throw error;
  }

  const normalizedPaths = uniqueSorted(changedPaths);
  const explicitDependencyPaths = normalizedPaths.filter(isExplicitHEarthRegistryDependency);
  const authenticated = new Set(authenticatedCandidatePaths);
  const admittedCandidatePaths = normalizedPaths.filter(entry =>
    isAmbiguousHEarthAuthorityScope(entry) && authenticated.has(entry));
  const ambiguousAuthorityPaths = normalizedPaths.filter(entry =>
    isAmbiguousHEarthAuthorityScope(entry) && !authenticated.has(entry));
  const knownProductPaths = normalizedPaths.filter(isKnownProductSemanticPath);
  const selectedPaths = uniqueSorted([...explicitDependencyPaths, ...ambiguousAuthorityPaths]);
  const selectedByDecision = selectedPaths.length > 0;

  const reasonCodes = [];
  if (explicitDependencyPaths.length > 0) reasonCodes.push('EXPLICIT_REGISTRY_OR_CONTROL_PLANE_DEPENDENCY');
  if (ambiguousAuthorityPaths.length > 0) reasonCodes.push('AMBIGUOUS_H_EARTH_AUTHORITY_SCOPE_FAIL_CLOSED');
  if (admittedCandidatePaths.length > 0) reasonCodes.push('EXACT_ACTIVE_ADMITTED_CANDIDATE_PATH_RECOGNIZED');
  if (!selectedByDecision && knownProductPaths.length > 0) reasonCodes.push('KNOWN_PRODUCT_SEMANTICS_WITHOUT_REGISTRY_DEPENDENCY');
  if (!selectedByDecision) reasonCodes.push('DIRECTORY_PREFIX_MATCH_ALONE_DOES_NOT_SELECT');

  return {
    schema: SCHEMA,
    workflowId: WORKFLOW_ID,
    decisionAuthority: 'WHOLE_ESTATE_EXECUTION_DECISION_v1',
    result: selectedByDecision ? 'SELECTED' : 'NOT_APPLICABLE',
    selectedByDecision,
    severity: selectedByDecision ? 'SELECTED_BLOCKER' : 'NOT_APPLICABLE',
    failureDispositionWhenUnselected: 'ADVISORY_UNSELECTED',
    mayExecuteExpensiveWork: selectedByDecision,
    changedPaths: normalizedPaths,
    selectedPaths,
    explicitDependencyPaths,
    ambiguousAuthorityPaths,
    admittedCandidatePaths,
    knownProductPaths,
    reasonCodes,
    invariants: {
      prefixMatchAloneMaySelectBlockingGate: false,
      knownProductRuntimePathMayCreateRegistryPrerequisiteSolelyByLocation: false,
      ambiguousHEarthAuthorityScopeFailsClosed: true,
      durableAuthorityBoundaryRequiresExplicitOrUnambiguousAuthorityEvidence: true,
      selectedDependencyFailureRemainsFailClosed: true,
      exactHeadCustodyPreserved: true,
      boundedMutationScopePreserved: true,
      scientificAndEmpiricalFailClosedBoundariesPreserved: true,
      mergeDeploymentPublicationSeparationPreserved: true
    },
    authorityEffect: 'NONE',
    safetyCorePreserved: true
  };
}

function assert(condition, code) {
  if (!condition) throw new Error(`SELF_TEST_ASSERTION_FAILED:${code}`);
}

function runSelfTest() {
  const historicalAudraliaRegression = evaluateWorkflowApplicability({
    changedPaths: [
      'showroom/globe/h-earth/terrain-estate-construction-v1/audralia-tablet-cloud-pass.mjs',
      'showroom/globe/h-earth/terrain-estate-construction-v1/audralia-tablet-weather-morphology-atlas-v1.mjs',
      'showroom/globe/h-earth/terrain-estate-construction-v1/precomputed-gratitude-mesh-v1.mjs'
    ]
  });
  assert(historicalAudraliaRegression.result === 'NOT_APPLICABLE', 'AUDRALIA_THREE_PATH_NOT_APPLICABLE');
  assert(historicalAudraliaRegression.mayExecuteExpensiveWork === false, 'AUDRALIA_THREE_PATH_NO_EXPENSIVE_WORK');
  assert(historicalAudraliaRegression.severity === 'NOT_APPLICABLE', 'AUDRALIA_THREE_PATH_NEUTRAL_SEVERITY');
  assert(historicalAudraliaRegression.knownProductPaths.length === 3, 'AUDRALIA_THREE_PATH_PRODUCT_SEMANTICS');

  const selectedRegistryChange = evaluateWorkflowApplicability({
    changedPaths: ['h-earth-3d/registry/candidate.v1.json']
  });
  assert(selectedRegistryChange.result === 'SELECTED', 'REGISTRY_CHANGE_SELECTED');
  assert(selectedRegistryChange.mayExecuteExpensiveWork === true, 'REGISTRY_CHANGE_MAY_EXECUTE');
  assert(selectedRegistryChange.severity === 'SELECTED_BLOCKER', 'REGISTRY_CHANGE_BLOCKER_SEVERITY');

  const ambiguousHEarthChange = evaluateWorkflowApplicability({
    changedPaths: ['h-earth-3d/new-authority-boundary.mjs']
  });
  assert(ambiguousHEarthChange.result === 'SELECTED', 'AMBIGUOUS_H_EARTH_FAILS_CLOSED');
  assert(ambiguousHEarthChange.reasonCodes.includes('AMBIGUOUS_H_EARTH_AUTHORITY_SCOPE_FAIL_CLOSED'), 'AMBIGUOUS_REASON_TYPED');

  const admittedNovel = 'h-earth-3d/evidence/vegetation-support-fringe-20261030/dry-run.mjs';
  const unadmittedNovel = evaluateWorkflowApplicability({ changedPaths: [admittedNovel] });
  assert(unadmittedNovel.result === 'SELECTED', 'UNADMITTED_SAME_PATH_FAILS_CLOSED');
  const boundNovel = evaluateWorkflowApplicability({
    changedPaths: [admittedNovel], authenticatedCandidatePaths: [admittedNovel]
  });
  assert(boundNovel.result === 'NOT_APPLICABLE', 'AUTHENTICATED_CANDIDATE_NO_REGISTRY_GATE');
  assert(boundNovel.admittedCandidatePaths.length === 1, 'AUTHENTICATED_EXACT_CANDIDATE_ONLY');
  const unrelatedNovel = evaluateWorkflowApplicability({
    changedPaths: [admittedNovel, 'h-earth-3d/unadmitted-control.mjs'],
    authenticatedCandidatePaths: [admittedNovel]
  });
  assert(unrelatedNovel.result === 'SELECTED', 'UNAUTHORIZED_SIBLING_STILL_FAILS_CLOSED');
  const explicitWithNovel = evaluateWorkflowApplicability({
    changedPaths: [admittedNovel, 'h-earth-3d/registry/new-ownership.json'],
    authenticatedCandidatePaths: [admittedNovel]
  });
  assert(explicitWithNovel.result === 'SELECTED', 'CONTROL_PLANE_DEPENDENCY_STILL_SELECTED');

  const canonicalGen3010 = 'H_EARTH_NATURAL_GRASS_SUPPORT_FRINGE_20261030_001';
  const canonicalGen3010Branch = 'h-earth/gen3010-natural-grass-support-fringe-20261030';
  assert(admittedHEarthBranch(canonicalGen3010, 3010) === canonicalGen3010Branch,
    'CANONICAL_GEN3010_BRANCH_DERIVATION');
  assert(admittedHEarthBranch(canonicalGen3010, 3010) !==
    'h-earth/gen3010-foreign-grass-support-fringe-20261030',
    'FOREIGN_GEN3010_BRANCH_CANNOT_BORROW_LOCK');
  assert(admittedHEarthBranch('OTHER_PROJECT_NATURAL_GRASS_SUPPORT_FRINGE_20261030_001', 3010)
    === null, 'FOREIGN_PROJECT_CANNOT_BORROW_LOCK');
  assert(admittedHEarthBranch(canonicalGen3010, 3011) !== canonicalGen3010Branch,
    'WRONG_GENERATION_CANNOT_BORROW_BRANCH');

  // Gen3044: an admitted named branch is not an exception based on its
  // human-readable label. The original owner-signed packet must bind it.
  const namedOperation='H_EARTH_SOIL_SUBSTRATE_COMPOSITION_A03_A04_20261101_001';
  const namedBranch='h-earth/a03-a04-common-soil-substrate-20261101-001';
  const namedLock={operationId:namedOperation,lockGeneration:3044};
  const namedPacket={operationRequest:{subjectIdentity:{newCandidateBranch:namedBranch}}};
  const namedBody='Authority: `'+namedOperation+'`';
  assert(singleHearthPrOperationLocator(namedBody)===namedOperation,
    'GEN3044_PR_BODY_OPERATION_LOCATOR_ONLY');
  assert(singleHearthPrOperationLocator(namedBody+' `H_EARTH_OTHER_OPERATION_20261101_002`')===null,
    'AMBIGUOUS_PR_OPERATION_ID_FAILS_CLOSED');
  assert(admittedCandidateBranch(namedLock,namedPacket,namedBranch,
    singleHearthPrOperationLocator(namedBody),true)===namedBranch,
    'AUTHENTIC_GEN3044_NAMED_BRANCH_ONLY');
  const generatedAlias=admittedHEarthBranch(namedOperation,namedLock.lockGeneration);
  assert(admittedCandidateBranch(namedLock,namedPacket,generatedAlias,null,true)===null,
    'UNDECLARED_GEN3044_GENERATED_ALIAS_FAILS_CLOSED');
  assert(admittedCandidateBranch(namedLock,
    {operationRequest:{subjectIdentity:{newCandidateBranch:generatedAlias}}},
    generatedAlias,null,true)===generatedAlias,
    'EXPLICIT_CANONICAL_BRANCH_PRESERVED');
  assert(admittedCandidateBranch(namedLock,
    {operationRequest:{subjectIdentity:{newCandidateBranch:7}}},
    generatedAlias,null,true)===null,
    'MALFORMED_EXPLICIT_BRANCH_FAILS_CLOSED');
  assert(admittedCandidateBranch(namedLock,namedPacket,'h-earth/foreign',
    namedOperation,true)===null,'FOREIGN_PR_BRANCH_CANNOT_BORROW_LOCK');
  assert(admittedCandidateBranch(namedLock,namedPacket,namedBranch,
    'H_EARTH_OTHER_OPERATION_20261101_002',true)===null,
    'FORGED_OPERATION_LOCATOR_CANNOT_BORROW_LOCK');
  assert(admittedCandidateBranch(namedLock,{operationRequest:{subjectIdentity:{}}},
    namedBranch,namedOperation,true)===null,'UNBOUND_BRANCH_FAILS_CLOSED');
  assert(admittedCandidateBranch(namedLock,namedPacket,namedBranch,
    namedOperation,false)===null,'PUSH_MAY_NOT_BORROW_PR_BRANCH_BINDING');
  assert(admittedCandidateBranch({operationId:canonicalGen3010,lockGeneration:3010},
    {operationRequest:{}},canonicalGen3010Branch,null,false)===canonicalGen3010Branch,
    'LEGACY_CANONICAL_GEN_BRANCH_UNCHANGED');

  // Canonical provenance and digest checks are part of the admission verifier,
  // not just a caller-supplied candidate-path flag.
  const ownerRequest = {
    schema: 'REPOSITORY_OPERATION_REQUEST_v1', operationClass: 'RUNTIME_OR_AUTHORITY',
    projectId: 'H_EARTH', operationId: 'H_EARTH_EXACT_ADMISSION_FIXTURE',
    lockScope: 'H_EARTH:EXACT_ADMISSION_FIXTURE',
    exactGoverningHead: 'a'.repeat(40),
    allowedPaths: ['h-earth-3d/evidence/fixture/**']
  };
  const ownerProcedure = {
    schema: 'REPOSITORY_CONSTRUCTION_PROCEDURE_v1',
    operationClass: 'RUNTIME_OR_AUTHORITY', exactGoverningHead: ownerRequest.exactGoverningHead,
    exactAllowedRepositoryPaths: ownerRequest.allowedPaths
  };
  const ownerPacket = {schema: 'CANONICAL_OPERATION_INTAKE_TRANSPORT_REQUEST_v1',
    operationRequest: ownerRequest, constructionProcedure: ownerProcedure};
  const ownerComment = {
    body: admissionMarker + JSON.stringify(ownerPacket),
    user: {login: 'smansfield635-create'}, author_association: 'OWNER',
    issue_url: 'https://api.github.com/repos/' + expectedRepository + '/issues/999'
  };
  const requestDigest = sha256(JSON.stringify(stable(ownerRequest)));
  const procedureDigest = sha256(JSON.stringify(stable(ownerProcedure)));
  const ownerLock = {
    schema: 'REPOSITORY_OPERATION_LOCK_v1',
    state: 'ADMITTED_LOCKED', released: false, lockGeneration: 3010,
    operationId: ownerRequest.operationId, lockScope: ownerRequest.lockScope,
    governingHead: ownerRequest.exactGoverningHead,
    scopeHash: sha256(ownerRequest.lockScope), requestDigest, procedureLocatorDigest: procedureDigest,
    authorityProvenance: {
      schema: 'REPOSITORY_OPERATION_AUTHORITY_PROVENANCE_v1', origin: 'CANONICAL_INTAKE',
      authorityIdentity: {
        operationId: ownerRequest.operationId, lockGeneration: 3010,
        scopeHash: sha256(ownerRequest.lockScope), governingHead: ownerRequest.exactGoverningHead,
        requestDigest, procedureLocatorDigest: procedureDigest
      },
      invocation: {
        schema: 'REPOSITORY_OPERATION_AUTHORITY_INVOCATION_v1',
        repository: expectedRepository, marker: 'CANONICAL_OPERATION_INTAKE_REQUEST_V1',
        commentAuthorAssociation: 'OWNER', commentAuthorLogin: 'smansfield635-create',
        issueNumber: 999, commentId: 4567, commentBodySha256: sha256(ownerComment.body)
      }
    }
  };
  assert(verifyCanonicalLockPair(ownerLock, ownerPacket, ownerComment, 3010),
    'AUTHENTIC_MATCHING_LOCK_AND_OWNER_PACKET_ACCEPTED');
  assert(!verifyCanonicalLockPair({...ownerLock, released: true}, ownerPacket, ownerComment, 3010),
    'CLOSED_LOCK_REJECTED');
  assert(!verifyCanonicalLockPair(ownerLock, ownerPacket, ownerComment, 3011),
    'GENERATION_MISMATCH_REJECTED');
  assert(!verifyCanonicalLockPair(ownerLock, ownerPacket,
    {...ownerComment, body: ownerComment.body + 'tamper'}, 3010),
    'OWNER_COMMENT_DIGEST_TAMPER_REJECTED');
  assert(!verifyCanonicalLockPair(ownerLock,
    {...ownerPacket, operationRequest: {...ownerRequest, allowedPaths: ['h-earth-3d/**']}},
    ownerComment, 3010), 'FORGED_PATH_SCOPE_REJECTED');
  assert(!verifyCanonicalLockPair(ownerLock, ownerPacket,
    {...ownerComment, author_association: 'CONTRIBUTOR'}, 3010),
    'UNAUTHORIZED_COMMENT_AUTHOR_REJECTED');
  assert(allWithinAdmission(['h-earth-3d/evidence/fixture/dry-run.mjs'],
    ownerRequest.allowedPaths), 'EXACT_ADMITTED_CANDIDATE_GLOB_ACCEPTED');
  assert(!allWithinAdmission(['h-earth-3d/evidence/foreign.mjs'],
    ownerRequest.allowedPaths), 'UNADMITTED_SIBLING_SCOPE_REJECTED');
  assert(!allWithinAdmission(['h-earth-3d/registry/authority.json'],
    ownerRequest.allowedPaths), 'UNDECLARED_DURABLE_AUTHORITY_REJECTED');

  const workflowSelfChange = evaluateWorkflowApplicability({
    changedPaths: ['.github/workflows/h-earth-repository-registry-preflight.yml']
  });
  assert(workflowSelfChange.result === 'SELECTED', 'WORKFLOW_SELF_CHANGE_SELECTED');

  const ignoredEvidenceChange = evaluateWorkflowApplicability({
    changedPaths: ['h-earth-3d/experience-anchor/evidence/receipt.json']
  });
  assert(ignoredEvidenceChange.result === 'NOT_APPLICABLE', 'EVIDENCE_ONLY_NOT_APPLICABLE');

  const unrelatedChange = evaluateWorkflowApplicability({ changedPaths: ['README.md'] });
  assert(unrelatedChange.result === 'NOT_APPLICABLE', 'UNRELATED_CHANGE_NOT_APPLICABLE');
  assert(unrelatedChange.failureDispositionWhenUnselected === 'ADVISORY_UNSELECTED', 'UNSELECTED_DISPOSITION_TYPED');
  assert(unrelatedChange.authorityEffect === 'NONE', 'NO_AUTHORITY_EFFECT');
  assert(unrelatedChange.safetyCorePreserved === true, 'SAFETY_CORE_PRESERVED');

  return {
    schema: 'WORKFLOW_APPLICABILITY_SELF_TEST_RECEIPT_v1',
    result: 'PASS',
    assertions: 44,
    regression: 'RUN_34773289185_AUDRALIA_THREE_PATH_FALSE_BLOCK',
    historicalRegressionDisposition: historicalAudraliaRegression.result,
    selectedFixture: 'H_EARTH_REGISTRY_EXPLICIT_DEPENDENCY',
    selectedFixtureDisposition: selectedRegistryChange.result,
    ambiguousFixture: 'H_EARTH_UNCLASSIFIED_AUTHORITY_SCOPE',
    ambiguousFixtureDisposition: ambiguousHEarthChange.result,
    authorityEffect: 'NONE'
  };
}

function helpText() {
  return [
    'Whole-estate workflow applicability gate v1',
    '',
    'Usage:',
    '  node tools/workflow-applicability-gate.v1.mjs --paths-file <file> [--output <file>]',
    '  node tools/workflow-applicability-gate.v1.mjs --path <path> [--path <path> ...]',
    '  node tools/workflow-applicability-gate.v1.mjs --self-test',
    '',
    'This gate decides whether a legacy workflow is semantically selected before expensive execution.',
    'Known product runtime paths without a registry dependency are NOT_APPLICABLE.',
    'Ambiguous h-earth-3d authority scope remains SELECTED and fail-closed.',
    'NOT_APPLICABLE is a neutral-success disposition and creates no authority.'
  ].join('\n');
}

let options;
try {
  options = parseArguments(process.argv.slice(2));
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(64);
}

if (options.help) {
  process.stdout.write(`${helpText()}\n`);
  process.exit(0);
}

try {
  if (options.selfTest) {
    process.stdout.write(`${JSON.stringify(runSelfTest(), null, 2)}\n`);
    process.exit(0);
  }

  const embeddedSelfTest = runSelfTest();
  if (options.pathsFile) options.paths.push(...readPathsFile(options.pathsFile));
  const candidate = await authenticatedCandidateScope(options.paths);
  const receipt = {
    ...evaluateWorkflowApplicability({ workflow: options.workflow, changedPaths: options.paths,
      authenticatedCandidatePaths: candidate.paths }),
    verifiedAdmission: candidate.operationId ? {
      operationId: candidate.operationId, lockGeneration: candidate.lockGeneration,
      source: 'PINNED_CANONICAL_LEDGER_AND_OWNER_INTAKE_COMMENT'
    } : null,
    embeddedSelfTest: {
      result: embeddedSelfTest.result,
      assertions: embeddedSelfTest.assertions,
      regression: embeddedSelfTest.regression,
      historicalRegressionDisposition: embeddedSelfTest.historicalRegressionDisposition,
      selectedFixtureDisposition: embeddedSelfTest.selectedFixtureDisposition,
      ambiguousFixtureDisposition: embeddedSelfTest.ambiguousFixtureDisposition
    }
  };
  const serialized = `${JSON.stringify(receipt, null, 2)}\n`;

  if (options.output) {
    const outputPath = path.resolve(options.output);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, serialized, 'utf8');
  }

  process.stdout.write(serialized);
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exit(1);
}
