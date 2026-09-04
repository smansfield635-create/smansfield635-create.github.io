#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const names=['contract.v1.json','descriptors.v1.js','index.css','index.html','index.js','verify.v1.mjs'];
const results=[];
const check=(condition,id,detail='')=>{results.push({id,pass:Boolean(condition),detail});if(!condition)process.stderr.write(`FAIL ${id}${detail?`: ${detail}`:''}\n`)};
const text=name=>fs.readFileSync(path.join(here,name),'utf8');
const exists=name=>fs.existsSync(path.join(here,name));
const functionBody=(source,name)=>{
  const mark=`function ${name}(`,start=source.indexOf(mark);if(start<0)return'';
  const brace=source.indexOf('{',start);if(brace<0)return'';
  let depth=0,quote=null,escape=false;
  for(let i=brace;i<source.length;i++){
    const ch=source[i];
    if(quote){if(escape){escape=false;continue}if(ch==='\\'){escape=true;continue}if(ch===quote)quote=null;continue}
    if(ch==='"'||ch==="'"||ch==='`'){quote=ch;continue}
    if(ch==='{')depth++;else if(ch==='}'&&--depth===0)return source.slice(brace+1,i);
  }
  return'';
};

for(const name of names)check(exists(name),`FILE_EXISTS_${name}`);
if(!names.every(exists)){process.exitCode=1;process.exit()}

const contract=JSON.parse(text('contract.v1.json'));
const descriptorSource=text('descriptors.v1.js');
const css=text('index.css');
const html=text('index.html');
const js=text('index.js');
const sandbox={globalThis:{},Math,Object};vm.createContext(sandbox);vm.runInContext(descriptorSource,sandbox,{filename:'descriptors.v1.js'});
const D=sandbox.globalThis.DGB_HOLOGRAPHIC_FULL_DESCRIPTORS;

