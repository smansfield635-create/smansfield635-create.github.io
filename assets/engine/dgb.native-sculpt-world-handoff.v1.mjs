/** Diamond Gate C2-C: OFF-PRODUCT candidate for reversible Sculpt Lab v2 -> H-Earth runtime object handoff.
 * No renderer, H-Earth, scene or production source modification. This module
 * prepares source-bound geometry and offers a failure-atomic host transaction
 * interface. An actual world runtime adapter requires separate canonical admission.
 * This is NOT a generic learned image-to-3D system or rabbit animation exporter.
 */
import {
  makeNeutralSculptRegionFixture, makeSculptReferenceFixture,
  restoreSculptStudioState, sculptMeshSpecification, serializeSculptStudioState
} from './dgb.native-sculpt-browser.v1.mjs';

const assert=(ok,code)=>{if(!ok)throw Error('C2C_WORLD_HANDOFF_'+code);};
const finite=(x)=>typeof x==='number'&&Number.isFinite(x);
const copy=x=>x instanceof Float32Array?new Float32Array(x):x instanceof Uint16Array?new Uint16Array(x):x instanceof Uint32Array?new Uint32Array(x):Array.isArray(x)?x.map(copy):x&&typeof x==='object'?Object.fromEntries(Object.entries(x).map(([k,v])=>[k,copy(v)])):x;
const boundsOf=p=>{const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<p.length;i+=3)for(let k=0;k<3;k++){min[k]=Math.min(min[k],p[i+k]);max[k]=Math.max(max[k],p[i+k]);}return {min,max};};
const sha=async text=>Array.from(new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)))).map(x=>x.toString(16).padStart(2,'0')).join('');
const normalizedName=s=>{assert(typeof s==='string'&&/^[A-Za-z][A-Za-z0-9_-]{1,63}$/.test(s),'OBJECT_ID_INVALID');return s;};
const point=p=>assert(p&&[p.x,p.y,p.z].every(finite),'PROJECTED_WORLD_POINT_INVALID');
const inside=(x,z,b)=>x>=b.minX&&x<=b.maxX&&z>=b.minZ&&z<=b.maxZ;
const marginOverlap=(b,a)=>b.minX<a.maxX&&b.maxX>a.minX&&b.minZ<a.maxZ&&b.maxZ>a.minZ;

