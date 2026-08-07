import crypto from 'node:crypto';
import {E,cj,SD,RD,PD} from './r3-spatial-context-interpreter.v1.mjs';
import {ID as NAVIGATION_ID,check as checkNavigation,replay as replayNavigation} from './r4-recursive-navigation-state.v1.mjs';
import {ID as DISCLOSURE_ID,disclose,check as checkDisclosure} from './r5-context-bound-relation-disclosure.v1.mjs';

export const ID='SPATIAL_TRANSFORMATION_GRAMMAR_v1';
export const V='SPATIAL_TRANSFORMATION_GRAMMAR_SCHEMA_v1';
const h=s=>crypto.createHash('sha256').update(s).digest('hex');
const fail=(c,d='')=>{throw new E(c,d)};
const sid=(p,v)=>`${p}_${h(cj(v)).slice(0,24)}`;
const clone=v=>JSON.parse(JSON.stringify(v));
const eq=(a,b)=>cj(a)===cj(b);
const deepFreeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.freeze(v);for(const x of Object.values(v))deepFreeze(x)}return v};
const currentFrame=n=>n.lineageFrames.at(-1);

export function validateBindingSet(ids,bindings){
  if(!Array.isArray(ids)||!Array.isArray(bindings))fail('TRANSFORMATION_SEMANTIC_MISMATCH','arrays required');
  if(new Set(ids).size!==ids.length)fail('DUPLICATE_TRANSFORMATION_ID');
  if(bindings.length<ids.length)fail('MISSING_TRANSFORMATION_SEMANTIC_BINDING');
  if(bindings.length>ids.length)fail('UNDECLARED_TRANSFORMATION_SEMANTIC_BINDING');
  const seen=new Set();
  for(const b of bindings){
    if(!b||typeof b!=='object'||typeof b.spatialTransformationId!=='string')fail('TRANSFORMATION_SEMANTIC_MISMATCH','binding shape');
    if(seen.has(b.spatialTransformationId))fail('DUPLICATE_TRANSFORMATION_SEMANTIC_BINDING',b.spatialTransformationId);seen.add(b.spatialTransformationId);
    if(!ids.includes(b.spatialTransformationId))fail('UNDECLARED_TRANSFORMATION_SEMANTIC_BINDING',b.spatialTransformationId);
    if(typeof b.informationalSemanticId!=='string'||!b.informationalSemanticId)fail('TRANSFORMATION_SEMANTIC_MISMATCH',`${b.spatialTransformationId}:informationalSemanticId`);
    if(!('fromSelector' in b)||!('toSelector' in b)||typeof b.authorityBasis!=='string'||!b.authorityBasis)fail('TRANSFORMATION_SEMANTIC_MISMATCH',`${b.spatialTransformationId}:binding fields`);
    if(b.decorativeOnlyPrimaryNavigationPermitted!==false)fail('TRANSFORMATION_SEMANTIC_MISMATCH',`${b.spatialTransformationId}:decorativeOnlyPrimaryNavigationPermitted`);
  }
  for(const id of ids)if(!seen.has(id))fail('MISSING_TRANSFORMATION_SEMANTIC_BINDING',id);
  return true;
}

export function digest(g){const q={...g};delete q.grammarDigest;return h(cj(q))}

export function compile(n,d,{authority:a}={}){
  if(!a)fail('SOURCE_DIGEST_MISSING','authority');checkNavigation(n,a);checkDisclosure(d,n,a);const f=currentFrame(n);
  validateBindingSet(f.allowedSpatialTransformations,f.transformationSemantics);
  const ids=clone(f.allowedSpatialTransformations),bindings=clone(f.transformationSemantics);
  const g={grammarStateId:sid('GRAMMAR',{V,navigationStateId:n.navigationStateId,disclosureStateId:d.disclosureStateId,contextFrameId:f.contextFrameId,ids,bindings,SD,RD,PD}),grammarVersion:V,navigationStateId:n.navigationStateId,navigationDigest:n.navigationDigest,disclosureStateId:d.disclosureStateId,disclosureDigest:d.disclosureDigest,contextFrameId:f.contextFrameId,sourceScientificStateDigest:SD,sourceRelationGraphDigest:RD,sourceProjectionGraphDigest:PD,authorizedTransformationIds:ids,semanticBindings:bindings,admissionMode:ids.length?'DECLARED_TRANSFORMATIONS_GRAMMAR_ADMISSIBLE':'NO_SPATIAL_TRANSFORMATION_AUTHORIZED',navigationDoesNotAuthorizeTransformation:true,relationDisclosureDoesNotAuthorizeTransformation:true,runtimeExecutionAuthorized:false,visibleMutationAuthorized:false,scientificMutationAuthorized:false,grammarDigest:''};
  g.grammarDigest=digest(g);check(g,n,d,a);return deepFreeze(g);
}

