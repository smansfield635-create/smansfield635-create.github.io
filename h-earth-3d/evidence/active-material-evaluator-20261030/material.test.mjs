import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {verifyBytes} from './evaluate.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));
test('ordered stage and fixture regressions',()=>{
 const out=execFileSync('python3',['-m','unittest','-v','test_material_stages.py','test_material_replay.py'],{cwd:here,encoding:'utf8',stdio:['ignore','pipe','pipe']});
 assert.equal(typeof out,'string');
});
test('ordered source helper custody is exact and rejects a changed byte',()=>{
 assert.ok(process.env.EVALUATOR_SOURCE_DIR,'prepare-material.py and EVALUATOR_SOURCE_DIR required');
 const m=JSON.parse(fs.readFileSync(path.join(here,'ordered-source-manifest.json')));
 for(const [p,h] of Object.entries(m.moduleHashes)){
  const bytes=fs.readFileSync(path.join(process.env.EVALUATOR_SOURCE_DIR,p));verifyBytes(bytes,h,p);
  const changed=Buffer.from(bytes);changed[0]^=1;
  assert.throws(()=>verifyBytes(changed,h,p),/SOURCE_HASH_MISMATCH/);
 }
});
test('independent native helper and affine replay',()=>{
 const out=execFileSync('python3',[path.join(here,'independent_material_checks.py'),path.resolve(process.env.EVALUATOR_SOURCE_DIR)],{cwd:here,encoding:'utf8'});
 const r=JSON.parse(out);assert.equal(r.nativeHelperCases,1000);assert.equal(r.randomSubstrateCompositions,1000);assert.ok(r.maxAffineDifference<1e-12);
});
