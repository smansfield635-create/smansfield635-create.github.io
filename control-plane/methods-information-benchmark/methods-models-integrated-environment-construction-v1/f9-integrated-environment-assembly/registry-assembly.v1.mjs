import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bindings as successorBindings} from '../pre-f8-corrective-construction-v1/f4-successor-state-binding-builder.v1.mjs';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.dirname(here);
const pre=path.join(root,'pre-f8-corrective-construction-v1');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const readRoot=(dir,file)=>read(path.join(root,dir,file));
const readPre=file=>read(path.join(pre,file));
const clone=value=>structuredClone(value);
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const sorted=a=>[...a].sort((x,y)=>String(x).localeCompare(String(y)));

function loadShardIndex(indexFile,itemField){
  const index=readPre(indexFile);
  const items=[];
  for(const shard of index.shards){
    const body=readPre(shard.path);
    if(!Array.isArray(body[itemField])) throw new Error(`SHARD_FIELD_INVALID:${shard.path}:${itemField}`);
    items.push(...body[itemField]);
  }
  return {index,items};
}

function assertUnique(items,key,label){
  const values=items.map(item=>item[key]);
  if(values.some(v=>typeof v!=='string'||v.length===0)) throw new Error(`${label}_ID_INVALID`);
  if(new Set(values).size!==values.length) throw new Error(`${label}_DUPLICATE_ID`);
}

function exactSet(actual,expected,label){
  if(!same(sorted(actual),sorted(expected))) throw new Error(`${label}_SET_MISMATCH`);
}

function successorInstance(source,relations){
  const bearing=relations.filter(r=>r.studyId===source.contentId);
  if(bearing.length===0) throw new Error(`SUCCESSOR_RELATION_TRACE_MISSING:${source.contentId}`);
  const adverse=bearing.filter(r=>r.direction!=='SUPPORTING');
  return {
    contentId:source.contentId,
    contentClass:'PRE_F8_LEVEL_A_STATEFUL_SCIENTIFIC_OBJECT',
    evidenceStatus:source.evidenceStatus,
    evidenceStanding:source.evidenceStatus,
    disposition:source.disposition,
    terminalDisposition:source.disposition,
    claimCeiling:source.claimCeiling,
    claimCeilingRef:source.claimCeiling,
    prohibitions:clone(source.prohibitions),
    objectClass:source.objectClass,
    classification:source.classification,
    typedResultToClaimRelations:clone(bearing),
    resultSummaries:bearing.map(r=>({relationId:r.relationId,claimId:r.claimId,type:r.type,direction:r.direction,standing:r.standing,summary:r.summary})),
    comparators:bearing.filter(r=>String(r.type).includes('COMPARATOR')).map(r=>({relationId:r.relationId,claimId:r.claimId,direction:r.direction,standing:r.standing,summary:r.summary})),
    adverseAndMixedFindings:adverse.map(r=>({relationId:r.relationId,claimId:r.claimId,direction:r.direction,standing:r.standing,summary:r.summary})),
    executionId:source.executionId,
    fingerprint:source.fingerprint,
    sourceProvenance:{authorityRef:'PRE_F8_CORRECTIVE_CONSTRUCTION_SOURCE_BOUND_AUGMENTATION',sourceBinding:'f4-successor-binding-inputs.v1.json',fingerprint:source.fingerprint}
  };
}

function successorProfile(source,profileTemplate){
  const fieldsByDepth=clone(profileTemplate);
  return {
    contentId:source.contentId,
    entryPointId:source.contentId,
    requiredAtD0:clone(fieldsByDepth.D0),
    materialD0QualifierValues:[source.evidenceStatus,source.disposition,...source.prohibitions],
    fieldsByDepth
  };
}

function successorEntry(binding){
  const axis=binding?.state?.axes?.SCIENTIFIC_OBJECT;
  if(!axis||axis.status!=='DECLARED') throw new Error(`SUCCESSOR_OBJECT_AXIS_INVALID:${binding?.contentId}`);
  return {
    entryPointId:binding.contentId,
    bindingId:binding.bindingId,
    contentId:binding.contentId,
    expectedObjectClass:axis.value.objectClass,
    expectedObjectId:axis.value.objectId,
    authority:'PRE_F8_EXACT_SUCCESSOR_STATE_BINDING_ONLY'
  };
}

