import test from 'node:test';
import assert from 'node:assert/strict';
import {makeNeutralSculptRegionFixture,createNativeSculptStudio,makeSculptUvHandoff,sculptMeshSpecification,makeSculptSubdivision,serializeSculptStudioState,restoreSculptStudioState} from './dgb.native-sculpt-browser.v1.mjs';
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


test('C2-B C2-A source-owned connected face subdivision retains UV lineage and edits topology',()=>{
  const fixture=makeNeutralSculptRegionFixture(),session=createSculptSession(fixture);
  const uv=makeSculptUvHandoff(session.getPositions(),session.getTriangles());
  const edit=makeSculptSubdivision(session,uv,fixture.protectedVertices,251,0);
  assert.equal(edit.counts.addedVertices,1);
  assert.equal(edit.counts.outputFaces,482);
  assert.equal(edit.render.originalUvPrefixPreserved,true);
  assert.equal(edit.render.sourceFaceCornerLineagePreserved,true);
  const updated=createSculptSession({positions:edit.positions,triangles:edit.triangles,
    regions:[...edit.regions],protectedVertices:[...edit.protectedVertices]});
  const spec=sculptMeshSpecification(updated,{renderToMaster:edit.render.renderToMaster,
    uvs:edit.render.uvs,faceRenderCorners:edit.render.triangles});
  assert.equal(spec.indices.length,482*3);
  assert.equal(spec.attributes[2].data.length,spec.vertexCount*2);
  assert(spec.vertexCount>session.getPositions().length/3);
  assert.throws(()=>makeSculptSubdivision(session,uv,fixture.protectedVertices,480,0),/STUDIO_SELECTED_FACE_INVALID/);
});
test('C2-B verified one and two transaction save/reload with legacy v1 compatibility',()=>{
  const fixture=makeNeutralSculptRegionFixture(),s0=createSculptSession(fixture);
  const uv0=makeSculptUvHandoff(s0.getPositions(),s0.getTriangles());
  const original=serializeSculptStudioState(s0,[]);
  assert.equal(JSON.parse(original).schema,'DGB_NATIVE_SCULPT_MESH_V1');
  assert.equal(restoreSculptStudioState(original,fixture).stages.length,0);
  const e1=makeSculptSubdivision(s0,uv0,fixture.protectedVertices,251,0);
  const s1=createSculptSession({positions:e1.positions,triangles:e1.triangles,regions:[...e1.regions],
    protectedVertices:[...e1.protectedVertices]});
  const uv1={renderToMaster:e1.render.renderToMaster,uvs:e1.render.uvs,faceRenderCorners:e1.render.triangles};
  const e2=makeSculptSubdivision(s1,uv1,fixture.protectedVertices,250,1);
  const s2=createSculptSession({positions:e2.positions,triangles:e2.triangles,regions:[...e2.regions],
    protectedVertices:[...e2.protectedVertices]});
  const saved=serializeSculptStudioState(s2,[{before:s0.serialize(),recipe:e1.serialize()},
    {before:s1.serialize(),recipe:e2.serialize()}]);
  const restored=restoreSculptStudioState(saved,fixture);
  assert.equal(restored.stages.length,2);
  assert.deepEqual([...restored.session.getPositions()],[...s2.getPositions()]);
  assert.deepEqual([...restored.session.getTriangles()],[...s2.getTriangles()]);
  assert.equal(restored.uv.faceRenderCorners.length,s2.getTriangles().length);
  const tampered=JSON.parse(saved);tampered.stages[0].recipe=tampered.stages[0].recipe.replace(
    '"normalOffset":0.005','"normalOffset":0.2');
  assert.throws(()=>restoreSculptStudioState(JSON.stringify(tampered),fixture),/C2A_SAVE_OR_SOURCE_IDENTITY_DRIFT|C2A_/);
});
test('C2-B original Sculpt Lab exposes human topology action and updated source import',async()=>{
  const {readFileSync}=await import('node:fs');
  const html=readFileSync(new URL('../../graphics-engine/sculpt-lab/index.html',import.meta.url),'utf8');
  const browser=readFileSync(new URL('./dgb.native-sculpt-browser.v1.mjs',import.meta.url),'utf8');
  assert.match(html,/id="subdivide"/);
  assert.match(html,/Subdivide selected face/);
  assert.match(browser,/restoreConnectedSculptTopologyCandidate/);
  assert.match(browser,/view\.device\.replaceMesh\(view\.mesh,replacement\)/);
  assert.match(browser,/get session\(\)\{return session;/);
});
