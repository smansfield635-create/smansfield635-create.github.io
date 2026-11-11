import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';

const gate='tools/h-earth-experience-anchor-gate.mjs';
const anchor='h-earth-3d/experience-anchor/H_EARTH_EXPERIENCE_ANCHOR_v1.json';

test('exact-source proportional mode: positive and eleven adversarial fixtures',()=>{
  const result=spawnSync(process.execPath,[gate,'--proportional-self-test'],{
    cwd:process.cwd(),encoding:'utf8',timeout:20000});
  assert.equal(result.status,0,'gate self-test failed: '+result.stderr+'\n'+result.stdout);
  const receipt=JSON.parse(result.stdout);
  assert.equal(receipt.schema,'H_EARTH_PROPORTIONAL_ANCHOR_SELF_TEST_v1');
  assert.equal(receipt.result,'PASS');
  assert.equal(receipt.cases,14);
  assert.equal(receipt.noBroadDirectoryExemption,true);
  assert.equal(receipt.allElevenHardRequirementsRetained,true);
});

test('hard original video, eleven invariant names and no-waiver law remain immutable',()=>{
  const manifest=JSON.parse(fs.readFileSync(anchor,'utf8'));
  assert.equal(manifest.status,'HARD_ACCEPTANCE_CRITERION');
  assert.equal(manifest.sourceVideo.sha256,
    '7757fb4fe731456b3058ec595369133f5c2136c99b282eb6b4df108600bca573');
  assert.equal(manifest.requiredInvariants.length,11);
  assert.equal(manifest.upgradeAcceptance.mayWaiveWithoutExplicitUserReplacementOfAnchor,false);
  assert.equal(manifest.upgradeAcceptance.failureDisposition,'BLOCK_H_EARTH_EXPERIENCE_UPGRADE');
});

test('full Anchor acceptance remains the fail-closed fallback for all other experiences',()=>{
  const source=fs.readFileSync(gate,'utf8');
  for(const literal of [
    'EXPERIENCE_CHANGE_WITHOUT_ANCHOR_RECEIPT',
    'INVARIANT_NOT_PASS:',
    'SCOPED_ROUTE_BLOB_DRIFT',
    'AN_H_EARTH_UPGRADE_FAILS_IF_ENTERING_H_EARTH_FEELS_LIKE_ENTERING_A_DIFFERENT_PRODUCT',
    'PROPORTIONAL_UNAPPROVED_EXPERIENCE_DELTA',
    'PROPORTIONAL_EXACT_ACCEPTED_SOURCE_BLOB_DRIFT',
    'PROPORTIONAL_OWNER_PRECEDENT_MISSING',
    'PROPORTIONAL_ANCHOR_CLAIM_INVALID'
  ]) assert.ok(source.includes(literal),'missing fail-closed predicate: '+literal);
});
