/** E10 Gen3128 — OFF-PRODUCT diagnostic quadruped browser lab.
 * This is an intentionally synthetic engineering fixture, not an authored rabbit,
 * character asset, production consumer, glTF loader or new GPU renderer.
 * E10 CPU motion -> fixed E1 meshes -> E3 matrices -> E4 material -> E2 draw.
 */
import {createSkeleton} from './dgb.native-character-skeleton.v1.mjs';
import {createSkinnedMesh} from './dgb.native-character-skinning.v1.mjs';
import {createHingeClip} from './dgb.native-character-clips.v1.mjs';
import {createTwoBoneIK} from './dgb.native-character-ik-contact.v1.mjs';
import {createGaitCoordinator} from './dgb.native-character-gait-coordinator.v1.mjs';
import {createNativeWebGLDevice} from './dgb.native-webgl-device.v1.mjs';
import {createNativeFramePipeline} from './dgb.native-frame-pipeline.v1.mjs';
import {createNativeSpatialScene} from './dgb.native-scene-spatial.v1.mjs';
import {createNativeMaterialLibrary} from './dgb.native-material-light.v1.mjs';

const finite = Number.isFinite;
const identity = () => new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
export const E10_BROWSER_LAB_ID = 'DGB_E10_OFF_PRODUCT_DIAGNOSTIC_QUADRUPED_GEN3128';
export const E10_FRAME_LIMIT = 16;
export const E10_DEFAULT_SAMPLES = Object.freeze([.04,.11,.22,.30,.41,.475,.55,.70,.77,.90,.96]);

/** Explicit E10 test-derived contact data, not a model asset or animal anatomy. */
export function createDiagnosticFourLegFixture() {
  const joints=[
    {id:'root'},
    {id:'trunk',parent:'root',constraint:{kind:'HINGE',axis:[0,1,0],min:-.6,max:.6}}
  ];
  const legs=[];
  for(let i=0;i<4;i++){
    const x=(i%2?1:-1)*.52, z=Math.floor(i/2)*.55;
    joints.push(
      {id:'hip'+i,parent:'trunk',bindPosition:[x,0,z],constraint:{kind:'FREE'}},
      {id:'knee'+i,parent:'hip'+i,bindPosition:[0,-.85,0],constraint:{kind:'FREE'}},
      {id:'foot'+i,parent:'knee'+i,bindPosition:[0,-.8,0]}
    );
    const A=[x-.07,0,z],B=[x+.07,0,z];
    const contacts=i%2
      ? [{start:0,end:.18,target:B},{start:.35,end:.64,target:A},{start:.81,end:1,target:B}]
      : [{start:.1,end:.35,target:A},{start:.6,end:.85,target:B}];
    legs.push({id:'leg'+i,hipJoint:'hip'+i,kneeJoint:'knee'+i,footJoint:'foot'+i,
      ik:createTwoBoneIK({upperLength:.85,lowerLength:.8,pole:[0,0,1]}),contacts});
  }
  const skeleton=createSkeleton(joints);
  const clip=createHingeClip(skeleton,{duration:1,loop:true,frames:[
    {time:0,controls:{trunk:0},rootTranslation:[0,1.2,0]},
    {time:.5,controls:{trunk:.2},rootTranslation:[.04,1.23,-.01]},
    {time:1,controls:{trunk:0},rootTranslation:[0,1.2,0]}
  ]});
  const gait=createGaitCoordinator(skeleton,{clip,legs});
  return Object.freeze({skeleton,clip,gait});
}

