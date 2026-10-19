import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {sampleHEarthTerrainElevation,sampleHEarthTerrainField} from '../terrain/h-earth.terrain-field.js';
import {sampleHEarthVisibleTerrainClearanceSurface,sampleHEarthVisibleTerrainClearanceEnvelope} from '../../showroom/globe/h-earth/functional-landscape/visible-terrain-clearance.js';

const SOURCE = new URL('../terrain/h-earth.terrain-field.js',import.meta.url);
const GRASS = new URL('../../showroom/globe/h-earth/render/assets/precomputed-grass.v1.json',import.meta.url);
const ANCHOR = new URL('../experience-anchor/H_EARTH_EXPERIENCE_ANCHOR_v1.json',import.meta.url);
const PRIOR_SOURCE_BLOB = 'deaef74f59edd5c6cfbdc96c32f31e140e6a6c2a';
const ROOT_MANIFEST_BLOB = '04fda6859473ee82ba49af0500eac782917b900c';
const EXPERIENCE_BLOB = 'a8fdf61515fc665ff5a832137ab232a8b3bc36d8';
const source=readFileSync(SOURCE,'utf8');
const start=source.indexOf('/**\n * East A B2 terrain relief');
const end=source.indexOf('export function sampleHEarthTerrainField(',start);
assert.ok(start>0 && end>start,'B2 must have exactly the declared canonical sampler seam');
const inserted=source.slice(start,end);
const priorSampler=[
 'export function sampleHEarthTerrainElevation(worldX, worldZ) {',
 '  if (!finite(worldX) || !finite(worldZ)) return Number.NaN;',
 '  return evaluateRawElevation(worldX, worldZ);',
 '}'
].join('\n');
const oldSource=source.slice(0,start)+priorSampler+'\n\n'+source.slice(end);
const gitBlob=val=>createHash('sha1').update('blob '+Buffer.byteLength(val)+'\0').update(val).digest('hex');
assert.equal(gitBlob(oldSource),PRIOR_SOURCE_BLOB,'Only the admitted East A B2 source edit may differ from pinned pre-B2 canonical source');
const oldModule=await import('data:text/javascript;base64,'+Buffer.from(oldSource,'utf8').toString('base64'));
const oldElevation=oldModule.sampleHEarthTerrainElevation;
const elevation=sampleHEarthTerrainElevation;
const notchX=z=>209.5+2.2*Math.sin((z+325)/22)+0.025*(z+330);
function close(actual,expected,tol=1e-8){assert.ok(Math.abs(actual-expected)<=tol,'actual='+actual+',expected='+expected+',tol='+tol)}

