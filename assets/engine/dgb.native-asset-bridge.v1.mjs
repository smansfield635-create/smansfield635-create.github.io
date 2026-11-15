/** Creation-to-world asset transport contract for Cycle One off-product development.
 * It carries source-owned identities and geometry without reimplementing E1/E2/E3 or H-Earth renderers.
 */
import {inspectMesh} from './dgb.native-volume.v1.mjs';
const isV3=x=>Array.isArray(x)&&x.length===3&&x.every(Number.isFinite);
const plain=x=>JSON.parse(JSON.stringify(x));
const stable=x=>Array.isArray(x)?x.map(stable):x&&typeof x==='object'?Object.fromEntries(Object.entries(x).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>[k,stable(v)])):x;
const meters=p=>{if(!isV3(p))throw new TypeError('VECTOR3_REQUIRED');return [...p];};
const deepFreeze=x=>{if(x&&typeof x==='object'&&!Object.isFrozen(x)){for(const y of Object.values(x))deepFreeze(y);Object.freeze(x);}return x;};
export function makeAsset({id,mesh,material={baseColor:[.7,.7,.7,1]},animation=null,source=null}={}){
  if(typeof id!=='string'||!/^[a-z][a-z0-9-]{1,63}$/.test(id))throw new TypeError('ASSET_ID_INVALID');
  if(!mesh?.positions||!mesh.triangles)throw new TypeError('MESH_REQUIRED');
  const s=inspectMesh(mesh);if(s.invalidTriangles||s.degenerateTriangles||s.nonManifoldEdges||s.duplicateTriangles||s.vertices===0||s.triangles===0)throw new TypeError('MESH_TOPOLOGY_INVALID');
  if(!Array.isArray(material.baseColor)||material.baseColor.length!==4||!material.baseColor.every(x=>Number.isFinite(x)&&x>=0&&x<=1))throw new TypeError('MATERIAL_INVALID');
  if(animation!==null&&(typeof animation!=='object'||!Number.isInteger(animation.poseCount)||animation.poseCount<1))throw new TypeError('ANIMATION_METADATA_INVALID');
  const uv=mesh.uvs||[];if(mesh.normals&&mesh.normals.length!==s.vertices*3)throw new TypeError('NORMAL_COUNT_INVALID');if(uv.length && uv.length!==s.vertices*2)throw new TypeError('UV_COUNT_INVALID');
  const asset={schema:'DGB_CREATION_WORLD_ASSET_v1',id,geometry:{positions:Array.from(mesh.positions),triangles:Array.from(mesh.triangles),uvs:Array.from(uv),normals:Array.from(mesh.normals||[])},material:plain(material),animation:animation?plain(animation):null,source:source?plain(source):null,geometryCensus:s};
  return deepFreeze(asset);
}
export function serializeAsset(asset){if(asset?.schema!=='DGB_CREATION_WORLD_ASSET_v1')throw new TypeError('ASSET_SCHEMA_INVALID');return JSON.stringify(stable(asset));}
export function restoreAsset(serialized){const x=typeof serialized==='string'?JSON.parse(serialized):serialized;if(x.schema!=='DGB_CREATION_WORLD_ASSET_v1')throw new TypeError('ASSET_SCHEMA_INVALID');const result=makeAsset({id:x.id,mesh:{positions:Float32Array.from(x.geometry.positions),triangles:Uint32Array.from(x.geometry.triangles),uvs:Float32Array.from(x.geometry.uvs),normals:Float32Array.from(x.geometry.normals)},material:x.material,animation:x.animation,source:x.source});if(JSON.stringify(stable(result.geometryCensus))!==JSON.stringify(stable(x.geometryCensus)))throw new TypeError('GEOMETRY_CENSUS_DRIFT');return result;}
/** Existing E3 scene API adapter: creates a transform node ONLY, no GL resource ownership. */
export function placeInSpatialScene(scene,asset,{x,z,scale=1,rotationY=0,groundSampler,verticalOffset=0}={}){
  if(typeof scene?.createNode!=='function'||typeof groundSampler!=='function'||asset?.schema!=='DGB_CREATION_WORLD_ASSET_v1')throw new TypeError('PLACEMENT_DEPENDENCY_INVALID');
  if(![x,z,scale,rotationY,verticalOffset].every(Number.isFinite)||scale<=0)throw new TypeError('PLACEMENT_VALUES_INVALID');
  const ground=groundSampler(x,z);if(!Number.isFinite(ground?.y))throw new Error('ACTUAL_TERRAIN_GROUND_MISSING');
  const positions=asset.geometry.positions;let minY=Infinity;for(let i=1;i<positions.length;i+=3)minY=Math.min(minY,positions[i]);
  const y=ground.y-minY*scale+verticalOffset;
  const node=scene.createNode({position:meters([x,y,z]),rotation:[0,Math.sin(rotationY/2),0,Math.cos(rotationY/2)],scale:[scale,scale,scale]});
  return Object.freeze({node,placement:Object.freeze({assetId:asset.id,x,y,z,scale,rotationY,groundY:ground.y,grounding:'TERRAIN_SAMPLED',renderableBinding:'REQUIRES_EXISTING_E1_E2_E3_CONSUMER'})});
}