check(contract.schema==='COMPASS_HOLOGRAPHIC_FULL_SUCCESSOR_CONTRACT_v1','CONTRACT_SCHEMA');
check(contract.status==='CONSTRUCTION_CANDIDATE','CONTRACT_STATUS');
check(contract.operation.id==='COMPASS_MAIN_ORIENTATION_HOLOGRAPHIC_SUCCESSOR_P3_P11_CONSTRUCTION_20260904_001','OPERATION_ID');
check(contract.operation.lockGeneration===416,'LOCK_GENERATION');
check(contract.operation.scopeHash==='ba3dea3e0c965c574725018c6dead8452e99f5596ded8e134caec86966f50f41','SCOPE_HASH');
check(contract.operation.requestDigest==='364ba80832aeff95d0d0ce0177418cd57f4f2f4bb09dc5716470bdf9c3fc6568','REQUEST_DIGEST');
check(contract.operation.procedureLocatorDigest==='a1b6943312669264dd90ccf848603c37efcf1f8ec93c6667001073812c10e4b8','PROCEDURE_DIGEST');
check(contract.operation.publicBaseHead==='8ca9f9fcae3e975993f8c50a4c2524cee0de0f1c','PUBLIC_BASE_HEAD');
check(contract.operation.candidateInputHead==='8906782c7b9c2593b9d1937edf5c3a6cc1d473a7','CANDIDATE_INPUT_HEAD');
check(contract.operation.draftPr===2697,'DRAFT_PR');
check(contract.surface.productionMutation===false,'NO_PRODUCTION_MUTATION');
check(contract.surface.mergeAuthorized===false,'NO_MERGE_AUTHORITY');
check(contract.surface.deploymentAuthorized===false,'NO_DEPLOY_AUTHORITY');
check(contract.acquisition.model==='CODE_NATIVE_HOLOGRAPHIC_RECONSTRUCTION','ACQUISITION_MODEL');
check(contract.acquisition.physicalVideoClipsRequired===0,'ZERO_VIDEO_CLIPS');
check(contract.acquisition.imageMediaRequired===0,'ZERO_IMAGE_MEDIA');
check(contract.acquisition.genericProxyRequirement===0,'ZERO_GENERIC_PROXY_REQUIREMENT');
check(contract.acquisition.destinationRuntimeInitialization===0,'ZERO_DESTINATION_RUNTIME_INIT');
check(contract.entryGate.beginDurationMs===4350,'ENTRY_BEGIN_DURATION');
check(contract.entryGate.skipDurationMs===2450,'ENTRY_SKIP_DURATION');
check(contract.entryGate.blankFrameAllowance===0,'ENTRY_BLANK_FRAME_ALLOWANCE');
check(contract.master.durationMs===40600,'MASTER_DURATION');
check(contract.master.durationEnvelopeMs?.[0]===38000,'DURATION_ENVELOPE_MIN');
check(contract.master.durationEnvelopeMs?.[1]===42000,'DURATION_ENVELOPE_MAX');
check(contract.master.requestAnimationFrameAuthorities===1,'MASTER_RAF_AUTHORITY');
check(contract.master.wallClock==='performance.now','MASTER_WALL_CLOCK');
check(contract.timeline.length===11,'TIMELINE_LENGTH');
check(contract.timeline[0]?.startMs===0,'TIMELINE_START_ZERO');
check(contract.timeline.every((p,i)=>i===0||p.startMs===contract.timeline[i-1].endMs),'TIMELINE_CONTIGUOUS');
check(contract.timeline.at(-1)?.endMs===contract.master.durationMs,'TIMELINE_FINAL_END');
check(contract.timeline.map(p=>p.passage).join(',')==='P1,P2,P3,P4,P5,P6,P7,P8,P9,P10,P11','TIMELINE_PASSAGE_ORDER');
check(contract.transitionCauses.length===10,'TRANSITION_CAUSE_COUNT');
check(contract.runtimeInvariants.destinationOwnedGpuContexts===0,'ZERO_DESTINATION_GPU_CONTEXTS');
check(contract.runtimeInvariants.destinationOwnedAnimationSchedulers===0,'ZERO_DESTINATION_SCHEDULERS');
check(contract.runtimeInvariants.cinematicOwnedContextCount===1,'ONE_CINEMATIC_CONTEXT');
check(contract.runtimeInvariants.cinematicOwnedContextClass==='CANVAS_2D','CINEMATIC_CONTEXT_CLASS');
check(contract.runtimeInvariants.fullscreenAnimatedFilter===false,'NO_FULLSCREEN_ANIMATED_FILTER');
check(contract.runtimeInvariants.backdropFilterDuringPlaying===false,'NO_BACKDROP_FILTER_PLAYING');
check(contract.runtimeInvariants.stableStateFilter==='none','STABLE_FILTER_NONE');
check(contract.runtimeInvariants.canvasDimensionAssignmentInRenderLoop===false,'NO_CANVAS_RESIZE_IN_RENDER_CONTRACT');
check(contract.runtimeInvariants.continuouslyRetargetedCssTransitions===false,'NO_RETARGETED_CSS_TRANSITIONS_CONTRACT');
check(contract.runtimeInvariants.navigationMutation===false,'NO_NAVIGATION_MUTATION');
check(contract.runtimeInvariants.historyMutation===false,'NO_HISTORY_MUTATION');
check(contract.runtimeInvariants.analyticsMutation===false,'NO_ANALYTICS_MUTATION');
check(contract.runtimeInvariants.durableApplicationStateMutation===false,'NO_DURABLE_STATE_MUTATION');
check(contract.runtimeInvariants.onlyFinalHandoffMayOverlapLiveHomepageCompass===true,'FINAL_HANDOFF_ONLY_OVERLAP');
check(contract.sourceBindings.length===13,'SOURCE_BINDING_COUNT');
check(contract.sourceBindings.every(x=>/^[0-9a-f]{40}$/.test(x.blob)),'SOURCE_BLOBS_HEX40');
check(new Set(contract.sourceBindings.map(x=>x.passage)).size===13,'SOURCE_BINDING_PASSAGE_IDENTITIES');

const expected={
 P1:'93a9fc9989b53ef75319dc1af0206ebc6a2b537c',P2:'fe35d8d844859a6af810684ace53d2c65258522f',P3:'ac955931681b46e39706d298f4f83d4cf50a50c5',P4:'06a82735deec6e577b71cf47b2d7246a9d853f0f',P5:'bef36f101c15fe949b89dd6ecea6117cd471680e',P6:'325b9486d0ab2136d425aed9468c22c28c67a57b',P7A:'a82e3c963a10808b9f8f1922faab45155ea4a62b',P7B:'fb3ee8ab92fa4b08e7708b83780de75d1a6f8595',P7C:'fe909379190431baaf825df1b776ec1d66c305f2',P8:'7875a6a220fa44da24fe2ad805bb1e146440b5d6',P9:'872d20b17bb0cd89d9613ca0262b25350890a617',P10:'d281e18b06128671ffe2a19e8fdb272cc5544e31',P11:'fe35d8d844859a6af810684ace53d2c65258522f'
};
for(const [passage,blob] of Object.entries(expected))check(contract.sourceBindings.find(x=>x.passage===passage)?.blob===blob,`SOURCE_${passage}_EXACT_BLOB`);

