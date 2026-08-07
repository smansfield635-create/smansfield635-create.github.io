import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {buildIntegratedRegistries} from './registry-assembly.v1.mjs';
import {
  buildInteractionContext,
  createInteractionSession,
  performInteraction,
  adaptViewport
} from '../f7-interaction-and-accessibility/interaction-engine.v1.mjs';
import {
  encodeDeepLink,
  decodeDeepLink,
  validateAuthorizedState
} from '../f5-navigation-and-continuity/navigator.v1.mjs';
import {
  projectScene,
  authorizeScientificRelation,
  authorizeProjection,
  validateCameraRequest
} from '../f8-spatial-xyz-semantic-layer/scene-projector.v1.mjs';

export const ENVIRONMENT_SCHEMA='METHODS_MODELS_F9_INTEGRATED_ENVIRONMENT_v1';
export const ENVIRONMENT_SESSION_SCHEMA='METHODS_MODELS_F9_INTEGRATED_ENVIRONMENT_SESSION_v1';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.dirname(here);
const read=(dir,file)=>JSON.parse(fs.readFileSync(path.join(root,dir,file),'utf8'));
const clone=value=>structuredClone(value);
const digest=value=>crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
const sorted=a=>[...a].sort((x,y)=>String(x).localeCompare(String(y)));

function buildContext(registries){
  return buildInteractionContext({
    entrypointRegistry:registries.entrypointRegistry,
    stateBindings:registries.stateBindings,
    empiricalRegistry:registries.empiricalRegistry,
    depthProfileRegistry:registries.depthProfileRegistry,
    controlRegistry:read('f7-interaction-and-accessibility','semantic-control-registry.v1.json'),
    modalityRegistry:read('f7-interaction-and-accessibility','modality-registry.v1.json')
  });
}

function environmentIdentity(registries,scene){
  return {
    statefulEntryIds:sorted(registries.statefulEntryIds),
    nonStatefulPortfolioIds:sorted(registries.nonStatefulPortfolioIds),
    sceneScienceDigest:scene.scienceDigest,
    relationIds:sorted(registries.relations.map(v=>v.relationId)),
    portfolioStudyIds:sorted(registries.studies.map(v=>v.studyId))
  };
}

export function assembleIntegratedEnvironment(){
  const registries=buildIntegratedRegistries();
  const interactionContext=buildContext(registries);
  const scene=projectScene();
  if(scene.schema!=='METHODS_MODELS_F8_SEMANTIC_SCENE_v1') throw new Error('F8_SCENE_SCHEMA_MISMATCH');
  if(scene.counts.studies!==22||scene.counts.claims!==19||scene.counts.typedRelations!==38) throw new Error('F8_SCENE_COUNT_MISMATCH');
  if(registries.statefulEntryIds.length!==16) throw new Error('STATEFUL_ENTRY_COUNT_MISMATCH');
  const studyNodeIds=new Set(scene.nodes.filter(v=>v.nodeKind==='STUDY_OBJECT_NODE').map(v=>v.canonicalId));
  for(const id of registries.statefulEntryIds) if(!studyNodeIds.has(id)) throw new Error(`STATEFUL_ENTRY_SCENE_NODE_MISSING:${id}`);
  for(const id of registries.nonStatefulPortfolioIds) if(!studyNodeIds.has(id)) throw new Error(`NON_STATEFUL_PORTFOLIO_SCENE_NODE_MISSING:${id}`);
  if(registries.nonStatefulPortfolioIds.length!==6) throw new Error('NON_STATEFUL_PORTFOLIO_COUNT_MISMATCH');
  if(!validateCameraRequest(scene.camera)) throw new Error('F8_CAMERA_AUTHORITY_INVALID');
  const identity=environmentIdentity(registries,scene);
  return {
    schema:ENVIRONMENT_SCHEMA,
    registries,
    interactionContext,
    scene,
    environmentScienceDigest:digest(identity),
    textFirstComplete:scene.textFirstComplete===true,
    spatialLayerRequiredForScientificInterpretation:scene.spatialLayerRequiredForScientificInterpretation,
    statefulEntryCount:registries.statefulEntryIds.length,
    portfolioStudyCount:registries.studies.length
  };
}

function wrapSession(interactionSession,environment){
  return {
    schema:ENVIRONMENT_SESSION_SCHEMA,
    entryPointId:interactionSession.entryPointId,
    interactionSession:clone(interactionSession),
    environmentScienceDigest:environment.environmentScienceDigest,
    sceneScienceDigest:environment.scene.scienceDigest,
    scenePresentationDigest:environment.scene.presentationDigest,
    textFirstComplete:environment.textFirstComplete
  };
}

function validateEnvironmentSession(session,environment){
  if(!session||session.schema!==ENVIRONMENT_SESSION_SCHEMA) throw new Error('ENVIRONMENT_SESSION_INVALID');
  if(session.environmentScienceDigest!==environment.environmentScienceDigest) throw new Error('ENVIRONMENT_SCIENCE_DIGEST_MISMATCH');
  if(session.sceneScienceDigest!==environment.scene.scienceDigest) throw new Error('SCENE_SCIENCE_DIGEST_MISMATCH');
  if(session.scenePresentationDigest!==environment.scene.presentationDigest) throw new Error('SCENE_PRESENTATION_DIGEST_MISMATCH');
  if(!environment.registries.statefulEntryIds.includes(session.entryPointId)) throw new Error('SESSION_ENTRY_NOT_STATEFUL');
  if(session.interactionSession.entryPointId!==session.entryPointId) throw new Error('SESSION_ENTRY_IDENTITY_MISMATCH');
  const checked=adaptViewport(session.interactionSession,session.interactionSession.viewportClass,environment.interactionContext);
  if(!checked.valid) throw new Error(`SESSION_REVALIDATION_FAILED:${checked.errors.join('|')}`);
  return true;
}

