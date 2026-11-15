/** Diamond Gate Graphics Engine — off-product four-view interactive sculpt studio.
 * Reuses existing E1/M1.1 GPU device, E2 frame submission, and E3 scene/camera.
 * All canvases show ONE mutable indexed session; no second renderer or modeler.
 */
import { createNativeWebGLDevice } from './dgb.native-webgl-device.v1.mjs';
import { seedMeshFromSilhouette } from './dgb.native-image-seed.v1.mjs';
import { createNativeFramePipeline } from './dgb.native-frame-pipeline.v1.mjs';
import { createNativeSpatialScene } from './dgb.native-scene-spatial.v1.mjs';
import { createSculptSession, sculptScreenRay, createConnectedSculptTopologyCandidate, restoreConnectedSculptTopologyCandidate } from './dgb.native-sculpt-session.v1.mjs';
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const norm=a=>{const d=Math.hypot(...a);if(d<1e-9)throw new Error('CAMERA_BASIS_INVALID');return a.map(x=>x/d);};
const names=['HERO','SIDE','FRONT','REAR THREE-QUARTER'];
const eyes=[[2.4,1.25,3.5],[4.8,.3,0],[0,.15,4.8],[-2.4,1.3,-3.5]];
function lookAtQuaternion(eye){
  const z=norm(eye),x=norm(cross([0,1,0],z)),y=cross(z,x);
  const m=[x[0],y[0],z[0],x[1],y[1],z[1],x[2],y[2],z[2]],t=m[0]+m[4]+m[8];
  let q;if(t>0){const s=Math.sqrt(t+1)*2;q=[(m[7]-m[5])/s,(m[2]-m[6])/s,(m[3]-m[1])/s,s/4];}
  else if(m[0]>m[4]&&m[0]>m[8]){const s=Math.sqrt(1+m[0]-m[4]-m[8])*2;q=[s/4,(m[1]+m[3])/s,(m[2]+m[6])/s,(m[7]-m[5])/s];}
  else if(m[4]>m[8]){const s=Math.sqrt(1+m[4]-m[0]-m[8])*2;q=[(m[1]+m[3])/s,s/4,(m[5]+m[7])/s,(m[2]-m[6])/s];}
  else{const s=Math.sqrt(1+m[8]-m[0]-m[4])*2;q=[(m[2]+m[6])/s,(m[5]+m[7])/s,s/4,(m[3]-m[1])/s];}
  return {rotation:q,right:x,up:y};
}
export function makeNeutralSculptRegionFixture(){
  // Non-rabbit, single connected open boundary surface, four abstract named zones.
  // Preserved characters, images, poses, textures and all rejected shapes excluded.
  const cols=21,rows=13,p=[],regions=[],protectedVertices=[],indices=[];
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){
    const x=2.4*(i/(cols-1)-.5),y=1.55*(j/(rows-1)-.5);
    const shoulder=.35*Math.exp(-((x-.72)**2/.35+(y+.03)**2/.30));
    const cheek=.33*Math.exp(-((x+.5)**2/.24+(y-.12)**2/.18));
    const bridge=.13*Math.exp(-((x-.10)**2/.28+y*y/.4));
    const z=shoulder+cheek+bridge+.06*Math.sin(3*x)*Math.cos(3*y);
    p.push(x,y,z);
    regions.push(x<-.5?'skull':x<-.08?'cheek':x<.48?'nape':'shoulder');
    if(i===0||i===cols-1||j===0||j===rows-1)protectedVertices.push(j*cols+i);
  }
  for(let j=0;j<rows-1;j++)for(let i=0;i<cols-1;i++){
    const a=j*cols+i,b=a+1,c=a+cols,d=c+1;indices.push(a,b,d,a,d,c);
  }
  return {positions:new Float32Array(p),triangles:new Uint16Array(indices),regions,protectedVertices};
}
const shaders=backend=>{
  const two=backend==='WEBGL2',p=two?'#version 300 es\n':'',inV=two?'in':'attribute',outV=two?'out':'varying',inF=two?'in':'varying';
  return {vertexSource:p+inV+' vec3 aPosition;'+inV+' vec3 aNormal;uniform mat4 uMVP;'+outV+' vec3 vNormal;'+outV+' vec3 vPosition;void main(){vNormal=aNormal;vPosition=aPosition;gl_Position=uMVP*vec4(aPosition,1.0);}',
    fragmentSource:p+'precision mediump float;'+inF+' vec3 vNormal;'+inF+' vec3 vPosition;'+(two?'out vec4 outColor;':'')+'void main(){float diffuse=.55+.45*abs(dot(normalize(vNormal),normalize(vec3(.35,.4,.85))));vec3 clay=mix(vec3(.31,.48,.62),vec3(.75,.80,.81),diffuse);'+(two?'outColor':'gl_FragColor')+'=vec4(clay,1.0);}'};

};


