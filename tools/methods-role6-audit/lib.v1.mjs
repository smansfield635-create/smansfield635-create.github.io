import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export const OPERATION_ID = "METHODS_FORMAL_RECORD_TYPE_DEPENDENCY_THREE_ANCHOR_AND_DEVELOPMENTAL_BASELINE_AUDIT_v1";
export const ASSIGNMENT_HEAD = "ce40519190a9048c1e0cef682108c34b0a7f8055";
export const ASSIGNMENT_ID = "8c4d0f0fb1b3068764e476c4";
export const PACKET_HEAD = "fa7e74403ff43e017bccef7462f4e001918cf0a3";
export const PACKET_SHA256 = "5c93a8ebe638b9f06a4e14fc42f8ee202c8801e940527aa4fb987006a04e0cdc";
export const REGISTRY_PATH = "control-plane/methods-information-benchmark/role6-audit-bootstrap/audit-output-path-registry.v1.json";

export class AuditError extends Error {
  constructor(code, detail = "") {
    super(detail ? `${code}:${detail}` : code);
    this.name = "AuditError";
    this.code = code;
    this.detail = detail;
  }
}

export function assert(condition, code, detail = "") {
  if (!condition) throw new AuditError(code, detail);
}

export function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) throw new AuditError("INPUT_SCHEMA_INVALID", `unexpected_argument:${token}`);
    const key = token.slice(2);
    if (key === "self-test") {
      out.selfTest = true;
      continue;
    }
    const value = argv[i + 1];
    if (value === undefined || value.startsWith("--")) throw new AuditError("INPUT_SCHEMA_INVALID", `missing_value:${token}`);
    out[key.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = value;
    i += 1;
  }
  return out;
}

export function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

export function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function normalize(value) {
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, normalize(value[key])]));
  }
  return value;
}

export function stableJson(value) {
  return `${JSON.stringify(normalize(value))}\n`;
}

export function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function canonicalPayloadBytes(payload) {
  return `${JSON.stringify(payload, null, 2)}\n`;
}

export function loadRegistry(repoRoot) {
  const registry = readJson(path.join(repoRoot, REGISTRY_PATH));
  assert(registry.schema === "METHODS_ROLE_6_AUDIT_OUTPUT_PATH_REGISTRY_v1", "INPUT_SCHEMA_INVALID", "registry_schema");
  assert(registry.operationId === OPERATION_ID, "OPERATION_ID_MISMATCH", "registry_operation");
  assert(registry.assignmentHead === ASSIGNMENT_HEAD && registry.assignmentId === ASSIGNMENT_ID, "ASSIGNMENT_IDENTITY_MISMATCH", "registry_assignment");
  assert(registry.substantiveOutputs.length === 27 && registry.returnArtifacts.length === 2, "OUTPUT_COUNT_MISMATCH", "registry_counts");
  return registry;
}

export function expectedEntries(registry) {
  return [...registry.substantiveOutputs, ...registry.returnArtifacts].map(({ id, path: entryPath }) => ({ id, path: entryPath }));
}

export function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function validatePackage(pkg, registry) {
  assert(isPlainObject(pkg), "INPUT_SCHEMA_INVALID", "package_not_object");
  assert(pkg.schema === "METHODS_ROLE_6_AUDIT_PACKAGE_v1", "INPUT_SCHEMA_INVALID", "package_schema");
  assert(pkg.operationId === OPERATION_ID, "OPERATION_ID_MISMATCH");
  assert(pkg.assignmentHead === ASSIGNMENT_HEAD && pkg.assignmentId === ASSIGNMENT_ID, "ASSIGNMENT_IDENTITY_MISMATCH");
  assert(pkg.packetHead === PACKET_HEAD && pkg.packetCanonicalSha256 === PACKET_SHA256, "ASSIGNMENT_IDENTITY_MISMATCH", "packet_identity");
  assert(typeof pkg.executionHolder === "string" && /^[A-Z0-9][A-Z0-9_.:-]{2,127}$/.test(pkg.executionHolder), "INPUT_SCHEMA_INVALID", "execution_holder");
  assert(Array.isArray(pkg.substantiveOutputs) && pkg.substantiveOutputs.length === 27, "OUTPUT_COUNT_MISMATCH", "substantive");
  assert(Array.isArray(pkg.returnArtifacts) && pkg.returnArtifacts.length === 2, "OUTPUT_COUNT_MISMATCH", "returns");

  const actual = [...pkg.substantiveOutputs, ...pkg.returnArtifacts];
  const expected = expectedEntries(registry);
  const ids = new Set();
  const paths = new Set();

  actual.forEach((entry, index) => {
    assert(isPlainObject(entry), "INPUT_SCHEMA_INVALID", `entry_${index}`);
    assert(entry.id === expected[index].id && entry.path === expected[index].path, "OUTPUT_ID_OR_PATH_MISMATCH", `entry_${index}`);
    assert(!ids.has(entry.id) && !paths.has(entry.path), "DUPLICATE_OUTPUT_ID_OR_PATH", `entry_${index}`);
    ids.add(entry.id);
    paths.add(entry.path);
    assert(isPlainObject(entry.payload), "PAYLOAD_NOT_OBJECT", entry.id);
    assert(!entry.path.startsWith("/") && !entry.path.includes(".."), "UNAUTHORIZED_PATH", entry.path);
  });

  assert(actual.length === registry.authorizedChangedPaths.length, "OUTPUT_COUNT_MISMATCH", "authorized_paths");
  assert(actual.every((entry, index) => entry.path === registry.authorizedChangedPaths[index]), "OUTPUT_ID_OR_PATH_MISMATCH", "authorized_path_order");
  return true;
}

export function packageFingerprint(pkg, registry) {
  const domain = {
    operationId: pkg.operationId,
    assignmentHead: pkg.assignmentHead,
    assignmentId: pkg.assignmentId,
    packetHead: pkg.packetHead,
    packetCanonicalSha256: pkg.packetCanonicalSha256,
    executionHolder: pkg.executionHolder,
    substantiveOutputIdPathPayloadMap: pkg.substantiveOutputs,
    returnArtifactIdPathPayloadMap: pkg.returnArtifacts,
    authorizedChangedPaths: registry.authorizedChangedPaths
  };
  return sha256(stableJson(domain));
}

export function safeTarget(root, relativePath) {
  const resolvedRoot = path.resolve(root);
  const target = path.resolve(resolvedRoot, relativePath);
  assert(target === resolvedRoot || target.startsWith(`${resolvedRoot}${path.sep}`), "UNAUTHORIZED_PATH", relativePath);
  return target;
}

export function listFilesRecursive(root) {
  if (!fs.existsSync(root)) return [];
  const output = [];
  const visit = (dir) => {
    for (const name of fs.readdirSync(dir).sort()) {
      const full = path.join(dir, name);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) visit(full);
      else output.push(path.relative(root, full).split(path.sep).join("/"));
    }
  };
  visit(root);
  return output;
}
