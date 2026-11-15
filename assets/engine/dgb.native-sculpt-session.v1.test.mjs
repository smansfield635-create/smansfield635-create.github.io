import test from 'node:test';
import assert from 'node:assert/strict';
import {createSculptSession,createM13OriginalSource,verifySculptGeometry,verifySculptSourceRelative,createSculptSourceHandoff,verifySculptProspectiveBake,sculptScreenRay,invertSculptMatrix} from './dgb.native-sculpt-session.v1.mjs';
const fixture=()=>({positions:new Float32Array([-1,-1,0, 0,-1,0, 1,-1,0, -1,0,0, 0,0,0, 1,0,0, -1,1,0, 0,1,0, 1,1,0]),triangles:new Uint16Array([0,1,4,0,4,3, 1,2,5,1,5,4, 3,4,7,3,7,6, 4,5,8,4,8,7]),regions:['skull','skull','nape','skull','skull','nape','shoulder','shoulder','shoulder'],protectedVertices:[0,3,6]});
test('actual ray-to-triangle intersection returns 3D hit and barycentrics',()=>{
  const s=createSculptSession(fixture());const hit=s.pick([0,0,5],[0,0,-1]);assert(hit);assert(Math.abs(hit.position[2])<1e-8);assert(Math.abs(hit.barycentric.reduce((a,b)=>a+b,0)-1)<1e-7);assert.equal(hit.vertexIds.length,3);
});
test('bounded stroke edits intended cheek/skull vertices and protects unrelated structures',()=>{
  const s=createSculptSession(fixture()),before=s.getPositions(),hit=s.pick([0,0,5],[0,0,-1]);const response=s.beginStroke(hit,{radius:1.35,strength:.8,falloff:2,region:'skull'});assert(response.affectedVertexIds.length>0);assert(s.applyStroke({mode:'PULL',amount:.12}));s.endStroke();const after=s.getPositions();
  let changed=0;for(let i=0;i<9;i++){if(after[3*i+2]!==before[3*i+2]){changed++;assert.equal(fixture().regions[i],'skull');assert(!fixture().protectedVertices.includes(i));}else if(fixture().protectedVertices.includes(i))assert.deepEqual([...after.slice(3*i,3*i+3)],[...before.slice(3*i,3*i+3)]);}assert(changed>0);assert.equal(s.state().undoDepth,1);
});
test('undo redo commit entire drag and deterministic JSON roundtrip',()=>{
  const s=createSculptSession(fixture());const initial=s.serialize();const hit=s.pick([0,0,5],[0,0,-1]);s.beginStroke(hit,{radius:1.5,region:'skull'});s.applyStroke({mode:'PULL',amount:.05});s.applyStroke({mode:'PULL',amount:.04});s.endStroke();const changed=s.serialize();assert.notEqual(changed,initial);assert(s.undo());assert.equal(s.serialize(),initial);assert(s.redo());assert.equal(s.serialize(),changed);
  const copy=createSculptSession(fixture());copy.restore(changed);assert.equal(copy.serialize(),changed);assert.equal(copy.state().undoDepth,0);
});
test('rejected invalid edit rollback and malformed saves do not replace valid source',()=>{
  const s=createSculptSession(fixture());const initial=s.serialize();const hit=s.pick([0,0,5],[0,0,-1]);s.beginStroke(hit,{radius:2.5,region:'ALL'});
  assert.throws(()=>s.applyStroke({mode:'MOVE',delta:[NaN,0,0]}),/VEC3/);s.cancelStroke();assert.equal(s.serialize(),initial);
  assert.throws(()=>s.restore('bad'),/JSON/);assert.throws(()=>s.restore(JSON.stringify({...JSON.parse(initial),triangles:[0,1,5]})),/IDENTITY/);assert.equal(s.serialize(),initial);
  assert.throws(()=>verifySculptGeometry(new Float32Array([0,0,0, 1,0,0, 0,0,0]),new Uint16Array([0,1,2])),/DEGENERATE/);
});
test('detect edge nonmanifold and geometric crossing independently of visual render',()=>{
  const f=fixture();const same=new Uint16Array([0,1,4,0,4,3,0,4,7]);assert.throws(()=>verifySculptGeometry(f.positions,same),/NONMANIFOLD|DUPLICATE/);
  const crossing={positions:new Float32Array([-1,-1,0,1,-1,0,0,1,0, 0,-.5,-1,0,-.5,1,0,.5,0]),triangles:new Uint16Array([0,1,2,3,4,5])};assert.throws(()=>verifySculptGeometry(crossing.positions,crossing.triangles),/SELF_INTERSECTION/);
});
test('screen unprojection is finite and deterministic; singular matrices rejected',()=>{
  const identity=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);const a=sculptScreenRay({x:50,y:50,width:100,height:100,viewProjection:identity});assert.deepEqual(a.origin,[0,0,-1]);assert.deepEqual(a.direction,[0,0,1]);assert.throws(()=>invertSculptMatrix(new Float32Array(16)),/SINGULAR/);
});

// M1.6.2: Integrated organic-field and source-relative regression checks.
const plane=()=>({
  positions:new Float32Array([-1,-1,0,0,-1,0,1,-1,0,-1,0,0,0,0,0,1,0,0,-1,1,0,0,1,0,1,1,0]),
  triangles:new Uint16Array([0,1,4,0,4,3,1,2,5,1,5,4,3,4,7,3,7,6,4,5,8,4,8,7]),
  regions:['back','back','back','back','shoulder','back','back','back','back'],
  protectedVertices:[0,1,2,3,5,6,7,8]
});
const hit=s=>s.pick([0,0,3],[0,0,-1]);

