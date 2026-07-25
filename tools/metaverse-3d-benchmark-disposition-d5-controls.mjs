import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import { compileD5 } from './metaverse-3d-benchmark-disposition-d5-compile.mjs';
import { DIMENSIONS, EXPECTED, SUBJECTS, assert, digest } from './metaverse-3d-benchmark-disposition-d5-core.mjs';

const outputs = await compileD5();
const fact = outputs['fact-disposition-manifest.json'];
const dimensions = outputs['dimension-disposition-manifest.json'];
const subjectDimensions = outputs['subject-dimension-disposition-manifest.json'];
const subjects = outputs['subject-disposition-manifest.json'];
const deferred = outputs['deferred-evidence-ledger.json'];
const acceptance = outputs['acceptance-eligibility-ledger.json'];
const trace = outputs['traceability-index.json'];
const d5a = outputs['d5a-rule-lock.receipt.json'];
const d5b = outputs['d5b-disposition-compilation.receipt.json'];
const d5c = outputs['d5c-subject-reconciliation.receipt.json'];
const d5d = outputs['d5d-closure-audit.json'];
const aggregate = outputs['d5.aggregate.receipt.json'];

assert(fact.dispositionRecordCount === EXPECTED.factCount && digest(fact.records) === fact.dispositionManifestSha256, 'D5_FACT_MANIFEST_CONTROL_FAILED');
assert(dimensions.dispositionRecordCount === DIMENSIONS.length && digest(dimensions.records) === dimensions.dispositionManifestSha256, 'D5_DIMENSION_MANIFEST_CONTROL_FAILED');
assert(subjectDimensions.dispositionRecordCount === SUBJECTS.length * DIMENSIONS.length && digest(subjectDimensions.records) === subjectDimensions.dispositionManifestSha256, 'D5_SUBJECT_DIMENSION_MANIFEST_CONTROL_FAILED');
assert(subjects.dispositionRecordCount === SUBJECTS.length && digest(subjects.records) === subjects.dispositionManifestSha256, 'D5_SUBJECT_MANIFEST_CONTROL_FAILED');
assert(digest(deferred.records) === deferred.ledgerSha256, 'D5_DEFERRED_LEDGER_CONTROL_FAILED');
assert(acceptance.admissibleSubjectCount === 0 && acceptance.acceptedSubjectCount === 0 && digest(acceptance.records) === acceptance.ledgerSha256, 'D5_ACCEPTANCE_LEDGER_CONTROL_FAILED');
assert(digest({ records: trace.records, relationRecords: trace.relationRecords }) === trace.traceabilityIndexSha256, 'D5_TRACEABILITY_CONTROL_FAILED');
for (const receipt of [d5a,d5b,d5c,d5d,aggregate]) {
  const { deterministicReceiptSha256, ...body } = receipt;
  assert(digest(body) === deterministicReceiptSha256, `D5_RECEIPT_CONTROL_FAILED:${receipt.checkpoint}`);
}
assert(d5d.failedControlCount === 0 && d5d.compilerClosureReady === true, 'D5_CLOSURE_AUDIT_FAILED');
assert(aggregate.status === 'PASS_CLOSED' && aggregate.compilerConstructionComplete === true && aggregate.compilerVerified === true, 'D5_AGGREGATE_CLOSURE_FAILED');
assert(aggregate.nextRequiredCompilerCheckpoint === 'NONE', 'D5_UNEXPECTED_NEXT_CHECKPOINT');
assert(aggregate.productFilesChanged === 0 && aggregate.hEarthFilesChanged === 0 && aggregate.mainChanged === false && aggregate.mergePerformed === false && aggregate.userAcceptanceGranted === false, 'D5_BOUNDARY_FAILED');

const contractPath = resolve(fileURLToPath(new URL('.', import.meta.url)), 'metaverse-3d-benchmark-disposition-d5-contract.json');
const contract = JSON.parse(await readFile(contractPath, 'utf8'));
assert(contract.finalStoppingPoint === 'D5_PASS_CLOSED' && contract.nextRequiredCompilerCheckpointAfterPass === 'NONE', 'D5_CONTRACT_STOPPING_POINT_FAILED');

console.log(JSON.stringify({
  checkpoint: 'D5', status: aggregate.status, controls: d5d.controlCount,
  passedControls: d5d.passedControlCount, failedControls: d5d.failedControlCount,
  factDispositions: fact.dispositionRecordCount, relationTraceRecords: trace.relationTraceRecordCount,
  dimensionDispositions: dimensions.dispositionRecordCount,
  subjectDimensionDispositions: subjectDimensions.dispositionRecordCount,
  subjectDispositions: subjects.dispositionRecordCount,
  deferredEvidenceRecords: deferred.deferredRecordCount,
  nextRequiredCompilerCheckpoint: aggregate.nextRequiredCompilerCheckpoint,
  aggregateReceiptSha256: aggregate.deterministicReceiptSha256
}));
