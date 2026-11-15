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


// Read bounded image headers BEFORE createImageBitmap allocates decoded pixels.
// A small compressed image may describe an enormous decoded surface.
export async function readSculptReferenceImageDimensions(file) {
  if (!file || !new RegExp('^image/(png|jpeg|webp)$').test(file.type) ||
    !Number.isSafeInteger(file.size) || file.size < 16 || file.size > 5000000 ||
    typeof file.arrayBuffer !== 'function')
    throw new Error('STUDIO_REFERENCE_IMAGE_TYPE_OR_SIZE_REJECTED');
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (bytes.length !== file.size) throw new Error('STUDIO_REFERENCE_IMAGE_HEADER_INVALID');
  const ascii = (at, word) => [...word].every((ch, i) => bytes[at + i] === ch.charCodeAt(0));
  const be16 = at => (bytes[at] << 8) | bytes[at + 1];
  const be32 = at => (bytes[at] * 16777216 + (bytes[at+1] << 16) +
    (bytes[at+2] << 8) + bytes[at+3]) >>> 0;
  const le24 = at => bytes[at] | (bytes[at+1] << 8) | (bytes[at+2] << 16);
  let width = 0, height = 0;
  if (file.type === 'image/png') {
    if (bytes.length < 24 || ![137,80,78,71,13,10,26,10].every((b,i)=>bytes[i]===b) ||
      !ascii(12, 'IHDR') || be32(8) !== 13)
      throw new Error('STUDIO_REFERENCE_IMAGE_HEADER_INVALID');
    width = be32(16); height = be32(20);
  } else if (file.type === 'image/jpeg') {
    if (bytes[0] !== 255 || bytes[1] !== 216)
      throw new Error('STUDIO_REFERENCE_IMAGE_HEADER_INVALID');
    let at = 2;
    const sof = new Set([192,193,194,195,197,198,199,201,202,203,205,206,207]);
    while (at + 4 <= bytes.length) {
      if (bytes[at] !== 255) break;
      while (at < bytes.length && bytes[at] === 255) at++;
      const code = bytes[at++];
      if (code === 218 || code === 217 || code === undefined) break;
      if (code === 1 || (code >= 208 && code <= 215)) continue;
      if (at + 2 > bytes.length) break;
      const length = be16(at);
      if (length < 2 || at + length > bytes.length) break;
      if (sof.has(code)) {
        if (length < 7) break;
        height = be16(at + 3); width = be16(at + 5); break;
      }
      at += length;
    }
  } else if (file.type === 'image/webp') {
    if (bytes.length < 30 || !ascii(0, 'RIFF') || !ascii(8, 'WEBP'))
      throw new Error('STUDIO_REFERENCE_IMAGE_HEADER_INVALID');
    if (ascii(12, 'VP8X')) {
      width = 1 + le24(24); height = 1 + le24(27);
    } else if (ascii(12, 'VP8 ') && bytes[23] === 157 && bytes[24] === 1 && bytes[25] === 42) {
      width = (bytes[26] | (bytes[27] << 8)) & 16383;
      height = (bytes[28] | (bytes[29] << 8)) & 16383;
    } else if (ascii(12, 'VP8L') && bytes[20] === 47) {
      width = 1 + (bytes[21] | ((bytes[22] & 63) << 8));
      height = 1 + ((bytes[22] >>> 6) | (bytes[23] << 2) | ((bytes[24] & 15) << 10));
    }
  }
  if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) ||
    width < 1 || height < 1)
    throw new Error('STUDIO_REFERENCE_IMAGE_HEADER_INVALID');
  if (width * height > 16000000)
    throw new Error('STUDIO_REFERENCE_DECODE_BUDGET_EXCEEDED');
  return Object.freeze({ width, height });
}

export function validateSculptFaceIndex(index, faceCount) {
  if (!Number.isSafeInteger(index) || !Number.isSafeInteger(faceCount) ||
    faceCount < 1 || index < 0 || index >= faceCount)
    throw new RangeError('STUDIO_SELECTED_FACE_INVALID');
  return index;
}

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

/** One draw per topology transaction; CPU session commits only after this succeeds.
 * If any GPU replacement or render fails, restore all touched E1 records and
 * redraw the original geometry. Uncertain state is quarantined by the caller. */
export function replaceFourSculptViewMeshes(views,oldSpec,newSpec,draw,quarantine=()=>{}){
  if(!Array.isArray(views)||views.length!==4||typeof draw!=='function'||typeof quarantine!=='function')
    throw new TypeError('STUDIO_FOUR_VIEW_SWAP_INVALID');
  const replaced=[];
  try {
    for(const view of views){
      view.device.replaceMesh(view.mesh,newSpec);
      replaced.push(view);
    }
    return draw();
  } catch(error) {
    let uncertain=false;
    for(const view of replaced.reverse()){
      try { view.device.replaceMesh(view.mesh,oldSpec); }
      catch (_) { uncertain=true; }
    }
    // Replacement itself may have quarantined the failing device without
    // entering the 'replaced' list.
    for(const view of views){
      try {
        const state=view.device.status?.();
        if(state?.restorationError||state?.lost||state?.disposed)uncertain=true;
      } catch (_) { uncertain=true; }
    }
    try { draw(); } catch (_) { uncertain=true; }
    if(uncertain)quarantine();
    throw error;
  }
}