test('source-relative checker rejects inverted triangle that remains nondegenerate',()=>{
  const a=new Float32Array([0,0,0,1,0,0,0,1,0]);
  const b=new Float32Array([0,0,0,1,0,0,0,-1,0]);
  assert.throws(()=>verifySculptSourceRelative(a,b,new Uint16Array([0,1,2])),/SCULPT_SOURCE_NORMAL_GUARD_REJECTED/);
});
test('source-relative checker rejects area changes outside the frozen ratio interval',()=>{
  const a=new Float32Array([0,0,0,1,0,0,0,1,0]);
  const b=new Float32Array([0,0,0,0.1,0,0,0,1,0]);
  assert.throws(()=>verifySculptSourceRelative(a,b,new Uint16Array([0,1,2])),/SCULPT_SOURCE_AREA_GUARD_REJECTED/);
});
test('protected complement is checked at exact Float32 source coordinate',()=>{
  const a=new Float32Array([0,0,0,1,0,0,0,1,0]),b=new Float32Array(a);
  b[0]+=0.001;
  assert.throws(()=>verifySculptSourceRelative(a,b,new Uint16Array([0,1,2]),{protectedVertices:[0]}),/SCULPT_PROTECTED_SOURCE_CHANGED/);
});
test('single native session supports anisotropic inflate, grab, flatten, full undo and redraw inputs',()=>{
  const f=plane(),s=createSculptSession(f),before=s.serialize();
  const options={region:'shoulder',fieldRadii:[1.2,.8,.5],radius:1,strength:1};
  let h=hit(s);assert(h);
  const sel=s.beginStroke(h,options);
  assert.deepEqual(sel.affectedVertexIds,[4]);
  assert(s.applyStroke({mode:'ORGANIC_INFLATE',amount:.04}));s.endStroke();
  let p=s.getPositions();assert(p[14]>.03 && p[14]<.041);
  h=hit(s);s.beginStroke(h,options);
  assert(s.applyStroke({mode:'ORGANIC_GRAB',delta:[.01,0,0]}));s.endStroke();
  p=s.getPositions();assert(p[12]>.009);
  h=hit(s);s.beginStroke(h,options);
  assert(s.applyStroke({mode:'ORGANIC_FLATTEN',amount:.3,planeNormal:[0,0,1],planeOffset:0}));s.endStroke();
  assert(s.getPositions()[14]<.04);
  const final=s.serialize();assert.notEqual(final,before);
  assert(s.verify().sourceRelative.sourceRelativePass);
  assert.equal(s.state().undoDepth,3);
  for(let i=0;i<3;i++)assert(s.undo());
  assert.equal(s.serialize(),before);
  for(let i=0;i<3;i++)assert(s.redo());
  assert.equal(s.serialize(),final);
  const copy=createSculptSession(f);copy.restore(final);assert.equal(copy.serialize(),final);
  for(const id of f.protectedVertices)assert.deepEqual([...s.getPositions().slice(3*id,3*id+3)],[...f.positions.slice(3*id,3*id+3)]);
});
test('unsafe stroke is atomic: no corrupted frame, undo history or exported state',()=>{
  const f=plane();const s=createSculptSession({...f,sourceGuards:{maxAreaRatio:1.0000001}}),before=s.serialize();
  const h=hit(s);s.beginStroke(h,{region:'shoulder',fieldRadii:[1,1,1]});
  assert.throws(()=>s.applyStroke({mode:'ORGANIC_INFLATE',amount:.3}),/SCULPT_SOURCE_AREA_GUARD_REJECTED/);
  assert.equal(s.serialize(),before);
  assert.equal(s.state().undoDepth,0);
  assert.equal(s.state().redoDepth,0);
  assert.equal(s.state().active,false);
  assert.equal(s.state().revision,0);
});
test('invalid organic controls cannot silently mutate a session',()=>{
  const f=plane(),s=createSculptSession(f),before=s.serialize(),h=hit(s);
  assert.throws(()=>s.beginStroke(h,{fieldRadii:[1,-1,1]}),/OUT_OF_BOUNDS/);
  s.beginStroke(h,{region:'shoulder'});
  assert.throws(()=>s.applyStroke({mode:'ORGANIC_FLATTEN',planeNormal:[0,0,0],amount:1}),/INVALID|ZERO_NORMAL|AMOUNT/);
  s.cancelStroke();assert.equal(s.serialize(),before);
});
test('M1.3 +Z-up handoff transforms round-trip and preserves split UV identity',()=>{
  const src=new Float32Array([1,2,3,4,5,6,7,8,10]),indices=new Uint16Array([0,1,2]);
  const seam=new Uint32Array([0,1,1,2]);const uv=new Float32Array([0,0,.4,.1,.6,.2,1,1]);
  const h=createSculptSourceHandoff({positions:src,triangles:indices,renderToMaster:seam,uvs:uv});
  assert.deepEqual([...h.positionsYUp],[1,3,-2,4,6,-5,7,10,-8]);
  assert.deepEqual([...h.fromSculptYUp(h.positionsYUp)],[...src]);
  assert.deepEqual([...h.renderToMaster],[...seam]);assert.deepEqual([...h.uvs],[...uv]);
  assert.equal(h.retopologyBakeAllowed,false);
  assert.throws(()=>h.fromSculptYUp(new Float32Array([0,0,0,1,0,0,1,1,0,0,1,0])),/VERTEX_COUNT_CHANGED/);
});


