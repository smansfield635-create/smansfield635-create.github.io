import test from 'node:test';
import assert from 'node:assert/strict';
import {makeNeutralSculptRegionFixture,createNativeSculptStudio,makeSculptUvHandoff,sculptMeshSpecification,makeSculptSubdivision,serializeSculptStudioState,restoreSculptStudioState,makeReferenceMaskFromRgba,makeSculptReferenceFixture,readSculptReferenceImageDimensions,validateSculptFaceIndex,replaceFourSculptViewMeshes,abortRejectedSculptStroke} from './dgb.native-sculpt-browser.v1.mjs';
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
  assert.match(browser,/replaceFourSculptViewMeshes\(views,previous,replacement,drawAll/);
  assert.match(browser,/get session\(\)\{return session;/);
  assert.match(browser,/abortRejectedSculptStroke\(session,updateAll,failed\)/);
  assert.match(browser,/Pointer cancelled; prior geometry restored/);
});


test('C2-B image RGBA reference uses bounded silhouette heuristic and preserves seed UVs',()=>{
  const width=12,height=12,data=new Uint8ClampedArray(width*height*4);
  for(let i=0;i<width*height;i++){
    const inside=((i%width)-6)**2+(Math.floor(i/width)-6)**2<16;
    for(let k=0;k<3;k++)data[4*i+k]=inside?0:255;
    data[4*i+3]=255;
  }
  const mask=makeReferenceMaskFromRgba({width,height,data});
  assert.equal(mask.mask.reduce((n,x)=>n+x,0),45);
  const generated=makeSculptReferenceFixture(mask);
  assert.equal(generated.positions.length/3,454);
  assert.equal(generated.triangles.length/3,904);
  const session=createSculptSession(generated);
  const uv=makeSculptUvHandoff(session.getPositions(),session.getTriangles(),generated.uvs);
  assert.deepEqual([...uv.uvs],[...generated.uvs]);
  const spec=sculptMeshSpecification(session,uv);
  assert.equal(spec.indices.length,generated.triangles.length);
  assert.throws(()=>makeReferenceMaskFromRgba({width:4,height:4,data:new Uint8ClampedArray(64)}),/STUDIO_REFERENCE_IMAGE_INVALID/);
  assert.throws(()=>makeReferenceMaskFromRgba({width:12,height:12,data:new Uint8ClampedArray(576)}),/STUDIO_REFERENCE_MASK_NO_CONTRAST/);
});
test('C2-B reference source mask persists through v2 save, trusted C2-A edit and reload',()=>{
  const width=12,height=12,mask=Array.from({length:144},(_,i)=>
    ((i%12)-6)**2+(Math.floor(i/12)-6)**2<16?1:0);
  const reference={width,height,mask},metadata={kind:'SILHOUETTE_HEURISTIC_PRIOR',...reference};
  const fixture=makeSculptReferenceFixture(reference),session=createSculptSession(fixture),
    uv=makeSculptUvHandoff(session.getPositions(),session.getTriangles(),fixture.uvs);
  const neutral=makeNeutralSculptRegionFixture();
  const unedited=serializeSculptStudioState(session,[],metadata);
  assert.equal(JSON.parse(unedited).schema,'DGB_SCULPT_LAB_TOPOLOGY_CHAIN_V2');
  const plain=restoreSculptStudioState(unedited,neutral);
  assert.equal(plain.stages.length,0);
  assert.deepEqual([...plain.session.getTriangles()],[...session.getTriangles()]);
  const edit=makeSculptSubdivision(session,uv,fixture.protectedVertices,191,0);
  const next=createSculptSession({positions:edit.positions,triangles:edit.triangles,
    regions:[...edit.regions],protectedVertices:[...edit.protectedVertices]});
  const saved=serializeSculptStudioState(next,[{before:session.serialize(),recipe:edit.serialize()}],metadata);
  const restored=restoreSculptStudioState(saved,neutral);
  assert.equal(restored.stages.length,1);
  assert.deepEqual([...restored.session.getTriangles()],[...next.getTriangles()]);
  assert.deepEqual([...restored.uv.uvs],[...edit.render.uvs]);
  const corrupt=JSON.parse(saved);corrupt.source.mask[1]=2;
  assert.throws(()=>restoreSculptStudioState(JSON.stringify(corrupt),neutral),/SILHOUETTE_INVALID/);
});