export function openIntegratedEntry(entryPointId,depth='D0',environment=assembleIntegratedEnvironment()){
  if(!environment.registries.statefulEntryIds.includes(entryPointId)) return {valid:false,errors:['ENTRYPOINT_NOT_STATEFUL_OR_NOT_REGISTERED'],session:null};
  const opened=createInteractionSession(entryPointId,environment.interactionContext,depth);
  if(!opened.valid) return {valid:false,errors:opened.errors,session:null};
  const session=wrapSession(opened.session,environment);
  validateEnvironmentSession(session,environment);
  return {valid:true,errors:[],session};
}

export function performIntegratedInteraction(session,action,environment=assembleIntegratedEnvironment()){
  try{
    validateEnvironmentSession(session,environment);
    const result=performInteraction(session.interactionSession,action,environment.interactionContext);
    if(!result.valid) return {valid:false,errors:result.errors,session:clone(session),output:null,recovery:result.recovery};
    const next=wrapSession(result.session,environment);
    validateEnvironmentSession(next,environment);
    return {valid:true,errors:[],session:next,output:result.output};
  }catch(error){
    return {valid:false,errors:[error.message],session:clone(session),output:null};
  }
}

export function adaptIntegratedViewport(session,viewportClass,environment=assembleIntegratedEnvironment()){
  try{
    validateEnvironmentSession(session,environment);
    const result=adaptViewport(session.interactionSession,viewportClass,environment.interactionContext);
    if(!result.valid) return {valid:false,errors:result.errors,session:clone(session),output:null,recovery:result.recovery};
    const next=wrapSession(result.session,environment);
    validateEnvironmentSession(next,environment);
    return {valid:true,errors:[],session:next,output:result.output};
  }catch(error){
    return {valid:false,errors:[error.message],session:clone(session),output:null};
  }
}

export function createIntegratedDeepLink(session,environment=assembleIntegratedEnvironment()){
  validateEnvironmentSession(session,environment);
  return encodeDeepLink(session.interactionSession.state,session.entryPointId,environment.interactionContext.authorityRegistry);
}

export function restoreIntegratedDeepLink(url,environment=assembleIntegratedEnvironment()){
  const decoded=decodeDeepLink(url,environment.interactionContext.authorityRegistry);
  if(!decoded.valid) return {valid:false,errors:decoded.errors,session:null};
  const base=createInteractionSession(decoded.entryPointId,environment.interactionContext,'D0');
  if(!base.valid) return {valid:false,errors:base.errors,session:null};
  const authorized=validateAuthorizedState(decoded.state,decoded.entryPointId,environment.interactionContext.authorityRegistry);
  if(!authorized.valid) return {valid:false,errors:authorized.errors,session:null};
  base.session.state=authorized.state;
  base.session.scientificStateSha256=authorized.sha256;
  const session=wrapSession(base.session,environment);
  try{
    validateEnvironmentSession(session,environment);
    return {valid:true,errors:[],session};
  }catch(error){
    return {valid:false,errors:[error.message],session:null};
  }
}

export function inspectSpatialNode(nodeId,environment=assembleIntegratedEnvironment()){
  const matches=environment.scene.nodes.filter(v=>v.id===nodeId);
  if(matches.length!==1) return {valid:false,errors:[matches.length===0?'SPATIAL_NODE_NO_MATCH':'SPATIAL_NODE_AMBIGUOUS'],record:null};
  const node=matches[0];
  const incident=environment.scene.edges.filter(e=>e.source===node.id||e.target===node.id);
  return {
    valid:true,
    errors:[],
    record:{node:clone(node),incidentEdges:clone(incident),statefulEntryAvailable:environment.registries.statefulEntryIds.includes(node.canonicalId),activated:false}
  };
}

export function attemptSpatialActivation(nodeId,environment=assembleIntegratedEnvironment()){
  const inspected=inspectSpatialNode(nodeId,environment);
  if(!inspected.valid) return inspected;
  return {valid:false,errors:['SPATIAL_NODE_NONACTIVATING_USE_REGISTERED_F7_CONTROL_OR_DIRECT_F5_ENTRY'],record:inspected.record};
}

export function checkScientificRelation(candidate){
  return authorizeScientificRelation(candidate);
}

export function checkEstateProjection(claimId,destination){
  return authorizeProjection(claimId,destination);
}

if(process.argv[1]===fileURLToPath(import.meta.url)){
  const environment=assembleIntegratedEnvironment();
  process.stdout.write(JSON.stringify({schema:environment.schema,statefulEntryCount:environment.statefulEntryCount,portfolioStudyCount:environment.portfolioStudyCount,environmentScienceDigest:environment.environmentScienceDigest,sceneScienceDigest:environment.scene.scienceDigest,nonStatefulPortfolioIds:environment.registries.nonStatefulPortfolioIds},null,2)+'\n');
}
