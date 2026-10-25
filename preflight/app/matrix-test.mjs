import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const source=fs.readFileSync(new URL('./dist/app.mjs',import.meta.url),'utf8');
const html=fs.readFileSync(new URL('./dist/index.html',import.meta.url),'utf8');
test('matrix UI: result controls default hidden and use shared workflow eligibility',()=>{
 assert.match(html,/id="outcome-review" hidden/);
 assert.match(source,/workflowDecision\(p\)/);
 assert.match(source,/\$\('outcome-review'\)\.hidden=!w\.canReviewResult&&!w\.canClose/);
 assert.match(source,/requirementReviewState\(p,r\.id\)\.eligible/);
 assert.match(source,/storageBlocked\|\|!w\.canContinue/);
});
test('matrix UI: feedback is passed to decision logic and checkpoint saving is distinct',()=>{
 assert.match(html,/id="review-feedback"/);
 assert.match(source,/recordUserDecision\(project\(\),value,\$\('review-feedback'\)\.value\)/);
 assert.doesNotMatch(source,/'Accept progress →'|'Accept this checkpoint →'/);
});
test('matrix UI: historical structured context cannot rewind independently of evidence',()=>{
 assert.match(source,/h\.id!==c\.id&&!p\.progress/);
 assert.match(source,/Historical context is read-only for tracked requirements/);
});