test('C2-B four-view swap draws exactly once and retains all mesh identities',()=>{
  const views=Array.from({length:4},()=>{
    const mesh={gpu:{}};
    return {mesh,device:{replaceMesh(m,s){assert.strictEqual(m,mesh);m.spec=s;}}};
  });
  let draws=0,quarantines=0;
  const answer=replaceFourSculptViewMeshes(views,{id:'before'},{id:'after'},
    ()=>{draws++;return 'DRAWN'},()=>{quarantines++;});
  assert.equal(answer,'DRAWN');
  assert.equal(draws,1);
  assert.equal(quarantines,0);
  for(const view of views)assert.equal(view.mesh.spec.id,'after');
});
test('C2-B third-view GPU failure rolls back prior views and redraws original',()=>{
  const oldSpec={id:'before'},newSpec={id:'after'};
  const views=Array.from({length:4},(_,i)=>{
    const mesh={spec:oldSpec};
    return {mesh,device:{replaceMesh(m,s){
      if(i===2&&s===newSpec)throw Error('INJECT_THIRD_VIEW_FAILURE');
      m.spec=s;
    },status(){return {restorationError:null,lost:false}}}};
  });
  let draws=0,quarantines=0;
  assert.throws(()=>replaceFourSculptViewMeshes(views,oldSpec,newSpec,()=>{draws++;},()=>{quarantines++;}),
    /INJECT_THIRD_VIEW_FAILURE/);
  assert.equal(draws,1); // redraw only: transaction draw never occurred
  assert.equal(quarantines,0);
  for(const v of views)assert.strictEqual(v.mesh.spec,oldSpec);
});
test('C2-B rendered topology failure rolls back all four views and does not redraw a candidate',()=>{
  const oldSpec={id:'before'},newSpec={id:'after'};
  const views=Array.from({length:4},()=>({mesh:{spec:oldSpec},
    device:{replaceMesh(m,s){m.spec=s;},status(){return {restorationError:null,lost:false}}}}));
  let draws=0,quarantines=0;
  assert.throws(()=>replaceFourSculptViewMeshes(views,oldSpec,newSpec,()=>{
    draws++;
    if(draws===1)throw Error('INJECT_RENDER_FAILURE');
  },()=>{quarantines++;}),/INJECT_RENDER_FAILURE/);
  assert.equal(draws,2); // candidate fails, restored geometry redraw succeeds
  assert.equal(quarantines,0);
  for(const v of views)assert.strictEqual(v.mesh.spec,oldSpec);
});
test('C2-B uncertain release or failed rollback quarantines instead of accepting partial GPU state',()=>{
  const oldSpec={id:'before'},newSpec={id:'after'};
  const views=Array.from({length:4},(_,i)=>({mesh:{spec:oldSpec},
    device:{replaceMesh(m,s){
      if(i===2&&s===newSpec)throw Error('INJECT_RELEASE_UNCERTAIN');
      if(i===0&&s===oldSpec)throw Error('INJECT_ROLLBACK_FAILED');
      m.spec=s;
    },status(){return {restorationError:i===2?'MESH_RELEASE_UNCERTAIN':null}}}}));
  let quarantines=0;
  assert.throws(()=>replaceFourSculptViewMeshes(views,oldSpec,newSpec,()=>{},()=>{quarantines++;}),
    /INJECT_RELEASE_UNCERTAIN/);
  assert.equal(quarantines,1);
});

test('C2-B rejected pointer edit cancels active stroke and restores savable session',()=>{
  const fixture=makeNeutralSculptRegionFixture(),session=createSculptSession(fixture),
    before=session.getPositions(),hit=session.pick([-.55,.13,4.5],[0,0,-1]);
  assert(hit);
  session.beginStroke(hit,{region:'cheek',radius:.45,strength:.8});
  assert.equal(session.state().active,true);
  let redraws=0;
  const recovery=abortRejectedSculptStroke(session,()=>{redraws++;session.verify();});
  assert.equal(recovery.restored,true);
  assert.equal(recovery.uncertain,false);
  assert.equal(redraws,1);
  assert.equal(session.state().active,false);
  assert.deepEqual([...session.getPositions()],[...before]);
  assert.equal(JSON.parse(session.serialize()).schema,'DGB_NATIVE_SCULPT_MESH_V1');
});
test('C2-B uncertain rejected stroke GPU redraw does not certify recovery',()=>{
  const fixture=makeNeutralSculptRegionFixture(),session=createSculptSession(fixture),
    hit=session.pick([-.55,.13,4.5],[0,0,-1]);
  assert(hit);session.beginStroke(hit,{radius:.45});
  const recovery=abortRejectedSculptStroke(session,()=>{throw Error('INJECT_GPU_REDRAW_FAILURE');});
  assert.equal(recovery.restored,false);
  assert.equal(recovery.uncertain,true);
  assert.equal(recovery.recoveryError,'INJECT_GPU_REDRAW_FAILURE');
  assert.equal(session.state().active,false);
});
test('C2-B a quarantined GPU skips redraw but still closes CPU stroke',()=>{
  const fixture=makeNeutralSculptRegionFixture(),session=createSculptSession(fixture),
    hit=session.pick([-.55,.13,4.5],[0,0,-1]);
  assert(hit);session.beginStroke(hit,{radius:.45});
  let called=false;
  const recovery=abortRejectedSculptStroke(session,()=>{called=true;},true);
  assert.equal(called,false);
  assert.equal(recovery.uncertain,true);
  assert.equal(recovery.restored,false);
  assert.equal(session.state().active,false);
});

