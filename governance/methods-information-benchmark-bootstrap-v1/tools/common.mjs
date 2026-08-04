import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';

export const PACKAGE_PREFIX = 'governance/methods-information-benchmark-bootstrap-v1';
export const SEED_PATH = `${PACKAGE_PREFIX}/origin-seed.v1.json`;
export const AUTH_PATH = `${PACKAGE_PREFIX}/origin-authorization.receipt.v1.json`;
export const FUNCTIONS_PATH = `${PACKAGE_PREFIX}/registries/operational-functions.v1.json`;
export const ROLES_PATH = `${PACKAGE_PREFIX}/registries/role-contracts.v1.json`;
export const CONFLICTS_PATH = `${PACKAGE_PREFIX}/registries/conflict-matrix.v1.json`;

export function fail(code, detail = '') {
  const error = new Error(detail ? `${code}:${detail}` : code);
  error.code = code;
  throw error;
}

export function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  }
  return value;
}

export function canonicalText(value) {
  return JSON.stringify(canonicalize(value));
}

export function sha256Bytes(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

export function sha256Text(text) {
  return sha256Bytes(Buffer.from(text, 'utf8'));
}

export function gitBlobSha1(bytes) {
  return createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`, 'utf8'), bytes])).digest('hex');
}

export function readJson(filePath) {
  try { return JSON.parse(fs.readFileSync(filePath, 'utf8')); }
  catch (error) { fail('INVALID_OR_MISSING_JSON', `${filePath}:${error.message}`); }
}

export function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

export function fileSha256(filePath) {
  return sha256Bytes(fs.readFileSync(filePath));
}

export function normalizeRepoPath(value) {
  if (typeof value !== 'string' || !value.trim()) fail('INVALID_RELATIVE_PATH');
  const normalized = value.trim().replaceAll('\\', '/').replace(/^\.\//, '');
  if (normalized.startsWith('/') || normalized.includes('../')) fail('INVALID_RELATIVE_PATH', value);
  return normalized;
}

export function findRoot(start = process.cwd()) {
  let current = path.resolve(start);
  while (true) {
    if (fs.existsSync(path.join(current, SEED_PATH))) return current;
    const parent = path.dirname(current);
    if (parent === current) fail('BOOTSTRAP_ROOT_NOT_FOUND');
    current = parent;
  }
}

function runGit(root, args, allowFailure = false) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  if (result.error) {
    if (allowFailure) return { status: 1, stdout: '', stderr: result.error.message };
    throw result.error;
  }
  if (!allowFailure && result.status !== 0) fail('GIT_COMMAND_FAILED', `${args.join(' ')}:${result.stderr || result.stdout}`);
  return { status: result.status ?? 1, stdout: result.stdout ?? '', stderr: result.stderr ?? '' };
}

export function repositoryIdentity(root, exactStartingHead, requireGit = false) {
  const probe = runGit(root, ['rev-parse', '--is-inside-work-tree'], true);
  if (probe.status !== 0) {
    if (requireGit) fail('GIT_REPOSITORY_REQUIRED');
    return { gitAvailable: false, head: null, startingHeadIsAncestor: null, clean: null };
  }
  const head = runGit(root, ['rev-parse', 'HEAD^{commit}']).stdout.trim();
  const clean = runGit(root, ['status', '--porcelain=v1', '--untracked-files=all']).stdout.trim() === '';
  const ancestor = runGit(root, ['merge-base', '--is-ancestor', exactStartingHead, head], true).status === 0;
  if (requireGit && !clean) fail('AUTHORITY_WORKTREE_DIRTY');
  if (requireGit && !ancestor) fail('EXACT_STARTING_HEAD_NOT_ANCESTOR');
  return { gitAvailable: true, head, startingHeadIsAncestor: ancestor, clean };
}

export function loadAuthority(root, { requireGit = false } = {}) {
  const seedFile = path.join(root, SEED_PATH);
  const authFile = path.join(root, AUTH_PATH);
  if (!fs.existsSync(seedFile)) fail('ORIGIN_SEED_MISSING');
  if (!fs.existsSync(authFile)) fail('ORIGIN_AUTHORIZATION_RECEIPT_MISSING');
  const seedBytes = fs.readFileSync(seedFile);
  const seed = readJson(seedFile);
  const auth = readJson(authFile);
  const seedSha256 = sha256Bytes(seedBytes);
  const seedGitBlob = gitBlobSha1(seedBytes);
  if (auth.originSeedSha256 !== seedSha256) fail('ORIGIN_SEED_HASH_MISMATCH');
  if (auth.originSeedGitBlob !== seedGitBlob) fail('ORIGIN_SEED_GIT_BLOB_MISMATCH');
  if (auth.originSeedPath !== SEED_PATH) fail('ORIGIN_SEED_PATH_MISMATCH');
  if (seed.exactStartingHead !== auth.exactStartingHead) fail('EXACT_STARTING_HEAD_MISMATCH');
  const repository = repositoryIdentity(root, seed.exactStartingHead, requireGit);
  return { seed, auth, seedSha256, seedGitBlob, seedFile, authFile, repository };
}

export function readRegistries(root) {
  return {
    functions: readJson(path.join(root, FUNCTIONS_PATH)),
    roles: readJson(path.join(root, ROLES_PATH)),
    conflicts: readJson(path.join(root, CONFLICTS_PATH))
  };
}

export function validateGraph(registries) {
  const functions = registries.functions.functions;
  const contracts = registries.roles.contracts;
  const functionIds = new Set();
  const roleIds = new Set();
  for (const fn of functions) {
    if (!fn.functionId || functionIds.has(fn.functionId)) fail('DUPLICATE_OPERATIONAL_FUNCTION', fn.functionId);
    functionIds.add(fn.functionId);
  }
  for (const role of contracts) {
    if (!role.roleId || roleIds.has(role.roleId)) fail('DUPLICATE_ROLE_CONTRACT', role.roleId);
    roleIds.add(role.roleId);
    if (role.createdBy === role.roleId) fail('ROLE_SELF_CREATION', role.roleId);
    if (role.activationAuthority === role.roleId) fail('ROLE_SELF_ACTIVATION', role.roleId);
  }
  const assignments = new Map([...functionIds].map((id) => [id, []]));
  for (const role of contracts) {
    for (const functionId of role.functionIds ?? []) {
      if (!assignments.has(functionId)) fail('UNKNOWN_OPERATIONAL_FUNCTION_ASSIGNMENT', functionId);
      assignments.get(functionId).push(role.roleId);
    }
  }
  for (const [functionId, assignedRoles] of assignments) {
    if (assignedRoles.length === 0) fail('UNASSIGNED_OPERATIONAL_FUNCTION', functionId);
    if (assignedRoles.length > 1) fail('MULTIPLY_ASSIGNED_OPERATIONAL_FUNCTION', functionId);
  }
  for (const fn of functions) {
    if (!roleIds.has(fn.roleId)) fail('FUNCTION_ROLE_CONTRACT_MISSING', fn.roleId);
    for (const predecessor of fn.permanentRolePredecessors ?? []) {
      if (!roleIds.has(predecessor)) fail('UNKNOWN_PERMANENT_ROLE_PREDECESSOR', predecessor);
    }
  }
  const edges = new Map([...roleIds].map((id) => [id, []]));
  for (const fn of functions) for (const predecessor of fn.permanentRolePredecessors ?? []) edges.get(predecessor).push(fn.roleId);
  const visiting = new Set();
  const visited = new Set();
  const visit = (id) => {
    if (visiting.has(id)) fail('PERMANENT_ROLE_GRAPH_CYCLE', id);
    if (visited.has(id)) return;
    visiting.add(id);
    for (const next of edges.get(id) ?? []) visit(next);
    visiting.delete(id);
    visited.add(id);
  };
  for (const id of roleIds) visit(id);
  const eligible = functions.filter((fn) => (fn.permanentRolePredecessors ?? []).length === 0 && fn.requiredBeforeAllConstructionFunctions === true);
  if (eligible.length === 0) fail('NO_ELIGIBLE_FIRST_ROLE');
  if (eligible.length > 1) fail('NONUNIQUE_FIRST_ROLE');
  return { firstRoleId: eligible[0].roleId, functionCount: functions.length, roleCount: contracts.length };
}

export function validateConflictMatrix(registries) {
  const pairs = registries.conflicts.conflictingRolePairs ?? [];
  const seen = new Set();
  for (const pair of pairs) {
    if (!Array.isArray(pair) || pair.length !== 2 || pair[0] === pair[1]) fail('INVALID_CONFLICT_PAIR');
    const key = [...pair].sort().join('|');
    if (seen.has(key)) fail('DUPLICATE_CONFLICT_PAIR', key);
    seen.add(key);
  }
  return seen;
}

export function topologyFrom(registries, graph) {
  const functions = [...registries.functions.functions].sort((a, b) => a.operationOrder - b.operationOrder || a.functionId.localeCompare(b.functionId));
  const contractsByRole = Object.fromEntries(registries.roles.contracts.map((role) => [role.roleId, role]));
  const roles = functions.map((fn) => ({
    roleId: fn.roleId,
    title: contractsByRole[fn.roleId].title,
    status: contractsByRole[fn.roleId].status,
    functionIds: [...contractsByRole[fn.roleId].functionIds],
    predecessors: [...(fn.permanentRolePredecessors ?? [])],
    operationOrder: fn.operationOrder,
    may: [...contractsByRole[fn.roleId].may],
    mayNot: [...contractsByRole[fn.roleId].mayNot]
  }));
  return {
    schema: 'METHODS_INFORMATION_BENCHMARK_GENERATED_ROLE_TOPOLOGY_v1',
    firstPermanentRole: graph.firstRoleId,
    lifecycle: [
      'PROPOSED_ROLE',
      'MATERIALIZED_INACTIVE_ROLE',
      'INDEPENDENTLY_VERIFIED_ROLE',
      'ACTIVATABLE_ROLE',
      'OPERATION_SCOPED_ACTIVE_ASSIGNMENT',
      'RETURNED_OR_SUPERSEDED_ROLE_ASSIGNMENT'
    ],
    roles,
    routingSequence: roles.map((role) => role.roleId)
  };
}

export function fingerprintPayload(authority, registries, topology) {
  return {
    schema: 'METHODS_INFORMATION_BENCHMARK_BOOTSTRAP_FINGERPRINT_PAYLOAD_v1',
    operationId: authority.seed.operationId,
    packageVersion: authority.seed.version,
    exactStartingHead: authority.seed.exactStartingHead,
    originSeedSha256: authority.seedSha256,
    originSeedGitBlob: authority.seedGitBlob,
    originAuthorizationSha256: fileSha256(authority.authFile),
    operationalFunctionsSha256: fileSha256(path.join(findRoot(path.dirname(authority.seedFile)), FUNCTIONS_PATH)),
    roleContractsSha256: fileSha256(path.join(findRoot(path.dirname(authority.seedFile)), ROLES_PATH)),
    conflictMatrixSha256: fileSha256(path.join(findRoot(path.dirname(authority.seedFile)), CONFLICTS_PATH)),
    topologyDigest: sha256Text(canonicalText(topology)),
    canonicalization: authority.seed.canonicalization
  };
}

export function parseArgs(argv, allowed) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!allowed.includes(token)) fail('UNKNOWN_ARGUMENT', token);
    result[token.slice(2)] = argv[++index] ?? null;
  }
  return result;
}

export function ledgerPayload(ledger) {
  return {
    schema: ledger.schema,
    operationId: ledger.operationId,
    revision: ledger.revision,
    completedRoles: ledger.completedRoles,
    assignments: ledger.assignments
  };
}

export function computeLedgerHead(ledger) {
  return sha256Text(canonicalText(ledgerPayload(ledger)));
}

export function initialLedger(operationId) {
  const ledger = {
    schema: 'METHODS_INFORMATION_BENCHMARK_ROLE_ASSIGNMENT_LEDGER_v1',
    operationId,
    revision: 0,
    ledgerHead: '',
    completedRoles: [],
    assignments: []
  };
  ledger.ledgerHead = computeLedgerHead(ledger);
  return ledger;
}