export function check(g,n,d,a){
  if(!g||typeof g!=='object')fail('NONDETERMINISTIC_GRAMMAR_STATE','state');checkNavigation(n,a);checkDisclosure(d,n,a);const f=currentFrame(n);
  const req=['grammarStateId','grammarVersion','navigationStateId','navigationDigest','disclosureStateId','disclosureDigest','contextFrameId','sourceScientificStateDigest','sourceRelationGraphDigest','sourceProjectionGraphDigest','authorizedTransformationIds','semanticBindings','admissionMode','navigationDoesNotAuthorizeTransformation','relationDisclosureDoesNotAuthorizeTransformation','runtimeExecutionAuthorized','visibleMutationAuthorized','scientificMutationAuthorized','grammarDigest'];for(const k of req)if(!(k in g))fail('NONDETERMINISTIC_GRAMMAR_STATE',k);
  if(g.grammarVersion!==V)fail('NONDETERMINISTIC_GRAMMAR_STATE','version');
  if(g.sourceScientificStateDigest!==SD||g.sourceRelationGraphDigest!==RD||g.sourceProjectionGraphDigest!==PD)fail('SCIENTIFIC_STATE_MUTATION_ATTEMPT','authority drift');
  if(g.navigationStateId!==n.navigationStateId||g.navigationDigest!==n.navigationDigest||g.disclosureStateId!==d.disclosureStateId||g.disclosureDigest!==d.disclosureDigest||g.contextFrameId!==f.contextFrameId)fail('TRANSFORMATION_SCOPE_VIOLATION','context identity');
  validateBindingSet(g.authorizedTransformationIds,g.semanticBindings);
  if(g.authorizedTransformationIds.length<f.allowedSpatialTransformations.length)fail('REQUIRED_TRANSFORMATION_SUPPRESSED');
  if(g.authorizedTransformationIds.length>f.allowedSpatialTransformations.length)fail('TRANSFORMATION_SCOPE_VIOLATION','invented transformation');
  if(!eq(g.authorizedTransformationIds,f.allowedSpatialTransformations))fail('TRANSFORMATION_SCOPE_VIOLATION','transformation identity or order');
  if(!eq(g.semanticBindings,f.transformationSemantics))fail('TRANSFORMATION_SEMANTIC_MISMATCH','binding identity');
  const mode=f.allowedSpatialTransformations.length?'DECLARED_TRANSFORMATIONS_GRAMMAR_ADMISSIBLE':'NO_SPATIAL_TRANSFORMATION_AUTHORIZED';if(g.admissionMode!==mode)fail('TRANSFORMATION_SCOPE_VIOLATION','admission mode');
  if(g.navigationDoesNotAuthorizeTransformation!==true||g.relationDisclosureDoesNotAuthorizeTransformation!==true||g.runtimeExecutionAuthorized!==false||g.visibleMutationAuthorized!==false||g.scientificMutationAuthorized!==false)fail('TRANSFORMATION_SCOPE_VIOLATION','authority expansion');
  const expectedId=sid('GRAMMAR',{V,navigationStateId:n.navigationStateId,disclosureStateId:d.disclosureStateId,contextFrameId:f.contextFrameId,ids:f.allowedSpatialTransformations,bindings:f.transformationSemantics,SD,RD,PD});if(g.grammarStateId!==expectedId)fail('NONDETERMINISTIC_GRAMMAR_STATE','identity');
  if(digest(g)!==g.grammarDigest)fail('GRAMMAR_DIGEST_MISMATCH');return true;
}

export function admit(g,transformationId,{navigation:n,disclosure:d,authority:a}={}){
  if(!n||!d||!a)fail('SOURCE_DIGEST_MISSING','admission context');check(g,n,d,a);
  const i=g.authorizedTransformationIds.indexOf(transformationId);if(i<0)fail('SPATIAL_TRANSFORMATION_NOT_AUTHORIZED',transformationId);
  const binding=g.semanticBindings.find(x=>x.spatialTransformationId===transformationId);if(!binding)fail('MISSING_TRANSFORMATION_SEMANTIC_BINDING',transformationId);
  return deepFreeze({transformationId,semanticBinding:clone(binding),runtimeExecutionAuthorized:false,visibleMutationAuthorized:false,scientificAuthority:false,authoritySourceContextFrameId:g.contextFrameId});
}

export function replay(transitionIds,{authority:a}={}){const n=replayNavigation(transitionIds,{authority:a}),d=disclose(n,{authority:a});return compile(n,d,{authority:a})}
export function trace(g,n,d,a){check(g,n,d,a);const f=currentFrame(n);const forward=[{component:'FROZEN_SCIENTIFIC_STATE',authority:SD},{component:'FROZEN_RELATION_GRAPH',authority:RD},{component:'FROZEN_PROJECTION_GRAPH',authority:PD},{component:'R3_CONTEXT_FRAME',contextFrameId:f.contextFrameId,allowedSpatialTransformations:clone(f.allowedSpatialTransformations),transformationSemantics:clone(f.transformationSemantics)},{component:'R4_NAVIGATION_STATE',authority:NAVIGATION_ID,navigationStateId:n.navigationStateId},{component:'R5_RELATION_DISCLOSURE',authority:DISCLOSURE_ID,disclosureStateId:d.disclosureStateId},{component:'R6_TRANSFORMATION_GRAMMAR',authority:ID,grammarStateId:g.grammarStateId,runtimeExecutionAuthorized:false}];return{forward,reverse:[...forward].reverse(),scientificStateDigestInvariant:true,relationGraphDigestInvariant:true,projectionGraphDigestInvariant:true,visibleReconstruction:false,presentationRuntimeConstructed:false,spatialTransformationRuntimeConstructed:false}}
export function invariant(states){if(states.some(g=>g.sourceScientificStateDigest!==SD||g.sourceRelationGraphDigest!==RD||g.sourceProjectionGraphDigest!==PD))fail('SCIENTIFIC_STATE_MUTATION_ATTEMPT','authority drift');return true}