const faces=[
 [[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]],
 [[1,-1,-1],[-1,-1,-1],[-1,1,-1],[1,1,-1]],
 [[1,-1,1],[1,-1,-1],[1,1,-1],[1,1,1]],
 [[-1,-1,-1],[-1,-1,1],[-1,1,1],[-1,1,-1]],
 [[-1,1,1],[1,1,1],[1,1,-1],[-1,1,-1]],
 [[-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1]]
];
/** Face-separated box segments permit per-frame normals after true CPU skinning. */
export function createDiagnosticMeshDefinition(skeleton) {
  if(!skeleton||!Array.isArray(skeleton.joints))throw new TypeError('LAB_SKELETON_REQUIRED');
  const ids=new Set(skeleton.joints.map(j=>j.id));
  const vertices=[],influences=[],indices=[];
  function box(joint,center,size){
    if(!ids.has(joint))throw new Error('LAB_UNKNOWN_JOINT');
    if(![...center,...size].every(finite)||size.some(x=>x<=0))throw new TypeError('LAB_BOX_INVALID');
    for(const face of faces){
      const first=vertices.length;
      for(const c of face){
        vertices.push(center.map((v,k)=>v+c[k]*size[k]/2));
        influences.push([{joint,weight:1}]);
      }
      indices.push(first,first+1,first+2,first,first+2,first+3);
    }
  }
  box('trunk',[0,-.05,.27],[1.2,.36,1.18]);
  box('trunk',[0,.12,.99],[.32,.32,.30]); // orientation marker, not a head asset
  for(let i=0;i<4;i++){
    const x=(i%2?1:-1)*.52,z=Math.floor(i/2)*.55;
    box('hip'+i,[x,-.425,z],[.16,.85,.16]);
    box('knee'+i,[x,-1.25,z],[.13,.8,.13]);
  }
  if(vertices.length>65535||indices.some(i=>i>=vertices.length))throw new RangeError('LAB_GEOMETRY_RANGE');
  return Object.freeze({vertices:Object.freeze(vertices.map(x=>Object.freeze(x))),
    influences:Object.freeze(influences.map(x=>Object.freeze(x.map(y=>Object.freeze(y))))),
    indices:Object.freeze(indices),vertexCount:vertices.length});
}
function normalArray(points) {
  const out=[];
  for(let i=0;i<points.length;i+=4){
    const a=points[i],b=points[i+1],c=points[i+2];
    const u=b.map((v,j)=>v-a[j]),v=c.map((z,j)=>z-a[j]);
    const n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
    const len=Math.hypot(...n);
    if(!finite(len)||len<1e-9)throw new RangeError('LAB_NORMAL_DEGENERATE');
    for(let q=0;q<4;q++)out.push(n[0]/len,n[1]/len,n[2]/len);
  }
  return out;
}
export function createE10DiagnosticFrameBank(times=E10_DEFAULT_SAMPLES){
  if(!Array.isArray(times)||times.length<2||times.length>E10_FRAME_LIMIT||
     times.some((x,i)=>!finite(x)||x<0||x>=1||(i>0&&x<=times[i-1])))
    throw new TypeError('LAB_SAMPLES_INVALID');
  const fixture=createDiagnosticFourLegFixture();
  const geometry=createDiagnosticMeshDefinition(fixture.skeleton);
  const skin=createSkinnedMesh(fixture.skeleton,geometry);
  const frames=times.map(time=>{
    const sample=fixture.gait.sample(time);
    const points=skin.deform(sample.pose);
    const positions=points.flat();
    const normals=normalArray(points);
    if(positions.some(x=>!finite(x)||Math.abs(x)>1e6)||normals.some(x=>!finite(x)))
      throw new RangeError('LAB_DEFORMED_VERTEX_NONFINITE');
    return Object.freeze({time,positions:Object.freeze(positions),normals:Object.freeze(normals),
      phases:Object.freeze(sample.legs.map(x=>x.phase))});
  });
  if(frames[0].positions.every((x,i)=>x===frames[frames.length-1].positions[i]))
    throw new Error('LAB_ANIMATION_STATIC');
  return Object.freeze({labId:E10_BROWSER_LAB_ID,frames:Object.freeze(frames),
    indices:geometry.indices,vertexCount:geometry.vertexCount,triangleCount:geometry.indices.length/3,
    duration:fixture.gait.duration});
}

/** Explicit E3/E4 bridge: matrix binding occurs inside E2 draw before E4 uniform upload. */
export function createLabE3E4Binding(scene,node,library,material,initialMesh,bounds={center:[0,.6,.3],radius:3}){
  if(!scene||typeof scene.setRenderable!=='function'||!library||typeof library.makeDrawBinding!=='function')
    throw new TypeError('LAB_E3_E4_DEPENDENCIES_REQUIRED');
  const prime=library.makeDrawBinding(material,{modelMatrix:identity(),modelViewProjection:identity()});
  const program=prime.program;
  if(!program?.gpu)throw new TypeError('LAB_E4_PROGRAM_REQUIRED');
  let queued=null,active=null,bindCount=0,drawCount=0,cleanupCount=0;
  function beforeDraw(gl,handle){
    if(!queued)throw new Error('LAB_E3_MATRICES_MISSING');
    const args=queued;queued=null;
    const binding=library.makeDrawBinding(material,args);
    if(binding.program!==program)throw new Error('LAB_E4_PROGRAM_IDENTITY_MISMATCH');
    active=binding;
    binding.beforeDraw(gl,handle);
    drawCount++;
  }
  function afterDraw(gl,handle){
    try{if(active)active.afterDraw(gl,handle);}
    finally{active=null;queued=null;cleanupCount++;}
  }
  function selectMesh(mesh){
    if(!mesh?.gpu)throw new TypeError('LAB_E1_MESH_REQUIRED');
    scene.setRenderable(node,{program,mesh,pass:'OPAQUE',cull:'NONE',bounds,beforeDraw,afterDraw});
  }
  function bindMatrices({gl,programHandle,modelMatrix,modelViewProjection}={}){
    if(!gl||programHandle!==program.gpu)throw new TypeError('LAB_E3_PROGRAM_CONTEXT_MISMATCH');
    if(queued)throw new Error('LAB_E3_MATRICES_NOT_CONSUMED');
    if(!modelMatrix||!modelViewProjection||modelMatrix.length!==16||modelViewProjection.length!==16||
       !Array.from(modelMatrix).every(finite)||!Array.from(modelViewProjection).every(finite))
      throw new TypeError('LAB_E3_MATRIX_INVALID');
    queued={modelMatrix:new Float32Array(modelMatrix),modelViewProjection:new Float32Array(modelViewProjection)};
    bindCount++;
  }
  selectMesh(initialMesh);
  return Object.freeze({program,selectMesh,bindMatrices,
    status:()=>Object.freeze({bindCount,drawCount,cleanupCount,matrixQueued:Boolean(queued),bindingActive:Boolean(active)})});
}

