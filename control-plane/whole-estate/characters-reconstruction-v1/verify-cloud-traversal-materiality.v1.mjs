import fs from 'node:fs';
import crypto from 'node:crypto';
import {CLOUD_TRAVEL_STATES} from '../../../characters/cloud-traversal.mjs';
import {CLOUD_PRESENTATION_BY_STATE, buildCloudBankLayout, resolveCloudPresentation} from '../../../characters/cloud-system.mjs';

const CONTRACT_PATH='control-plane/whole-estate/characters-reconstruction-v1/cloud-traversal-materiality-contract.v1.json';
const APP_PATH='characters/app.mjs';
const TRAVEL_PATH='characters/cloud-traversal.mjs';
const SYSTEM_PATH='characters/cloud-system.mjs';
const contract=JSON.parse(fs.readFileSync(CONTRACT_PATH,'utf8'));
const app=fs.readFileSync(APP_PATH,'utf8');
const travel=fs.readFileSync(TRAVEL_PATH,'utf8');
const system=fs.readFileSync(SYSTEM_PATH,'utf8');
const checks=[];
const check=(id,condition,detail={})=>{checks.push({id,result:condition?'PASS':'FAIL',...detail});if(!condition)throw new Error(`${id}:${JSON.stringify(detail)}`);};

check('EXISTING_STATE_AUTHORITY_PRESERVED',JSON.stringify(CLOUD_TRAVEL_STATES)===JSON.stringify(contract.states),{states:CLOUD_TRAVEL_STATES});
check('STATE_PUBLICATION_CONTRACT_PRESENT',travel.includes('CLOUD_TRAVEL_STATES')&&contract.statePublication==='document.documentElement.dataset.cloudTravel');
check('DIRECT_SIGNAL_STATE_BINDING_PRESENT',travel.includes(".signal[data-id]")&&travel.includes('begin({destinationId:'),{});

const desktop=buildCloudBankLayout({compact:false});
const mobile=buildCloudBankLayout({compact:true});
const countPuffs=banks=>banks.reduce((n,b)=>n+b.puffs.length,0);
check('NORMAL_VIEW_CLOUD_GEOMETRY_PRESENT',desktop.length>=contract.presentation.minimumDesktopBanks&&mobile.length>=contract.presentation.minimumMobileBanks,{desktopBanks:desktop.length,mobileBanks:mobile.length});
check('CLOUD_PUFF_BUDGET_PRESENT',countPuffs(desktop)>=contract.presentation.minimumDesktopPuffs&&countPuffs(mobile)>=contract.presentation.minimumMobilePuffs,{desktopPuffs:countPuffs(desktop),mobilePuffs:countPuffs(mobile)});

for(const state of contract.states){
  const actual=CLOUD_PRESENTATION_BY_STATE[state];
  const frozen=contract.presentation.stateProfiles[state];
  check(`PROFILE_${state}_EXACT`,actual&&Object.entries(frozen).every(([k,v])=>actual[k]===v),{actual,frozen});
}
const orbit=resolveCloudPresentation('ORBIT',{reducedMotion:false,compact:false});
const entry=resolveCloudPresentation('CLOUD_ENTRY',{reducedMotion:false,compact:false});
const transit=resolveCloudPresentation('CLOUD_TRANSIT',{reducedMotion:false,compact:false});
const descent=resolveCloudPresentation('DESCENT',{reducedMotion:false,compact:false});
const arrival=resolveCloudPresentation('ARRIVAL',{reducedMotion:false,compact:false});
check('ASCENT_ENTRY_TRANSIT_DESCENT_ARRIVAL_VISUAL_RESPONSE',entry.opacity>orbit.opacity&&transit.opacity>entry.opacity&&descent.opacity<transit.opacity&&arrival.opacity<descent.opacity,{orbit,entry,transit,descent,arrival});
check('CLOUD_TRANSIT_LONG_RANGE_OCCLUSION',transit.opticalDepth>=.75&&transit.opticalDepth>orbit.opticalDepth*4&&transit.veil>=.6,{orbitDepth:orbit.opticalDepth,transitDepth:transit.opticalDepth,transitVeil:transit.veil});
check('DESCENT_ARRIVAL_CLEAR_OCCLUSION',descent.opticalDepth<transit.opticalDepth&&arrival.veil===0&&arrival.opticalDepth<=orbit.opticalDepth,{descent,arrival});
const rmTransit=resolveCloudPresentation('CLOUD_TRANSIT',{reducedMotion:true,compact:false});
const rmArrival=resolveCloudPresentation('ARRIVAL',{reducedMotion:true,compact:false});
check('REDUCED_MOTION_SEMANTIC_EQUIVALENT',rmTransit.drift===0&&rmTransit.opticalDepth>=.75&&rmArrival.veil===0,{rmTransit,rmArrival});

check('APP_RUNTIME_INTEGRATION',app.includes("from './cloud-system.mjs'")&&app.includes('createCloudSystem')&&app.includes('cloudSystem.draw'),{});
check('STATE_RESPONSIVE_RENDERER',system.includes('dataset.cloudTravel')||app.includes('dataset.cloudTravel'),{});
check('WEBGL_GEOMETRY_AND_VEIL_PRESENT',system.includes('gl.drawArrays')&&system.includes('VEIL_VS')&&system.includes('VEIL_FS'),{});
check('OVERLAY_NOT_SOLE_CLOUD_PROOF',contract.presentation.overlayIsSupplementOnly===true&&system.includes('gl.drawArrays'),{});
check('NO_FOREST_MUTATION_DECLARED',contract.protectedPaths.includes('characters/forest-system.mjs'),{});
check('NO_SEQUENCE_4_PLUS_MUTATION',contract.sequence4PlusMutationAllowed===false,{});

const digest=crypto.createHash('sha256').update(fs.readFileSync(SYSTEM_PATH)).update(fs.readFileSync(CONTRACT_PATH)).digest('hex');
const receipt={schema:'MIRRORLAND_CLOUD_TRAVERSAL_MATERIALITY_RECEIPT_v1',result:'PASS_CLOSED',operationId:contract.operationId,governingHead:contract.governingHead,desktopBanks:desktop.length,mobileBanks:mobile.length,desktopPuffs:countPuffs(desktop),mobilePuffs:countPuffs(mobile),transitOpticalDepth:transit.opticalDepth,arrivalOpticalDepth:arrival.opticalDepth,cloudSystemDigest:digest,checks};
fs.writeFileSync('cloud-traversal-materiality-receipt.json',JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt,null,2));
