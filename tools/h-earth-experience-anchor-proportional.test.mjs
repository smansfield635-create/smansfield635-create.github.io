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

test('current-world receipt binds frozen product rather than self-referential review commit',()=>{
 const source=fs.readFileSync(gate,'utf8');
 assert.ok(source.includes('r.candidateHead!==r.productSourceHead'),'frozen product head binding missing');
 assert.equal(source.includes('r.candidateHead!==head'),false,'impossible embedded review-head binding restored');
 assert.ok(source.includes("PRODUCT_SOURCE_HEAD_NOT_ANCESTOR"),'descendant review branch verification missing');
 assert.ok(source.includes('blob(receipt.productSourceHead,f.path)!==f.gitBlob'),'reviewed product file identity not protected');
 assert.ok(source.includes("INDEPENDENT_REVIEW_MISSING"),'mandatory independent review erased');
 assert.ok(source.includes("OWNER_KEEP_DISPOSITION_NOT_PROVEN"),'mandatory authenticated owner KEEP erased');
});

test('Gen3453 runtime exception is exact-identity constrained and adversarially exercised',()=>{
 const source=fs.readFileSync(gate,'utf8');
 for(const value of [
  "GEN3453_PRODUCT_HEAD='4fe58d4ae1566a99ca87dc385cfea053bac7efa6'",
  'GEN3453_TRAVERSAL_RUN=44855110841',
  'GEN3453_TRAVERSAL_ARTIFACT=14687009434',
  "GEN3453_TRAVERSAL_SHA256='321c8ef2c6419105c40ef09cf8511d4cbbd6ae09f5f9de690816bc983eae962c'",
  'run?.head_sha===sourceHead',
  'artifact?.workflow_run?.head_sha===sourceHead',
  'artifact?.digest===',
  'GEN3453_EXACT_ARTIFACT_CUSTODY'
 ])assert.ok(source.includes(value),'missing source-bound custody constraint '+value);
 assert.equal(source.includes('artifact?.name===sourceHead'),false,'unbounded artifact name');
});
