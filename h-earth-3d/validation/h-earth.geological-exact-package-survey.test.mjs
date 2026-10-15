import test from 'node:test';
import assert from 'node:assert/strict';
import {makeContactField,sampleSite,traceD8,analyzeCanonicalWorld} from '../tools/geology/h-earth.geological-exact-package-survey.v1.mjs';
function fixture({sloped=true}={}){
 const positions=[],indices=[],n=9;for(let z=0;z<n;z++)for(let x=0;x<n;x++)positions.push(x,sloped?z:10,z);
 for(let z=0;z<n-1;z++)for(let x=0;x<n-1;x++){let a=z*n+x,b=a+1,c=a+n,d=c+1;indices.push(a,c,b,b,c,d)}
 return {buffers:{positions,indices},primitiveSpans:[{role:'TERRAIN',primitiveId:'TEST_TERRAIN',indexStart:0,indexCount:indices.length}]};
}
test('sample barycentric active triangles',()=>{const field=makeContactField(fixture(),{domain:{xMin:0,xMax:8,zMin:0,zMax:8},cellSize:2});assert.equal(field.stats.triangleCount,128);let r=field.sample(3.25,4.75);assert(r);assert(Math.abs(r.y-4.75)<1e-6);assert(Math.abs(r.slope-1)<1e-6);assert.equal(r.primitiveId,'TEST_TERRAIN');assert.equal(field.sample(9,5),null)});
test('D8 requires strictly downhill and is not a water simulation',()=>{const field=makeContactField(fixture(),{domain:{xMin:0,xMax:8,zMin:0,zMax:8},cellSize:2});let r=traceD8(field,{x:4,z:6},{study:{xMin:0,xMax:8,zMin:0,zMax:8},entry:{xMin:-5,xMax:-4,zMin:-5,zMax:-4},step:1,maxSteps:25});assert.equal(r.result,'STUDY_EDGE_UNRESOLVED');assert(r.netElevationFall>0);assert.equal(r.entersOasis,false)});
test('flat terrain cannot manufacture downhill flow',()=>{const field=makeContactField(fixture({sloped:false}),{domain:{xMin:0,xMax:8,zMin:0,zMax:8},cellSize:2});const r=traceD8(field,{x:4,z:6},{study:{xMin:0,xMax:8,zMin:0,zMax:8},entry:{xMin:-5,xMax:-4,zMin:-5,zMax:-4},step:1,maxSteps:25});assert.equal(r.steps,1);assert.equal(r.netElevationFall,0)});
test('does not change input index or positions',()=>{const f=fixture();const before=JSON.stringify(f);const field=makeContactField(f,{domain:{xMin:0,xMax:8,zMin:0,zMax:8},cellSize:2});field.sample(3,4);assert.equal(JSON.stringify(f),before)});
test('reject invalid index',()=>{const f=fixture();f.buffers.indices[0]=99999;assert.throws(()=>makeContactField(f,{domain:{xMin:0,xMax:8,zMin:0,zMax:8}}),/TERRAIN_TRIANGLE_INDEX/)});
test('versioned canonical buffer identity refuses false evidence',()=>{const f=fixture();const canonical={...f,packageIdentity:'C',buffers:f.buffers};const raw={...f,packageIdentity:'R',buffers:f.buffers};const manifest={packageIdentity:'WRONG',rawPackageIdentity:'R',bufferLengths:{positions:f.buffers.positions.length,indices:f.buffers.indices.length}};assert.throws(()=>analyzeCanonicalWorld({canonical,raw},manifest),/PACKAGE_IDENTITY/)});