/** Fail-closed recovery for an interrupted interactive brush stroke.
 * Do not leave an active stroke behind after rejection. A failed CPU cancel or
 * GPU redraw is uncertainty, never a silently completed edit. */
export function abortRejectedSculptStroke(session, redraw, quarantineAlready=false){
  if(!session||typeof session.cancelStroke!=='function'||typeof redraw!=='function')
    throw new TypeError('STUDIO_STROKE_ABORT_INPUT_INVALID');
  let recoveryError=null;
  try{session.cancelStroke();}catch(error){recoveryError=error;}
  if(!quarantineAlready&&!recoveryError){
    try{redraw();}catch(error){recoveryError=error;}
  }
  return Object.freeze({restored:!quarantineAlready&&!recoveryError,
    uncertain:Boolean(quarantineAlready||recoveryError),
    recoveryError:recoveryError?.message??null});
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
    const result=replaceFourSculptViewMeshes(views,previous,replacement,drawAll,
      ()=>{failed=true;});
    session=nextSession;uv=nextUv;stages=nextStages;selectedFace=null;
    if(controls.faceIndex){
      controls.faceIndex.value='';
      controls.faceIndex.max=String(session.getTriangles().length/3-1);
    }
    fixtureSource=nextFixture;sourceMetadata=nextSource;
    return result;
  }
  function subdivide(faceIndex=selectedFace){
    assertReady();
    if(active)throw new Error('STUDIO_STROKE_ACTIVE');
    validateSculptFaceIndex(faceIndex,session.getTriangles().length/3);
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
    if(controls.faceIndex)controls.faceIndex.value=String(selectedFace);
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
    }catch(e){
      const recovery=abortRejectedSculptStroke(session,updateAll,failed);
      active=null;
      if(recovery.uncertain)failed=true;
      status(recovery.uncertain
        ?'Stroke failed; studio quarantined: '+e.message+(recovery.recoveryError?' / '+recovery.recoveryError:'')
        :'Stroke rejected; prior geometry restored: '+e.message);
    }}
  function pointerUp(event,v){if(!active||active.view!==v||active.pointerId!==event.pointerId)return;
    try{session.endStroke();status('Stroke committed; undo/redo available.');}catch(e){status(e.message);}active=null;}
  for(const v of views){add(v.canvas,'pointerdown',e=>pointerDown(e,v));add(v.canvas,'pointermove',e=>pointerMove(e,v));add(v.canvas,'pointerup',e=>pointerUp(e,v));add(v.canvas,'pointercancel',e=>{
    if(active?.view!==v)return;
    const recovery=abortRejectedSculptStroke(session,updateAll,failed);
    active=null;
    if(recovery.uncertain)failed=true;
    status(recovery.uncertain
      ?'Pointer cancellation recovery uncertain; studio quarantined.'
      :'Pointer cancelled; prior geometry restored.');
  });}
  function operate(fn,label){try{assertReady();if(active){session.cancelStroke();active=null;}const changed=fn();if(changed)updateAll();status(label+(changed?' complete.':' no available edit.'));}catch(e){status(label+' failed: '+e.message);}}
  add(controls.undo,'click',()=>operate(()=>session.undo(),'Undo'));
  add(controls.redo,'click',()=>operate(()=>session.redo(),'Redo'));
  // Keyboard-accessible numeric face selection uses exactly the same
  // selectedFace state as pointer picking; neither path bypasses C2-A guards.
  if(controls.faceIndex){
    controls.faceIndex.max=String(session.getTriangles().length/3-1);
    add(controls.faceIndex,'input',event=>{
      try{
        assertReady();
        if(active)throw new Error('STUDIO_STROKE_ACTIVE');
        const raw=String(event.target.value);
        if(!/^(0|[1-9][0-9]*)$/.test(raw))
          throw new RangeError('STUDIO_SELECTED_FACE_INVALID');
        selectedFace=validateSculptFaceIndex(Number(raw),session.getTriangles().length/3);
        status('Selected triangle '+selectedFace+' using keyboard-accessible face index.');
      }catch(error){
        selectedFace=null;
        status('Face selection rejected: '+error.message);
      }
    });
  }
  if(controls.subdivide)add(controls.subdivide,'click',()=>{
    try{
      if(controls.faceIndex && controls.faceIndex.value!=='')
        selectedFace=validateSculptFaceIndex(Number(controls.faceIndex.value),
          session.getTriangles().length/3);
      subdivide();
    }catch(error){status('Topology edit rejected: '+error.message);}
  });
  if(controls.reference)add(controls.reference,'change',async event=>{
    const file=event.target.files?.[0];if(!file)return;
    let bitmap=null;
    try{
      assertReady();
      // Reject oversized decoded surfaces from compressed headers first.
      const dimensions=await readSculptReferenceImageDimensions(file);
      bitmap=await createImageBitmap(file);
      // JPEG EXIF orientation can swap width and height during decode.
      const same=bitmap.width===dimensions.width&&bitmap.height===dimensions.height;
      const rotated=bitmap.width===dimensions.height&&bitmap.height===dimensions.width;
      if((!same&&!rotated)||bitmap.width*bitmap.height>16000000)
        throw new Error('STUDIO_REFERENCE_DECODE_BUDGET_EXCEEDED');
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
