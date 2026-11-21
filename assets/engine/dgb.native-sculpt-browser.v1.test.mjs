import test from 'node:test';
import assert from 'node:assert/strict';
import {makeNeutralSculptRegionFixture,createNativeSculptStudio,makeSculptUvHandoff,sculptMeshSpecification,makeSculptSubdivision,serializeSculptStudioState,restoreSculptStudioState,makeReferenceMaskFromRgba,makeSculptReferenceFixture,readSculptReferenceImageDimensions,validateSculptFaceIndex,createSculptReferenceImportGate,replaceFourSculptViewMeshes,abortRejectedSculptStroke,releaseSculptStudioResources,replaceSculptStudioAtomically} from './dgb.native-sculpt-browser.v1.mjs';
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

test('C2-B overlapping reference imports ignore late image A after B and later edits',async()=>{
  const gate=createSculptReferenceImportGate();
  const deferred=()=>{
    let resolve;
    const promise=new Promise(done=>{resolve=done;});
    return {promise,resolve};
  };
  const aHeader=deferred(),aDecode=deferred(),bHeader=deferred(),bDecode=deferred();
  let image='original',edits=0,cleared=[];
  async function importSource(name,header,decode){
    const token=gate.begin();
    let released=0;
    try{
      await header.promise;
      if(!gate.isCurrent(token))return;
      await decode.promise;
      if(!gate.isCurrent(token))return;
      image=name; // same commit gate as the real reference import
    }finally{
      released++;
      if(gate.isCurrent(token))cleared.push(name);
    }
    assert.equal(released,1);
  }
  const first=importSource('A',aHeader,aDecode);
  aHeader.resolve();await Promise.resolve(); // A enters decode
  const second=importSource('B',bHeader,bDecode);
  bHeader.resolve();await Promise.resolve();
  bDecode.resolve();await second;
  assert.equal(image,'B');
  image+=':sculpt-edit';edits++;
  aDecode.resolve();await first;
  assert.equal(image,'B:sculpt-edit');
  assert.equal(edits,1);
  assert.deepEqual(cleared,['B']);
  // Pending work is invalidated on later edits, loads and disposal.
  const pending=gate.begin();
  gate.cancel();
  assert.equal(gate.isCurrent(pending),false);
});
test('C2-B source uses current-token checks after each await and before four-view adoption',async()=>{
  const {readFileSync}=await import('node:fs');
  const source=readFileSync(new URL('./dgb.native-sculpt-browser.v1.mjs',import.meta.url),'utf8');
  assert.match(source,/const token=referenceImports\.begin\(\)/);
  assert.match(source,/const dimensions=await readSculptReferenceImageDimensions\(file\);\s*if\(!referenceImports\.isCurrent\(token\)\)return;/);
  assert.match(source,/bitmap=await createImageBitmap\(file\);\s*if\(!referenceImports\.isCurrent\(token\)\)return;/);
  assert.match(source,/if\(!referenceImports\.isCurrent\(token\)\)return;\s*adoptTopology\(nextSession/);
  assert.match(source,/if\(referenceImports\.isCurrent\(token\)\)event\.target\.value='';/);
});

test('C2-B delayed JSON reload cannot overwrite a newer topology edit or reference',async()=>{
  const gate=createSculptReferenceImportGate();
  const deferred=()=>{
    let resolve;
    const promise=new Promise(done=>{resolve=done;});
    return {promise,resolve};
  };
  let current='neutral',cleared=[];
  const a=deferred();
  async function reload(name,wait){
    const token=gate.begin();
    try{
      const json=await wait.promise;
      if(!gate.isCurrent(token))return;
      current=JSON.parse(json).mesh;
    }finally{if(gate.isCurrent(token))cleared.push(name);}
  }
  const first=reload('older-json',a);
  current='subdivided';gate.cancel(); // actual subdivision invalidates pending file.text()
  a.resolve('{"mesh":"neutral"}');await first;
  assert.equal(current,'subdivided');
  assert.deepEqual(cleared,[]);
  const b=deferred(),second=reload('newer-json',b);
  const reference=gate.begin(); // newer imported image supersedes JSON reload
  current='reference-image';
  b.resolve('{"mesh":"old-topology"}');await second;
  assert.equal(gate.isCurrent(reference),true);
  assert.equal(current,'reference-image');
  assert.deepEqual(cleared,[]);
});
test('C2-B live file.text reload checks generation before topology adoption and clearing',async()=>{
  const {readFileSync}=await import('node:fs');
  const source=readFileSync(new URL('./dgb.native-sculpt-browser.v1.mjs',import.meta.url),'utf8');
  assert.match(source,/add\(controls\.load,'change',async event=>\{\s*\/\/[^\n]*\n[^\n]*\n\s*const token=referenceImports\.begin\(\)/);
  assert.match(source,/const source=await file\.text\(\);\s*if\(!referenceImports\.isCurrent\(token\)\)return;/);
  assert.match(source,/const restored=restoreSculptStudioState\(source,fixture\);\s*if\(!referenceImports\.isCurrent\(token\)\)return;\s*adoptTopology\(/);
  assert.match(source,/if\(referenceImports\.isCurrent\(token\)\)event\.target\.value='';/);
});

test('Gen3310 original M1.3 remains protected while C2-B editing paths survive',async()=>{
  const {readFileSync}=await import('node:fs');
  const html=readFileSync(new URL('../../graphics-engine/sculpt-lab/index.html',import.meta.url),'utf8');
  const browser=readFileSync(new URL('./dgb.native-sculpt-browser.v1.mjs',import.meta.url),'utf8');
  const session=readFileSync(new URL('./dgb.native-sculpt-session.v1.mjs',import.meta.url),'utf8');
  for(const id of ['m13Archive','m13Pose','returnNeutral','reference','subdivide','faceIndex','load'])
    assert(html.includes('id="'+id+'"'),id);
  for(const marker of ["new DecompressionStream('deflate-raw')","crypto.subtle.digest","M13_ZIP_SHA","M13_MEMBER_HASHES","originalEyeAt","nextSource.pose(index)"])
    assert(html.includes(marker),marker);
  assert(!html.includes('src="https://drive.google.com'));
  for(const marker of ['sourceGeometry(texturedSource','originalTexturedShaders','originalEyeShaders','texturedSource?device.createMesh','Original M1.3 is read-only','restoreSculptStudioState','replaceFourSculptViewMeshes','createSculptReferenceImportGate'])
    assert(browser.includes(marker),marker);
  assert(browser.includes('if(originalSource)throw new Error(\'M13_ORIGINAL_REFERENCE_EDIT_FORBIDDEN\')'));
  assert(session.includes('forequarterEditAllowed:false'));
  assert(session.includes('originalReferenceSelfIntersectionNotAdjudicated'));
});

test('Gen3310 failed partial four-view initialization releases device-only entries and listeners',()=>{
  const calls=[],listeners=[()=>calls.push('canvas-listener')];
  const views=[
    {device:{dispose(){calls.push('device-1');}},scene:{dispose(){calls.push('scene-1');}}},
    {device:{dispose(){calls.push('device-2');}}} // atlas/eye setup threw before scene existed
  ];
  releaseSculptStudioResources(views,listeners);
  assert.deepEqual(calls,['canvas-listener','scene-1','device-1','device-2']);
  assert.equal(listeners.length,0);
});
test('Gen3310 studio replacement preserves edited session on failed original import',()=>{
  let disposed=0,redraws=0;
  const editable={state:{revision:7,undoDepth:2},drawAll(){redraws++;},dispose(){disposed++;}};
  assert.throws(()=>replaceSculptStudioAtomically(editable,()=>{throw Error('WEBGL2_MISSING');}),/WEBGL2_MISSING/);
  assert.equal(disposed,0);
  assert.equal(redraws,1);
  assert.deepEqual(editable.state,{revision:7,undoDepth:2});
  const original={originalM13ReadOnly:true};
  assert.equal(replaceSculptStudioAtomically(editable,()=>original),original);
  assert.equal(disposed,1);
});
test('Gen3310 source-mode installation commits state only on success and exposes truthful readiness',async()=>{
  const {readFileSync}=await import('node:fs');
  const html=readFileSync(new URL('../../graphics-engine/sculpt-lab/index.html',import.meta.url),'utf8');
  const browser=readFileSync(new URL('./dgb.native-sculpt-browser.v1.mjs',import.meta.url),'utf8');
  assert.match(browser,/const view=\{name:names\[i\],canvas,device\};views\.push\(view\);[\s\S]*?const texture=texturedSource/);
  assert.match(browser,/catch\(e\)\{releaseSculptStudioResources\(views,listeners\);throw e;\}/);
  assert.match(browser,/catch\(error\)\{releaseSculptStudioResources\(views,listeners\);throw error;\}/);
  assert.match(html,/const next=replaceSculptStudioAtomically\(previous,build\);\s*studio=next;/);
  assert.match(html,/get ready\(\)\{return Boolean\(studio&&!studio\.status\(\)\.disposed&&!studio\.status\(\)\.failed\);\}/);
  assert.match(html,/showOriginalPose\(52,\{source:nextSource,rawM13:nextRaw,atlas:nextAtlas,eyeModule:nextModule\}\);/);
  assert.match(html,/install\(frame\);\s*\/\/ Publish source-mode state only after/);
  assert.doesNotMatch(html,/studio\?\.dispose\(\);studio=null/);
});

test('Gen3310 original M1.3 eye anchor is frozen at rest and carried through hop poses',async()=>{
  const {readFileSync}=await import('node:fs');
  const html=readFileSync(new URL('../../graphics-engine/sculpt-lab/index.html',import.meta.url),'utf8');
  const start=html.indexOf('function originalEyeAt(');
  const end=html.indexOf('\nlet studio=',start);
  assert(start>=0&&end>start,'M13_ORIGINAL_EYE_ADAPTER_REQUIRED');
  const adapter=Function('return ('+html.slice(start,end).trim()+')')();
  const map=Uint32Array.from([0,1]);
  const restFrame={sourceMasterPosition:Float32Array.from([.74,1,.668,.75,1,.667]),
    sourceRender:{renderToMaster:map,originalPose:52}};
  const hopFrame={sourceMasterPosition:Float32Array.from([.4,1.1,.6,.41,1.2,.61]),
    sourceRender:{renderToMaster:map,originalPose:24}};
  const calls=[];
  const mockPrivateEye={createRabbitVisualAppearance({device,bridge}){
    const atRest=bridge.snapshot().positions;
    assert.deepEqual([...atRest],[...restFrame.sourceMasterPosition]);
    calls.push('anchor-rest');
    device.createMesh({attributes:[
      {name:'a_position',data:Float32Array.from([.74,1,.668])},
      {name:'a_normal',data:Float32Array.from([0,0,1])},
      {name:'a_color',data:Float32Array.from([.2,.1,.1])},
      {name:'a_fade',data:Float32Array.from([1])}]});
    return {status:()=>({furFins:0,tailIncluded:false}),update({positions}){
      assert.deepEqual([...positions],[...hopFrame.sourceMasterPosition]);
      calls.push('follow-posed-surface');
      device.updateMeshAttribute(null,'a_position',Float32Array.from([.4,1.1,.6]));
    }};
  }};
  const hop=adapter(mockPrivateEye,{},hopFrame,restFrame);
  assert.deepEqual(calls,['anchor-rest','follow-posed-surface']);
  assert.deepEqual([...hop.positions],[.4,.6,-1.1].map(Math.fround));
  assert.deepEqual([...hop.colors],[Math.fround(.2),Math.fround(.1),Math.fround(.1)]);
  const rest=adapter(mockPrivateEye,{},restFrame,restFrame);
  assert.deepEqual(calls,['anchor-rest','follow-posed-surface','anchor-rest']);
  assert.deepEqual([...rest.positions],[.74,.668,-1].map(Math.fround));
  assert.match(html,/const restFrame=nextSource\.pose\(52\),frame=index===52\?restFrame:nextSource\.pose\(index\)/);
});


test('Gen3430 original remains immutable while a separate A4 derivative action is explicit',async()=>{
  const {readFileSync}=await import('node:fs');
  const html=readFileSync(new URL('../../graphics-engine/sculpt-lab/index.html',import.meta.url),'utf8');
  const browser=readFileSync(new URL('./dgb.native-sculpt-browser.v1.mjs',import.meta.url),'utf8');
  const kernel=readFileSync(new URL('./dgb.native-sculpt-session.v1.mjs',import.meta.url),'utf8');
  assert.match(html,/id="createDerivative"[^>]*disabled/);
  assert.match(html,/createM13EditableDerivative\(originalRestFrame,M13_ZIP_SHA\)/);
  assert.match(html,/get editableA4Derivative\(\)/);
  assert.match(html,/id="region"[\s\S]*?value="foreleg"/);
  assert.match(browser,/const originalSource=fixture\.sourceRender\?\.readOnlyOriginal===true/);
  assert.match(browser,/const editableSource=fixture\.sourceRender\?\.editableDerivative===true/);
  assert.match(browser,/if\(originalSource\)return drawAll\(\)/);
  assert.match(browser,/editableSource\?sourceGeometry\(editableSource,session\.getPositions\(\),session\.getNormals\(\)\)/);
  assert.match(browser,/A4_DERIVATIVE_TOPOLOGY_CHANGE_FORBIDDEN/);
  assert.match(browser,/sourceGeometry\(texturedSource/);
  assert.match(browser,/const texture=texturedSource/);
  assert.match(browser,/editableSource\?session\.serialize\(\)/);
  assert.match(kernel,/export function createM13EditableDerivative\(/);
  assert.match(kernel,/verifyA4DerivativeNoNewIntersections/);
  assert.match(kernel,/DGB_A4_EDITABLE_DERIVATIVE_V1/);
  assert.match(kernel,/if\(readOnlyOriginal\)throw new Error\('M13_ORIGINAL_REFERENCE_EDIT_FORBIDDEN'\)/);
});