export function makeReferenceMaskFromRgba({width,height,data}={}){
  if(!Number.isInteger(width)||!Number.isInteger(height)||width<8||height<8||width>64||height>64||
    !(data instanceof Uint8ClampedArray||data instanceof Uint8Array)||data.length!==width*height*4)
    throw new TypeError('STUDIO_REFERENCE_IMAGE_INVALID');
  const border=[];
  for(let y=0;y<height;y++)for(let x=0;x<width;x++)if(x===0||y===0||x===width-1||y===height-1){
    const i=4*(y*width+x);border.push([data[i],data[i+1],data[i+2],data[i+3]]);
  }
  const transparent=border.filter(p=>p[3]<48).length>border.length/2;
  const bg=[0,1,2].map(k=>border.reduce((sum,p)=>sum+p[k],0)/border.length);
  const mask=[];
  for(let i=0;i<width*height;i++){
    const a=data[4*i+3],delta=Math.hypot(...bg.map((v,k)=>data[4*i+k]-v));
    mask.push(a>=96&&(transparent||delta>=45)?1:0);
  }
  if(mask.every(v=>v===0)||mask.every(v=>v===1))throw new Error('STUDIO_REFERENCE_MASK_NO_CONTRAST');
  return {width,height,mask};
}
export function makeSculptReferenceFixture(reference){
  if(!reference||!Number.isInteger(reference.width)||!Number.isInteger(reference.height)||
    !Array.isArray(reference.mask))throw new TypeError('STUDIO_MASK_SOURCE_REQUIRED');
  const mesh=seedMeshFromSilhouette({width:reference.width,height:reference.height,
    mask:reference.mask},{resolution:10,maxDepth:.6});
  const vertices=mesh.positions.length/3,faces=mesh.triangles.length/3;
  if(vertices>65535||faces>3000||Math.max(...mesh.triangles)>65535)
    throw new RangeError('STUDIO_REFERENCE_MESH_BUDGET_EXCEEDED');
  const regions=Array.from({length:vertices},(_,i)=>{
    const x=mesh.positions[3*i];
    return x<-.5?'skull':x<-.08?'cheek':x<.48?'nape':'shoulder';
  });
  return {positions:new Float32Array(mesh.positions),triangles:new Uint16Array(mesh.triangles),
    regions,protectedVertices:[],uvs:new Float32Array(mesh.uvs)};
}

