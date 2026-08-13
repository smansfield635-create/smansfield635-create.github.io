#!/usr/bin/env node
import assert from 'node:assert/strict';
import { loadFixture, validateExternalRequest, validateCandidateObjects } from './exact-candidate-adoption.v1.mjs';

const fixture = loadFixture();
assert.equal(fixture.generation,1378);
assert.equal(fixture.force,false);
assert.equal(fixture.expectedChanges.length,19);
assert.equal(fixture.expectedChanges.filter(x=>x.status==='removed').length,18);
assert.equal(fixture.expectedChanges.filter(x=>x.status==='modified').length,1);
assert.equal(validateExternalRequest(fixture,'1378',fixture.candidate,'ADOPT'),true);

for (const [generation,candidate,adopt,code] of [
  ['1377',fixture.candidate,'ADOPT','GENERATION_MISMATCH'],
  ['1378',fixture.expectedParent,'ADOPT','CANDIDATE_MISMATCH'],
  ['1378',fixture.candidate,'NO','ADOPT_REQUEST_INVALID']
]) {
  assert.throws(()=>validateExternalRequest(fixture,generation,candidate,adopt),e=>e.code===code);
}

const commit={sha:fixture.candidate,parents:[{sha:fixture.expectedParent}],commit:{tree:{sha:fixture.candidateTree}}};
const router={sha:fixture.candidateRouterBlob};
const compare={files:fixture.expectedChanges.map(x=>({filename:x.path,status:x.status}))};
assert.equal(validateCandidateObjects(fixture,commit,router,compare),true);
assert.throws(()=>validateCandidateObjects(fixture,{...commit,parents:[{sha:fixture.candidate}]},router,compare),e=>e.code==='CANDIDATE_PARENT_MISMATCH');
assert.throws(()=>validateCandidateObjects(fixture,commit,{sha:fixture.expectedParent},compare),e=>e.code==='CANDIDATE_ROUTER_BLOB_MISMATCH');
assert.throws(()=>validateCandidateObjects(fixture,commit,router,{files:compare.files.slice(1)}),e=>e.code==='CHANGED_PATH_COUNT_MISMATCH');
const drift={files:compare.files.map(x=>({...x}))}; drift.files[0].status='modified';
assert.throws(()=>validateCandidateObjects(fixture,commit,router,drift),e=>e.code==='CHANGED_PATH_STATUS_MISMATCH');
const extra={files:compare.files.map(x=>({...x}))}; extra.files[0].filename='UNAUTHORIZED.txt';
assert.throws(()=>validateCandidateObjects(fixture,commit,router,extra),e=>e.code==='UNAUTHORIZED_CHANGED_PATH');

process.stdout.write(JSON.stringify({schema:'EXACT_CANDIDATE_ADOPTION_SELF_TEST_RECEIPT_v1',result:'PASS_CLOSED',generation:fixture.generation,candidate:fixture.candidate,checks:15})+'\n');