test('B2 is the exact two-taper-denominator extension of one canonical G_world source',()=>{
 assert.match(inserted,/function upliftB2\(x,z\)/);
 assert.match(inserted,/smooth5\(\(x-184\)\/\(24\+1\.4\*Math\.sin/);
 assert.match(inserted,/smooth5\(\(232-x\)\/\(26\.5\+1\.1\*Math\.cos/);
 assert.match(inserted,/if \(x<=184 \|\| x>=232 \|\| z<=-368 \|\| z>=-280\) return 0/);
 assert.ok(source.includes('return evaluateRawElevation(worldX, worldZ) + upliftB2(worldX, worldZ);'));
 assert.ok(inserted.includes('6260006002') && inserted.includes('6270930139'));
});

test('B2 changes only the intended East A interior and nowhere in the protected outer domain',()=>{
 let positive=0,max=0,count=0;
 for(let x=-304;x<=304;x+=8)for(let z=-568;z<=32;z+=8){
   const y=elevation(x,z),delta=y-oldElevation(x,z);
   assert.ok(Number.isFinite(y));
   if(x<=184||x>=232||z<=-368||z>=-280)close(delta,0,1e-12);
   else {assert.ok(delta>=-1e-12);if(delta>0)positive++;max=Math.max(max,delta)}
   count++;
 }
 assert.ok(count>5000 && positive>=40);
 close(max,6.289584631437112,1e-6);
 for(const [x,z,delta] of [[208,-344,6.289584631437112],[216,-344,4.192644650988665],[208,-328,4.526690285354625],[208,-300,.2857504813046541],[190,-330,.6493117391429237]])close(elevation(x,z)-oldElevation(x,z),delta,1e-6);
});

test('Real source derivatives and terrain material samples remain consistent with the B2 height field',()=>{
 for(let x=180;x<=236;x+=4)for(let z=-372;z<=-276;z+=4){
   const s=sampleHEarthTerrainField(x,z);
   assert.equal(s.valid,true);
   close(s.elevation,elevation(x,z),1e-10);
   assert.ok(Number.isFinite(s.slope)&&Number.isFinite(s.curvature));
   assert.ok(Number.isFinite(s.normal.x)&&Number.isFinite(s.normal.y)&&Number.isFinite(s.normal.z));
   assert.ok(s.materialProfile!=null);
 }
});

test('Curved 4m-ribbon notch remains below provisional 0.30 source-grade limit',()=>{
 let max=0;
 for(const offset of [0,2,4])for(let i=0;i<182;i++){
   const z0=-352+64*i/182,z1=-352+64*(i+1)/182;
   const x0=notchX(z0)+offset,x1=notchX(z1)+offset;
   const grade=Math.abs(elevation(x1,z1)-elevation(x0,z0))/Math.hypot(x1-x0,z1-z0);
   assert.ok(Number.isFinite(grade));max=Math.max(max,grade);
 }
 assert.ok(max<=.30,'B2_SOURCE_NOTCH_GRADE='+max);
});

test('Actual Gen314 camera volumes and Gen311 presented triangle surfaces pass 51 B2 notch checks',()=>{
 let count=0,maxGrade=0;
 for(const offset of [0,2,4]){
   let previous=null;
   for(let i=0;i<=16;i++){
     const z=-288-4*i,x=notchX(z)+offset;
     const surface=sampleHEarthVisibleTerrainClearanceSurface(x,z);
     const envelope=sampleHEarthVisibleTerrainClearanceEnvelope(x,z,{yawDegrees:0});
     assert.equal(surface.valid,true,'GEN314_SURFACE:'+offset+':'+i+':'+(surface.issues||[]).join(','));
     assert.equal(envelope.valid,true,'GEN314_CAMERA:'+offset+':'+i+':'+(envelope.issues||[]).join(','));
     assert.ok(Number.isFinite(surface.visibleElevation));
     assert.ok(envelope.clearanceReferenceElevation>=envelope.centerElevation);
     if(previous)maxGrade=Math.max(maxGrade,Math.abs(surface.visibleElevation-previous.y)/Math.hypot(x-previous.x,z-previous.z));
     previous={x,z,y:surface.visibleElevation};count++;
   }
 }
 assert.equal(count,51);
 assert.ok(maxGrade<=.30,'B2_PRESENTED_NOTCH_GRADE='+maxGrade);
});

test('All published vegetation bytes and the established navigable-world anchor are unchanged',()=>{
 const roots=readFileSync(GRASS);
 assert.equal(gitBlob(roots),ROOT_MANIFEST_BLOB);
 const grass=JSON.parse(roots.toString('utf8'));
 assert.equal(grass.rootCount,1457471);
 assert.equal(grass.stride,52);
 const anchorBytes=readFileSync(ANCHOR);
 assert.equal(gitBlob(anchorBytes),EXPERIENCE_BLOB);
 const anchor=JSON.parse(anchorBytes.toString('utf8'));
 assert.equal(anchor.status,'HARD_ACCEPTANCE_CRITERION');
 assert.equal(anchor.sourceVideo.sha256,'7757fb4fe731456b3058ec595369133f5c2136c99b282eb6b4df108600bca573');
 // No browser, GPU, tablet, owner perceptual acceptance or deployment is claimed here.
});