// M1.6.3: source-handoff topology and geometric self-intersection gaps.
test('coplanar non-adjacent overlapping faces are rejected, not missed by segment-plane tests',()=>{
  const positions=new Float32Array([0,0,0, 2,0,0, 0,2,0, .2,.2,0, 1.2,.2,0, .2,1.2,0]);
  assert.throws(()=>verifySculptGeometry(positions,new Uint16Array([0,1,2,3,4,5])),/SELF_INTERSECTION/);
});
test('coplanar edge-adjacent faces with only boundary contact remain valid',()=>{
  const positions=new Float32Array([0,0,0, 2,0,0, 0,2,0, 1,-1,0]);
  assert.equal(verifySculptGeometry(positions,new Uint16Array([0,1,2,0,3,1])).triangleCount,2);
});
test('coplanar adjacent faces with overlapping interiors are rejected',()=>{
  const positions=new Float32Array([0,0,0, 2,0,0, 0,2,0, 1,1,0]);
  assert.throws(()=>verifySculptGeometry(positions,new Uint16Array([0,1,2,0,1,3])),/SELF_INTERSECTION/);
});
test('coplanar overlap remains prohibited when two faces share only a vertex',()=>{
  const positions=new Float32Array([0,0,0, 2,0,0, 0,2,0, 1,0,0, 0,1,0]);
  assert.throws(()=>verifySculptGeometry(positions,new Uint16Array([0,1,2,0,3,4])),/SELF_INTERSECTION/);
});
test('source handoff rejects out-of-range, repeated and duplicate master triangle identities',()=>{
  const sourcePositions=new Float32Array([0,0,0, 1,0,0, 0,1,0]);
  const data={positions:sourcePositions,renderToMaster:new Uint32Array([0,1,2]),uvs:new Float32Array([0,0,1,0,0,1])};
  assert.throws(()=>createSculptSourceHandoff({...data,triangles:new Uint16Array([0,1,3])}),/SCULPT_SOURCE_HANDOFF_TRIANGLE_INDEX_INVALID/);
  assert.throws(()=>createSculptSourceHandoff({...data,triangles:new Uint16Array([0,1,1])}),/SCULPT_SOURCE_HANDOFF_TRIANGLE_INDEX_INVALID/);
  assert.throws(()=>createSculptSourceHandoff({...data,triangles:new Uint16Array([0,1,2,2,1,0])}),/SCULPT_SOURCE_HANDOFF_DUPLICATE_FACE/);
  assert.equal(createSculptSourceHandoff({...data,triangles:new Uint16Array([0,1,2])}).retopologyBakeAllowed,false);
});
test('source handoff rejects nonmanifold master edge incidence without rewriting the source',()=>{
  const data={positions:new Float32Array([0,0,0, 1,0,0, 0,1,0, 0,-1,0, 0,0,1]),
    triangles:new Uint16Array([0,1,2, 1,0,3, 0,1,4]),renderToMaster:new Uint32Array([0,1,2,3,4]),
    uvs:new Float32Array([0,0,1,0,0,1,1,1,.5,.5])};
  assert.throws(()=>createSculptSourceHandoff(data),/SCULPT_SOURCE_HANDOFF_NONMANIFOLD_EDGE/);
});
test('prospective bake with plausible face counts cannot claim authenticated parent-child lineage',()=>{
  const sourcePositions=new Float32Array([0,0,0, 1,0,0, 1,1,0, 0,1,0]);
  const r=verifySculptProspectiveBake({sourcePositions,sourceTriangles:new Uint16Array([0,1,2,0,2,3]),
    outputPositions:sourcePositions,outputTriangles:new Uint16Array([0,2,3,0,1,2]),
    sourceToOutputFaceCounts:[1,1]});
  assert.equal(r.poseScreenPass,true);
  assert.equal(r.result,'DIAGNOSTIC_ONLY_UNVERIFIED_LINEAGE');
  assert.equal(r.lineageAuthenticated,false);
  assert.equal(r.diagnosticOnly,true);
  assert.equal(r.surfaceAccepted,false);
  assert.equal(r.bakePerformed,false);
  assert.equal(r.animationQualified,false);
});
test('prospective bake retains negative inversion receipt and rejects malformed face counts',()=>{
  const positions=new Float32Array([0,0,0,1,0,0,0,1,0]),triangles=new Uint16Array([0,1,2]);
  const reversed=new Float32Array([0,0,0,1,0,0,0,-1,0]);
  const params={sourcePositions:positions,sourceTriangles:triangles,outputPositions:reversed,
    outputTriangles:triangles,sourceToOutputFaceCounts:[1]};
  const report=verifySculptProspectiveBake({...params,diagnosticOnly:true});
  assert.equal(report.result,'REJECT_SOURCE_POSE');
  assert.equal(report.reversedChildFaces,1);
  assert.equal(report.weakChildFaces,1);
  assert.equal(report.lineageAuthenticated,false);
  assert.throws(()=>verifySculptProspectiveBake(params),/SCULPT_BAKE_LINEAGE_REJECTED/);
  assert.throws(()=>verifySculptProspectiveBake({...params,sourceToOutputFaceCounts:[2]}),/SCULPT_BAKE_SOURCE_LINEAGE_INVALID/);
});


