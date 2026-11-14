import test from 'node:test';
import assert from 'node:assert/strict';
import {makeNeutralSculptRegionFixture,createNativeSculptStudio} from './dgb.native-sculpt-browser.v1.mjs';
import {createSculptSession,verifySculptGeometry} from './dgb.native-sculpt-session.v1.mjs';
test('neutral four-zone regional mesh is a real connected editable 3D surface',()=>{
  const x=makeNeutralSculptRegionFixture();const v=verifySculptGeometry(x.positions,x.triangles);assert.equal(v.vertexCount,273);assert.equal(v.triangleCount,480);
  assert.deepEqual([...new Set(x.regions)].sort(),['cheek','nape','shoulder','skull']);assert(v.openBoundaryEdges>0);assert(x.protectedVertices.length>0);assert([...x.positions].some((v,i)=>i%3===2&&v>0.2));
});
test('regional pointer-driven edit changes only the unlocked actual positions and can be reversed',()=>{
  const f=makeNeutralSculptRegionFixture(),s=createSculptSession(f);const before=s.getPositions(),hit=s.pick([-.55,.13,4.5],[0,0,-1]);assert(hit);
  const affected=s.beginStroke(hit,{region:'cheek',radius:.45,strength:.8});assert(affected.affectedVertexIds.length>0);
  s.applyStroke({mode:'PULL',amount:.08});s.endStroke();const after=s.getPositions();let changed=0;
  for(let i=0;i<f.regions.length;i++)if(before[3*i]!==after[3*i]||before[3*i+1]!==after[3*i+1]||before[3*i+2]!==after[3*i+2]){assert.equal(f.regions[i],'cheek');assert(!f.protectedVertices.includes(i));changed++;}
  assert(changed>0);s.verify();assert(s.undo());assert.deepEqual([...s.getPositions()],[...before]);
});
test('studio requires exactly four actual target canvas objects',()=>{
  assert.throws(()=>createNativeSculptStudio({canvases:[]}),/FOUR_CANVASES_REQUIRED/);
  assert.throws(()=>createNativeSculptStudio({canvases:[1,2,3,4],backend:'PDF'}),/STUDIO_OPTIONS_INVALID/);
});

// M1.6.2: verify integrated UI names and original E1/E2/E3 controller reuse.
test('existing four-view studio exposes organic controls via the same native session',async()=>{
  const {readFileSync}=await import('node:fs');
  const html=readFileSync(new URL('../../graphics-engine/sculpt-lab/index.html',import.meta.url),'utf8');
  const controller=readFileSync(new URL('./dgb.native-sculpt-browser.v1.mjs',import.meta.url),'utf8');
  for(const mode of ['ORGANIC_INFLATE','ORGANIC_GRAB','ORGANIC_FLATTEN'])assert(html.includes(`value="${mode}"`));
  for(const id of ['fieldX','fieldY','fieldZ'])assert(html.includes(`id="${id}"`));
  assert.match(controller,/createSculptSession\(fixture\)/);
  assert.match(controller,/createNativeFramePipeline\(device\)/);
  assert.match(controller,/createNativeSpatialScene\(\)/);
  assert.match(controller,/mode==='ORGANIC_GRAB'/);
  assert.match(controller,/fieldRadii/);
});