const STUDIO_SOURCE_ID='DGB_SCULPT_LAB_NEUTRAL_SOURCE_V1';
const STUDIO_CHAIN_SCHEMA='DGB_SCULPT_LAB_TOPOLOGY_CHAIN_V2';
// The neutral source has an identity UV handoff. A later reference asset can
// provide its own render-to-master seam map, without altering the C2-A kernel.
export function makeSculptUvHandoff(positions,triangles,sourceUvs=null){
  if(!(positions instanceof Float32Array)||!(triangles instanceof Uint16Array||triangles instanceof Uint32Array)||
    positions.length%3!==0||triangles.length%3!==0)throw new TypeError('STUDIO_SOURCE_GEOMETRY_INVALID');
  const uvs=new Float32Array(positions.length/3*2);
  for(let i=0;i<positions.length/3;i++){
    uvs[2*i]=positions[3*i]/2.4+.5;
    uvs[2*i+1]=positions[3*i+1]/1.55+.5;
  }
  if(sourceUvs!==null){
    if(!(sourceUvs instanceof Float32Array)||sourceUvs.length!==uvs.length||
      Array.from(sourceUvs).some(x=>!Number.isFinite(x)))
      throw new TypeError('STUDIO_SOURCE_UV_INVALID');
    uvs.set(sourceUvs);
  }
  return {renderToMaster:Uint32Array.from({length:positions.length/3},(_,i)=>i),
    uvs,faceRenderCorners:new Uint32Array(triangles)};
}
const nextUv=render=>({renderToMaster:render.renderToMaster,uvs:render.uvs,
  faceRenderCorners:render.triangles});
export function sculptMeshSpecification(session,uv){
  const p=session.getPositions(),n=session.getNormals(),ids=uv.renderToMaster;
  if(!(ids instanceof Uint32Array)||!(uv.uvs instanceof Float32Array)||
    !(uv.faceRenderCorners instanceof Uint32Array)||uv.uvs.length!==ids.length*2||
    uv.faceRenderCorners.length!==session.getTriangles().length||ids.length>65535||
    Array.from(ids).some(i=>i>=p.length/3))throw new Error('STUDIO_UV_SEAM_IDENTITY_INVALID');
  const renderPositions=new Float32Array(ids.length*3),renderNormals=new Float32Array(ids.length*3);
  for(let i=0;i<ids.length;i++)for(let k=0;k<3;k++){
    renderPositions[3*i+k]=p[3*ids[i]+k];renderNormals[3*i+k]=n[3*ids[i]+k];
  }
  return {attributes:[
    {name:'aPosition',data:renderPositions,size:3,dynamic:true},
    {name:'aNormal',data:renderNormals,size:3,dynamic:true},
    {name:'aUV',data:new Float32Array(uv.uvs),size:2}
  ],indices:new Uint16Array(uv.faceRenderCorners),vertexCount:ids.length};
}
export function makeSculptSubdivision(session,uv,protectedVertices,faceIndex,step=0){
  const triangles=session.getTriangles(),positions=session.getPositions(),regions=session.getRegions();
  if(!Number.isInteger(faceIndex)||faceIndex<0||faceIndex>=triangles.length/3)
    throw new RangeError('STUDIO_SELECTED_FACE_INVALID');
  if(!Number.isInteger(step)||step<0||step>39)throw new RangeError('STUDIO_TOPOLOGY_LIMIT');
  const a=triangles[3*faceIndex],b=triangles[3*faceIndex+1],c=triangles[3*faceIndex+2];
  const center=positions.length/3,sourceId=STUDIO_SOURCE_ID+':'+step;
  return createConnectedSculptTopologyCandidate({
    sourceId,positions,triangles,regions,protectedVertices,uvHandoff:uv,
    selectedFaces:[faceIndex],
    newVertices:[{sourceFace:faceIndex,barycentric:[1/3,1/3,1/3],normalOffset:0.005,region:regions[a]}],
    replacementFaces:[
      {sourceFace:faceIndex,indices:[a,b,center]},
      {sourceFace:faceIndex,indices:[b,c,center]},
      {sourceFace:faceIndex,indices:[c,a,center]}]
  });
}
export function serializeSculptStudioState(session,stages,source=null){
  if(!stages.length&&source===null)return session.serialize(); // Existing v1 unchanged.
  return JSON.stringify({schema:STUDIO_CHAIN_SCHEMA,sourceId:STUDIO_SOURCE_ID,
    source,stages:stages.map(s=>({before:s.before,recipe:s.recipe})),current:session.serialize()});
}
export function restoreSculptStudioState(text,fixture){
  let saved;try{saved=JSON.parse(text);}catch{throw new TypeError('STUDIO_SAVE_JSON_INVALID');}
  let source=null,sourceFixture=fixture;
  if(saved?.schema===STUDIO_CHAIN_SCHEMA&&saved.source!==null&&saved.source!==undefined){
    if(saved.source?.kind!=='SILHOUETTE_HEURISTIC_PRIOR')throw new Error('STUDIO_SAVE_SOURCE_INVALID');
    source={kind:saved.source.kind,width:saved.source.width,height:saved.source.height,
      mask:saved.source.mask};
    sourceFixture=makeSculptReferenceFixture(source);
  }
  let session=createSculptSession(sourceFixture),
    uv=makeSculptUvHandoff(session.getPositions(),session.getTriangles(),sourceFixture.uvs??null);
  const stages=[];
  if(saved?.schema==='DGB_NATIVE_SCULPT_MESH_V1'){
    session.restore(text);return {session,uv,stages,fixture:sourceFixture,source};
  }
  if(saved?.schema!==STUDIO_CHAIN_SCHEMA||saved.sourceId!==STUDIO_SOURCE_ID||
    !Array.isArray(saved.stages)||saved.stages.length>40||
    typeof saved.current!=='string')throw new Error('STUDIO_SAVE_CHAIN_INVALID');
  for(const [step,record] of saved.stages.entries()){
    if(typeof record?.before!=='string'||typeof record.recipe!=='string')
      throw new Error('STUDIO_SAVE_STAGE_INVALID');
    session.restore(record.before);
    const trustedSource={sourceId:STUDIO_SOURCE_ID+':'+step,positions:session.getPositions(),
      triangles:session.getTriangles(),regions:session.getRegions(),
      protectedVertices:[...(sourceFixture.protectedVertices??[])],uvHandoff:uv,animation:null};
    const candidate=restoreConnectedSculptTopologyCandidate(record.recipe,trustedSource);
    session=createSculptSession({positions:candidate.positions,triangles:candidate.triangles,
      regions:[...candidate.regions],protectedVertices:[...candidate.protectedVertices]});
    uv=nextUv(candidate.render);
    stages.push({before:record.before,recipe:record.recipe});
  }
  session.restore(saved.current);
  return {session,uv,stages,fixture:sourceFixture,source};
}

