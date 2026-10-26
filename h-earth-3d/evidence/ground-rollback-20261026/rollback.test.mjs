import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';

const renderer='showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js';
const html='showroom/globe/h-earth/index.html';
const governing='6a06f72fb228755a29747bf07fbc62373ca15760';
const oldBlob='31d97193a508ede2c244b4253c76be892fd9782e';
const rejectedBlob='24cbadc677839246718fbb354bdea008252f3691';
const source=fs.readFileSync(renderer);
test('renderer is the exact pre-6847 source, including earlier vegetation work',()=>{
  assert.equal(crypto.createHash('sha256').update(source).digest('hex'),'4450c9e9f66f3dfd8f3094e897311e09550269c2c0f7510a4ce2a4982387d2c1');
  assert.equal(execFileSync('git',['hash-object',renderer],{encoding:'utf8'}).trim(),oldBlob);
});
test('HTML changes only the two rejected renderer import pins',()=>{
  const prior=execFileSync('git',['show',`${governing}:${html}`],{encoding:'utf8'});
  assert.equal(prior.split(rejectedBlob).length-1,2);
  assert.equal(fs.readFileSync(html,'utf8'),prior.replaceAll(rejectedBlob,oldBlob));
});
test('restored renderer parses as an ES module',()=>{
  execFileSync(process.execPath,['--input-type=module','--check'],{input:source});
});
test('tracked differences stay inside restoration and its evidence',()=>{
  const changes=execFileSync('git',['diff','--name-only',governing],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
  for(const p of changes) assert.ok(p===renderer||p===html||p.startsWith('h-earth-3d/evidence/ground-rollback-20261026/')||p==='h-earth-3d/experience-anchor/receipts/ground-rollback-20261026.json',`unexpected change: ${p}`);
});
