import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {createReceipt, digest, verifyReceipt} from "../../javascript/lineage_receipt_protocol_v1.mjs";

export const PROFILE = "ESTATE_DIAGNOSTIC_RECEIPT_PROFILE_v1";
export const PROFILE_VERSION = "1.0.0";
export const PROFILE_SCHEMA = "ESTATE_DIAGNOSTIC_RECEIPT_PROFILE_SCHEMA_v1";
export const COHERENCE_GATE = "AUDRALIA_DIAGNOSTIC_FAMILY_COHERENCE_GATE_v1";
export const CYCLE_PROFILE = "ESTATE_DIAGNOSTIC_F1_F89_CYCLE_ROOT_v1";
export const FIBONACCI_STATIONS = Object.freeze(["F1","F3","F5","F8","F13","F21","F34","F55","F89"]);
export const DIAGNOSTIC_ROOT = "showroom/globe/audralia/diagnostic";

export const PROTECTED_LOCAL_FAMILY = Object.freeze({
  "index.html": "398bd1b438a72431446a9fc221e32d5a2d1b7f3e",
  "index.css": "8030a00cf8eacdf26d7d48649b7b28999f0ef740",
  "index.js": "e3930d350255569bec73fdbd77ef9de13e6157f4",
  "index.controls.js": "4ea62b0c1291b997ab9b497f3e2e745ddd9d9808",
  "index.control.bridge.js": "857cbacf174dd0e27203e4b0d230c4a93e28ac47",
  "index.inspection.lane.js": "206602dde5f48bcbddf29c40104babb8d0f52107",
  "index.inspection.authority.js": "d9f989407e42ecd85779ff358ed656a99105a7b5",
  "index.inspection.registry.js": "50fb95cfb09cdf64b4d303282ab992c36b856edc"
});

const SHA256_RE = /^[0-9a-f]{64}$/;
const SHA1_RE = /^[0-9a-f]{40}$/;

function assert(condition, code) { if (!condition) throw new Error(code); }
function nonempty(value, code) { assert(typeof value === "string" && value.length > 0, code); return value; }
function digest64(value, code) { assert(typeof value === "string" && SHA256_RE.test(value), code); return value; }
function sha40(value, nullable, code) {
  if (nullable && value === null) return null;
  assert(typeof value === "string" && SHA1_RE.test(value), code);
  return value;
}
function clone(value) { return JSON.parse(JSON.stringify(value)); }

export function validateEstateDiagnosticPayload(payload) {
  assert(payload && typeof payload === "object" && !Array.isArray(payload), "PROFILE_PAYLOAD_NOT_OBJECT");
  const allowed = new Set([
    "profile","profile_version","receipt_id","instrument","producer","target","execution",
    "input_refs","evidence","absence","result","direction","claim_ceiling",
    "parent_receipt_digests","archive_locator","legacy_receipt","cycle_root"
  ]);
  for (const key of Object.keys(payload)) assert(allowed.has(key), `PROFILE_UNDECLARED_FIELD:${key}`);
  assert(payload.profile === PROFILE, "PROFILE_ID_MISMATCH");
  assert(payload.profile_version === PROFILE_VERSION, "PROFILE_VERSION_MISMATCH");
  nonempty(payload.receipt_id, "RECEIPT_ID_INVALID");
  nonempty(payload.instrument?.id, "INSTRUMENT_ID_INVALID");
  digest64(payload.instrument?.definition_digest, "INSTRUMENT_DEFINITION_DIGEST_INVALID");
  nonempty(payload.producer?.id, "PRODUCER_ID_INVALID");
  assert(["instrument","workflow","browser","human","other"].includes(payload.producer?.kind), "PRODUCER_KIND_INVALID");
  nonempty(payload.target?.uri, "TARGET_URI_INVALID");
  nonempty(payload.target?.identity, "TARGET_IDENTITY_INVALID");
  if (payload.target?.digest !== null && payload.target?.digest !== undefined) digest64(payload.target.digest, "TARGET_DIGEST_INVALID");
  sha40(payload.execution?.repository_sha, false, "REPOSITORY_SHA_INVALID");
  sha40(payload.execution?.deployment_sha ?? null, true, "DEPLOYMENT_SHA_INVALID");
  nonempty(payload.execution?.invocation_id, "INVOCATION_ID_INVALID");
  nonempty(payload.execution?.started_at, "STARTED_AT_INVALID");
  nonempty(payload.execution?.finished_at, "FINISHED_AT_INVALID");
  assert(Array.isArray(payload.input_refs), "INPUT_REFS_INVALID");
  for (const ref of payload.input_refs) { nonempty(ref?.id, "INPUT_REF_ID_INVALID"); digest64(ref?.digest, "INPUT_REF_DIGEST_INVALID"); }
  assert(Array.isArray(payload.evidence), "EVIDENCE_INVALID");
  assert(Array.isArray(payload.absence), "ABSENCE_INVALID");
  nonempty(payload.result, "RESULT_INVALID");
  nonempty(payload.direction, "DIRECTION_INVALID");
  nonempty(payload.claim_ceiling, "CLAIM_CEILING_INVALID");
  assert(Array.isArray(payload.parent_receipt_digests), "PARENT_DIGESTS_INVALID");
  for (const value of payload.parent_receipt_digests) digest64(value, "PARENT_DIGEST_INVALID");
  assert(payload.archive_locator === null || typeof payload.archive_locator === "string", "ARCHIVE_LOCATOR_INVALID");
  return clone(payload);
}