const expectCanvas=(x,i)=>{if(!x||typeof x.getContext!=='function'||typeof x.addEventListener!=='function')throw new TypeError('CANVAS_'+i+'_REQUIRED');return x;};
export function createNativeSculptStudio({canvases,controls,fixture=makeNeutralSculptRegionFixture(),backend='AUTO',onStatus=()=>{}}={}){
  if(!Array.isArray(canvases)||canvases.length!==4)throw new TypeError('FOUR_CANVASES_REQUIRED');
  if(!['AUTO','WEBGL1','WEBGL2'].includes(backend)||typeof onStatus!=='function')throw new TypeError('STUDIO_OPTIONS_INVALID');
  if(!controls||!['radius','strength','falloff','mode','region','undo','redo','save','load'].every(k=>controls[k]))throw new TypeError('STUDIO_CONTROLS_REQUIRED');
  let session=createSculptSession(fixture),fixtureSource=fixture,sourceMetadata=null;
  let uv=makeSculptUvHandoff(session.getPositions(),session.getTriangles(),fixture.uvs??null);
  let stages=[],selectedFace=null;
  if(Math.max(...session.getTriangles())>65535)throw new Error('WEBGL1_NEUTRAL_FIXTURE_INDEX_LIMIT');
  let disposed=false,failed=false,active=null;const views=[];const listeners=[];
  function add(el,name,handler){el.addEventListener(name,handler);listeners.push(()=>el.removeEventListener(name,handler));}
  function status(message){onStatus(message,{...session.state(),failed,viewCount:views.length,topologyDepth:stages.length,selectedFace});}
  function assertReady(){if(disposed)throw new Error('SCULPT_STUDIO_DISPOSED');if(failed)throw new Error('SCULPT_STUDIO_QUARANTINED');}
  try{
    for(let i=0;i<4;i++){
      const canvas=expectCanvas(canvases[i],i),be=backend==='AUTO'?(canvas.getContext('webgl2')?'WEBGL2':'WEBGL1'):backend;
      const device=createNativeWebGLDevice(canvas,{backend:be,contextAttributes:{alpha:false,antialias:true,depth:true,preserveDrawingBuffer:true}}),pipeline=createNativeFramePipeline(device);
      const program=device.createProgram(shaders(be)),mesh=device.createMesh(sculptMeshSpecification(session,uv));
      const scene=createNativeSpatialScene(),eye=eyes[i],basis=lookAtQuaternion(eye),camera=scene.createCamera({position:eye,rotation:basis.rotation,projection:'ORTHOGRAPHIC',near:.1,far:40,aspect:canvas.width/canvas.height,orthoHeight:3.15});
      const node=scene.createNode();scene.setRenderable(node,{program,mesh,pass:'OPAQUE',cull:'NONE',bounds:{center:[0,0,0],radius:3}});
      const view={name:names[i],canvas,device,pipeline,program,mesh,scene,camera,basis};views.push(view);
      add(canvas,'webglcontextlost',event=>{event.preventDefault();failed=true;status('WebGL context lost. Reload studio; no edit published.');});
    }
  }catch(e){for(const v of views){try{v.device.dispose();}catch{}}throw e;}
  function drawAll(){assertReady();
    for(const v of views){
      const {canvas,device,pipeline,scene,camera}=v;
      device.viewport(canvas.width,canvas.height);
      pipeline.beginFrame({target:null,clear:{color:[.085,.11,.15,1],depth:1},depthMode:'TEST_WRITE',cull:'NONE'});
      scene.submit(pipeline,camera,{bindMatrices:({gl,programHandle,modelViewProjection})=>{
        const uniform=gl.getUniformLocation(programHandle,'uMVP');if(uniform===null)throw new Error('MVP_UNIFORM_NOT_FOUND');gl.uniformMatrix4fv(uniform,false,modelViewProjection);
      }});
      pipeline.endFrame({presentToCanvas:true});
    }
    return {views:views.length,revision:session.state().revision};
  }
  function updateAll(){assertReady();
    const spec=sculptMeshSpecification(session,uv),p=spec.attributes[0].data,n=spec.attributes[1].data;
    try{
      for(const view of views){view.device.updateMeshAttribute(view.mesh,'aPosition',p);view.device.updateMeshAttribute(view.mesh,'aNormal',n);}
      return drawAll();
    }catch(e){failed=true;status('GPU update failed; studio quarantined: '+e.message);throw e;}
  }
  // One unchanged E3 renderable identity per view; replace only E1 buffers.
  // If any of four replacements or draws fail, attempt complete old-mesh
  // restoration; do not adopt the new session if GPU rollback is uncertain.
  function adoptTopology(nextSession,nextUv,nextStages,nextFixture=fixtureSource,nextSource=sourceMetadata){
    assertReady();
    if(active)throw new Error('STUDIO_STROKE_ACTIVE');
    const previous=sculptMeshSpecification(session,uv),replacement=sculptMeshSpecification(nextSession,nextUv);
    const replaced=[];
    try{
      for(const view of views){view.device.replaceMesh(view.mesh,replacement);replaced.push(view);}
      drawAll();
    }catch(error){
      let rollbackFailed=false;
      for(const view of replaced.reverse())try{view.device.replaceMesh(view.mesh,previous);}catch(_){rollbackFailed=true;}
      if(rollbackFailed){failed=true;status('GPU mesh rollback failed; studio quarantined.');}
      throw error;
    }
    session=nextSession;uv=nextUv;stages=nextStages;selectedFace=null;
    fixtureSource=nextFixture;sourceMetadata=nextSource;
    return drawAll();
  }
  function subdivide(faceIndex=selectedFace){
    assertReady();
    if(active)throw new Error('STUDIO_STROKE_ACTIVE');
    const before=session.serialize(),candidate=makeSculptSubdivision(session,uv,fixtureSource.protectedVertices??[],faceIndex,stages.length);
    const nextSession=createSculptSession({positions:candidate.positions,triangles:candidate.triangles,
      regions:[...candidate.regions],protectedVertices:[...candidate.protectedVertices]});
    const result=adoptTopology(nextSession,nextUv(candidate.render),
      [...stages,{before,recipe:candidate.serialize()}]);
    status('C2-A verified face subdivision committed across four views.');
    return result;
  }
  function localPointer(event,canvas){const r=canvas.getBoundingClientRect();return {x:(event.clientX-r.left)*canvas.width/r.width,y:(event.clientY-r.top)*canvas.height/r.height};}
  function pointerDown(event,v){try{
    assertReady();if(event.button!==undefined&&event.button!==0||active)return;
    const local=localPointer(event,v.canvas),vp=v.scene.collect(v.camera).viewProjectionMatrix;
    const ray=sculptScreenRay({...local,width:v.canvas.width,height:v.canvas.height,viewProjection:vp});
    const hit=session.pick(ray.origin,ray.direction);if(!hit){status('No surface intersected.');return;}
    selectedFace=hit.triangle;
    const mode=controls.mode.value, organic=mode.startsWith('ORGANIC_');
    const radius=Number(controls.radius.value);
    const fieldRadii=organic?['fieldX','fieldY','fieldZ'].map(k=>radius*Number(controls[k]?.value??1)):null;
    const response=session.beginStroke(hit,{radius,strength:Number(controls.strength.value),falloff:Number(controls.falloff.value),region:controls.region.value,fieldRadii});
    active={view:v,pointerId:event.pointerId,lastX:event.clientX,lastY:event.clientY};v.canvas.setPointerCapture?.(event.pointerId);
    status(v.name+': selected triangle '+hit.triangle+', '+response.affectedVertexIds.length+' editable vertices. Drag to sculpt.');
    event.preventDefault?.();
  }catch(e){status('Selection rejected: '+e.message);}}
  function pointerMove(event,v){if(!active||active.view!==v||active.pointerId!==event.pointerId)return;
    try{
      const dx=event.clientX-active.lastX,dy=event.clientY-active.lastY;active.lastX=event.clientX;active.lastY=event.clientY;
      if(dx===0&&dy===0)return;
      const mode=controls.mode.value;let update;
      if(mode==='MOVE'||mode==='ORGANIC_GRAB'){
        const size=v.canvas.getBoundingClientRect(),scale=3.15/Math.max(size.width,size.height);
        const right=v.basis.right,up=v.basis.up;
        update={mode:'MOVE',delta:right.map((x,k)=>x*dx*scale-up[k]*dy*scale)};
      }else update={mode,amount:Math.min(.18,Math.hypot(dx,dy)*.005)};
      session.applyStroke(update);updateAll();status(v.name+': live four-view update, revision '+session.state().revision);
    }catch(e){active=null;status('Stroke rejected: '+e.message);try{updateAll();}catch{}}}
  function pointerUp(event,v){if(!active||active.view!==v||active.pointerId!==event.pointerId)return;
    try{session.endStroke();status('Stroke committed; undo/redo available.');}catch(e){status(e.message);}active=null;}
  for(const v of views){add(v.canvas,'pointerdown',e=>pointerDown(e,v));add(v.canvas,'pointermove',e=>pointerMove(e,v));add(v.canvas,'pointerup',e=>pointerUp(e,v));add(v.canvas,'pointercancel',e=>{if(active?.view===v){session.cancelStroke();active=null;updateAll();}});}
  function operate(fn,label){try{assertReady();if(active){session.cancelStroke();active=null;}const changed=fn();if(changed)updateAll();status(label+(changed?' complete.':' no available edit.'));}catch(e){status(label+' failed: '+e.message);}}
  add(controls.undo,'click',()=>operate(()=>session.undo(),'Undo'));
  add(controls.redo,'click',()=>operate(()=>session.redo(),'Redo'));
  if(controls.subdivide)add(controls.subdivide,'click',()=>{
    try{subdivide();}catch(error){status('Topology edit rejected: '+error.message);}
  });
  if(controls.reference)add(controls.reference,'change',async event=>{
    const file=event.target.files?.[0];if(!file)return;
    let bitmap=null;
    try{
      assertReady();
      if(!/^image\/(png|jpeg|webp)$/.test(file.type)||file.size>5000000)
        throw new Error('STUDIO_REFERENCE_IMAGE_TYPE_OR_SIZE_REJECTED');
      bitmap=await createImageBitmap(file);
      if(bitmap.width*bitmap.height>16000000)throw new Error('STUDIO_REFERENCE_DECODE_BUDGET_EXCEEDED');
      const small=document.createElement('canvas');small.width=24;small.height=24;
      const ctx=small.getContext('2d',{willReadFrequently:true});
      if(!ctx)throw new Error('STUDIO_REFERENCE_2D_CONTEXT_MISSING');
      ctx.clearRect(0,0,24,24);
      ctx.drawImage(bitmap,0,0,24,24);
      const mask=makeReferenceMaskFromRgba({width:24,height:24,data:ctx.getImageData(0,0,24,24).data});
      const generated=makeSculptReferenceFixture(mask);
      const nextSession=createSculptSession(generated);
      adoptTopology(nextSession,
        makeSculptUvHandoff(nextSession.getPositions(),nextSession.getTriangles(),generated.uvs),
        [],generated,{kind:'SILHOUETTE_HEURISTIC_PRIOR',...mask});
      status('Reference mask applied using Cycle One silhouette heuristic; not trained image-to-3D.');
    }catch(error){status('Reference image rejected: '+error.message);}
    finally{bitmap?.close?.();event.target.value='';}
  });
  add(controls.save,'click',()=>{
    try{assertReady();const data=serializeSculptStudioState(session,stages,sourceMetadata),blob=new Blob([data],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=(stages.length||sourceMetadata)?'dgb-native-sculpt-topology-v2.json':'dgb-native-sculpt-mesh-v1.json';a.click();URL.revokeObjectURL(url);status('Saved deterministic editable mesh.');}catch(e){status('Save failed: '+e.message);}
  });
  add(controls.load,'change',async event=>{
    const file=event.target.files?.[0];if(!file)return;
    try{assertReady();const source=await file.text(),restored=restoreSculptStudioState(source,fixture);
      adoptTopology(restored.session,restored.uv,restored.stages,restored.fixture,restored.source);
      status('Reloaded verified editable mesh and topology lineage.');
    }catch(e){status('Reload rejected: '+e.message);}finally{event.target.value='';}
  });
  drawAll();status('Ready: four actual synchronized engine WebGL views.');
  return Object.freeze({get session(){return session;},drawAll,updateAll,subdivide,
    saveState:()=>serializeSculptStudioState(session,stages,sourceMetadata),
    loadState:text=>{const restored=restoreSculptStudioState(text,fixture);return adoptTopology(restored.session,restored.uv,restored.stages,restored.fixture,restored.source);},
    views:()=>views.map(v=>Object.freeze({name:v.name,backend:v.device.backend,width:v.canvas.width,height:v.canvas.height})),
    status:()=>Object.freeze({...session.state(),failed,disposed,views:views.length,topologyDepth:stages.length,selectedFace}),
    dispose(){if(disposed)return;for(const f of listeners)f();for(const v of views){try{v.scene.dispose();v.device.dispose();}catch{}}disposed=true;}});
}
