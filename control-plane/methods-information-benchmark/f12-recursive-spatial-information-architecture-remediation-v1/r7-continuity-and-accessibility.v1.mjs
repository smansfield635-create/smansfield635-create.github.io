import crypto from 'node:crypto';
import {E,cj,SD,RD,PD} from './r3-spatial-context-interpreter.v1.mjs';
import {ID as NAVIGATION_ID,check as checkNavigation,replay as replayNavigation} from './r4-recursive-navigation-state.v1.mjs';
import {ID as DISCLOSURE_ID,disclose,check as checkDisclosure} from './r5-context-bound-relation-disclosure.v1.mjs';
import {ID as GRAMMAR_ID,compile as compileGrammar,check as checkGrammar} from './r6-spatial-transformation-grammar.v1.mjs';

export const ID='SPATIAL_CONTINUITY_ACCESSIBILITY_STATE_v1';
export const V='SPATIAL_CONTINUITY_ACCESSIBILITY_STATE_SCHEMA_v1';
const h=s=>crypto.createHash('sha256').update(s).digest('hex');
const fail=(c,d='')=>{throw new E(c,d)};
const sid=(p,v)=>`${p}_${h(cj(v)).slice(0,24)}`;
const clone=v=>JSON.parse(JSON.stringify(v));
const eq=(a,b)=>cj(a)===cj(b);
const deepFreeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.freeze(v);for(const x of Object.values(v))deepFreeze(x)}return v};
const currentFrame=n=>n.lineageFrames.at(-1);
const recordDigests=d=>d.disclosedRelations.map(x=>x.sourceRecordDigest);

function continuityCore(n,d,g){
  const f=currentFrame(n);
  return {
    contextFrameId:f.contextFrameId,
    rootContextFrameId:f.rootContextFrameId,
    selector:clone(f.orientationAnchor.selector),
    destination:f.orientationAnchor.destination,
    activeDepth:f.activeDepth,
    disclosureLevel:f.disclosureLevel,
    orientationKey:n.orientationState.orientationKey,
    returnPath:clone(f.returnPath),
    navigationOperationEquivalents:clone(n.operationEquivalents),
    visibleRelationIds:clone(d.visibleRelationIds),
    sourceRecordDigests:clone(recordDigests(d)),
    transformationAuthorityIds:clone(g.authorizedTransformationIds),
    sourceScientificStateDigest:SD,
    sourceRelationGraphDigest:RD,
    sourceProjectionGraphDigest:PD
  };
}
function modality(mode,core,frameEquivalent,disclosureEquivalent){
  return {
    mode,
    continuityCore:clone(core),
    frameEquivalent:clone(frameEquivalent),
    relationDisclosureEquivalent:clone(disclosureEquivalent),
    requiresSpatialTransformation:false,
    scientificAuthority:'UPSTREAM_ONLY',
    visibleMutationAuthorized:false
  };
}
export function digest(c){const q={...c};delete q.continuityDigest;return h(cj(q))}