// M1.6.3 corrective safety regression: geometry and handoff must agree on area.
test('source handoff rejects in-range collinear master triangles rejected by the geometry validator',()=>{
  const positions=new Float32Array([0,0,0,1,0,0,2,0,0]),triangles=new Uint16Array([0,1,2]);
  const data={positions,triangles,renderToMaster:new Uint32Array([0,1,2]),uvs:new Float32Array([0,0,.5,0,1,0])};
  assert.throws(()=>verifySculptGeometry(positions,triangles),/DEGENERATE_TRIANGLE/);
  assert.throws(()=>createSculptSourceHandoff(data),/SCULPT_SOURCE_HANDOFF_DEGENERATE_TRIANGLE/);
});
test('source handoff shares geometry doubled-area floor without rejecting valid thin faces',()=>{
  const makeData=(height)=>({positions:new Float32Array([0,0,0,1,0,0,0,height,0]),
    triangles:new Uint16Array([0,1,2]),renderToMaster:new Uint32Array([0,1,2]),
    uvs:new Float32Array([0,0,1,0,0,1])});
  const tiny=makeData(5e-9);
  assert.throws(()=>verifySculptGeometry(tiny.positions,tiny.triangles),/DEGENERATE_TRIANGLE/);
  assert.throws(()=>createSculptSourceHandoff(tiny),/SCULPT_SOURCE_HANDOFF_DEGENERATE_TRIANGLE/);
  const valid=makeData(1e-4);
  assert.equal(verifySculptGeometry(valid.positions,valid.triangles).triangleCount,1);
  const h=createSculptSourceHandoff(valid);
  assert.deepEqual([...h.triangles],[0,1,2]);
  assert.equal(h.retopologyBakeAllowed,false);
});


// Cycle Two C2-A: test the real topology-changing transaction and its negative space.
const square=()=>({
  sourceId:'connected-square',
  positions:new Float32Array([0,0,0,1,0,0,1,1,0,0,1,0]),
  triangles:new Uint32Array([0,1,2,0,2,3]),
  regions:['rim','rim','rim','rim'],protectedVertices:[0],
  selectedFaces:[0,1],
  newVertices:[
    {sourceFace:0,barycentric:[1/3,1/3,1/3],normalOffset:.08,region:'interior'},
    {sourceFace:1,barycentric:[1/3,1/3,1/3],normalOffset:.06,region:'interior'}
  ],
  replacementFaces:[
    {sourceFace:0,indices:[0,1,4]},{sourceFace:0,indices:[1,2,4]},{sourceFace:0,indices:[2,0,4]},
    {sourceFace:1,indices:[0,2,5]},{sourceFace:1,indices:[2,3,5]},{sourceFace:1,indices:[3,0,5]}
  ],
  uvHandoff:{renderToMaster:new Uint32Array([0,1,2,3]),uvs:new Float32Array([0,0,1,0,1,1,0,1]),
    faceRenderCorners:new Uint32Array([0,1,2,0,2,3])}
});
const C2A=()=>import('./dgb.native-sculpt-session.v1.mjs');
test('C2-A: two connected source faces gain actual interior 3D volume and topology with UV seam custody',async()=>{
  const {createConnectedSculptTopologyCandidate,restoreConnectedSculptTopologyCandidate}=await C2A();
  const input=square(),before=[...input.positions],bfaces=[...input.triangles],
    candidate=createConnectedSculptTopologyCandidate(input);
  assert.equal(candidate.counts.replacedFaces,2);assert.equal(candidate.counts.addedVertices,2);
  assert.equal(candidate.counts.outputFaces,6);assert.equal(candidate.positions.length/3,6);
  assert.equal(candidate.positions[4*3+2]>.07,true);
  assert.deepEqual([...input.positions],before);assert.deepEqual([...input.triangles],bfaces);
  assert.deepEqual([...candidate.positions.slice(0,12)],before);
  assert.equal(candidate.render.originalUvPrefixPreserved,true);
  assert.deepEqual([...candidate.render.renderToMaster.slice(0,4)],[0,1,2,3]);
  assert.deepEqual([...candidate.render.uvs.slice(0,8)],[0,0,1,0,1,1,0,1]);
  assert.equal(candidate.render.triangles.length,18);
  assert.equal(candidate.sourceFaceLineage.length,6);
  assert.doesNotThrow(()=>verifySculptGeometry(candidate.positions,candidate.triangles));
  const serialized=candidate.serialize(),restored=restoreConnectedSculptTopologyCandidate(serialized,input);
  assert.equal(restored.serialize(),serialized);
  assert.deepEqual([...restored.positions],[...candidate.positions]);
  assert.deepEqual([...restored.render.uvs],[...candidate.render.uvs]);
});
test('C2-A: disconnected selection and region with multiple boundary loops fail closed',async()=>{
  const {createConnectedSculptTopologyCandidate:make}=await C2A();
  const disconnected={...square(),positions:new Float32Array([0,0,0,1,0,0,0,1,0,3,0,0,4,0,0,3,1,0]),
    triangles:new Uint32Array([0,1,2,3,4,5]),regions:['a','a','a','b','b','b'],selectedFaces:[0,1],uvHandoff:null};
  assert.throws(()=>make(disconnected),/DISCONNECTED_REGION/);
  const verts=[],tris=[];for(let y=0;y<4;y++)for(let x=0;x<4;x++)verts.push(x,y,0);
  for(let y=0;y<3;y++)for(let x=0;x<3;x++){const a=y*4+x,b=a+1,c=a+4,d=c+1;tris.push(a,b,d,a,d,c);}
  const holes=Array.from({length:18},(_,i)=>i).filter(i=>i!==8&&i!==9);
  assert.throws(()=>make({...square(),positions:new Float32Array(verts),triangles:new Uint32Array(tris),
    regions:Array(16).fill('body'),protectedVertices:[],selectedFaces:holes,uvHandoff:null}),/MULTIPLE_BOUNDARY_LOOPS|BOUNDARY_NOT_SINGLE/);
});
test('C2-A: false parent-child identity, inverted topology and changed boundary reject',async()=>{
  const {createConnectedSculptTopologyCandidate:make}=await C2A();
  const old=square(),bad=old.replacementFaces.map(v=>({...v,indices:[...v.indices]}));
  bad[0]={sourceFace:0,indices:[0,1,5]};
  assert.throws(()=>make({...old,replacementFaces:bad}),/FALSE_PARENT_FACE_LINEAGE/);
  const inverted=old.replacementFaces.map(v=>({...v,indices:[...v.indices]}));
  inverted[0].indices=[0,4,1];
  assert.throws(()=>make({...old,replacementFaces:inverted}),/REVERSED_OR_DEGENERATE_CHILD/);
  assert.throws(()=>make({...old,replacementFaces:old.replacementFaces.slice(1)}),/BOUNDARY_MISMATCH|COVERAGE_INVALID/);
  assert.throws(()=>make({...old,selectedFaces:[1,0]}),/SELECTED_FACES_INVALID/);
});
test('C2-A: inconsistent UV/master seams and unsupported 64-pose transfer are rejected',async()=>{
  const {createConnectedSculptTopologyCandidate:make}=await C2A();
  const old=square(),seam={...old.uvHandoff,faceRenderCorners:new Uint32Array([0,1,3,0,2,3])};
  assert.throws(()=>make({...old,uvHandoff:seam}),/SOURCE_RENDER_MASTER_SEAM_MISMATCH/);
  assert.throws(()=>make({...old,animation:{poseCount:64}}),/ANIMATED_SOURCE_TRANSFER_UNQUALIFIED/);
  assert.throws(()=>make({...old,newVertices:[{...old.newVertices[0],normalOffset:2},old.newVertices[1]]}),/NEW_VERTEX_LINEAGE_INVALID/);
});
test('C2-A: forged save geometry and UV lineage cannot change a verified candidate',async()=>{
  const {createConnectedSculptTopologyCandidate:make,restoreConnectedSculptTopologyCandidate:load}=await C2A();
  const candidate=make(square()),save=candidate.serialize(),bad=JSON.parse(save);
  bad.geometry.positions[14]+=.05;
  assert.throws(()=>load(JSON.stringify(bad),square()),/SAVE_OR_SOURCE_IDENTITY_DRIFT/);
  const badSeam=JSON.parse(save);badSeam.uvHandoff.faceRenderCorners[0]=3;
  assert.throws(()=>load(JSON.stringify(badSeam),square()),/TRUSTED_UV_IDENTITY_MISMATCH|SOURCE_RENDER_MASTER_SEAM_MISMATCH/);
  assert.equal(candidate.serialize(),save);
  assert.throws(()=>load('not-json',square()),/SAVE_JSON_INVALID/);
  const fixed=createSculptSession({positions:new Float32Array([0,0,0,1,0,0,1,1,0,0,1,0]),
    triangles:new Uint32Array([0,1,2,0,2,3]),regions:['a','a','a','a']});
  const v1=fixed.serialize();assert.equal(fixed.restore(v1),true);
  assert.equal(fixed.serialize(),v1);
});