export async function createEstateDiagnosticReceipt(payload) {
  return createReceipt(validateEstateDiagnosticPayload(payload));
}

export async function verifyEstateDiagnosticReceipt(receipt) {
  const base = await verifyReceipt(receipt);
  if (base.state !== "VALID") return {...base, profile_state: "INVALID"};
  try {
    validateEstateDiagnosticPayload(receipt.payload);
    return {...base, profile_state: "VALID"};
  } catch (error) {
    return {...base, state: "INVALID", profile_state: "INVALID", reasons: [...base.reasons, String(error.message || error)]};
  }
}

export async function buildOrderedCycleRoot(stationReceipts) {
  assert(Array.isArray(stationReceipts) && stationReceipts.length === FIBONACCI_STATIONS.length, "CYCLE_STATION_COUNT_INVALID");
  const ordered = stationReceipts.map((entry, index) => {
    assert(entry?.station === FIBONACCI_STATIONS[index], `CYCLE_STATION_ORDER_INVALID:${index}`);
    return {station: entry.station, lineage_digest: digest64(entry.lineage_digest, `CYCLE_STATION_DIGEST_INVALID:${entry.station}`)};
  });
  const body = {profile: CYCLE_PROFILE, order: [...FIBONACCI_STATIONS], receipts: ordered};
  return {...body, cycle_root_digest: await digest(body)};
}

export function wrapLegacyReceiptVerbatim({canonicalization, canonical_json, receipt_digest}) {
  nonempty(canonicalization, "LEGACY_CANONICALIZATION_INVALID");
  nonempty(canonical_json, "LEGACY_CANONICAL_JSON_INVALID");
  digest64(receipt_digest, "LEGACY_RECEIPT_DIGEST_INVALID");
  return {
    profile: "ESTATE_DIAGNOSTIC_LEGACY_RECEIPT_VERBATIM_WRAPPER_v1",
    legacy_canonicalization: canonicalization,
    legacy_receipt_digest: receipt_digest,
    legacy_receipt_canonical_json: canonical_json,
    reinterpretation_performed: false
  };
}

export function toHumanManifest(receipt) {
  assert(receipt?.payload?.profile === PROFILE, "HUMAN_MANIFEST_PROFILE_INVALID");
  const p = receipt.payload;
  return {
    receipt_id: p.receipt_id,
    instrument_id: p.instrument.id,
    producer_id: p.producer.id,
    target_uri: p.target.uri,
    repository_sha: p.execution.repository_sha,
    deployment_sha: p.execution.deployment_sha,
    result: p.result,
    direction: p.direction,
    claim_ceiling: p.claim_ceiling,
    parent_count: p.parent_receipt_digests.length,
    cycle_root_digest: p.cycle_root?.cycle_root_digest ?? null,
    lineage_digest: receipt.lineage_digest
  };
}

