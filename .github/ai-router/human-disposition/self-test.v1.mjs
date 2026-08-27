#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateIntakeCompleteness } from '../../../tools/operation-intake/repository-operation-intake-gate.v1.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../..');
const readJson = p => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const expectCode = (code, fn) => {
  let caught = null;
  try { fn(); } catch (e) { caught = e; }
  assert(caught, `expected ${code} but no error was thrown`);
  assert(caught.code === code, `expected ${code} got ${caught.code || caught.message}`);
};

const files = {
  manifest: '.github/ai-router/human-disposition/human-disposition-manifest.schema.v1.json',
  ledger: '.github/ai-router/human-disposition/human-decision-ledger.schema.v1.json',
  completeness: '.github/ai-router/human-disposition/intake-completeness-receipt.schema.v1.json',
  checkpoint: '.github/ai-router/human-disposition/human-checkpoint-receipt.schema.v1.json',
  request: '.github/operation-intake/request.schema.v1.json',
  entry: 'AI_ENTRYPOINT.json'
};
const s = Object.fromEntries(Object.entries(files).map(([k, v]) => [k, readJson(v)]));

assert(s.manifest.$id === 'HUMAN_DISPOSITION_MANIFEST_v1', 'manifest schema identity mismatch');
assert(s.ledger.$id === 'HUMAN_DECISION_LEDGER_v1', 'decision ledger schema identity mismatch');
assert(s.completeness.$id === 'INTAKE_COMPLETENESS_RECEIPT_v1', 'completeness schema identity mismatch');
assert(s.checkpoint.$id === 'HUMAN_CHECKPOINT_RECEIPT_v1', 'checkpoint schema identity mismatch');
assert(s.manifest.properties.authorityEffect.const === 'NONE_BY_HUMAN_DISPOSITION', 'manifest authority leak');
assert(s.ledger.properties.authorityEffect.const === 'NONE_BY_HUMAN_DECISION_LEDGER', 'ledger authority leak');
assert(s.completeness.properties.authorityEffect.const === 'NONE_BY_INTAKE_COMPLETENESS_RECEIPT', 'completeness authority leak');
assert(s.checkpoint.properties.authorityEffect.const === 'NONE_BY_HUMAN_CHECKPOINT_RECEIPT', 'checkpoint authority leak');
assert(s.request.properties.intakeCompletenessReceipt, 'operation request lacks intake completeness binding');

const binding = s.entry.humanDispositionPlane;
assert(binding?.status === 'ACTIVE_FAIL_CLOSED', 'AI Entry human disposition binding not active');
assert(binding?.intakeInvariant === 'NO_MATERIAL_HUMAN_UNKNOWN_ENTERS_INTAKE_UNDECLARED', 'AI Entry invariant mismatch');
assert(binding?.humanDispositionCreatesAuthority === false, 'AI Entry improperly grants authority');
assert(binding?.humanDispositionReplacesOperationLedger === false, 'AI Entry improperly replaces operation ledger');
assert(binding?.defaultQuestionCount === 0, 'AI Entry must default to zero questions');

const base = {
  schema: 'INTAKE_COMPLETENESS_RECEIPT_v1',
  receiptId: 'ICR-TEST-001',
  result: 'COMPLETE_NO_QUESTIONS_REQUIRED',
  unresolvedMaterialQuestions: [],
  receiptDigest: 'test-digest',
  authorityEffect: 'NONE_BY_INTAKE_COMPLETENESS_RECEIPT'
};
const wrap = receipt => ({ intakeCompletenessReceipt: receipt });

validateIntakeCompleteness(wrap(base));
validateIntakeCompleteness(wrap({ ...base, result: 'COMPLETE_AFTER_USER_DISPOSITION' }));
expectCode('HUMAN_DISPOSITION_COMPLETENESS_MISSING_NOT_STARTED', () => validateIntakeCompleteness({}));
expectCode('HUMAN_INPUT_REQUIRED_NOT_STARTED', () => validateIntakeCompleteness(wrap({ ...base, result: 'INCOMPLETE_HUMAN_INPUT_REQUIRED', unresolvedMaterialQuestions: ['OWNER_DECISION_REQUIRED'] })));
expectCode('SCOPE_AMBIGUITY_REQUIRES_USER_DISPOSITION', () => validateIntakeCompleteness(wrap({ ...base, result: 'INCOMPLETE_SCOPE_AMBIGUOUS', unresolvedMaterialQuestions: ['SCOPE_AMBIGUOUS'] })));
expectCode('MATERIAL_UNKNOWN_UNDECLARED', () => validateIntakeCompleteness(wrap({ ...base, unresolvedMaterialQuestions: ['UNDECLARED_MATERIAL_UNKNOWN'] })));
expectCode('HUMAN_DISPOSITION_AUTHORITY_LEAK', () => validateIntakeCompleteness(wrap({ ...base, authorityEffect: 'MERGE_AUTHORIZED' })));
expectCode('COMPLETENESS_RECEIPT_INVALID', () => validateIntakeCompleteness(wrap({ ...base, result: 'UNKNOWN' })));

const receipt = {
  schema: 'HUMAN_DISPOSITION_MVP_SELF_TEST_RECEIPT_v1',
  result: 'PASS',
  invariant: 'NO_MATERIAL_HUMAN_UNKNOWN_ENTERS_INTAKE_UNDECLARED',
  assertions: 20,
  authorityEffect: 'NONE',
  testedFiles: Object.values(files)
};
fs.writeFileSync('/tmp/human-disposition-self-test.json', JSON.stringify(receipt, null, 2) + '\n');
process.stdout.write(JSON.stringify(receipt, null, 2) + '\n');