test('C2-A independent review: validated output buffers remain immutable across external writes',async()=>{
  const {createConnectedSculptTopologyCandidate:make,restoreConnectedSculptTopologyCandidate:restore}=await C2A();
  const c=make(square()),saved=c.serialize(),first=c.positions[0],firstUv=c.render.uvs[0],firstIndex=c.triangles[0],firstRenderIndex=c.render.triangles[0];
  c.positions[0]=Infinity;c.triangles[0]=4294967295;c.render.uvs[0]=Infinity;
  c.render.renderToMaster[0]=4294967295;c.render.triangles[0]=4294967295;
  assert.equal(c.positions[0],first);assert.equal(c.triangles[0],firstIndex);
  assert.equal(c.render.uvs[0],firstUv);assert.equal(c.render.renderToMaster[0],0);
  assert.equal(c.render.triangles[0],firstRenderIndex);assert.equal(c.serialize(),saved);
  assert.equal(restore(saved,square()).serialize(),saved);
});
test('C2-A independent review: forged saved source identity and UV custody fail against trusted external source',async()=>{
  const {createConnectedSculptTopologyCandidate:make,restoreConnectedSculptTopologyCandidate:restore}=await C2A();
  const clean=make(square()),saved=clean.serialize(),bogus=JSON.parse(saved);
  assert.throws(()=>restore(saved),/TRUSTED_SOURCE_REQUIRED/);
  bogus.original.positions[0]=-2;
  assert.throws(()=>restore(JSON.stringify(bogus),square()),/TRUSTED_SOURCE_IDENTITY_MISMATCH/);
  const savedUv=JSON.parse(saved);savedUv.uvHandoff.uvs[0]=.25;
  assert.throws(()=>restore(JSON.stringify(savedUv),square()),/TRUSTED_UV_IDENTITY_MISMATCH/);
  const trusted=square();trusted.positions[0]=4;
  assert.throws(()=>restore(saved,trusted),/TRUSTED_SOURCE_IDENTITY_MISMATCH/);
});
test('C2-A independent review: orphan new geometry rejected, projected parent coverage checked',async()=>{
  const {createConnectedSculptTopologyCandidate:make}=await C2A();
  const valid=square();
  const orphan={...valid,newVertices:[...valid.newVertices,{sourceFace:0,barycentric:[.5,.25,.25],normalOffset:.02,region:'floating'}]};
  assert.throws(()=>make(orphan),/ORPHAN_NEW_VERTEX/);
  const under={...valid,replacementFaces:valid.replacementFaces.map(x=>({...x,indices:[...x.indices]}))};
  // Move the first center from a barycentric 1/3 to 1/5: projected partition still exact and should remain valid.
  const moved={...valid,newVertices:valid.newVertices.map(x=>({...x,barycentric:[...x.barycentric]}))};
  moved.newVertices[0].barycentric=[.2,.4,.4];
  assert.equal(make(moved).counts.outputFaces,6);
});