/** Pure immutable-exact-source edit recovery; throws on forged/malformed topology. */
export async function recoverEditedSculptAsset(saved,{expectedSha256=null}={}) {
  assert(typeof saved==='string'&&saved.length>100&&saved.length<2_000_000,'SAVE_BYTES_INVALID');
  const hash=await sha(saved);
  if(expectedSha256!==null)assert(hash===expectedSha256,'SOURCE_SHA256_MISMATCH');
  let obj;try{obj=JSON.parse(saved);}catch{throw Error('C2C_WORLD_HANDOFF_SAVE_JSON_INVALID');}
  assert(obj.schema==='DGB_SCULPT_LAB_TOPOLOGY_CHAIN_V2'&&obj.sourceId==='DGB_SCULPT_LAB_NEUTRAL_SOURCE_V1','SAVE_SCHEMA_OR_IDENTITY_INVALID');
  assert(obj.source?.kind==='SILHOUETTE_HEURISTIC_PRIOR'&&Array.isArray(obj.stages)&&obj.stages.length>=1&&obj.stages.length<=40,'NOT_EDITED_IMAGE_DERIVED_SOURCE');
  const fixture=makeNeutralSculptRegionFixture(),original=makeSculptReferenceFixture(obj.source);
  const reconstructed=restoreSculptStudioState(saved,fixture);
  const repacked=serializeSculptStudioState(reconstructed.session,reconstructed.stages,reconstructed.source);
  assert(repacked===saved,'RESTORE_SOURCE_LINEAGE_DRIFT');
  const mesh=sculptMeshSpecification(reconstructed.session,reconstructed.uv);
  const rawPositions=new Float32Array(reconstructed.session.getPositions());
  const rawIndices=new Uint32Array(reconstructed.session.getTriangles());
  assert(rawIndices.length/3!==original.triangles.length/3 || rawPositions.length!==original.positions.length,'NO_NONTRIVIAL_TOPOLOGY_CHANGE');
  const attrs=mesh.attributes;
  assert(attrs.length>=3&&attrs[0].name==='aPosition'&&attrs[1].name==='aNormal'&&attrs[2].name==='aUV','MESH_ATTRIBUTES_INVALID');
  const positions=new Float32Array(attrs[0].data),normals=new Float32Array(attrs[1].data),uvs=new Float32Array(attrs[2].data),indices=new Uint16Array(mesh.indices);
  assert(positions.length%3===0&&positions.length>=9&&positions.length/3===mesh.vertexCount&&mesh.vertexCount<=65535,'VERTEX_COUNT_INVALID');
  assert(normals.length===positions.length&&uvs.length===mesh.vertexCount*2&&indices.length>=3&&indices.length%3===0,'MESH_CARDINALITY_INVALID');
  assert([...positions,...normals,...uvs].every(finite)&&[...indices].every(x=>x<mesh.vertexCount),'NONFINITE_OR_INVALID_MESH');
  const size=boundsOf(positions);
  assert(size.min.every(finite)&&size.max.every(finite),'MESH_BOUNDS_INVALID');
  assert((size.max[0]-size.min[0])<=8&&(size.max[1]-size.min[1])<=8&&(size.max[2]-size.min[2])<=8,'MESH_LOCAL_SIZE_LIMIT');
  const metadata=Object.freeze({schema:'DGB_C2C_EDITED_IMAGE_ASSET_v1',saveSha256:hash,sourceKind:'SILHOUETTE_HEURISTIC_PRIOR',topologyStages:obj.stages.length,vertices:mesh.vertexCount,triangles:indices.length/3,masterVertices:rawPositions.length/3,sourceTriangles:original.triangles.length/3,bounds:copy(size),UVsPreserved:true,originalRabbit:false});
  return Object.freeze({metadata, snapshot:()=>({positions:new Float32Array(positions),normals:new Float32Array(normals),uvs:new Float32Array(uvs),indices:new Uint16Array(indices),bounds:copy(size)})});
}