/** Standard glTF 2.0 binary export for STATIC cycle-one assets only.
 * Animated source data is deliberately never silently dropped.
 */
export function exportStaticGlb(asset){
  if(asset?.schema!=='DGB_CREATION_WORLD_ASSET_v1')throw new TypeError('ASSET_SCHEMA_INVALID');
  if(asset.animation!==null)throw new Error('ANIMATION_EXPORT_UNSUPPORTED');
  const mesh=asset.geometry,n=mesh.positions.length/3;
  if(mesh.normals.length!==n*3||mesh.uvs.length!==n*2)throw new TypeError('GLB_NORMAL_UV_REQUIRED');
  const data=[new Float32Array(mesh.positions),new Float32Array(mesh.normals),new Float32Array(mesh.uvs),new Uint32Array(mesh.triangles)];
  const chunks=[],views=[],accessors=[];let offset=0;
  for(let i=0;i<data.length;i++){
    const bytes=new Uint8Array(data[i].buffer);chunks.push(bytes);
    views.push({buffer:0,byteOffset:offset,byteLength:bytes.byteLength,target:i===3?34963:34962});
    const type=i<2?'VEC3':i===2?'VEC2':'SCALAR';
    const acc={bufferView:i,componentType:i===3?5125:5126,count:i===3?mesh.triangles.length:n,type};
    if(i===0){acc.min=[Infinity,Infinity,Infinity];acc.max=[-Infinity,-Infinity,-Infinity];for(let j=0;j<mesh.positions.length;j++){const k=j%3;acc.min[k]=Math.min(acc.min[k],mesh.positions[j]);acc.max[k]=Math.max(acc.max[k],mesh.positions[j]);}}
    accessors.push(acc);offset+=bytes.byteLength;
  }
  const color=asset.material.baseColor;
  const json={asset:{version:'2.0',generator:'Diamond Gate Cycle One static GLB writer'},scene:0,
    scenes:[{nodes:[0]}],nodes:[{mesh:0,name:asset.id}],meshes:[{primitives:[{attributes:{POSITION:0,NORMAL:1,TEXCOORD_0:2},indices:3,material:0,mode:4}]}],
    materials:[{pbrMetallicRoughness:{baseColorFactor:color,metallicFactor:0,roughnessFactor:1},doubleSided:true}],
    accessors,bufferViews:views,buffers:[{byteLength:offset}],extras:{dgbAssetId:asset.id,source:asset.source||null}};
  const encoded=new TextEncoder().encode(JSON.stringify(json));const jp=(4-encoded.length%4)%4,bp=(4-offset%4)%4;
  const total=12+8+encoded.length+jp+8+offset+bp,out=new ArrayBuffer(total),dv=new DataView(out),u=new Uint8Array(out);let at=0;
  const word=x=>{dv.setUint32(at,x,true);at+=4;};
  word(0x46546c67);word(2);word(total);word(encoded.length+jp);word(0x4e4f534a);u.set(encoded,at);at+=encoded.length;
  u.fill(0x20,at,at+jp);at+=jp;word(offset+bp);word(0x004e4942);
  for(const chunk of chunks){u.set(chunk,at);at+=chunk.length;}at+=bp;
  if(at!==total)throw new Error('GLB_LAYOUT_MISMATCH');return new Uint8Array(out);
}