test('C2-A: shared-vertex 3D penetration rejects, but lawful shared-edge contact remains valid',async()=>{
  const {createConnectedSculptTopologyCandidate:make}=await C2A();
  const crossing=new Float32Array([0,0,0,1,0,0,0,1,0,.5,.25,1,.5,.25,-1]);
  assert.throws(()=>verifySculptGeometry(crossing,new Uint32Array([0,1,2,0,3,4])),/SELF_INTERSECTION/);
  const sourcePositions=new Float32Array([0,0,0,1,0,0,0,1,0,.25,.15,.01,.25,.15,.10]);
  const sourceTriangles=new Uint32Array([0,1,2,0,3,4]);
  assert.doesNotThrow(()=>verifySculptGeometry(sourcePositions,sourceTriangles));
  assert.throws(()=>make({
    sourceId:'shared-vertex-interior-crossing',positions:sourcePositions,triangles:sourceTriangles,
    regions:Array(5).fill('body'),protectedVertices:[0],selectedFaces:[0],
    newVertices:[{sourceFace:0,barycentric:[1/3,1/3,1/3],normalOffset:.08,region:'interior'}],
    replacementFaces:[{sourceFace:0,indices:[0,1,5]},{sourceFace:0,indices:[1,2,5]},{sourceFace:0,indices:[2,0,5]}],
    uvHandoff:null
  }),/SELF_INTERSECTION/);
  const lawful=new Float32Array([0,0,0,1,0,0,0,1,0,0,0,1]);
  assert.doesNotThrow(()=>verifySculptGeometry(lawful,new Uint32Array([0,1,2,1,0,3])));
});

test('C2-A Copilot high: intersecting vertex-adjacent triangles crossing face interior must reject even with boundary-ending intersection',()=>{
  const positions=new Float32Array([0,0,0,1,0,0,0,1,0,.5,.5,1,.5,.5,-1]);
  const triangles=new Uint32Array([0,1,2,0,3,4]);
  assert.throws(()=>verifySculptGeometry(positions,triangles),/SELF_INTERSECTION/);
});

test('C2-A Copilot high: trusted 64-pose source cannot bypass animation guard during replay',async()=>{
  const {createConnectedSculptTopologyCandidate:make,restoreConnectedSculptTopologyCandidate:load}=await C2A();
  const source=square(),saved=make(source).serialize();
  assert.throws(()=>load(saved,{...source,animation:{poseCount:64}}),/ANIMATED_SOURCE_TRANSFER_UNQUALIFIED/);
  assert.equal(load(saved,source).serialize(),saved);
});

test('C2-A Copilot medium: valid skinny source triangle at shared area floor accepts centroid subdivision',async()=>{
  const {createConnectedSculptTopologyCandidate:make}=await C2A();
  const input={sourceId:'skinny-face',positions:new Float32Array([0,0,0,1,0,0,0,1e-7,0]),
    triangles:new Uint32Array([0,1,2]),regions:['body','body','body'],
    selectedFaces:[0],newVertices:[{sourceFace:0,barycentric:[1/3,1/3,1/3],normalOffset:0,region:'body'}],
    replacementFaces:[{sourceFace:0,indices:[0,1,3]},{sourceFace:0,indices:[1,2,3]},{sourceFace:0,indices:[2,0,3]}]};
  assert.doesNotThrow(()=>verifySculptGeometry(input.positions,input.triangles));
  const candidate=make(input);
  assert.equal(candidate.counts.outputFaces,3);
  assert.deepEqual([...candidate.sourceFaceLineage],[0,0,0]);
});

test('C2-A Copilot medium: untouched source face retains aligned sourceFaceLineage in output',async()=>{
  const {createConnectedSculptTopologyCandidate:make}=await C2A();
  const s=square();const candidate=make({...s,selectedFaces:[0],
    newVertices:[{sourceFace:0,barycentric:[1/3,1/3,1/3],normalOffset:.08,region:'interior'}],
    replacementFaces:[{sourceFace:0,indices:[0,1,4]},{sourceFace:0,indices:[1,2,4]},{sourceFace:0,indices:[2,0,4]}]});
  assert.equal(candidate.counts.outputFaces,4);
  assert.deepEqual([...candidate.sourceFaceLineage],[1,0,0,0]);
  assert.equal(candidate.sourceFaceLineage.length,candidate.triangles.length/3);
});

test('C2-A Copilot medium: omitted trusted protectedVertices defaults empty only when absent',async()=>{
  const {createConnectedSculptTopologyCandidate:make,restoreConnectedSculptTopologyCandidate:load}=await C2A();
  const source=square();delete source.protectedVertices;
  const saved=make(source).serialize();
  assert.equal(load(saved,source).serialize(),saved);
  assert.throws(()=>load(saved,{...source,protectedVertices:null}),/TRUSTED_SOURCE_REQUIRED/);
  assert.throws(()=>load(saved,{...source,protectedVertices:[0]}),/TRUSTED_SOURCE_IDENTITY_MISMATCH/);
});

