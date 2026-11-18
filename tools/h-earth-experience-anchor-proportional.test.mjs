import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
const gate='tools/h-earth-experience-anchor-gate.mjs';
const legacy=JSON.parse(fs.readFileSync('h-earth-3d/experience-anchor/H_EARTH_EXPERIENCE_ANCHOR_v1.json','utf8'));
const current=JSON.parse(fs.readFileSync('h-earth-3d/experience-anchor/H_EARTH_CURRENT_WORLD_ACCEPTANCE_v2.json','utf8'));
test('August 2026 early visual is historical, not controlling',()=>{
 assert.equal(legacy.status,'HISTORICAL_SUPERSEDED');
 assert.equal(legacy.authority.controlsAcceptanceOfExperienceChangingUpgrades,false);
 assert.equal(legacy.upgradeAcceptance.receiptRequired,false);
 assert.equal(legacy.supersededBy.originalVideoIsCurrentProductBaseline,false);
 assert.equal(current.status,'ACTIVE_FAIL_CLOSED');
 assert.equal(current.historicalAnchor.currentVisualAuthority,false);
 assert.equal(current.historicalAnchor.preserveHistoricalReceipts,true);
});
test('current-world acceptance pass and 15 adversarial cases',()=>{
 const a=spawnSync(process.execPath,[gate,'--self-test'],{encoding:'utf8',timeout:30000});
 assert.equal(a.status,0,a.stderr+'\n'+a.stdout);
 const result=JSON.parse(a.stdout);
 assert.equal(result.schema,'H_EARTH_CURRENT_WORLD_GATE_SELF_TEST_v2');
 assert.equal(result.result,'PASS');
 assert.equal(result.cases,16);
 assert.equal(result.missingEvidenceFailClosed,true);
});
test('active gate no longer hard-codes the obsolete video identity',()=>{
 const source=fs.readFileSync(gate,'utf8');
 const oldHash=['7757fb4fe731','456b3058ec59','133f5c2136c9','9b282eb6b4df','108600bca573'].join('');
 assert.equal(source.includes(oldHash),false);
 for(const s of ['EXPERIENCE_CHANGE_WITHOUT_CURRENT_WORLD_RECEIPT',
  'INHERITED_CROSS_SCALE_SOURCE_DRIFT','INDEPENDENT_REVIEW_MISSING',
  'PRODUCT_SOURCE_HEAD_NOT_ANCESTOR','CURRENT_WORLD_CHECK_NOT_PROVEN:',
  'EVIDENCE_DIGEST_MISMATCH:', 'HISTORICAL_ANCHOR_STILL_ACTIVE'])
  assert.ok(source.includes(s),'missing fail-closed guard '+s);
});