check(D?.schema==='COMPASS_HOLOGRAPHIC_DESCRIPTOR_MANIFEST_v1','DESCRIPTOR_SCHEMA');
check(D?.publicBaseHead==='8ca9f9fcae3e975993f8c50a4c2524cee0de0f1c','DESCRIPTOR_BASE_HEAD');
check(D?.masterDurationMs===40600,'DESCRIPTOR_MASTER_DURATION');
check(Array.isArray(D?.timeline)&&D.timeline.length===11,'DESCRIPTOR_TIMELINE_LENGTH');
check(html.includes('/assets/compass/upstream-compass.geometry.js'),'HTML_COMPASS_GEOMETRY_SOURCE');
check(html.includes('/assets/shared/mirrorland-window.geometry.js'),'HTML_WINDOW_GEOMETRY_SOURCE');
check(html.indexOf('./descriptors.v1.js')<html.indexOf('./index.js'),'HTML_DESCRIPTOR_LOAD_ORDER');
check(!/<(?:img|video|source)\b/i.test(html),'HTML_NO_IMAGE_VIDEO_MEDIA');
check(!/backdrop-filter\s*:/i.test(css),'CSS_NO_BACKDROP_FILTER');
check(!/(^|[;{]\s*)filter\s*:/im.test(css),'CSS_NO_FILTER_PROPERTY');
check(!/transition\s*:/i.test(css),'CSS_NO_TRANSITIONS');
check((js.match(/requestAnimationFrame\s*\(/g)||[]).length===1,'JS_ONE_RAF_CALL_SITE');
check(!/getContext\s*\(\s*["']webgl2?["']/i.test(js)&&!/\bimport\s*\(/.test(js),'JS_NO_DESTINATION_WEBGL_OR_DYNAMIC_IMPORT');
const resizeBody=functionBody(js,'resizeCanvas'),frameBody=functionBody(js,'frame');
check(/canvas\.width\s*=/.test(resizeBody)&&/canvas\.height\s*=/.test(resizeBody)&&!/canvas\.(?:width|height)\s*=/.test(frameBody),'JS_CANVAS_DIMENSIONS_RESIZE_ONLY');
check(js.includes('(prefers-reduced-motion: reduce)')&&js.includes('destinationGpuContexts:0')&&js.includes('destinationOwnedSchedulers:0'),'JS_REDUCED_MOTION_AND_RESOURCE_RECEIPT');

// Source-identity parity gates. These make a PASS assert actual cinematic extraction,
// not merely the presence of a correct source pathname/blob in the manifest.
check(D?.diagnostic?.productIdentity==='COHERISCOPE','PARITY_COHERISCOPE_PRODUCT_IDENTITY');
check(D?.diagnostic?.continuity==='P5_ASSESSMENT_TO_P6_INSTRUMENT','PARITY_COHERISCOPE_TWO_BEAT_CONTINUITY');
check(D?.timeline?.[4]?.label==='COHERISCOPE · ASSESSMENT'&&D?.timeline?.[5]?.label==='COHERISCOPE · INSTRUMENT','PARITY_COHERISCOPE_TIMELINE_GRAMMAR');
check(D?.brain?.projection==='CANONICAL_PARAMETRIC_MESH_FRONT_PROJECTION'&&D?.brain?.rows===34&&D?.brain?.cols===54,'PARITY_BRAIN_CANONICAL_MESH_RESOLUTION');
check(Array.isArray(D?.brain?.components)&&D.brain.components.join(',')==='LEFT_HEMISPHERE,RIGHT_HEMISPHERE,LONGITUDINAL_FISSURE,CEREBELLUM,PONS,BRAINSTEM','PARITY_BRAIN_COMPONENT_COVERAGE');
check(D?.windowFallback?.paneCount===21&&Array.isArray(D?.windowFallback?.panes)&&D.windowFallback.panes.length===21,'PARITY_WINDOW_21_PANE_DESCRIPTOR');
const drawWindowBody=functionBody(js,'drawWindow'),drawBrainBody=functionBody(js,'drawBrain'),drawHouseBody=functionBody(js,'drawHouse'),drawAudraliaBody=functionBody(js,'drawAudralia'),drawTrophyBody=functionBody(js,'drawTrophy');
check(/getPanes/.test(drawWindowBody)&&/createPanes/.test(drawWindowBody)&&/source\.length!==21/.test(drawWindowBody),'PARITY_WINDOW_CANONICAL_API_AND_COUNT_GUARD');
check(/traceOuterWindow/.test(drawWindowBody),'PARITY_WINDOW_CANONICAL_FRAME_PATH');
check(js.includes('function canonicalBrainPoint')&&/D\.brain\.rows/.test(drawBrainBody)&&/D\.brain\.cols/.test(drawBrainBody),'PARITY_BRAIN_PARAMETRIC_PROJECTION_USED');
check(D?.house?.projection==='CANONICAL_IDENTITY_FRONT_ELEVATION'&&D?.house?.identity?.length===7,'PARITY_HOUSE_IDENTITY_DESCRIPTOR');
check(js.includes('function pointedArch')&&/towerCenters/.test(drawHouseBody)&&/dormerCenters/.test(drawHouseBody)&&/courtRadius/.test(drawHouseBody),'PARITY_HOUSE_FEATURE_PROJECTION');
check(Math.abs(D?.audralia?.continentLinearScale-Math.sqrt(.70))<1e-12,'PARITY_AUDRALIA_CANONICAL_SCALE');
check(D?.audralia?.greatLakeAnchors?.length===19&&D?.audralia?.inletIslandAnchors?.length===2&&D?.audralia?.offshoreIslandAnchors?.length===3,'PARITY_AUDRALIA_MAJOR_GEOGRAPHY');
check(js.includes('function scaledAudraliaPoint')&&/greatLakeAnchors/.test(drawAudraliaBody)&&/inletIslandAnchors/.test(drawAudraliaBody)&&/offshoreIslandAnchors/.test(drawAudraliaBody),'PARITY_AUDRALIA_RESOLVED_GEOGRAPHY_RENDER');
check(Array.isArray(D?.trophy?.neckCollar)&&Array.isArray(D?.trophy?.footUpper)&&Array.isArray(D?.trophy?.footLower)&&D?.trophy?.plinth?.nameplate==='DIAMOND GATE BRIDGE · AWARDS TARGET','PARITY_TROPHY_COMPONENT_DESCRIPTOR');
check(/shoulder/.test(drawTrophyBody)&&/rim/.test(drawTrophyBody)&&/neckCollar/.test(drawTrophyBody)&&/footUpper/.test(drawTrophyBody)&&/footLower/.test(drawTrophyBody)&&/plinth/.test(drawTrophyBody),'PARITY_TROPHY_FULL_PROFILE_RENDER');
check(js.includes('sourceIdentityParity:Object.freeze')&&js.includes('mirrorlandCanonicalPaneCount:21'),'PARITY_RUNTIME_RECEIPT');
check(/progress>\.68/.test(functionBody(js,'drawDiagnostic'))&&/drawBrain/.test(functionBody(js,'drawDiagnostic')),'PARITY_COHERISCOPE_ASSESSMENT_TO_BRAIN_VISUAL_HANDOFF');

const passCount=results.filter(x=>x.pass).length,failCount=results.length-passCount;
const receipt={schema:'COMPASS_HOLOGRAPHIC_FULL_SUCCESSOR_STATIC_VERIFICATION_RECEIPT_v1',result:failCount===0?'PASS_CLOSED':'FAIL_CLOSED',sourceIdentityParity:failCount===0,testCount:results.length,passCount,failCount,operationId:contract.operation.id,publicBaseHead:contract.operation.publicBaseHead,lockGeneration:contract.operation.lockGeneration,results};
if(results.length!==101){receipt.result='FAIL_CLOSED';receipt.sourceIdentityParity=false;receipt.countError=`EXPECTED_101_ASSERTIONS_GOT_${results.length}`;process.stderr.write(`${receipt.countError}\n`)}
process.stdout.write(`${JSON.stringify(receipt,null,2)}\n`);
if(receipt.result!=='PASS_CLOSED')process.exitCode=1;