export function compile(n,d,g,{authority:a}={}){
  if(!a)fail('SOURCE_DIGEST_MISSING','authority');
  checkNavigation(n,a);checkDisclosure(d,n,a);checkGrammar(g,n,d,a);const f=currentFrame(n);
  if(!f.accessibilityEquivalent)fail('MISSING_ACCESSIBILITY_EQUIVALENT','frame');
  if(!f.textFirstEquivalent)fail('MISSING_TEXT_FIRST_EQUIVALENT','frame');
  if(!d.accessibilityEquivalent)fail('MISSING_ACCESSIBILITY_EQUIVALENT','disclosure');
  if(!d.textFirstEquivalent)fail('MISSING_TEXT_FIRST_EQUIVALENT','disclosure');
  const core=continuityCore(n,d,g);
  const access=modality('ACCESSIBILITY_CONTINUITY_EQUIVALENT',core,f.accessibilityEquivalent,d.accessibilityEquivalent);
  const text=modality('TEXT_FIRST_CONTINUITY_EQUIVALENT',core,f.textFirstEquivalent,d.textFirstEquivalent);
  const c={continuityStateId:sid('CONTINUITY',{V,navigationStateId:n.navigationStateId,disclosureStateId:d.disclosureStateId,grammarStateId:g.grammarStateId,contextFrameId:f.contextFrameId,core,SD,RD,PD}),continuityVersion:V,navigationRuntimeId:NAVIGATION_ID,navigationStateId:n.navigationStateId,navigationDigest:n.navigationDigest,disclosureRuntimeId:DISCLOSURE_ID,disclosureStateId:d.disclosureStateId,disclosureDigest:d.disclosureDigest,grammarRuntimeId:GRAMMAR_ID,grammarStateId:g.grammarStateId,grammarDigest:g.grammarDigest,contextFrameId:f.contextFrameId,sourceScientificStateDigest:SD,sourceRelationGraphDigest:RD,sourceProjectionGraphDigest:PD,continuityCore:core,accessibilityEquivalent:access,textFirstEquivalent:text,spatialTransformationRequired:false,spatialTransformationExecuted:false,visibleMutationAuthorized:false,scientificMutationAuthorized:false,continuityDigest:''};
  c.continuityDigest=digest(c);check(c,n,d,g,a);return deepFreeze(c);
}

export function check(c,n,d,g,a){
  if(!c||typeof c!=='object')fail('NONDETERMINISTIC_CONTINUITY_STATE','state');
  checkNavigation(n,a);checkDisclosure(d,n,a);checkGrammar(g,n,d,a);const f=currentFrame(n);
  const req=['continuityStateId','continuityVersion','navigationRuntimeId','navigationStateId','navigationDigest','disclosureRuntimeId','disclosureStateId','disclosureDigest','grammarRuntimeId','grammarStateId','grammarDigest','contextFrameId','sourceScientificStateDigest','sourceRelationGraphDigest','sourceProjectionGraphDigest','continuityCore','accessibilityEquivalent','textFirstEquivalent','spatialTransformationRequired','spatialTransformationExecuted','visibleMutationAuthorized','scientificMutationAuthorized','continuityDigest'];for(const k of req)if(!(k in c))fail('NONDETERMINISTIC_CONTINUITY_STATE',k);
  if(c.continuityVersion!==V||c.navigationRuntimeId!==NAVIGATION_ID||c.disclosureRuntimeId!==DISCLOSURE_ID||c.grammarRuntimeId!==GRAMMAR_ID)fail('NONDETERMINISTIC_CONTINUITY_STATE','version/runtime');
  if(c.sourceScientificStateDigest!==SD||c.sourceRelationGraphDigest!==RD||c.sourceProjectionGraphDigest!==PD)fail('SCIENTIFIC_STATE_MUTATION_ATTEMPT','authority drift');
  if(c.navigationStateId!==n.navigationStateId||c.navigationDigest!==n.navigationDigest||c.disclosureStateId!==d.disclosureStateId||c.disclosureDigest!==d.disclosureDigest||c.grammarStateId!==g.grammarStateId||c.grammarDigest!==g.grammarDigest||c.contextFrameId!==f.contextFrameId)fail('CONTINUITY_SCOPE_VIOLATION','input identity');
  const core=continuityCore(n,d,g);
  if(!eq(c.continuityCore.returnPath,f.returnPath)||!eq(c.continuityCore.returnPath,n.ancestorContextFrameIds))fail('RETURN_CONTINUITY_MISMATCH');
  if(!eq(c.continuityCore.navigationOperationEquivalents,n.operationEquivalents))fail('NAVIGATION_OPERATION_EQUIVALENCE_MISMATCH');
  if(!eq(c.continuityCore.visibleRelationIds,d.visibleRelationIds))fail('RELATION_DISCLOSURE_EQUIVALENCE_MISMATCH','visible relations');
  if(!eq(c.continuityCore.sourceRecordDigests,recordDigests(d)))fail('SOURCE_RECORD_CONTINUITY_MISMATCH');
  if(!eq(c.continuityCore,core))fail('CONTINUITY_SCOPE_VIOLATION','continuity core');
  if(!c.accessibilityEquivalent)fail('MISSING_ACCESSIBILITY_EQUIVALENT');
  if(!c.textFirstEquivalent)fail('MISSING_TEXT_FIRST_EQUIVALENT');
  const expectedAccess=modality('ACCESSIBILITY_CONTINUITY_EQUIVALENT',core,f.accessibilityEquivalent,d.accessibilityEquivalent);
  const expectedText=modality('TEXT_FIRST_CONTINUITY_EQUIVALENT',core,f.textFirstEquivalent,d.textFirstEquivalent);
  if(!eq(c.accessibilityEquivalent,expectedAccess))fail('ACCESSIBILITY_CONTINUITY_MISMATCH');
  if(!eq(c.textFirstEquivalent,expectedText))fail('TEXT_FIRST_CONTINUITY_MISMATCH');
  if(!eq(c.accessibilityEquivalent.continuityCore,c.textFirstEquivalent.continuityCore))fail('MODALITY_EQUIVALENCE_MISMATCH');
  if(c.spatialTransformationRequired!==false||c.spatialTransformationExecuted!==false||c.accessibilityEquivalent.requiresSpatialTransformation!==false||c.textFirstEquivalent.requiresSpatialTransformation!==false)fail('SPATIAL_TRANSFORMATION_DEPENDENCY');
  if(c.visibleMutationAuthorized!==false||c.scientificMutationAuthorized!==false||c.accessibilityEquivalent.visibleMutationAuthorized!==false||c.textFirstEquivalent.visibleMutationAuthorized!==false)fail('CONTINUITY_SCOPE_VIOLATION','authority expansion');
  const expectedId=sid('CONTINUITY',{V,navigationStateId:n.navigationStateId,disclosureStateId:d.disclosureStateId,grammarStateId:g.grammarStateId,contextFrameId:f.contextFrameId,core,SD,RD,PD});if(c.continuityStateId!==expectedId)fail('NONDETERMINISTIC_CONTINUITY_STATE','identity');
  if(digest(c)!==c.continuityDigest)fail('CONTINUITY_DIGEST_MISMATCH');return true;
}

