import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const here=path.dirname(fileURLToPath(import.meta.url));
test('source classification algebra, eligibility and adjacency regressions',()=>{
 execFileSync('python3',['-m','unittest','-v','test_classification.py'],{cwd:here,stdio:['ignore','pipe','pipe']});
});
test('independent symmetric attribution proof across 1000 traces',()=>{
 const result=JSON.parse(execFileSync('python3',['independent_attribution_review.py'],{cwd:here,encoding:'utf8'}));
 assert.equal(result.randomCases,1000);assert.equal(result.maxCubeBoundError,0);
 assert.ok(result.maxCoefficientSumError<1e-12);assert.equal(result.result,'PASS_ALGEBRA_ONLY');
});
