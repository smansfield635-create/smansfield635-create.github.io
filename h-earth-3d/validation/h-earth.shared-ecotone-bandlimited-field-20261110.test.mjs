import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {sample,fieldsAt,noise2,smoothstep} from '../evidence/broad-groundcover-v1/sample-shader.mjs';

const rendererUrl=new URL('../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url);
const source=readFileSync(rendererUrl,'utf8');
const original='        0.20,0.66,groundcoverOrganic*0.78+mesoField*0.22';
const corrected='        0.20,0.66,groundcoverOrganic*0.78+(mesoField*0.40+macroField*0.60)*0.22';
const expectedOriginalBlob='85ee835060d5106a670077a5f4352b7ad202b49b';

function originalPatchAt(x,z){
  const f=fieldsAt(x,z);
  const dx=(x*.8-z*.6)*.018+5+.65*(f.broad-.5);
  const dz=(x*.6+z*.8)*.018-11+.65*(f.macroField-.5);
  return smoothstep(.20,.66,noise2([dx,dz])*.78+f.mesoField*.22);
}
function weightForPatch(p,suitability,protection){
  return .88*p*(1-.25*smoothstep(.30,.85,p))*suitability*protection;
}
function compare(x,z){
  const current=sample({x,z,vCoastDistanceMeters:140,slope:.04,rockExposure:.08});
  const oldPatch=originalPatchAt(x,z);
  const oldWeight=weightForPatch(oldPatch,current.suitability,current.protection);
  const correctedWeight=weightForPatch(current.patch,current.suitability,current.protection);
  assert.ok(Math.abs(current.weight-correctedWeight)<1e-12);
  return {oldPatch,oldWeight,correctedPatch:current.patch,correctedWeight,current};
}

test('exactly one source expression; reversing it reproduces the complete approved renderer Git blob',()=>{
  assert.equal(source.split(corrected).length,2);
  assert.equal(source.includes(original),false);
  const reverted=Buffer.from(source.replace(corrected,original),'utf8');
  const header=Buffer.from('blob '+reverted.length+'\0');
  const blob=createHash('sha1').update(Buffer.concat([header,reverted])).digest('hex');
  assert.equal(blob,expectedOriginalBlob);
});
test('source-derived dry original-near inland contact contracts its abrupt groundcover weight gradient',()=>{
  const a=compare(-207,-289),b=compare(-207,-287);
  const before=Math.abs(a.oldWeight-b.oldWeight),after=Math.abs(a.correctedWeight-b.correctedWeight);
  assert.ok(before>.12&&after<before*.65,JSON.stringify({before,after}));
  assert.ok(a.current.suitability>.999&&b.current.suitability>.999);
  assert.ok(a.current.protection>.999&&b.current.protection>.999);
});
test('second supported dry contact contracts without changing groundcover tone or protection formula',()=>{
  const a=compare(-131,-327),b=compare(-129,-327);
  const before=Math.abs(a.oldWeight-b.oldWeight),after=Math.abs(a.correctedWeight-b.correctedWeight);
  assert.ok(before>.14&&after<before*.80,JSON.stringify({before,after}));
  assert.equal(source.includes('palette=mix(palette,groundcoverTone,groundcoverWeight);'),true);
});
test('saturated patch core retains original fully eligible weight',()=>{
  for(const x of [113,115]){
    const q=compare(x,-233);
    assert.equal(q.oldPatch,1);
    assert.equal(q.correctedPatch,1);
    assert.ok(Math.abs(q.oldWeight-q.correctedWeight)<1e-12);
  }
});
test('existing coast, steep-slope and rock-exclusion gates remain zero',()=>{
  assert.equal(sample({x:-207,z:-289,vCoastDistanceMeters:0}).weight,0);
  assert.equal(sample({x:-207,z:-289,slope:.85}).weight,0);
  assert.equal(sample({x:-207,z:-289,rockExposure:.9}).weight,0);
});
test('existing estate protection core remains zero with the same native source function',()=>{
  const q=sample({x:70,z:-175});
  assert.equal(q.protection,0);
  assert.equal(q.weight,0);
});
