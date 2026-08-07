import fs from 'node:fs';
import path from 'node:path';
const here=path.dirname(new URL(import.meta.url).pathname);
const src=JSON.parse(fs.readFileSync(path.join(here,'f4-successor-binding-inputs.v1.json'),'utf8'));
const A='PRE_F8_CORRECTIVE_CONSTRUCTION_SOURCE_BOUND_AUGMENTATION';
const NA=(ref)=>({status:'NOT_APPLICABLE',authorityRef:A,sourceRef:ref,value:null});
const UNSET=(ref)=>({status:'UNSET',authorityRef:A,sourceRef:ref,value:null});
export function materialize(o){
 const ref=`PRE_F8_SOURCE_${o.contentId}`;
 return {bindingId:`${o.contentId}_PRE_F8_F4_STATE_BINDING_v1`,contentId:o.contentId,expectedResolutionClass:'PARTIAL',state:{schema:'METHODS_MODELS_CANONICAL_ENVIRONMENT_STATE_v1',kernelVersion:'TEXT_FIRST_STATEFUL_METHODS_MODELS_CANONICAL_STATE_v1',axes:{
 SYSTEM:UNSET(ref),
 SCIENTIFIC_OBJECT:{status:'DECLARED',authorityRef:A,sourceRef:ref,value:{objectClass:o.objectClass,objectId:o.contentId}},
 MODEL:UNSET(ref),
 METHOD_STAGE:NA('PRE_F8_STUDY_SUMMARY_ENTRY'),
 EVIDENCE:{status:'DECLARED',authorityRef:A,sourceRef:ref,value:{evidenceObjectId:`${o.contentId}_RESULT`,evidenceStatus:o.evidenceStatus,classification:o.classification,disposition:o.disposition,independenceStatus:o.independenceStatus,contaminationStatus:o.contaminationStatus}},
 EXECUTION:{status:'DECLARED',authorityRef:A,sourceRef:ref,value:{executionId:o.executionId,executionStatus:o.executionStatus,scientificResultStatus:o.evidenceStatus}},
 CUSTODY:NA('PRE_F8_SOURCE_BOUND_CUSTODY_RETAINED_IN_PROVENANCE'),
 CLAIM_CEILING:{status:'DECLARED',authorityRef:A,sourceRef:ref,value:{ceilingId:o.claimCeiling,scopeRef:o.executionId,prohibitions:o.prohibitions}},
 SUPPORT_MODE:NA('PRE_F8_NO_SUPPORT_MODE_INFERENCE'),
 LENS:NA('F4_NO_PRESENTATION_BINDING'),
 VIEW_MODE:NA('F4_NO_PRESENTATION_BINDING'),
 ROUTE_HISTORY:NA('F5_RESERVED_NAVIGATION'),
 CONTENT_VERSION:{status:'DECLARED',authorityRef:'VERSIONED_CONTENT_AUTHORITY_ONLY',sourceRef:ref,value:{contentVersionId:`${o.contentId}_PRE_F8_BOUND_v1`,contentFingerprint:o.fingerprint}}
 }}};
}
export const bindings=src.objects.map(materialize);
if(import.meta.url===`file://${process.argv[1]}`) process.stdout.write(JSON.stringify({schema:'METHODS_MODELS_PRE_F8_F4_SUCCESSOR_STATE_BINDINGS_v1',bindings},null,2));
