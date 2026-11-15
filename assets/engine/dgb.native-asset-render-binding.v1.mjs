/** Diamond Gate Cycle One v0.2 — proposed native E1/E2/E3/E4 integration seam.
 * Non-product development candidate: no adopted engine module imported in this
 * standalone archive. Render submission is contract-tested with bounded stubs.
 * Imported immutable asset data, E1 mesh ownership, E3 spatial collection,
 * E4 per-object draw material, and E2 frame submission remain independent.
 */
import {serializeAsset,restoreAsset,placeInSpatialScene} from './dgb.native-asset-bridge.v1.mjs';
const IDENTITY = new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
function acceptedAsset(asset){
  // Re-run the canonical asset geometry/source census instead of trusting raw JSON.
  const accepted=restoreAsset(serializeAsset(asset));
  if(accepted.animation!==null) throw new Error('ANIMATED_ASSET_GPU_BINDING_NOT_YET_SUPPORTED');
  const g=accepted.geometry;
  if(g.normals.length!==g.positions.length || g.uvs.length!==g.positions.length/3*2)
    throw new Error('NATIVE_MESH_NORMAL_UV_REQUIRED');
  if(g.triangles.length===0 || g.positions.length===0) throw new Error('NATIVE_MESH_EMPTY');
  return accepted;
}
function localBounds(positions){
  const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
  for(let i=0;i<positions.length;i+=3)for(let k=0;k<3;k++){
    min[k]=Math.min(min[k],positions[i+k]);max[k]=Math.max(max[k],positions[i+k]);
  }
  const center=min.map((x,i)=>(x+max[i])*.5);
  let radius=0;
  for(let i=0;i<positions.length;i+=3){
    const dist=Math.hypot(positions[i]-center[0],positions[i+1]-center[1],positions[i+2]-center[2]);
    radius=Math.max(radius,dist);
  }
  return Object.freeze({center:Object.freeze(center),radius});
}
export function createCycleOneNativeBindings({device,scene,materialLibrary,pipeline,cameraNode}={}){
  if(!device||typeof device.createMesh!=='function'|| !['WEBGL1','WEBGL2'].includes(device.backend)
    || !scene||typeof scene.createNode!=='function'||typeof scene.setRenderable!=='function'||typeof scene.collect!=='function'
    || !materialLibrary||typeof materialLibrary.createMaterial!=='function'||typeof materialLibrary.makeDrawBinding!=='function'
    || !pipeline||typeof pipeline.beginFrame!=='function'||typeof pipeline.submit!=='function'||typeof pipeline.endFrame!=='function'
    || !cameraNode) throw new TypeError('ADOPTED_E1_E2_E3_E4_DEPENDENCIES_REQUIRED');
  const records=new Map();let closed=false;
  const ready=()=>{if(closed)throw new Error('ASSET_NATIVE_BINDINGS_DISPOSED');};
  function attach(asset,{x,z,scale=1,rotationY=0,groundSampler,verticalOffset=0}={}){
    ready();const a=acceptedAsset(asset),g=a.geometry;
    // Terrain validation happens before any GPU allocation or world mutation.
    if(typeof groundSampler!=='function')throw new Error('ACTUAL_TERRAIN_GROUND_MISSING');
    const ground=groundSampler(x,z);
    if(!Number.isFinite(ground?.y))throw new Error('ACTUAL_TERRAIN_GROUND_MISSING');
    if(g.triangles.length>500000)throw new RangeError('FIRST_STAGE_INDEX_BUDGET_EXCEEDED');
    let idx=0;for(const vertex of g.triangles)if(vertex>idx)idx=vertex;
    if(device.backend==='WEBGL1'&&idx>=65536)throw new Error('WEBGL1_UINT32_MESH_NOT_PROVEN');
    const material=materialLibrary.createMaterial({kind:'LIT',baseColor:a.material.baseColor,
      light:{direction:[.25,.72,.5],ambient:.2,intensity:.8}});
    // E4 owns the shader/program. No replacement shader is introduced here.
    const priming=materialLibrary.makeDrawBinding(material,{modelMatrix:IDENTITY,modelViewProjection:IDENTITY});
    if(!priming.program?.gpu)throw new Error('E4_MATERIAL_PROGRAM_MISSING');
    const mesh=device.createMesh({attributes:[
      {name:'aPosition',data:Float32Array.from(g.positions),size:3},
      {name:'aNormal',data:Float32Array.from(g.normals),size:3},
      {name:'aUV',data:Float32Array.from(g.uvs),size:2}
    ],indices:idx<65536?Uint16Array.from(g.triangles):Uint32Array.from(g.triangles),vertexCount:g.positions.length/3});
    if(!mesh?.gpu)throw new Error('E1_MESH_GPU_MISSING');
    const {node,placement}=placeInSpatialScene(scene,a,{x,z,scale,rotationY,groundSampler:()=>ground,verticalOffset});
    scene.setRenderable(node,{program:priming.program,mesh,pass:'OPAQUE',cull:'NONE',bounds:localBounds(g.positions)});
    records.set(node,Object.freeze({asset:a,material,mesh,program:priming.program,placement}));
    return Object.freeze({node,assetId:a.id,placement,vertexCount:g.positions.length/3,triangleCount:g.triangles.length/3,source:a.source});
  }
  function render({clearColor=[.085,.11,.15,1],presentToCanvas=true}={}){
    ready();
    if(!Array.isArray(clearColor)||clearColor.length!==4||!clearColor.every(Number.isFinite))throw new TypeError('CLEAR_COLOR_INVALID');
    const visible=scene.collect(cameraNode);
    const commands=[];
    for(const cmd of visible.commands){
      const record=records.get(cmd.node);
      // Refuse to assume which material belongs to an unrelated E3 node.
      if(!record)throw new Error('FOREIGN_SCENE_RENDERABLE_NOT_BORNE_BY_THIS_BINDING');
      const binding=materialLibrary.makeDrawBinding(record.material,{
        modelMatrix:cmd.modelMatrix,modelViewProjection:cmd.modelViewProjection});
      if(binding.program!==cmd.program)throw new Error('E4_MATERIAL_PROGRAM_IDENTITY_CHANGED');
      commands.push({program:cmd.program,mesh:cmd.mesh,first:cmd.first,count:cmd.count,
        pass:cmd.pass,cull:cmd.cull,depthKey:cmd.depthKey,
        beforeDraw:binding.beforeDraw,afterDraw:binding.afterDraw});
    }
    pipeline.beginFrame({target:null,clear:{color:clearColor,depth:1},depthMode:'TEST_WRITE',cull:'NONE'});
    try{for(const command of commands)pipeline.submit(command);
      pipeline.endFrame({presentToCanvas});
    }catch(error){throw error;} // preserve original E2 selected failure, never fake a PASS
    return Object.freeze({submitted:commands.length,considered:visible.considered,culled:visible.culled,assetCount:records.size});
  }
  return Object.freeze({attach,render,assets:()=>Object.freeze([...records.values()].map(r=>Object.freeze({id:r.asset.id,placement:r.placement,source:r.asset.source}))),
    dispose(){closed=true;records.clear();}});
}