export function buildIntegratedRegistries(){
  const originalState=readRoot('f4-scientific-content-binding','state-bindings.v1.json');
  const originalEmpirical=readRoot('f4-scientific-content-binding','empirical-instance-registry.v1.json');
  const originalEntries=readRoot('f5-navigation-and-continuity','entrypoint-registry.v1.json');
  const originalProfiles=readRoot('f6-depth-and-inquiry','depth-profile-registry.v1.json');
  const successorInputs=readPre('f4-successor-binding-inputs.v1.json');
  const f5Delta=readPre('f5-successor-entrypoint-delta.v1.json');
  const f6Delta=readPre('f6-successor-depth-profile-delta.v1.json');
  const f7Delta=readPre('f7-successor-accessibility-binding.v1.json');
  const relations=loadShardIndex('typed-relation-registry-index.v1.json','relations');
  const studies=loadShardIndex('versioned-study-registry-index.v1.json','studies');

  if(successorInputs.objects.length!==14||successorBindings.length!==14) throw new Error('SUCCESSOR_LEVEL_A_COUNT_MISMATCH');
  exactSet(successorInputs.objects.map(v=>v.contentId),successorBindings.map(v=>v.contentId),'SUCCESSOR_BINDING');
  exactSet(successorInputs.objects.map(v=>v.contentId),f5Delta.entryPoints,'F5_SUCCESSOR_DELTA');
  exactSet(successorInputs.objects.map(v=>v.contentId),f6Delta.contentIds,'F6_SUCCESSOR_DELTA');
  exactSet(successorInputs.objects.map(v=>v.contentId),f7Delta.contentIds,'F7_SUCCESSOR_DELTA');

  const successorInstances=successorInputs.objects.map(v=>successorInstance(v,relations.items));
  const successorProfiles=successorInputs.objects.map(v=>successorProfile(v,f6Delta.profile));
  const successorEntries=successorBindings.map(successorEntry);

  const stateBindings={schema:'METHODS_MODELS_F9_INTEGRATED_STATE_BINDINGS_v1',bindings:[...clone(originalState.bindings),...clone(successorBindings)]};
  const empiricalRegistry={schema:'METHODS_MODELS_F9_INTEGRATED_EMPIRICAL_REGISTRY_v1',instances:[...clone(originalEmpirical.instances),...successorInstances]};
  const entrypointRegistry={schema:'METHODS_MODELS_F9_INTEGRATED_ENTRYPOINT_REGISTRY_v1',canonicalBaseRoute:originalEntries.canonicalBaseRoute,entryPoints:[...clone(originalEntries.entryPoints),...successorEntries]};
  const depthProfileRegistry={schema:'METHODS_MODELS_F9_INTEGRATED_DEPTH_PROFILE_REGISTRY_v1',profiles:[...clone(originalProfiles.profiles),...successorProfiles]};

  assertUnique(stateBindings.bindings,'contentId','STATE_BINDING');
  assertUnique(empiricalRegistry.instances,'contentId','EMPIRICAL_INSTANCE');
  assertUnique(entrypointRegistry.entryPoints,'entryPointId','ENTRYPOINT');
  assertUnique(depthProfileRegistry.profiles,'contentId','DEPTH_PROFILE');

  const ids=stateBindings.bindings.map(v=>v.contentId);
  exactSet(ids,empiricalRegistry.instances.map(v=>v.contentId),'STATE_EMPIRICAL');
  exactSet(ids,entrypointRegistry.entryPoints.map(v=>v.entryPointId),'STATE_ENTRYPOINT');
  exactSet(ids,depthProfileRegistry.profiles.map(v=>v.contentId),'STATE_DEPTH_PROFILE');
  if(ids.length!==16) throw new Error('INTEGRATED_STATEFUL_ENTRY_COUNT_MISMATCH');
  if(studies.items.length!==22) throw new Error('PORTFOLIO_STUDY_COUNT_MISMATCH');
  if(relations.items.length!==38) throw new Error('TYPED_RELATION_COUNT_MISMATCH');

  const portfolioIds=new Set(studies.items.map(v=>v.studyId));
  for(const id of ids) if(!portfolioIds.has(id)) throw new Error(`STATEFUL_ENTRY_NOT_IN_PORTFOLIO:${id}`);

  return {
    stateBindings,
    empiricalRegistry,
    entrypointRegistry,
    depthProfileRegistry,
    relations:clone(relations.items),
    studies:clone(studies.items),
    statefulEntryIds:sorted(ids),
    nonStatefulPortfolioIds:sorted(studies.items.map(v=>v.studyId).filter(id=>!ids.includes(id))),
    sourceCounts:{originalStateful:originalState.bindings.length,successorStateful:successorBindings.length,totalStateful:ids.length,portfolioStudies:studies.items.length,typedRelations:relations.items.length}
  };
}

if(process.argv[1]===fileURLToPath(import.meta.url)) process.stdout.write(JSON.stringify(buildIntegratedRegistries(),null,2)+'\n');
