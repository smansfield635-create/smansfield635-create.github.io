/**
 * Generosity Harvest V1 — private first-party Sculpt Lab / Graphics Engine bridge.
 * Does not modify source R63 or its editor. Produces a disposable experimental
 * lineage, independent GPU render buffer, provenance and camera definitions.
 */
import {createHash} from 'node:crypto';
import {
  ACCEPTED_R63_SHA256,
  ORGANIC_OPERATION_ID,
  buildOrganicExperimentalSurface
} from './organic-forequarter-volume.v1.mjs';

export const FIRST_PARTY_CAMERAS=Object.freeze({
  hero:{eye:[1.42,1.10,1.38],target:[0.39,0.49,0],up:[0,1,0]},
  side:{eye:[0.39,0.56,2.10],target:[0.39,0.49,0],up:[0,1,0]},
  front:{eye:[1.85,0.50,0],target:[0.39,0.49,0],up:[0,1,0]},
  rear:{eye:[-1.02,1.13,-1.54],target:[0.39,0.49,0],up:[0,1,0]}
});

export function verifyAcceptedR63Bytes(jsonBytes){
  const bytes=typeof jsonBytes==='string'?Buffer.from(jsonBytes,'utf8'):Buffer.from(jsonBytes);
  const digest=createHash('sha256').update(bytes).digest('hex');
  if(digest!==ACCEPTED_R63_SHA256)throw Error(`ORGANIC_PARENT_DIGEST_MISMATCH:${digest}`);
  const original=JSON.parse(bytes.toString('utf8'));
  if(!original?.mesh||!Array.isArray(original?.mesh?.positions)||!Array.isArray(original?.mesh?.indices))throw Error('ORGANIC_PARENT_STRUCTURAL_INVALID');
  if(!Array.isArray(original?.history?.transactions)&&!Array.isArray(original?.undo)){
    // Historical private R63 save has a concrete chronological transaction list.
    if(!Array.isArray(original?.transactions))throw Error('ORGANIC_PARENT_TRANSACTION_HISTORY_UNAVAILABLE');
  }
  return{original,sourceDigest:digest,sourceBytes:bytes.length};
}

export function toFirstPartyWebGLBuffers(mesh){
  if(mesh.positions.length%3!==0||mesh.indices.length%3!==0)throw Error('ORGANIC_RENDER_MESH_INVALID');
  const n=mesh.positions.length/3;
  if(n>65535||mesh.indices.some(i=>i<0||i>=n))throw Error('ORGANIC_RENDER_INDEX_LIMIT');
  const positions=new Float32Array(mesh.positions.length),normals=new Float32Array(mesh.positions.length);
  for(let i=0;i<mesh.positions.length;i+=3){positions[i]=mesh.positions[i];positions[i+1]=mesh.positions[i+2];positions[i+2]=-mesh.positions[i+1]}
  for(let i=0;i<mesh.indices.length;i+=3){const a=3*mesh.indices[i],b=3*mesh.indices[i+1],c=3*mesh.indices[i+2];
    const ux=positions[b]-positions[a],uy=positions[b+1]-positions[a+1],uz=positions[b+2]-positions[a+2];
    const vx=positions[c]-positions[a],vy=positions[c+1]-positions[a+1],vz=positions[c+2]-positions[a+2];
    const nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx;
    for(const id of [a,b,c]){normals[id]+=nx;normals[id+1]+=ny;normals[id+2]+=nz}
  }
  for(let i=0;i<normals.length;i+=3){const n=Math.hypot(normals[i],normals[i+1],normals[i+2])||1;normals[i]/=n;normals[i+1]/=n;normals[i+2]/=n}
  return{positions,normals,indices:new Uint16Array(mesh.indices),cameras:FIRST_PARTY_CAMERAS,materialContract:'UNIFORM_NEUTRAL_MATERIAL_DIAGNOSTIC_ONLY'};
}

export function authorDisposableOrganicRabbit(acceptedSourceBytes, options={}){
  const p=verifyAcceptedR63Bytes(acceptedSourceBytes);
  const originalPositions=JSON.stringify(p.original.mesh.positions);
  const originalIndices=JSON.stringify(p.original.mesh.indices);
  const candidate=buildOrganicExperimentalSurface(p.original.mesh,options);
  if(!candidate.audit.connectedWatertight)throw Error('ORGANIC_SURFACE_NOT_CLOSED');
  if(JSON.stringify(p.original.mesh.positions)!==originalPositions||JSON.stringify(p.original.mesh.indices)!==originalIndices)throw Error('ORGANIC_MUTATED_PARENT_IN_MEMORY');
  const buffers=toFirstPartyWebGLBuffers(candidate.mesh);
  return{
    operationId:ORGANIC_OPERATION_ID,
    acceptedParent:{sha256:p.sourceDigest,byteCount:p.sourceBytes,immutable:true},
    experimentalCopy:{kind:'R63_DERIVED_DISPOSABLE_EXPERIMENT',notR64:true,geometry: candidate.mesh,mechanicalAudit:candidate.audit,provenance:candidate.provenance},
    firstPartyRenderBuffers:buffers,
    restrictions:{R63ParentUnaffected:true,sourceFaceRetirementLimitedToExperimentalCopy:true,farSidePawSourceReferencePreserved:true,farSidePawExactCopyGeometryNotEstablished:true,animationNotRetargeted:true,UVAndTexturedRenderNotQualified:true,C1NotGranted:true}
  };
}
