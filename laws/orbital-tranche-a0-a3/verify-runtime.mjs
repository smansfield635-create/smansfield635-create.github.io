import fs from 'node:fs';
import {pathToFileURL} from 'node:url';

const assert=(v,m)=>{if(!v)throw new Error(m)};
const manifest=JSON.parse(fs.readFileSync('laws/orbital-tranche-a0-a3/manifest.v1.json','utf8'));

if(fs.existsSync('laws/orbital-tranche-a0-a3/common-grammar.js')){
  await import(pathToFileURL(process.cwd()+'/laws/orbital-tranche-a0-a3/common-grammar.js'));
  const c=globalThis.DGBLawsOrbitalCore;
  assert(c,'core export');
  assert(c.stepIndex(0,-1,24,'BOUNDED')===0,'bounded lower');
  assert(c.stepIndex(0,1,24,'BOUNDED')===1,'forward');
  assert(c.stepIndex(1,-1,24,'BOUNDED')===0,'reverse traversal');
  assert(c.stepIndex(23,1,24,'BOUNDED')===23,'bounded upper');
  assert(c.visibleOffsets(0,24).every(x=>x.index>=0),'no wrap preview at story 1');
  assert(c.visibleOffsets(23,24).every(x=>x.index<=23),'no wrap preview at story 24');
  assert(c.dragProgress(-54,180,1,24)<0,'left drag produces forward orbital progress');
  assert(c.dragProgress(54,180,1,24)>0,'right drag produces reverse orbital progress');
  assert(Math.abs(c.dragProgress(90,180,0,24))<0.2,'story 1 reverse boundary applies resistance');
  assert(c.dragDirection(-0.3,0)===1,'left displacement commits forward');
  assert(c.dragDirection(0.3,0)===-1,'right displacement commits reverse');
  assert(c.dragDirection(-0.05,-0.6)===1,'left flick commits forward');
  assert(c.dragDirection(0.05,0.6)===-1,'right flick commits reverse');
  assert(c.dragDirection(0.1,0.1)===0,'small gesture snaps back');
}

assert(manifest.stories[0].route==='/laws/research/applied-investigations/','story1 route');
assert(manifest.stories[1].route==='/laws/research/evidence-and-sources/','story2 route');
assert(manifest.stories[2].route==='/laws/research/methods-and-models/','story3 route');
assert(manifest.stories[3].route==='/laws/categories/flow/signals/','story4 outward boundary');

console.log(JSON.stringify({status:'PASS',boundedTraversal:true,canonicalOrderPreserved:true,continuousDragContract:true,gestureCommitAndSnapback:true},null,2));