/** H-Earth source-authorized samplers are supplied by the existing world. We never synthesize them. */
export function groundEditedAsset(asset,{
 id,x,z,scale=1,rotation=0,groundAt,waterAt,projectWorld,protectedFootprints=[],worldBounds=null,footprintPadding=.2
}={}){
  normalizedName(id);
  assert([x,z,scale,rotation,footprintPadding].every(finite)&&scale>=.05&&scale<=1.2&&footprintPadding>=0&&footprintPadding<=3,'TRANSFORM_INVALID');
  assert(typeof groundAt==='function'&&typeof waterAt==='function'&&typeof projectWorld==='function','WORLD_CONSUMER_INTERFACE_REQUIRED');
  assert(Array.isArray(protectedFootprints),'PROTECTED_WORLD_FOOTPRINTS_REQUIRED');
  const mesh=asset.snapshot(),p=mesh.positions,b=mesh.bounds,c=Math.cos(rotation),s=Math.sin(rotation);
  const transform=(xx,zz)=>({x:x+(c*xx+s*zz)*scale,z:z+(-s*xx+c*zz)*scale});
  const corners=[];for(const px of [b.min[0],b.max[0]])for(const pz of [b.min[2],b.max[2]])corners.push(transform(px,pz));
  const worldFootprint={minX:Math.min(...corners.map(v=>v.x))-footprintPadding,maxX:Math.max(...corners.map(v=>v.x))+footprintPadding,minZ:Math.min(...corners.map(v=>v.z))-footprintPadding,maxZ:Math.max(...corners.map(v=>v.z))+footprintPadding};
  if(worldBounds)assert(worldFootprint.minX>=worldBounds.xMin&&worldFootprint.maxX<=worldBounds.xMax&&worldFootprint.minZ>=worldBounds.zMin&&worldFootprint.maxZ<=worldBounds.zMax,'OUTSIDE_AUTHORIZED_REGION');
  for(const protectedArea of protectedFootprints){
    assert(protectedArea&&[protectedArea.minX,protectedArea.maxX,protectedArea.minZ,protectedArea.maxZ].every(finite),'PROTECTED_FOOTPRINT_INVALID');
    assert(!marginOverlap(worldFootprint,protectedArea),'PROTECTED_WORLD_COLLISION');
  }
  const samples=[{x,z},...corners],contacts=[];
  for(const pt of samples){
    const ground=groundAt(pt.x,pt.z),water=waterAt(pt.x,pt.z);
    assert(ground&&finite(ground.y),'GROUND_CONTACT_MISSING');
    assert(!water||!finite(water.y)||water.y<ground.y-.03,'WATER_INTERSECTION');
    contacts.push({x:pt.x,z:pt.z,y:ground.y});
  }
  const center=contacts[0];assert(contacts.every(pt=>Math.abs(pt.y-center.y)<=.55),'FOOTPRINT_SLOPE_UNSUPPORTED');
  const projected=new Float32Array(p.length),worldPositions=new Float32Array(p.length);
  for(let i=0;i<p.length;i+=3){const t=transform(p[i],p[i+2]);const v={x:t.x,y:center.y-.06+(p[i+1]-b.min[1])*scale,z:t.z};
    point(v);const r=projectWorld(v);point(r);
    projected.set([r.x,r.y,r.z],i);worldPositions.set([v.x,v.y,v.z],i);
  }
  assert(projected.every(finite),'WORLD_PROJECTION_INVALID');
  const object=Object.freeze({schema:'DGB_C2C_WORLD_PLACEMENT_CANDIDATE_v1',id,sourceSha256:asset.metadata.saveSha256,sourceTriangles:asset.metadata.sourceTriangles,triangles:asset.metadata.triangles,vertices:asset.metadata.vertices,editStages:asset.metadata.topologyStages,sourceKind:asset.metadata.sourceKind,anchor:Object.freeze({x,y:center.y-.06,z}),groundContacts:contacts.map(p=>Object.freeze(p)),worldFootprint:Object.freeze(worldFootprint),terrainSource:'HOST_WORLD_SAMPLER',renderSource:'ADOPTED_NATIVE_SCULPT_V2',readOnly:false,notYetInstalled:true});
  return Object.freeze({receipt:object,snapshot:()=>({positions:new Float32Array(projected),worldPositions:new Float32Array(worldPositions),normals:new Float32Array(mesh.normals),uvs:new Float32Array(mesh.uvs),indices:new Uint16Array(mesh.indices)})});
}

/** Consumer installs through existing renderer's transaction, not through a new WebGL context. */
export function createReversibleWorldHandoff(prepared,host){
  assert(prepared?.receipt?.schema==='DGB_C2C_WORLD_PLACEMENT_CANDIDATE_v1','PREPARED_ASSET_REQUIRED');
  assert(host&&typeof host.beginTransaction==='function','HOST_TRANSACTION_REQUIRED');
  let state='PREPARED',transaction=null;
  function attach(){assert(state==='PREPARED','ATTACH_STATE_INVALID');let tx;
    try{
      tx=host.beginTransaction(prepared.receipt.id,prepared.snapshot(),prepared.receipt);
      assert(tx&&['commit','rollback','draw'].every(name=>typeof tx[name]==='function'),'HOST_TRANSACTION_CONTRACT_INVALID');
      tx.commit();transaction=tx;state='ATTACHED';return true;
    }catch(error){try{tx?.rollback?.();}catch{}state='QUARANTINED';throw error;}
  }
  function draw(packet){assert(state==='ATTACHED','DRAW_STATE_INVALID');try{return transaction.draw(packet);}catch(error){try{transaction.rollback();}catch{}state='QUARANTINED';throw error;}}
  function detach(){if(state==='DETACHED')return false;assert(state==='ATTACHED','DETACH_STATE_INVALID');try{transaction.rollback();state='DETACHED';return true;}catch(error){state='QUARANTINED';throw error;}}
  return Object.freeze({attach,draw,detach,status:()=>state,identity:prepared.receipt.sourceSha256});
}