test('C2-A Copilot round-two: detached component original vertex cannot be reused as child parent corner',async()=>{
  const {createConnectedSculptTopologyCandidate:make,restoreConnectedSculptTopologyCandidate:load}=await C2A();
  const source={sourceId:'detached-component-reuse',
    positions:new Float32Array([0,0,0,1,0,0,0,1,0,.25,.25,.08,.18,.23,.18,.25,.18,.18]),
    triangles:new Uint32Array([0,1,2,3,4,5]),regions:Array(6).fill('body'),protectedVertices:[],selectedFaces:[0],
    newVertices:[{sourceFace:0,barycentric:[.2,.5,.3],normalOffset:.06,region:'body'}],
    replacementFaces:[{sourceFace:0,indices:[0,1,3]},{sourceFace:0,indices:[1,2,6]},
      {sourceFace:0,indices:[2,0,3]},{sourceFace:0,indices:[2,3,6]},{sourceFace:0,indices:[3,1,6]}],uvHandoff:null};
  assert.throws(()=>make(source),/C2A_FALSE_PARENT_SOURCE_VERTEX/);
  const lawful={...source,replacementFaces:[{sourceFace:0,indices:[0,1,6]},
    {sourceFace:0,indices:[1,2,6]},{sourceFace:0,indices:[2,0,6]}]};
  const candidate=make(lawful);
  assert.equal(candidate.counts.sourceFaces,2);
  assert.equal(candidate.counts.outputFaces,4);
  assert.equal(load(candidate.serialize(),lawful).serialize(),candidate.serialize());
});

test('C2-A Copilot round-two: originally referenced protected vertex cannot be orphaned by replacement faces',async()=>{
  const {createConnectedSculptTopologyCandidate:make,restoreConnectedSculptTopologyCandidate:load}=await C2A();
  const source={sourceId:'protected-center-fan',
    positions:new Float32Array([0,0,0,1,0,0,1,1,0,0,1,0,.5,.5,0]),
    triangles:new Uint32Array([0,1,4,1,2,4,2,3,4,3,0,4]),
    regions:Array(5).fill('body'),protectedVertices:[4],selectedFaces:[0,1,2,3],
    newVertices:[{sourceFace:0,barycentric:[0,0,1],normalOffset:.08,region:'body'}],
    replacementFaces:[{sourceFace:0,indices:[0,1,5]},{sourceFace:1,indices:[1,2,5]},
      {sourceFace:2,indices:[2,3,5]},{sourceFace:3,indices:[3,0,5]}],uvHandoff:null};
  assert.throws(()=>make(source),/C2A_PROTECTED_SOURCE_VERTEX_REMOVED/);
  const valid={...source,protectedVertices:[0]};
  const candidate=make(valid);
  assert.equal(candidate.counts.outputFaces,4);
  assert.equal(load(candidate.serialize(),valid).serialize(),candidate.serialize());
});

test('C2-A Copilot round-three: new vertex joining detached incident fans on a folded strip is rejected',async()=>{
  const {createConnectedSculptTopologyCandidate:make,restoreConnectedSculptTopologyCandidate:load}=await C2A();
  const source={sourceId:'folded-u-sheet',
    positions:new Float32Array([0,0,0,1,0,0,1,1,0,0,1,0,1,0,.2,1,1,.2,0,1,.2,0,0,.2]),
    triangles:new Uint32Array([0,1,2,0,2,3,1,4,5,1,5,2,4,6,5,4,7,6]),
    regions:Array(8).fill('body'),protectedVertices:[],selectedFaces:[0,1,2,3,4,5],
    newVertices:[{sourceFace:0,barycentric:[.3,.3,.4],normalOffset:.1,region:'body'}],
    replacementFaces:[
      {sourceFace:0,indices:[0,1,8]},{sourceFace:0,indices:[1,2,8]},{sourceFace:0,indices:[2,0,8]},
      {sourceFace:1,indices:[0,2,3]},{sourceFace:2,indices:[1,4,5]},{sourceFace:3,indices:[1,5,2]},
      {sourceFace:4,indices:[4,6,8]},{sourceFace:4,indices:[6,5,8]},{sourceFace:4,indices:[5,4,8]},
      {sourceFace:5,indices:[4,7,6]}],uvHandoff:null};
  // Source is a single U-shaped connected sheet, while its replacement has two
  // disconnected triangle fans touching only at newly added vertex 8.
  assert.doesNotThrow(()=>verifySculptGeometry(source.positions,source.triangles));
  assert.throws(()=>make(source),/C2A_DISCONNECTED_NEW_VERTEX_FAN/);
});

test('C2-A Copilot round-three: a legitimately shared new vertex has one connected incident fan and restores',async()=>{
  const {createConnectedSculptTopologyCandidate:make,restoreConnectedSculptTopologyCandidate:load}=await C2A();
  const source={sourceId:'shared-edge-subdivision',
    positions:new Float32Array([0,0,0,1,0,0,1,1,0,0,1,0]),
    triangles:new Uint32Array([0,1,2,0,2,3]),regions:Array(4).fill('body'),protectedVertices:[],
    selectedFaces:[0,1],newVertices:[{sourceFace:0,barycentric:[.5,0,.5],normalOffset:0,region:'body'}],
    replacementFaces:[{sourceFace:0,indices:[0,1,4]},{sourceFace:0,indices:[1,2,4]},
      {sourceFace:1,indices:[0,4,3]},{sourceFace:1,indices:[4,2,3]}],uvHandoff:null};
  const candidate=make(source);
  assert.equal(candidate.counts.outputFaces,4);
  assert.equal(candidate.counts.addedVertices,1);
  assert.equal(load(candidate.serialize(),source).serialize(),candidate.serialize());
});

