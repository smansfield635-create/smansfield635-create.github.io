import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.dirname(here);
const pre=path.join(root,'pre-f8-corrective-construction-v1');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const readPre=n=>read(path.join(pre,n));
const readLocal=n=>read(path.join(here,n));
const stable=a=>[...a].sort((x,y)=>String(x).localeCompare(String(y)));
const digest=v=>crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');

function loadShardIndex(indexFile,itemField){
  const index=readPre(indexFile);
  const items=[];
  for(const shard of index.shards){
    const body=readPre(shard.path);
    items.push(...body[itemField]);
  }
  return {index,items};
}

export function loadAuthority(){
  const studies=loadShardIndex('versioned-study-registry-index.v1.json','studies');
  const relations=loadShardIndex('typed-relation-registry-index.v1.json','relations');
  return {
    studies,
    relations,
    inventory:readPre('scientific-object-inventory.v1.json'),
    coherence:readPre('canonical-coherence-object.v1.json'),
    projections:readPre('claim-to-estate-projection-matrix.v1.json'),
    preF8Receipt:readPre('f8-consumable-synchronized-delivery-receipt.v1.json')
  };
}

function xyzFor(index,lane){
  const col=index%6;
  const row=Math.floor(index/6);
  return {x:Number((-0.75+col*0.30).toFixed(2)),y:lane,z:Number((-0.75+row*0.30).toFixed(2))};
}

function nodesFor(ids,nodeKind,inputClass,lane,prefix,startFocus){
  return stable(ids).map((canonicalId,i)=>({
    id:`${prefix}:${canonicalId}`,
    canonicalId,
    nodeKind,
    inputClass,
    sourceRef:canonicalId,
    xyz:xyzFor(i,lane),
    visualWeight:1,
    textEquivalentId:canonicalId,
    focusOrder:startFocus+i,
    activation:'NONACTIVATING_UNLESS_UPSTREAM_CONTROL_BINDING_EXISTS'
  }));
}

export function authorizeScientificRelation(candidate,authority=loadAuthority()){
  return authority.relations.items.some(r=>
    r.relationId===candidate.relationId &&
    r.studyId===candidate.studyId &&
    r.claimId===candidate.claimId &&
    r.type===candidate.type &&
    r.direction===candidate.direction &&
    r.standing===candidate.standing
  );
}

export function authorizeProjection(claimId,destination,authority=loadAuthority()){
  const row=authority.projections.matrix.find(r=>r.claimId===claimId);
  return Boolean(row && row.allowed.includes(destination));
}

export function validateCameraRequest(request){
  if(request==null)return true;
  return request.mode==='FIXED_NON_USER_CONTROLLED' && request.orbit===false && request.pan===false && request.zoom===false && request.userControlled!==true;
}

export function projectScene(){
  const authority=loadAuthority();
  const geometry=readLocal('geometry-contract.v1.json');
  const studyIds=authority.studies.items.map(v=>v.studyId);
  const objectIds=authority.inventory.objects.map(v=>v.objectId);
  const claimIds=authority.coherence.claims.map(v=>v.claimId);
  const destinations=authority.projections.destinations;

  let focus=0;
  const studyNodes=nodesFor(studyIds,'STUDY_OBJECT_NODE','CANONICAL_SCIENTIFIC_OBJECTS',geometry.nodeKindLanes.STUDY_OBJECT_NODE,'STUDY',focus); focus+=studyNodes.length;
  const objectNodes=nodesFor(objectIds,'SCIENTIFIC_OBJECT_NODE','CANONICAL_SCIENTIFIC_OBJECTS',geometry.nodeKindLanes.SCIENTIFIC_OBJECT_NODE,'OBJECT',focus); focus+=objectNodes.length;
  const claimNodes=nodesFor(claimIds,'CLAIM_NODE','CANONICAL_SCIENTIFIC_OBJECTS',geometry.nodeKindLanes.CLAIM_NODE,'CLAIM',focus); focus+=claimNodes.length;
  const estateNodes=nodesFor(destinations,'ESTATE_DESTINATION_REGION','GOVERNED_CROSS_ESTATE_PROJECTIONS',geometry.nodeKindLanes.ESTATE_DESTINATION_REGION,'ESTATE',focus);
  const nodes=[...studyNodes,...objectNodes,...claimNodes,...estateNodes];

  const relationEdges=authority.relations.items.map(r=>({
    id:`RELATION:${r.relationId}`,
    edgeKind:'SCIENTIFIC_RELATION_EDGE',
    inputClass:'TYPED_SCIENTIFIC_RELATIONS',
    source:`STUDY:${r.studyId}`,
    target:`CLAIM:${r.claimId}`,
    relationId:r.relationId,
    relationType:r.type,
    direction:r.direction,
    standing:r.standing,
    visualWeight:1,
    navigationAuthority:false,
    textEquivalentId:r.relationId,
    inferred:false
  }));

  const projectionEdges=[];
  for(const row of authority.projections.matrix){
    for(const destination of row.allowed){
      projectionEdges.push({
        id:`PROJECTION:${row.claimId}:${destination}`,
        edgeKind:'GOVERNED_PROJECTION_EDGE',
        inputClass:'GOVERNED_CROSS_ESTATE_PROJECTIONS',
        source:`CLAIM:${row.claimId}`,
        target:`ESTATE:${destination}`,
        claimId:row.claimId,
        destination,
        claimCeiling:row.maximum,
        visualWeight:1,
        navigationAuthority:false,
        textEquivalentId:`${row.claimId}->${destination}`,
        inferred:false
      });
    }
  }

  const scientificIdentity={
    studies:stable(studyIds),
    objects:stable(objectIds),
    claims:stable(authority.coherence.claims.map(v=>`${v.claimId}|${v.status}|${v.ceiling}`)),
    relations:stable(authority.relations.items.map(v=>`${v.relationId}|${v.studyId}|${v.claimId}|${v.type}|${v.direction}|${v.standing}`)),
    projections:stable(projectionEdges.map(v=>`${v.claimId}|${v.destination}|${v.claimCeiling}`))
  };

  return {
    schema:'METHODS_MODELS_F8_SEMANTIC_SCENE_v1',
    authoritativeInputClasses:['CANONICAL_SCIENTIFIC_OBJECTS','TYPED_SCIENTIFIC_RELATIONS','GOVERNED_CROSS_ESTATE_PROJECTIONS'],
    coordinateAuthority:'PRESENTATION_ONLY',
    camera:geometry.camera,
    nodes,
    edges:[...relationEdges,...projectionEdges],
    counts:{studies:studyIds.length,scientificObjects:objectIds.length,claims:claimIds.length,destinations:destinations.length,typedRelations:relationEdges.length,governedProjections:projectionEdges.length},
    scienceDigest:digest(scientificIdentity),
    presentationDigest:digest(nodes.map(v=>[v.id,v.xyz])),
    focusOrder:nodes.map(v=>v.id),
    textFirstComplete:true,
    spatialLayerRequiredForScientificInterpretation:false
  };
}

if(process.argv[1]===fileURLToPath(import.meta.url)){
  process.stdout.write(JSON.stringify(projectScene(),null,2)+'\n');
}
