import crypto from 'node:crypto';
import {serializeCanonical} from '../f3-resolution-and-validity-engine/resolver.v1.mjs';
import {validateCameraRequest} from '../f8-spatial-xyz-semantic-layer/scene-projector.v1.mjs';
import {
  assembleIntegratedEnvironment,
  openIntegratedEntry,
  performIntegratedInteraction,
  createIntegratedDeepLink,
  restoreIntegratedDeepLink,
  attemptSpatialActivation,
  checkScientificRelation,
  checkEstateProjection
} from '../f9-integrated-environment-assembly/integrated-environment-runtime.v1.mjs';

const clone=value=>structuredClone(value);
const normalize=value=>Array.isArray(value)?value.map(normalize):(value!==null&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(k=>[k,normalize(value[k])])):value);
const stable=value=>JSON.stringify(normalize(value));
const sha256=text=>crypto.createHash('sha256').update(text,'utf8').digest('hex');
const b64url=text=>Buffer.from(text,'utf8').toString('base64url');
const action=(controlId,modality='KEYBOARD',payload={})=>({schema:'METHODS_MODELS_INTERACTION_ACTION_v1',kind:'ACTIVATE',modality,controlId,payload});
const focus=()=>({schema:'METHODS_MODELS_INTERACTION_ACTION_v1',kind:'FOCUS',modality:'KEYBOARD',controlId:'FOCUS_TARGET',payload:{}});
const axis=(session,id)=>session.interactionSession.state.axes[id];
const assert=(condition,message)=>{if(!condition) throw new Error(message);};
const record=(results,id,passed,detail)=>{results.push({id,passed,detail});assert(passed,`ATTACK_NOT_REJECTED:${id}:${detail}`);};

function internallyConsistentUnauthorizedUrl(session){
  const forged=clone(session.interactionSession.state);
  forged.axes.CLAIM_CEILING.value.ceilingId='F10_FORGED_PROMOTED_CLAIM';
  const serialized=serializeCanonical(forged);
  if(serialized.resolutionClass==='INVALID') throw new Error(`FORGED_STATE_COULD_NOT_BE_CANONICALIZED:${serialized.errors}`);
  const capsule={
    schema:'METHODS_MODELS_NAVIGATION_CAPSULE_v1',
    codecVersion:'MMNAV1',
    entryPointId:session.entryPointId,
    stateSha256:serialized.sha256,
    stateBytesB64Url:b64url(serialized.bytes),
    returnContext:null
  };
  const canonical=JSON.stringify(capsule);
  return `/laws/research/methods-and-models/#mmnav1.${b64url(canonical)}.${sha256(canonical)}`;
}

