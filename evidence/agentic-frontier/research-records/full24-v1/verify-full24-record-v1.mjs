#!/usr/bin/env node
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(directory, '../../../..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const sha256 = text => crypto.createHash('sha256').update(text).digest('hex');
const parseJsonl = text => text.trim().split(/\r?\n/).map((line, index) => {
  try { return JSON.parse(line); }
  catch (error) { throw new Error(`JSONL_PARSE_FAILURE:${index + 1}:${error.message}`); }
});
const count = (rows, predicate) => rows.filter(predicate).length;
const checks = [];
const check = (id, operation) => {
  operation();
  checks.push(id);
};

const resultsText = read('evidence/agentic-frontier/research-records/full24-v1/results-v1.jsonl');
const summaryText = read('evidence/agentic-frontier/research-records/full24-v1/summary-v1.md');
const adjudicationText = read('evidence/agentic-frontier/research-records/full24-v1/adjudication-v1.md');
const receipt = JSON.parse(read('evidence/agentic-frontier/research-records/full24-v1/claim-ceiling-receipt-v1.json'));
const manifestText = read('research/agentic-frontier-comparison/task-manifest-v1.jsonl');
const protocolText = read('research/agentic-frontier-comparison/protocol-v1.md');
const results = parseJsonl(resultsText);
const manifest = parseJsonl(manifestText);

check('RESULTS_SHA256', () => assert.equal(sha256(resultsText), '48db34097cd06b8e7eb87fa38a89a42c20a01a80de17c40294ca03bb70c7df65'));
check('SUMMARY_SHA256', () => assert.equal(sha256(summaryText), 'd15db1265702c20ec7c7b26667c60a7a448cdf0fcab137413567045a2d4b2e1c'));
check('MANIFEST_SHA256', () => assert.equal(sha256(manifestText), '231d7e19b932896c409297ca35192bdd76177b20f4f5d59df2b851fa8f584044'));
check('PROTOCOL_SHA256', () => assert.equal(sha256(protocolText), 'fa54c693686d55fd5a33a60bb953ed0ee296f44ce10f90fdad54046f09630784'));
check('RECEIPT_SCHEMA', () => assert.equal(receipt.schema, 'AGENTIC_FRONTIER_FULL24_CLAIM_CEILING_RECEIPT_v1'));
check('DISPOSITION', () => assert.equal(receipt.disposition, 'PASS_CONFIGURATION_BOUNDED_OBSERVATIONAL_RESULT'));
check('RUN_IDENTITY', () => assert.deepEqual([receipt.source.runId, receipt.source.runHead, receipt.source.aggregateArtifact.id], [33509152430, 'c2dbceb0267b124f5c34ac2fdf5245fc2015bca3', 9808335875]));
check('RESULT_COUNT', () => assert.equal(results.length, 24));
check('MANIFEST_COUNT', () => assert.equal(manifest.length, 24));
check('UNIQUE_TASK_IDS', () => assert.equal(new Set(results.map(row => row.task_id)).size, 24));
check('EXACT_TASK_POPULATION', () => assert.deepEqual(results.map(row => row.task_id).sort(), manifest.map(row => row.task_id).sort()));
check('EMBEDDED_MANIFESTS', () => {
  const byId = new Map(manifest.map(row => [row.task_id, row]));
  for (const row of results) {
    if (row.task_id === 'AF-IR-01') {
      assert.equal(row.manifest, undefined);
      assert.deepEqual(
        [row.source_run_id, row.source_artifact_id, row.source_artifact_sha256],
        [32916289501, 9588436111, 'a4776aa7b833f48eeaa90e99e7b4e067118d5f725f0b906b89a1d329a303bffb']
      );
    } else {
      assert.deepEqual(row.manifest, byId.get(row.task_id));
    }
  }
});
check('RECEIPT_SCHEMAS', () => {
  assert.equal(count(results, row => row.schema === 'AGENTIC_FRONTIER_PAIRED_TASK_RECEIPT_v1'), 23);
  const reused = results.find(row => row.task_id === 'AF-IR-01');
  assert.equal(reused.schema, 'AGENTIC_FRONTIER_PAIRED_SMOKE_AF_IR_01_STOCK_OPENHANDS_ADMISSIBILITY_v3');
});
check('FOUR_BALANCED_STRATA', () => {
  for (const stratum of ['COLLABORATIVE_HANDOFF', 'FAILURE_RECOVERY', 'IMPLEMENTATION_REPAIR', 'LONG_HORIZON']) {
    assert.equal(count(results, row => row.stratum === stratum), 6);
  }
});
check('PAIRED_RESULT_LOGIC', () => {
  for (const row of results) {
    const expected = row.diamond_gate.pass
      ? (row.openhands.pass ? 'BOTH_PASS' : 'DG_ONLY')
      : (row.openhands.pass ? 'OH_ONLY' : 'NEITHER');
    assert.equal(row.paired_result, expected, row.task_id);
  }
});
check('DIAMOND_GATE_PASS_COUNT', () => assert.equal(count(results, row => row.diamond_gate.pass), 10));
check('OPENHANDS_PASS_COUNT', () => assert.equal(count(results, row => row.openhands.pass), 0));
check('DG_ONLY_COUNT', () => assert.equal(count(results, row => row.paired_result === 'DG_ONLY'), 10));
check('OH_ONLY_COUNT', () => assert.equal(count(results, row => row.paired_result === 'OH_ONLY'), 0));
check('BOTH_PASS_COUNT', () => assert.equal(count(results, row => row.paired_result === 'BOTH_PASS'), 0));
check('NEITHER_COUNT', () => assert.equal(count(results, row => row.paired_result === 'NEITHER'), 14));
check('STRATUM_PASS_COUNTS', () => assert.deepEqual(receipt.outcomes.byStratum, {
  COLLABORATIVE_HANDOFF: { diamondGatePass: 4, openHandsPass: 0 },
  FAILURE_RECOVERY: { diamondGatePass: 2, openHandsPass: 0 },
  IMPLEMENTATION_REPAIR: { diamondGatePass: 3, openHandsPass: 0 },
  LONG_HORIZON: { diamondGatePass: 1, openHandsPass: 0 }
}));
check('TESTED_MODEL_IDENTITY', () => assert.deepEqual([...new Set(results.map(row => row.model))], ['qwen2.5-coder:7b']));
check('OPENHANDS_VERSION_IDENTITY', () => assert.deepEqual([...new Set(results.map(row => row.openhands_version))], ['1.14.0']));
check('OPENHANDS_NORMAL_EXITS', () => assert.equal(count(results, row => row.openhands.exit_code === 0), 23));
check('OPENHANDS_INITIALIZED', () => assert.equal(count(results, row => row.openhands.agent_log_tail?.includes('Agent initialized with model:')), 23));
check('OPENHANDS_FINISHED', () => assert.equal(count(results, row => row.openhands.agent_log_tail?.includes('Agent finished')), 23));
check('OPENHANDS_ASSISTANT_MESSAGES', () => assert.equal(count(results, row => row.openhands.agent_log_tail?.includes('"role": "assistant"')), 23));
check('ACTION_SHAPED_SYNTAX', () => {
  const pattern = /\\?"name\\?"\s*:\s*\\?"(?:file_editor|terminal)\\?"/;
  assert.equal(count(results, row => pattern.test(row.openhands.agent_log_tail ?? '')), 21);
});
check('EXACT_REQUEST_TIMEOUT_MESSAGES', () => assert.equal(count(results, row => row.openhands.agent_log_tail?.includes('Request timed out')), 18));
check('TOOL_CALLS_NULL', () => assert.equal(count(results, row => row.openhands.agent_log_tail?.includes('"tool_calls": null')), 23));
check('NO_ACTION_EVENTS_IN_PRESERVED_TAILS', () => assert.equal(count(results, row => row.openhands.agent_log_tail?.includes('ActionEvent')), 0));
check('NO_NONEMPTY_OPENHANDS_CHANGED_LIST', () => assert.equal(count(results, row => Array.isArray(row.openhands.changed) && row.openhands.changed.length > 0), 0));
check('OPENHANDS_EMPTY_CHANGED_LISTS', () => assert.equal(count(results, row => Array.isArray(row.openhands.changed) && row.openhands.changed.length === 0), 23));
check('ONE_TERMINAL_TIMEOUT', () => assert.equal(count(results, row => row.openhands.terminal === 'FAIL_TIMEOUT' && row.openhands.changed == null), 1));
check('SUMMARY_BOUNDARY', () => assert.ok(summaryText.includes('do not establish universal rank, superiority across all configurations, or architecture-only causation')));
check('ADJUDICATION_BOUNDARY', () => {
  for (const phrase of [
    'configuration-bounded difference in conversion from agentic intent to verified state change',
    'It is not a causal estimate.',
    'a universal ranking of Diamond Gate and OpenHands',
    'transfer of scientific support to VNF, VOER/LVTG, MAPS, Mars, cosmology'
  ]) assert.ok(adjudicationText.includes(phrase), phrase);
});
check('AUTHORITY_CEILING', () => assert.deepEqual(receipt.authority, {
  evidenceRecordPublicationAuthorized: true,
  researchPageClaimPublicationAuthorized: false,
  experimentRerunAuthorized: false,
  scientificGeneralizationAuthorized: false,
  crossDomainEvidenceTransferAuthorized: false
}));
check('FORBIDDEN_CLAIMS_ENUMERATED', () => assert.deepEqual(receipt.forbiddenClaims, [
  'UNIVERSAL_FRAMEWORK_SUPERIORITY',
  'GENERAL_10_TO_0_OPENHANDS_RANK',
  'ARCHITECTURE_ONLY_CAUSATION',
  'PSALM_CAUSATION',
  'FULLY_HEALTHY_OPENHANDS_TOOL_ENVIRONMENT',
  'OPENHANDS_REASONING_INABILITY',
  'CROSS_DOMAIN_SCIENTIFIC_EVIDENCE_TRANSFER'
]));

process.stdout.write(`${JSON.stringify({
  schema: 'AGENTIC_FRONTIER_FULL24_VERIFICATION_RECEIPT_v1',
  result: 'PASS',
  checksPassed: checks.length,
  checks,
  population: 24,
  diamondGatePass: 10,
  openHandsPass: 0,
  claimCeilingPreserved: true
}, null, 2)}\n`);