// Independent C2-B review: file-size checks must precede all decoded image allocation.
test('C2-B PNG JPEG and WebP dimensions are budgeted from compressed headers before decode',async()=>{
  const makePng=(w,h)=>{
    const b=new Uint8Array(33);b.set([137,80,78,71,13,10,26,10],0);
    const v=new DataView(b.buffer);v.setUint32(8,13);b.set([73,72,68,82],12);
    v.setUint32(16,w);v.setUint32(20,h);
    return new Blob([b],{type:'image/png'});
  };
  const jpeg=new Uint8Array(21);jpeg.set([255,216,255,192,0,17,8,1,44,1,144],0);
  const webp=new Uint8Array(30);
  webp.set([82,73,70,70],0);webp.set([87,69,66,80,86,80,56,88],8);webp[16]=10;
  webp[24]=143;webp[25]=1;webp[27]=199;
  assert.deepEqual(await readSculptReferenceImageDimensions(makePng(400,300)),{width:400,height:300});
  assert.deepEqual(await readSculptReferenceImageDimensions(new Blob([jpeg],{type:'image/jpeg'})),{width:400,height:300});
  assert.deepEqual(await readSculptReferenceImageDimensions(new Blob([webp],{type:'image/webp'})),{width:400,height:200});
  await assert.rejects(readSculptReferenceImageDimensions(makePng(8000,3000)),/DECODE_BUDGET_EXCEEDED/);
  await assert.rejects(readSculptReferenceImageDimensions(makePng(0,80)),/HEADER_INVALID/);
  await assert.rejects(readSculptReferenceImageDimensions(new Blob([new Uint8Array(5000001)],{type:'image/png'})),
    /TYPE_OR_SIZE_REJECTED/);
  await assert.rejects(readSculptReferenceImageDimensions(new Blob([new Uint8Array(33)],{type:'image/png'})),
    /HEADER_INVALID/);
  await assert.rejects(readSculptReferenceImageDimensions(new Blob([jpeg],{type:'image/gif'})),
    /TYPE_OR_SIZE_REJECTED/);
});
test('C2-B keyboard numeric face selection accepts the same C2-A face range as pointer picking',()=>{
  const initial=makeNeutralSculptRegionFixture(),faceCount=initial.triangles.length/3;
  assert.equal(faceCount,480);
  assert.equal(validateSculptFaceIndex(0,faceCount),0);
  assert.equal(validateSculptFaceIndex(251,faceCount),251);
  assert.equal(validateSculptFaceIndex(faceCount-1,faceCount),faceCount-1);
  for(const x of [-1,faceCount,NaN,1.5,'251',null])assert.throws(
    ()=>validateSculptFaceIndex(x,faceCount),/STUDIO_SELECTED_FACE_INVALID/);
});
test('C2-B reference input and numeric face selector are keyboard accessible in live HTML',async()=>{
  const {readFileSync}=await import('node:fs');
  const html=readFileSync(new URL('../../graphics-engine/sculpt-lab/index.html',import.meta.url),'utf8');
  const controller=readFileSync(new URL('./dgb.native-sculpt-browser.v1.mjs',import.meta.url),'utf8');
  assert.match(html,/<input id="faceIndex" type="number" min="0" step="1"/);
  assert.match(html,/input\[type=file\]\{display:block;/);
  assert.doesNotMatch(html,/input\[type=file\]\{display:none/);
  assert.match(html,/input:focus-visible/);
  assert.match(html,/id="reference" type="file"/);
  assert.match(controller,/add\(controls.faceIndex,'input'/);
  assert.match(controller,/selectedFace=validateSculptFaceIndex\(Number\(raw\)/);
  assert.match(controller,/const dimensions=await readSculptReferenceImageDimensions\(file\);[\s\S]*?bitmap=await createImageBitmap\(file\)/);
});