export function replay(transitionIds,{authority:a}={}){const n=replayNavigation(transitionIds,{authority:a}),d=disclose(n,{authority:a}),g=compileGrammar(n,d,{authority:a});return compile(n,d,g,{authority:a})}
export function trace(c,n,d,g,a){check(c,n,d,g,a);const f=currentFrame(n);const forward=[{component:'FROZEN_SCIENTIFIC_STATE',authority:SD},{component:'FROZEN_RELATION_GRAPH',authority:RD},{component:'FROZEN_PROJECTION_GRAPH',authority:PD},{component:'R3_CONTEXT_FRAME',contextFrameId:f.contextFrameId},{component:'R4_NAVIGATION_STATE',authority:NAVIGATION_ID,navigationStateId:n.navigationStateId},{component:'R5_RELATION_DISCLOSURE',authority:DISCLOSURE_ID,disclosureStateId:d.disclosureStateId},{component:'R6_TRANSFORMATION_GRAMMAR',authority:GRAMMAR_ID,grammarStateId:g.grammarStateId},{component:'R7_CONTINUITY_AND_ACCESSIBILITY',authority:ID,continuityStateId:c.continuityStateId,spatialTransformationRequired:false}];return{forward,reverse:[...forward].reverse(),scientificStateDigestInvariant:true,relationGraphDigestInvariant:true,projectionGraphDigestInvariant:true,accessibilityContinuity:true,textFirstContinuity:true,spatialTransformationRequired:false,visibleReconstruction:false,presentationRuntimeConstructed:false}}
export function invariant(states){if(states.some(c=>c.sourceScientificStateDigest!==SD||c.sourceRelationGraphDigest!==RD||c.sourceProjectionGraphDigest!==PD||c.spatialTransformationRequired!==false||c.spatialTransformationExecuted!==false))fail('SCIENTIFIC_STATE_MUTATION_ATTEMPT','continuity invariant');return true}
