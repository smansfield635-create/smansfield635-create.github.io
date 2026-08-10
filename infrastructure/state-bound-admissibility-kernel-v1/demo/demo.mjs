#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { adaptCedarDecision, adaptGenericEvidence, adaptSpiffeIdentity } from '../src/adapters.mjs';
import { generateEd25519Signer, verifyEnvelope } from '../src/dsse.mjs';
import { StateBoundAdmissibilityKernel } from '../src/kernel.mjs';

function context(head, authorityVersion, evidenceVersion) {
  const principal = adaptSpiffeIdentity({ spiffeId: 'spiffe://example.org/agent/release-bot', verified: true, verifier: 'demo-svid-verifier' });
  const authority = adaptCedarDecision({
    decision: 'Allow', verified: true, evaluator: 'demo-cedar-evaluator', policySetDigest: `policy-${authorityVersion}`,
    request: { principal: principal.subject, action: 'Repository::Action::"write"', resource: 'Repository::"demo"', context: { head } }
  });
  return {
    principal,
    operation: { id: 'deploy-change-42', action: 'write' },
    resource: { repository: 'example/demo', paths: ['src/app.js'] },
    state: { gitHead: head },
    authority,
    policy: { id: 'release-policy', version: authorityVersion },
    procedure: { id: 'release-procedure', version: 1 },
    evidence: [adaptGenericEvidence('tests', { suite: 'unit', head, version: evidenceVersion, result: 'PASS' })]
  };
}

const signer = generateEd25519Signer();
let tick = 0;
const kernel = new StateBoundAdmissibilityKernel({ signer, clock: () => `2026-08-09T19:30:${String(tick++).padStart(2, '0')}-05:00` });
const a = context('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'A', 'A');
const b = context('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', 'B', 'B');
const admittedA = kernel.admit(a, { nonce: 'demo-nonce-state-a-0001' });
const exactA = kernel.evaluate(admittedA.capability, a);
const staleA = kernel.evaluate(admittedA.capability, b);
const admittedB = kernel.admitSuccessor(admittedA.capability, b, { nonce: 'demo-nonce-state-b-0002', inheritedAuthority: false });
const exactB = kernel.enforce(admittedB.capability, b);
const replayB = kernel.enforce(admittedB.capability, b);
const signedReceiptVerified = verifyEnvelope(exactB.envelope, signer.publicKey);
const output = {
  schema: 'DIAMOND_GATE_STATE_BOUND_ADMISSIBILITY_DEMO_v1',
  result: exactA.result === 'EXECUTE' && staleA.result === 'DENY_STALE_STATE' && exactB.result === 'EXECUTE' && replayB.result === 'DENY_REPLAY' && signedReceiptVerified ? 'PASS' : 'FAIL',
  scenario: [
    { step: 'ADMIT_STATE_A_AND_EXECUTE', result: exactA.result },
    { step: 'STATE_ADVANCES_TO_B_OLD_ADMISSION_REUSED', result: staleA.result },
    { step: 'FRESH_SUCCESSOR_ADMISSION_FOR_B', result: exactB.result },
    { step: 'CONSUMED_B_CAPABILITY_REPLAYED', result: replayB.result }
  ],
  signedReceiptVerified,
  customerMeaning: 'An operation that was valid for state A is denied after the system changes to state B until a fresh state-bound admission is created.'
};
const text = JSON.stringify(output, null, 2) + '\n';
const index = process.argv.indexOf('--output');
if (index >= 0) {
  const target = process.argv[index + 1];
  if (!target) throw new Error('--output requires a path');
  fs.mkdirSync(path.dirname(path.resolve(target)), { recursive: true });
  fs.writeFileSync(target, text);
} else process.stdout.write(text);
if (output.result !== 'PASS') process.exitCode = 1;