export function executeAdversarialGauntlet(){
  const environment=assembleIntegratedEnvironment();
  const results=[];
  const opened=openIntegratedEntry('BIO_LAB','D0',environment);
  assert(opened.valid,'BIO_LAB_ATTACK_FIXTURE_UNAVAILABLE');

  const claim=clone(opened.session);
  claim.interactionSession.state.axes.CLAIM_CEILING.value.ceilingId='F10_PROMOTED_CLAIM';
  record(results,'CLAIM_PROMOTION',!performIntegratedInteraction(claim,focus(),environment).valid,'tampered claim ceiling must fail revalidation');

  const evidence=clone(opened.session);
  evidence.interactionSession.state.axes.EVIDENCE.value={forgedEvidenceStanding:'SUPPORTED'};
  record(results,'EVIDENCE_RELABELING',!performIntegratedInteraction(evidence,focus(),environment).valid,'tampered evidence axis must fail revalidation');

  const objectMutation=clone(opened.session);
  objectMutation.interactionSession.state.axes.SCIENTIFIC_OBJECT.value.objectId='F10_INVENTED_OBJECT';
  record(results,'SCIENTIFIC_OBJECT_MUTATION',!performIntegratedInteraction(objectMutation,focus(),environment).valid,'object identity mutation must fail revalidation');

  let nonStatefulRejected=0;
  for(const id of environment.registries.nonStatefulPortfolioIds){
    const ordinary=openIntegratedEntry(id,'D0',environment);
    if(!ordinary.valid) nonStatefulRejected++;
  }
  record(results,'UNAUTHORIZED_STUDY_PROMOTION',nonStatefulRejected===environment.registries.nonStatefulPortfolioIds.length,`${nonStatefulRejected}/${environment.registries.nonStatefulPortfolioIds.length} non-stateful studies rejected`);

  const fabricatedRelation={relationId:'F10_FABRICATED_RELATION',studyId:'BIO_LAB',claimId:'UCIC_CLAIM_EMPIRICAL_UNIVERSALITY',type:'INFERRED_FROM_PROXIMITY',direction:'SUPPORTING',standing:'F10_FORGED'};
  record(results,'RELATION_FABRICATION',checkScientificRelation(fabricatedRelation)===false,'undeclared relation authority rejected');

  record(results,'PROJECTION_DRIFT',checkEstateProjection('UCIC_CLAIM_GENERAL_BANK_COLLAPSE_EARLY_WARNING','APPLICATIONS')===false,'undeclared claim/destination projection rejected');

  const selfConsistent=internallyConsistentUnauthorizedUrl(opened.session);
  const selfConsistentResult=restoreIntegratedDeepLink(selfConsistent,environment);
  record(results,'SELF_CONSISTENT_UNAUTHORIZED_DEEP_LINK',!selfConsistentResult.valid,'cryptographically self-consistent but unauthorized state rejected');

  const validLink=createIntegratedDeepLink(opened.session,environment);
  const last=validLink.slice(-1);
  const digestTampered=validLink.slice(0,-1)+(last==='0'?'1':'0');
  record(results,'URL_DIGEST_TAMPERING',!restoreIntegratedDeepLink(digestTampered,environment).valid,'fragment digest tampering rejected');

  const modalities=['POINTER','KEYBOARD','TOUCH','ASSISTIVE_TECHNOLOGY'];
  const modalityResults=modalities.map(m=>performIntegratedInteraction(opened.session,action('DEPTH_D2',m),environment));
  const modalitySignature=r=>r.valid?stable({state:r.session.interactionSession.scientificStateSha256,binding:r.session.interactionSession.scientificBindingSha256,depth:r.session.interactionSession.activeDepth,output:r.output}):'INVALID';
  record(results,'MODALITY_DIVERGENCE',modalityResults.every(r=>r.valid)&&modalityResults.slice(1).every(r=>modalitySignature(r)===modalitySignature(modalityResults[0])),'all registered modalities produce the same semantic operation');

  const depthTamper=clone(opened.session);
  depthTamper.interactionSession.activeDepth='D4';
  record(results,'SILENT_DEPTH_ESCALATION',!performIntegratedInteraction(depthTamper,focus(),environment).valid,'carried depth tamper rejected before harmless focus can legitimize it');

  const routed=performIntegratedInteraction(opened.session,action('NAVIGATE_ROUTE','KEYBOARD',{routeId:'F10_ADVERSARIAL_ROUTE'}),environment);
  const routeOnly=routed.valid&&stable(routed.output.changedAxes)===stable(['ROUTE_HISTORY'])&&axis(routed.session,'SCIENTIFIC_OBJECT').value.objectId==='BIO_LAB'&&stable(axis(routed.session,'CLAIM_CEILING'))===stable(axis(opened.session,'CLAIM_CEILING'));
  record(results,'SCIENTIFIC_MUTATION_THROUGH_NAVIGATION',routeOnly,'navigation changes ROUTE_HISTORY only and preserves object/claim');

  record(results,'VISUAL_SEMANTIC_INFERENCE',attemptSpatialActivation('STUDY:BIO_LAB',environment).valid===false,'spatial node cannot activate or create authority');

  record(results,'USER_CONTROLLED_CAMERA',validateCameraRequest({mode:'USER_CONTROLLED',position:[0,0,0],target:[1,1,1]})===false,'user-controlled camera contract rejected');

  const envDigest=clone(opened.session);
  envDigest.environmentScienceDigest='0'.repeat(64);
  record(results,'SESSION_ENVIRONMENT_DIGEST_DRIFT',!performIntegratedInteraction(envDigest,focus(),environment).valid,'environment science digest disagreement rejected');

  const sceneDigest=clone(opened.session);
  sceneDigest.sceneScienceDigest='0'.repeat(64);
  record(results,'SESSION_SCENE_DIGEST_DRIFT',!performIntegratedInteraction(sceneDigest,focus(),environment).valid,'scene science digest disagreement rejected');

  for(const edge of environment.scene.edges.filter(e=>e.edgeKind==='SCIENTIFIC_RELATION_EDGE')){
    assert(checkScientificRelation({relationId:edge.relationId,studyId:edge.source.slice('STUDY:'.length),claimId:edge.target.slice('CLAIM:'.length),type:edge.relationType,direction:edge.direction,standing:edge.standing}),`AUTHORIZED_RELATION_BROKEN:${edge.id}`);
  }
  for(const edge of environment.scene.edges.filter(e=>e.edgeKind==='GOVERNED_PROJECTION_EDGE')) assert(checkEstateProjection(edge.claimId,edge.destination),`AUTHORIZED_PROJECTION_BROKEN:${edge.id}`);

  return {
    schema:'METHODS_MODELS_F10_ADVERSARIAL_GAUNTLET_RESULT_v1',
    disposition:'PASS_F10_ADVERSARIAL_GAUNTLET_v1',
    environmentScienceDigest:environment.environmentScienceDigest,
    sceneScienceDigest:environment.scene.scienceDigest,
    attackCount:results.length,
    attacksRejectedOrConstrained:results.filter(v=>v.passed).length,
    authorizedScientificRelationsPreserved:true,
    authorizedEstateProjectionsPreserved:true,
    results
  };
}

if(process.argv[1]===new URL(import.meta.url).pathname){
  process.stdout.write(JSON.stringify(executeAdversarialGauntlet(),null,2)+'\n');
}
