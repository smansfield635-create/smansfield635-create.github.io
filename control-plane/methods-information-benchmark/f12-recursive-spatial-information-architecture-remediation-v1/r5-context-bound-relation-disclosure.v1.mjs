import crypto from 'node:crypto';
import {ID as INTERPRETER_ID,E,cj,SD,RD,PD} from './r3-spatial-context-interpreter.v1.mjs';
import {ID as NAVIGATION_ID,V as NAVIGATION_VERSION,check as checkNavigation,replay as replayNavigation} from './r4-recursive-navigation-state.v1.mjs';

export const ID='SPATIAL_CONTEXT_BOUND_RELATION_DISCLOSURE_v1';
export const V='SPATIAL_CONTEXT_BOUND_RELATION_DISCLOSURE_SCHEMA_v1';
const h=s=>crypto.createHash('sha256').update(s).digest('hex');
const fail=(c,d='')=>{throw new E(c,d)};
const sid=(p,v)=>`${p}_${h(cj(v)).slice(0,24)}`;
const clone=v=>JSON.parse(JSON.stringify(v));
const eq=(a,b)=>cj(a)===cj(b);
const deepFreeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.freeze(v);for(const x of Object.values(v))deepFreeze(x)}return v};
const sourceDigest=v=>h(cj(v));
const currentFrame=n=>n.lineageFrames.at(-1);

function sourceTriplet(relationId,a){
  const relation=a.R.get(relationId);if(!relation)fail('UNDECLARED_RELATION',relationId);
  const study=a.T.get(relation.studyId);if(!study)fail('UNKNOWN_SCIENTIFIC_REFERENCE',relation.studyId);
  const claim=a.C.get(relation.claimId);if(!claim)fail('UNKNOWN_SCIENTIFIC_REFERENCE',relation.claimId);
  const relationRecord=clone(relation),studyRecord=clone(study),claimRecord=clone(claim);
  const evidenceBoundary={relationDirection:relation.direction??null,relationStanding:relation.standing??null,studyStanding:study.standing??null,claimStatus:claim.status??null,claimCeiling:claim.ceiling??null};
  return {relationId,studyId:relation.studyId,claimId:relation.claimId,relationRecord,studyRecord,claimRecord,evidenceBoundary,sourceRecordDigest:sourceDigest({relationRecord,studyRecord,claimRecord,evidenceBoundary})};
}
function contextScope(f){return{contextFrameId:f.contextFrameId,selector:clone(f.orientationAnchor.selector),destination:f.orientationAnchor.destination,activeDepth:f.activeDepth,activeView:f.activeView,activeObject:f.activeObject,activeSubobject:f.activeSubobject,activeRelation:f.activeRelation,disclosureLevel:f.disclosureLevel,authorizedVisibleRelationIds:clone(f.authorizedVisibleRelations)}};
function equivalent(mode,d){return{mode,contextFrameId:d.contextFrameId,navigationStateId:d.navigationStateId,visibleRelationIds:clone(d.visibleRelationIds),sourceRecordDigests:d.disclosedRelations.map(x=>x.sourceRecordDigest),scientificAuthority:'UPSTREAM_ONLY'}};