/** The only GPU path is adopted E1/E2/E3/E4. No world, shader or GPU primitive is replaced. */
export function createE10DiagnosticBrowserLab(canvas,{backend='WEBGL1',times=E10_DEFAULT_SAMPLES}={}){
  if(!canvas||typeof canvas.getContext!=='function')throw new TypeError('LAB_CANVAS_REQUIRED');
  if(!['WEBGL1','WEBGL2'].includes(backend))throw new TypeError('LAB_BACKEND_INVALID');
  const bank=createE10DiagnosticFrameBank(times);
  const device=createNativeWebGLDevice(canvas,{backend});
  let materials=null,scene=null,disposed=false;
  try{
    const pipeline=createNativeFramePipeline(device);
    materials=createNativeMaterialLibrary(device);
    const material=materials.createMaterial({kind:'LIT',baseColor:[.33,.76,.85,1],
      light:{direction:[.45,.75,.55],ambient:.25,intensity:.85}});
    const meshes=bank.frames.map(frame=>device.createMesh({vertexCount:bank.vertexCount,
      attributes:[
        {name:'aPosition',size:3,data:new Float32Array(frame.positions)},
        {name:'aNormal',size:3,data:new Float32Array(frame.normals)}
      ],indices:new Uint16Array(bank.indices)}));
    scene=createNativeSpatialScene();
    const node=scene.createNode();
    const aspect=Math.max(1,canvas.width||1)/Math.max(1,canvas.height||1);
    const camera=scene.createCamera({position:[0,1.3,5],near:.1,far:50,fovY:Math.PI/3,aspect});
    const binding=createLabE3E4Binding(scene,node,materials,material,meshes[0]);
    let last=null;
    function renderIndex(index){
      if(disposed)throw new Error('LAB_DISPOSED');
      if(!Number.isInteger(index)||index<0||index>=meshes.length)throw new RangeError('LAB_FRAME_INDEX_INVALID');
      const width=Math.max(1,canvas.width||1),height=Math.max(1,canvas.height||1);
      scene.setCamera(camera,{aspect:width/height});
      device.viewport(width,height);
      binding.selectMesh(meshes[index]);
      pipeline.beginFrame({target:null,clear:{color:[.025,.035,.055,1],depth:1},
        depthMode:'TEST_WRITE',cull:'NONE'});
      const spatial=scene.submit(pipeline,camera,{bindMatrices:binding.bindMatrices});
      const frame=pipeline.endFrame({presentToCanvas:true});
      if(spatial.visible!==1||frame.executed!==1||frame.presentation!=='DIRECT')
        throw new Error('LAB_FRAME_NOT_PRESENTED');
      const glError=device.gl.getError?.();
      if(glError!==undefined&&glError!==device.gl.NO_ERROR)throw new Error('LAB_GL_ERROR_'+glError);
      last=Object.freeze({index,time:bank.frames[index].time,backend,drawn:frame.executed,
        visible:spatial.visible,resourceMeshes:device.status().meshes});
      return last;
    }
    return Object.freeze({labId:E10_BROWSER_LAB_ID,backend,frameCount:meshes.length,renderIndex,
      status(){return Object.freeze({...device.status(),last,bridge:binding.status(),disposed});},
      dispose(){if(disposed)return;disposed=true;scene.dispose();materials.dispose();device.dispose();}});
  }catch(e){
    try{scene?.dispose();}catch{}
    try{materials?.dispose();}catch{}
    device.dispose();
    throw e;
  }
}