function gitBlobSha(buffer) {
  const header = Buffer.from(`blob ${buffer.length}\0`);
  return crypto.createHash("sha1").update(header).update(buffer).digest("hex");
}
function sha256(buffer) { return crypto.createHash("sha256").update(buffer).digest("hex"); }
function snapshot(repoRoot) {
  const result = {};
  for (const [name, expectedBlob] of Object.entries(PROTECTED_LOCAL_FAMILY)) {
    const absolute = path.join(repoRoot, DIAGNOSTIC_ROOT, name);
    const bytes = fs.readFileSync(absolute);
    result[name] = {git_blob_sha1: gitBlobSha(bytes), expected_git_blob_sha1: expectedBlob, sha256: sha256(bytes), size: bytes.length};
  }
  return result;
}
function readDiagnostic(repoRoot, name) { return fs.readFileSync(path.join(repoRoot, DIAGNOSTIC_ROOT, name), "utf8"); }

export function inspectAudraliaDiagnosticFamily(repoRoot = process.cwd()) {
  const before = snapshot(repoRoot);
  const html = readDiagnostic(repoRoot, "index.html");
  const bridge = readDiagnostic(repoRoot, "index.control.bridge.js");
  const lane = readDiagnostic(repoRoot, "index.inspection.lane.js");
  const engine = readDiagnostic(repoRoot, "index.js");
  const controls = readDiagnostic(repoRoot, "index.controls.js");
  const pairs = [
    ["HTML_BRIDGE_DECLARATION_VS_SOURCE","AUDRALIA_DIAGNOSTIC_RELATIONAL_CONTROL_COMPATIBILITY_BRIDGE_TNT_v11",html,"AUDRALIA_DIAGNOSTIC_RELATIONAL_CONTROL_COMPATIBILITY_BRIDGE_TNT_v12",bridge],
    ["HTML_INSPECTION_DECLARATION_VS_SOURCE","AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE_TNT_v2",html,"AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE_TNT_v3",lane],
    ["CONTROLS_EXPECTATION_VS_INSPECTION_SOURCE","AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE_TNT_v2",controls,"AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE_TNT_v3",lane],
    ["INSPECTION_ENGINE_EXPECTATION_VS_SOURCE","AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_ENGINE_TNT_v3",lane,"AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_ENGINE_TNT_v5",engine],
    ["INSPECTION_CONTROLS_EXPECTATION_VS_SOURCE","AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_DISTRIBUTED_CONTROL_PANEL_TNT_v8",lane,"AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_DISTRIBUTED_CONTROL_PANEL_TNT_v11",controls],
    ["INSPECTION_BRIDGE_EXPECTATION_VS_SOURCE","AUDRALIA_DIAGNOSTIC_RELATIONAL_CONTROL_COMPATIBILITY_BRIDGE_TNT_v11",lane,"AUDRALIA_DIAGNOSTIC_RELATIONAL_CONTROL_COMPATIBILITY_BRIDGE_TNT_v12",bridge]
  ];
  const mismatches = pairs.filter(([,declared,a,source,b]) => a.includes(declared) && b.includes(source))
    .map(([id,declared,,source]) => ({id, declared, source}));
  const after = snapshot(repoRoot);
  const byteStable = JSON.stringify(before) === JSON.stringify(after);
  const identityPass = Object.values(after).every((entry) => entry.git_blob_sha1 === entry.expected_git_blob_sha1);
  return {
    schema: "AUDRALIA_DIAGNOSTIC_FAMILY_COHERENCE_RECEIPT_v1",
    gate_id: COHERENCE_GATE,
    result: byteStable && identityPass ? (mismatches.length ? "OBSERVED_WITH_GENERATION_SKEW" : "OBSERVED_COHERENT") : "FAIL_CLOSED",
    mutation_performed: false,
    protected_byte_stability: byteStable,
    protected_identity_match: identityPass,
    protected_files: after,
    mismatch_count: mismatches.length,
    mismatches,
    interpretation: "Read-only evidence only. A mismatch is not proof of runtime causation and creates no mutation authority."
  };
}

