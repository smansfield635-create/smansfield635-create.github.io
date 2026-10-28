import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {sampleHEarthTerrainElevation} from '../terrain/h-earth.terrain-field.js';

// Read-only Gen2944 first-cause and parity preflight. These tests never alter
// world geometry, source field, root buffers, vegetation or hydrated asset bytes.
const SOURCE=new URL('../terrain/h-earth.terrain-field.js',import.meta.url);
const WORLD=new URL('../../showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz',import.meta.url);
const MANIFEST=new URL('../../showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.manifest.json',import.meta.url);
const publishedAssetSha='48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a';
const gaussian=(x,z,cx,cz,rx,rz,amp)=>amp*Math.exp(-1.6*(((x-cx)/rx)**2+((z-cz)/rz)**2));
const east=(x,z)=>gaussian(x,z,148,-224,66,34,38);
const central=(x,z)=>gaussian(x,z,86,-235,68,37,34);
// The formula is an ANALYTICAL PROSPECT, never an authorized source patch.
// The zero-offset smoothing preserves the value at the crossover, and
// preserves the original maximum exactly whenever the winner gap >= width.
function zeroOffsetSmoothMax(a,b,width){
  assert.ok(width>0&&Number.isFinite(width));
  const gap=Math.abs(a-b);
  if(gap>=width)return Math.max(a,b);
  const t=1-gap/width;
  return Math.max(a,b)-0.5*gap*t*t;
}
function derivative(f,x,dx=0.0001){return (f(x+dx)-f(x-dx))/(2*dx)}
function winnerCrossing(z=-250){
  let lo=120,hi=140;
  assert.ok((east(lo,z)-central(lo,z))<0);
  assert.ok((east(hi,z)-central(hi,z))>0);
  for(let n=0;n<70;n++){
    const m=(lo+hi)/2;
    if(east(m,z)>central(m,z))hi=m;else lo=m;
  }
  return (lo+hi)/2;
}
test('published canonical terrain source contains the exact non-differentiable ridge winner',()=>{
 const source=fs.readFileSync(SOURCE,'utf8');
 assert.equal(source.split('const strongestPositiveRelief = Math.max(...positiveReliefComponents);').length,2);
 assert.match(source,/const articulatedPositiveRelief = strongestPositiveRelief \+ secondaryPositiveRelief \* 0\.22;/);
 assert.match(source,/return amplitude \* Math\.exp\(-\(dx \* dx \+ dz \* dz\) \* 1\.6\)/);
});
test('ridge-east and central source Gaussians have a measurable derivative kink at actual crossover',()=>{
 const z=-250,x=winnerCrossing(z);
 const hard=p=>Math.max(east(p,z),central(p,z));
 const dx=0.00001;
 const left=(hard(x)-hard(x-dx))/dx;
 const right=(hard(x+dx)-hard(x))/dx;
 assert.ok(x>129&&x<132);
 assert.ok(Math.abs(left-right)>0.40,JSON.stringify({x,left,right}));
 const source=sampleHEarthTerrainElevation(x,z);
 assert.ok(Number.isFinite(source)&&source>0);
});
test('prospective local zero-offset winner yields C1 value and slope at the source tie without globally flattening elevations',()=>{
 const z=-250,x=winnerCrossing(z),width=2;
 const hard=p=>Math.max(east(p,z),central(p,z));
 const smooth=p=>zeroOffsetSmoothMax(east(p,z),central(p,z),width);
 assert.ok(Math.abs(hard(x)-smooth(x))<1e-10,'height at exact winner tie unchanged');
 const dx=0.00001;
 const left=(smooth(x)-smooth(x-dx))/dx;
 const right=(smooth(x+dx)-smooth(x))/dx;
 assert.ok(Math.abs(left-right)<0.001,JSON.stringify({left,right}));
 let maxDelta=0;
 for(let p=90;p<=175;p+=0.05){
  const delta=hard(p)-smooth(p);
  assert.ok(delta>=-1e-10&&delta<=0.15,JSON.stringify({p,delta}));
  maxDelta=Math.max(maxDelta,delta);
  if(Math.abs(east(p,z)-central(p,z))>=width)assert.equal(hard(p),smooth(p));
 }
 assert.ok(maxDelta>0.04);
 // One pair is only a mathematical first-cause probe. Do not interpret this
 // as an approved all-ridges, root-safe, precomputed-world repair.
});
test('published precomputed base world is unchanged and has the documented G_world B2 mismatch',()=>{
 const bytes=fs.readFileSync(WORLD),manifest=JSON.parse(fs.readFileSync(MANIFEST,'utf8'));
 assert.equal(createHash('sha256').update(bytes).digest('hex'),publishedAssetSha);
 assert.equal(manifest.binary.sha256,publishedAssetSha);
 const pkg=JSON.parse(gunzipSync(bytes).toString('utf8'));
 assert.equal(pkg.raw.packageIdentity,'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_0C47F685');
 assert.equal(pkg.canonical.packageIdentity,'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_2F3D0EB2');
 const xyz=pkg.raw.buffers.positions;
 assert.equal(xyz.length,330807);
 const target=[208.00238513946533,-344.0039446949959];
 let best=Infinity,idx=-1;
 for(let i=0;i<xyz.length;i+=3){
  const d=Math.hypot(xyz[i]-target[0],xyz[i+2]-target[1]);
  if(d<best){best=d;idx=i;}
 }
 assert.ok(best<0.15,JSON.stringify({best,idx}));
 const sourceHeight=sampleHEarthTerrainElevation(xyz[idx],xyz[idx+2]);
 const actualMeshHeight=xyz[idx+1],discrepancy=sourceHeight-actualMeshHeight;
 assert.ok(Math.abs(discrepancy)>4.5,JSON.stringify({best,sourceHeight,actualMeshHeight,discrepancy}));
 // Must reconcile precomputed geometry provenance before product mutation.
});