export function digest(d){const q={...d};delete q.disclosureDigest;return h(cj(q))}
export function disclose(n,{authority:a}={}){
  if(!a)fail('SOURCE_DIGEST_MISSING','authority');checkNavigation(n,a);const f=currentFrame(n),visible=clone(f.authorizedVisibleRelations),records=visible.map(r=>sourceTriplet(r,a));
  const d={disclosureStateId:sid('DISCLOSE',{V,navigationStateId:n.navigationStateId,contextFrameId:f.contextFrameId,visible,SD,RD,PD}),disclosureVersion:V,interpreterId:INTERPRETER_ID,navigationRuntimeId:NAVIGATION_ID,navigationVersion:NAVIGATION_VERSION,navigationStateId:n.navigationStateId,navigationDigest:n.navigationDigest,contextFrameId:f.contextFrameId,sourceScientificStateDigest:SD,sourceRelationGraphDigest:RD,sourceProjectionGraphDigest:PD,declaredRelationCount:a.R.size,contextScope:contextScope(f),visibleRelationIds:visible,disclosedRelations:records,disclosureMode:visible.length?'ACTIVE_CONTEXT_RELATIONS':'NO_RELATIONS_AUTHORIZED_IN_CONTEXT',globalRelationDump:false,scientificMutationPermitted:false,relationCreationPermitted:false,projectionCreationPermitted:false,accessibilityEquivalent:null,textFirstEquivalent:null,disclosureDigest:''};
  d.accessibilityEquivalent=equivalent('SEMANTIC_RELATION_DISCLOSURE',d);d.textFirstEquivalent=equivalent('TEXT_FIRST_RELATION_DISCLOSURE',d);d.disclosureDigest=digest(d);check(d,n,a);return deepFreeze(d);
}
export function check(d,n,a){
  if(!d||typeof d!=='object')fail('NONDETERMINISTIC_DISCLOSURE_STATE','state');checkNavigation(n,a);const f=currentFrame(n),req=['disclosureStateId','disclosureVersion','interpreterId','navigationRuntimeId','navigationVersion','navigationStateId','navigationDigest','contextFrameId','sourceScientificStateDigest','sourceRelationGraphDigest','sourceProjectionGraphDigest','declaredRelationCount','contextScope','visibleRelationIds','disclosedRelations','disclosureMode','globalRelationDump','scientificMutationPermitted','relationCreationPermitted','projectionCreationPermitted','accessibilityEquivalent','textFirstEquivalent','disclosureDigest'];for(const k of req)if(!(k in d))fail('NONDETERMINISTIC_DISCLOSURE_STATE',k);
  if(d.disclosureVersion!==V||d.interpreterId!==INTERPRETER_ID||d.navigationRuntimeId!==NAVIGATION_ID||d.navigationVersion!==NAVIGATION_VERSION)fail('NONDETERMINISTIC_DISCLOSURE_STATE','version');
  if(d.sourceScientificStateDigest!==SD||d.sourceRelationGraphDigest!==RD||d.sourceProjectionGraphDigest!==PD)fail('SCIENTIFIC_STATE_MUTATION_ATTEMPT','disclosure authority drift');
  if(d.navigationStateId!==n.navigationStateId||d.navigationDigest!==n.navigationDigest||d.contextFrameId!==f.contextFrameId)fail('CONTEXT_SCOPE_VIOLATION','navigation/frame identity');
  if(d.declaredRelationCount!==a.R.size)fail('SOURCE_DIGEST_MISMATCH','declared relation cardinality');
  const expectedVisible=f.authorizedVisibleRelations;if(!Array.isArray(d.visibleRelationIds)||!Array.isArray(d.disclosedRelations))fail('NONDETERMINISTIC_DISCLOSURE_STATE','relation arrays');
  if(d.visibleRelationIds.length<expectedVisible.length)fail('REQUIRED_RELATION_SUPPRESSED','visible relation set');
  if(d.visibleRelationIds.length>expectedVisible.length)fail('CONTEXT_SCOPE_VIOLATION','relation outside active context');
  if(!eq(d.visibleRelationIds,expectedVisible))fail('CONTEXT_SCOPE_VIOLATION','visible relation ordering or identity');
  if(new Set(d.visibleRelationIds).size!==d.visibleRelationIds.length)fail('CONTEXT_SCOPE_VIOLATION','duplicate relation');
  if(d.disclosedRelations.length<expectedVisible.length)fail('REQUIRED_RELATION_SUPPRESSED','disclosed relation record');
  if(d.disclosedRelations.length>expectedVisible.length)fail('CONTEXT_SCOPE_VIOLATION','global relation dump');
  if(d.globalRelationDump!==false||d.scientificMutationPermitted!==false||d.relationCreationPermitted!==false||d.projectionCreationPermitted!==false)fail('SCIENTIFIC_STATE_MUTATION_ATTEMPT','authority expansion');
  if(!eq(d.contextScope,contextScope(f)))fail('CONTEXT_SCOPE_VIOLATION','context descriptor');
  for(let i=0;i<expectedVisible.length;i++){
    const rid=expectedVisible[i];if(!a.R.has(rid))fail('UNDECLARED_RELATION',rid);const x=d.disclosedRelations[i];if(x?.relationId!==rid)fail('REQUIRED_RELATION_SUPPRESSED',rid);const expected=sourceTriplet(rid,a);
    if(!eq(x.relationRecord,expected.relationRecord)||!eq(x.studyRecord,expected.studyRecord))fail('SOURCE_RECORD_MISMATCH',rid);
    if(!eq(x.claimRecord,expected.claimRecord)||x.evidenceBoundary?.claimCeiling!==expected.evidenceBoundary.claimCeiling||x.evidenceBoundary?.claimStatus!==expected.evidenceBoundary.claimStatus)fail('CLAIM_CEILING_OR_SOURCE_MUTATION',rid);
    if(!eq(x.evidenceBoundary,expected.evidenceBoundary))fail('EVIDENCE_BOUNDARY_SUPPRESSION',rid);
    if(x.sourceRecordDigest!==expected.sourceRecordDigest)fail('SOURCE_RECORD_MISMATCH',`${rid}:digest`);
  }
  const mode=expectedVisible.length?'ACTIVE_CONTEXT_RELATIONS':'NO_RELATIONS_AUTHORIZED_IN_CONTEXT';if(d.disclosureMode!==mode)fail('CONTEXT_SCOPE_VIOLATION','disclosure mode');
  if(!eq(d.accessibilityEquivalent,equivalent('SEMANTIC_RELATION_DISCLOSURE',d))||!eq(d.textFirstEquivalent,equivalent('TEXT_FIRST_RELATION_DISCLOSURE',d)))fail('EQUIVALENCE_MISMATCH');
  const expectedId=sid('DISCLOSE',{V,navigationStateId:n.navigationStateId,contextFrameId:f.contextFrameId,visible:expectedVisible,SD,RD,PD});if(d.disclosureStateId!==expectedId)fail('NONDETERMINISTIC_DISCLOSURE_STATE','identity');
  if(digest(d)!==d.disclosureDigest)fail('DISCLOSURE_DIGEST_MISMATCH');return true;
}
export function replay(transitionIds,{authority:a}={}){const n=replayNavigation(transitionIds,{authority:a});return disclose(n,{authority:a})}
export function trace(d,n,a){check(d,n,a);const f=currentFrame(n),forward=[{layer:'L1_CANONICAL_SCIENTIFIC_INVENTORY',authority:SD},{layer:'L2_TYPED_SCIENTIFIC_RELATION_GRAPH',authority:RD,visibleRelationIds:clone(d.visibleRelationIds)},{layer:'L3_GOVERNED_ESTATE_PROJECTION_GRAPH',authority:PD,destination:f.orientationAnchor.destination},{layer:'L4_RECURSIVE_SPATIAL_INFORMATION_INTERPRETER',authority:INTERPRETER_ID,contextFrameId:f.contextFrameId},{layer:'L5_NAVIGATION_STATE',authority:NAVIGATION_ID,navigationStateId:n.navigationStateId},{layer:'L6_CONTEXT_BOUND_RELATION_DISCLOSURE',authority:ID,disclosureStateId:d.disclosureStateId,sourceRecordDigests:d.disclosedRelations.map(x=>x.sourceRecordDigest)}];return{forward,reverse:[...forward].reverse(),scientificStateDigestInvariant:true,relationGraphDigestInvariant:true,projectionGraphDigestInvariant:true,presentationRuntimeConstructed:false,spatialTransformationConstructed:false,visibleReconstruction:false}}
export function invariant(states){if(states.some(d=>d.sourceScientificStateDigest!==SD||d.sourceRelationGraphDigest!==RD||d.sourceProjectionGraphDigest!==PD))fail('SCIENTIFIC_STATE_MUTATION_ATTEMPT','authority drift');return true}