export async function runSelfTest(repoRoot = process.cwd()) {
  const ZERO64 = "0".repeat(64);
  const ONE64 = "1".repeat(64);
  const repositorySha = process.env.GITHUB_SHA && SHA1_RE.test(process.env.GITHUB_SHA)
    ? process.env.GITHUB_SHA
    : "f9e63ce0e08e1c3bbf69c1afcffe8de6aed41c13";
  const cycle = await buildOrderedCycleRoot(FIBONACCI_STATIONS.map((station,index)=>({station,lineage_digest:index.toString(16).padStart(64,"0")})));
  let reorderRejected = false;
  try {
    const wrong = FIBONACCI_STATIONS.map((station,index)=>({station,lineage_digest:index.toString(16).padStart(64,"0")}));
    [wrong[0],wrong[1]]=[wrong[1],wrong[0]];
    await buildOrderedCycleRoot(wrong);
  } catch { reorderRejected = true; }
  assert(reorderRejected, "CYCLE_REORDER_NOT_REJECTED");
  const legacy = wrapLegacyReceiptVerbatim({canonicalization:"LEGACY_EXAMPLE_CANONICAL_V1",canonical_json:"{\"legacy\":true,\"value\":1.25}",receipt_digest:ONE64});
  const payload = {
    profile: PROFILE, profile_version: PROFILE_VERSION, receipt_id:"estate-diagnostic-self-test-001",
    instrument:{id:"ESTATE_DIAGNOSTIC_SELF_TEST",definition_digest:ZERO64},
    producer:{id:"LRPV1_CONFORMANCE",kind:"workflow"},
    target:{uri:"/showroom/globe/audralia/diagnostic/",identity:"AUDRALIA_DIAGNOSTIC",digest:null},
    execution:{repository_sha:repositorySha,deployment_sha:null,invocation_id:"self-test",started_at:"2026-08-25T00:00:00Z",finished_at:"2026-08-25T00:00:01Z"},
    input_refs:[{id:"fixture",digest:ZERO64}], evidence:[{kind:"positive",id:"self-test"}], absence:[],
    result:"PASS_CLOSED",direction:"NONE",claim_ceiling:"PROFILE_CONFORMANCE_ONLY",parent_receipt_digests:[],
    archive_locator:null,legacy_receipt:legacy,cycle_root:cycle
  };
  const receipt = await createEstateDiagnosticReceipt(payload);
  const verification = await verifyEstateDiagnosticReceipt(receipt);
  assert(verification.state === "VALID" && verification.profile_state === "VALID", "PROFILE_RECEIPT_VERIFY_FAILED");
  const manifest = toHumanManifest(receipt);
  assert(!Object.prototype.hasOwnProperty.call(manifest,"evidence"), "HUMAN_MANIFEST_LEAKED_MACHINE_PAYLOAD");
  const schema = JSON.parse(fs.readFileSync(path.join(repoRoot,"infrastructure/lineage-receipt-protocol-v1/integrations/estate-diagnostic/estate_diagnostic_receipt_profile.schema.v1.json"),"utf8"));
  assert(schema.$id === PROFILE_SCHEMA && schema.properties?.profile?.const === PROFILE, "PROFILE_SCHEMA_MISMATCH");
  const coherence = inspectAudraliaDiagnosticFamily(repoRoot);
  assert(coherence.mutation_performed === false && coherence.protected_byte_stability === true && coherence.protected_identity_match === true, "COHERENCE_PROTECTION_FAILED");
  assert(coherence.result === "OBSERVED_WITH_GENERATION_SKEW" && coherence.mismatch_count >= 2, "COHERENCE_EXPECTED_SKEW_NOT_OBSERVED");
  return {
    schema:"ESTATE_DIAGNOSTIC_RECEIPT_PROFILE_SELF_TEST_v1", result:"PASS_CLOSED", profile:PROFILE,
    lrp_receipt_valid:true, cycle_root_deterministic:true, reordered_cycle_rejected:true,
    legacy_receipt_reinterpreted:false, human_manifest_compact:true,
    coherence_gate_result:coherence.result, coherence_mismatch_count:coherence.mismatch_count,
    audralia_diagnostic_mutation_performed:false, protected_byte_stability:true
  };
}

if (process.argv.includes("--self-test")) {
  runSelfTest().then((result)=>{
    const index = process.argv.indexOf("--output");
    const output = index >= 0 ? process.argv[index+1] : "/tmp/estate-diagnostic-profile-self-test.json";
    fs.writeFileSync(output, `${JSON.stringify(result,null,2)}\n`);
    process.stdout.write(`${JSON.stringify(result)}\n`);
  }).catch((error)=>{ console.error(error.stack || error); process.exit(1); });
} else if (process.argv.includes("--inspect-audralia")) {
  const receipt = inspectAudraliaDiagnosticFamily(process.cwd());
  process.stdout.write(`${JSON.stringify(receipt,null,2)}\n`);
  if (receipt.result === "FAIL_CLOSED") process.exitCode = 1;
}