test('C2-A Copilot round-three: sparse source regions or protected vertices reject before producing unrestorable saves',async()=>{
  const {createConnectedSculptTopologyCandidate:make}=await C2A();
  const source=square();
  const regions=Array(4),protectedVertices=[];protectedVertices.length=1;
  assert.throws(()=>make({...source,regions}),/C2A_REGIONS_INVALID/);
  assert.throws(()=>make({...source,protectedVertices}),/C2A_PROTECTED_INVALID/);
  const partial=['body','body','body'];partial.length=4;
  assert.throws(()=>make({...source,regions:partial}),/C2A_REGIONS_INVALID/);
  assert.equal(make({...source,protectedVertices:[]}).counts.outputFaces,6);
});

// Generated closed topology has the same public dimensions as M1.3 but contains
// no owner-private source coordinates, pose weights, atlas or appearance module.
function syntheticM13(){
  const rings=4,slices=283,base=[],triangles=[];
  for(let j=0;j<rings;j++){
    const phi=Math.PI*(j+1)/(rings+1);
    for(let k=0;k<slices;k++){const theta=2*Math.PI*k/slices;
      base.push(Math.sin(phi)*Math.cos(theta),Math.sin(phi)*Math.sin(theta),Math.cos(phi));}
  }
  const north=1132,south=1133;base.push(0,0,1,0,0,-1);
  for(let k=0;k<slices;k++)triangles.push(north,k,(k+1)%slices);
  for(let j=0;j<rings-1;j++)for(let k=0;k<slices;k++){
    const a=j*slices+k,b=j*slices+(k+1)%slices,c=a+slices,d=b+slices;
    triangles.push(a,c,b,b,c,d);
  }
  for(let k=0;k<slices;k++)triangles.push((rings-1)*slices+k,south,(rings-1)*slices+(k+1)%slices);
  return {base,targets:Array.from({length:16},()=>Array(1134*3).fill(0)),
    weights:Array.from({length:64},()=>Array(16).fill(0)),
    renderToMaster:Array.from({length:1409},(_,i)=>i<1134?i:i-1134),
    triangles,uv:Array.from({length:1409},(_,i)=>[i%17/17,i%31/31]).flat()};
}
test('original M1.3 read-only handoff separates 1134 masters and 1409 seam records',()=>{
  const original=syntheticM13(),source=createM13OriginalSource(original);
  assert.equal(source.morphTargets,16);assert.equal(source.poses,64);
  const frame=source.pose(52);
  assert.equal(frame.positions.length,3402);
  assert.equal(frame.triangles.length,6792);
  assert.equal(frame.sourceRender.renderToMaster.length,1409);
  assert.equal(frame.sourceRender.uvs.length,2818);
  assert.equal(frame.sourceRender.renderTriangles.length,6792);
  assert.equal(frame.sourceRender.readOnlyOriginal,true);
  assert.equal(frame.protectedVertices.length,1134);
  assert.equal(frame.sourceGuards.readOnlyOriginalBaseline,true);
  assert(frame.regions.every(x=>x==='ORIGINAL_PROTECTED'));
  assert.equal(source.forequarterEditAllowed,false);
  assert.equal(source.state().lastPose,52);
  // Input ownership: changing the caller's fixture never mutates a frozen pose.
  original.base[0]=100;original.triangles[0]=0;
  assert.deepEqual([...source.pose(52).positions],[...frame.positions]);
});
test('original M1.3 handoff fails closed on incorrect indexed source or pose data',()=>{
  const f=syntheticM13();
  assert.throws(()=>createM13OriginalSource({...f,targets:f.targets.slice(1)}),/M13_TARGET_COUNT_INVALID/);
  assert.throws(()=>createM13OriginalSource({...f,renderToMaster:f.renderToMaster.map((v,i)=>i===0?1134:v)}),/M13_MASTER_RENDER_MAP_INVALID/);
  assert.throws(()=>createM13OriginalSource({...f,triangles:f.triangles.map((v,i)=>i===0?1409:v)}),/M13_RENDER_TRIANGLES_INVALID/);
  const handoff=createM13OriginalSource(f);
  assert.throws(()=>handoff.pose(64),/M13_POSE_INDEX_INVALID/);
});

test('original intersecting reference is viewable only if every master is frozen',()=>{
  // Two independent faces cross in space. An ordinary editable session MUST
  // reject them; only the explicit all-protected original-reference path may
  // inspect such a source without claiming its geometry is repair-safe.
  const positions=new Float32Array([
    -1,-1,0, 1,-1,0, 0,1,0,
    0,-.2,-1, 0,-.2,1, 0,.8,0
  ]),triangles=new Uint16Array([0,1,2,3,4,5]),
    regions=Array(6).fill('ORIGINAL_PROTECTED'),protectedVertices=[0,1,2,3,4,5];
  assert.throws(()=>createSculptSession({positions,triangles,regions,protectedVertices}),/SELF_INTERSECTION/);
  const session=createSculptSession({positions,triangles,regions,protectedVertices,
    sourceGuards:{readOnlyOriginalBaseline:true}});
  assert.equal(session.state().originalReferenceReadOnly,true);
  assert.equal(session.verify().editableMeshSafetyQualified,false);
  assert.throws(()=>session.beginStroke({position:[0,0,0],normal:[0,0,1],vertexIds:[0,1,2]}),
    /M13_ORIGINAL_REFERENCE_EDIT_FORBIDDEN/);
  const edited=JSON.parse(session.serialize());edited.positions[0]+=.1;
  assert.throws(()=>session.restore(JSON.stringify(edited)),/SCULPT_PROTECTED_SOURCE_CHANGED/);
  assert.throws(()=>createSculptSession({positions,triangles,regions,protectedVertices:[0,1,2,3,4],
    sourceGuards:{readOnlyOriginalBaseline:true}}),/M13_ORIGINAL_READONLY_FULL_PROTECTION_REQUIRED/);
});
