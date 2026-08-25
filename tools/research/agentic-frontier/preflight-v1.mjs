import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const EXPECTED = Object.freeze({
  protocolBlob: '6a9e6eece0dfef878916326d85a2e1c1f97a07d6',
  manifestBlob: '1a58fc403720f13438a7db53faf157bfece89902',
  population: 24,
  openHandsRelease: '1.14.0',
  openHandsCommit: 'c0ba9e6d2b73dca07fe1127b91c1eff719853846',
  openHandsAgentServer: '1.42.1'
});

function blob(path) {
  return execFileSync('git', ['hash-object', path], { encoding: 'utf8' }).trim();
}

const protocolPath = 'research/agentic-frontier-comparison/protocol-v1.md';
const manifestPath = 'research/agentic-frontier-comparison/task-manifest-v1.jsonl';
const protocolBlob = blob(protocolPath);
const manifestBlob = blob(manifestPath);
const rows = readFileSync(manifestPath, 'utf8').trim().split(/\n/).filter(Boolean).map(JSON.parse);
const ids = new Set(rows.map(r => r.task_id));
const frozen = rows.every(r => r.frozen === true);
const credentialPresent = Boolean(process.env.LLM_API_KEY);
const modelPresent = Boolean(process.env.LLM_MODEL);

const checks = {
  protocol_identity: protocolBlob === EXPECTED.protocolBlob,
  manifest_identity: manifestBlob === EXPECTED.manifestBlob,
  population_24: rows.length === EXPECTED.population && ids.size === EXPECTED.population,
  all_rows_frozen: frozen,
  openhands_release_pinned: EXPECTED.openHandsRelease === '1.14.0' && EXPECTED.openHandsAgentServer === '1.42.1',
  model_credential_present: credentialPresent,
  model_identifier_present: modelPresent
};

const receipt = {
  schema: 'AGENTIC_FRONTIER_PAIRED_EXECUTION_PREFLIGHT_v1',
  result: Object.values(checks).every(Boolean) ? 'PASS_READY_TO_EXECUTE' : 'BLOCKED_PREFLIGHT',
  checks,
  frozen: EXPECTED,
  credential: credentialPresent ? 'PRESENT_REDACTED' : 'MISSING',
  model: modelPresent ? 'PRESENT_REDACTED' : 'MISSING'
};

process.stdout.write(JSON.stringify(receipt, null, 2) + '\n');
if (receipt.result !== 'PASS_READY_TO_EXECUTE') process.exitCode = 2;
