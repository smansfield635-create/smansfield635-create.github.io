#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync} from 'node:fs';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const OPERATION_ID='CHARACTERS_ENVIRONMENT_CARDINAL_PROPAGATION_SUCCESSOR_20260911_001';
const GOVERNING_HEAD='81419f69a3491e89185f2999f8fa91ea199af7b4';
const ALARIC_REFERENCE='3275ad31e81966c31b1d2790136cc535a4efe8dd';
const ALARIC_REFERENCE_APP_BLOB='a0441762e25a37b6bd6294fc97d668062bf35759';
const OUTPUT='/tmp/characters-four-cardinal-environment-propagation-v1.json';
const HERE=dirname(fileURLToPath(import.meta.url));
const ROOT=resolve(HERE,'../../..');
process.chdir(ROOT);

const ALLOWED_PATHS=[
  'characters/app.mjs',
  'control-plane/whole-estate/characters-reconstruction-v1/verify-four-cardinal-environment-propagation-v1.mjs'
];
const PROTECTED_BLOBS={
  'characters/gratitude-geography.adapter.mjs':'8e094b2beed8117f6322ca18d9b592949998aac4',
  'characters/cardinal-scene-state.mjs':'a7a60734529cfd6ebeea08e40f4722436689f5f3',
  'characters/cardinal-scenes.data.mjs':'cef3edc7beb5fc39037e00d5ead360ef9db9cdd5',
  'characters/cardinal-scene-geometry.mjs':'698dc392edd0b74547d76fb09a05bb3bb2437c15'
};
const CARDINALS=[
  {destinationId:'alaric',siteId:'WATCHFIRE_OVERLOOK',characterId:'ALARIC_AXION'},
  {destinationId:'tarian',siteId:'WATERLINE_STATION',characterId:'TARIAN_MERROW'},
  {destinationId:'elara',siteId:'SIGNAL_LANTERN_FIELD',characterId:'ELARA_SYLENE'},
  {destinationId:'soren',siteId:'RESTORATION_BOUNDARY',characterId:'SOREN_SEVRIN'}
];
const DESTINATION_IDS=['crossing','dextrion','alaric','tarian','manor','elara','soren','auren','jeeves','clock','remote'];

const issues=[];
const evidence={operationId:OPERATION_ID,governingHead:GOVERNING_HEAD,alaricReference:ALARIC_REFERENCE};
const assert=(condition,issue,details=null)=>{if(!condition)issues.push(details?{issue,details}:{issue});};
const run=(args)=>execFileSync('git',args,{cwd:ROOT,encoding:'utf8'}).trim();
const read=(path)=>readFileSync(join(ROOT,path),'utf8');
const gitShow=(spec)=>execFileSync('git',['show',spec],{cwd:ROOT,encoding:'utf8'});
const blobSha=(buffer)=>createHash('sha1').update(`blob ${buffer.length}\0`).update(buffer).digest('hex');
const lineFor=(text,prefix)=>text.split('\n').find(line=>line.startsWith(prefix))??null;
const phaseRoute=(stateModule,storyState,siteId)=>{
  let state=stateModule.createCardinalSceneState({storyState});
  const phases=[state.phase];
  const step=(event)=>{const result=stateModule.applyCardinalSceneEvent(state,event);assert(result.receipt.accepted,`CARDINAL_EVENT_REJECTED:${siteId}:${event.type}`,result.receipt);if(result.receipt.accepted){state=result.state;phases.push(state.phase);}return result.receipt.accepted;};
  step({type:'SELECT_SITE_SIGNAL',siteId});
  step({type:'ENTER_CHARACTER_SCENE'});
  step({type:'COMPLETE_SCENE_ENTRY'});
  step({type:'BEGIN_LOCAL_INSPECTION'});
  step({type:'RETURN_TO_HUB'});
  return {state,phases};
};

const head=run(['rev-parse','HEAD']);
evidence.head=head;
let ancestry=false;
try{execFileSync('git',['merge-base','--is-ancestor',GOVERNING_HEAD,head],{cwd:ROOT,stdio:'ignore'});ancestry=true;}catch{}
assert(ancestry,'CANDIDATE_NOT_DESCENDED_FROM_ADMITTED_GOVERNING_HEAD',{governingHead:GOVERNING_HEAD,head});

const changed=run(['diff','--name-only',`${GOVERNING_HEAD}...${head}`]).split('\n').filter(Boolean).sort();
evidence.changedPaths=changed;
assert(JSON.stringify(changed)===JSON.stringify([...ALLOWED_PATHS].sort()),'MUTATION_SURFACE_NOT_EXACT_TWO_PATH_ALLOWLIST',{changed,allowed:ALLOWED_PATHS});

const protectedEvidence={};
for(const [path,expected] of Object.entries(PROTECTED_BLOBS)){
  const actual=blobSha(readFileSync(join(ROOT,path)));
  protectedEvidence[path]={expected,actual,pass:actual===expected};
  assert(actual===expected,`PROTECTED_AUTHORITY_BLOB_DRIFT:${path}`,{expected,actual});
}
evidence.protectedBlobs=protectedEvidence;

const app=read('characters/app.mjs');
const baseApp=gitShow(`${GOVERNING_HEAD}:characters/app.mjs`);
const candidateAppBlob=blobSha(readFileSync(join(ROOT,'characters/app.mjs')));
evidence.candidateAppBlob=candidateAppBlob;
assert(candidateAppBlob!==ALARIC_REFERENCE_APP_BLOB,'ALARIC_REFERENCE_WHOLESALE_COPY_FORBIDDEN');

const destinationPreservation={};
for(const id of DESTINATION_IDS){
  const before=lineFor(baseApp,`D('${id}',`);
  const after=lineFor(app,`D('${id}',`);
  destinationPreservation[id]={pass:Boolean(before)&&before===after};
  assert(Boolean(before)&&before===after,`HOST_DESTINATION_RECORD_CHANGED:${id}`);
}
evidence.destinationPreservation=destinationPreservation;

for(const functionName of ['recomputeWorldState','syncWorldState','syncMap','openMap','closeMap','setStory','discover','resize','updateSignals','updateConstellations','updateProofExpressions']){
  const before=lineFor(baseApp,`function ${functionName}(`);
  const after=lineFor(app,`function ${functionName}(`);
  assert(Boolean(before)&&before===after,`HOST_BEHAVIOR_CHANGED_OUTSIDE_BOUNDED_SEAM:${functionName}`);
}
const baseControls=lineFor(baseApp,'for(const d of DESTINATIONS){const b=document.createElement');
const candidateControls=lineFor(app,'for(const d of DESTINATIONS){const b=document.createElement');
assert(Boolean(baseControls)&&baseControls===candidateControls,'MAP_OR_SIGNAL_CONTROL_CONSTRUCTION_DRIFT');
assert(!app.includes('visited.clear('),'COAST_HISTORY_RESET_INTRODUCED');
assert(app.includes('const visited=new Set();'),'COAST_VISITED_HISTORY_REMOVED');

const cloudTokens=[
  "import {createCloudSystem} from './cloud-system.mjs';",
  'const cloudSystem=createCloudSystem({gl,compact,reducedMotion});',
  "cloudSystem.draw({vp,time:sceneTime,state:document.documentElement.dataset.cloudTravel||'ORBIT'});"
];
for(const token of cloudTokens){assert(baseApp.includes(token),`BASE_CLOUD_TOKEN_MISSING:${token}`);assert(app.includes(token),`CURRENT_CLOUD_RUNTIME_REGRESSION:${token}`);}
evidence.cloudRuntime='PRESERVED_CURRENT_PRODUCTION_RUNTIME';

for(const token of [
  "from './cardinal-scene-state.mjs'",
  "from './cardinal-scenes.data.mjs'",
  "from './cardinal-scene-geometry.mjs'",
  "from './gratitude-geography.adapter.mjs'",
  'WORLD_MOON_POSITION',
  'drawCardinalSites(vp)',
  '__DGB_CARDINAL_PROPAGATION__'
]) assert(app.includes(token),`CARDINAL_RUNTIME_BINDING_MISSING:${token}`);

for(const {destinationId,siteId,characterId} of CARDINALS){
  assert(app.includes(`destinationId:'${destinationId}'`),`CARDINAL_DESTINATION_BINDING_MISSING:${destinationId}`);
  assert(app.includes(`siteId:'${siteId}'`),`CARDINAL_SITE_BINDING_MISSING:${siteId}`);
  assert(app.includes(`characterId:'${characterId}'`),`CARDINAL_CHARACTER_BINDING_MISSING:${characterId}`);
}
assert(app.includes("tabletProfile?'REGIONAL':'LOCAL'"),'TABLET_CARDINAL_LOD_POLICY_MISSING');
assert(app.includes("moonFrame:'WORLD_SPACE_CONSTANT'"),'WORLD_SPACE_MOON_CONTRACT_MISSING');
assert(app.includes("clouds:'CURRENT_PRODUCTION_PRESERVED'"),'CLOUD_PRESERVATION_RUNTIME_RECEIPT_MISSING');

try{execFileSync(process.execPath,['--check','characters/app.mjs'],{cwd:ROOT,stdio:'pipe'});evidence.appSyntax='PASS';}catch(error){evidence.appSyntax='FAIL';assert(false,'APP_SYNTAX_FAILURE',{stderr:String(error.stderr||error.message)});}

const stateModule=await import(pathToFileURL(join(ROOT,'characters/cardinal-scene-state.mjs')).href);
const dataModule=await import(pathToFileURL(join(ROOT,'characters/cardinal-scenes.data.mjs')).href);
const geometryModule=await import(pathToFileURL(join(ROOT,'characters/cardinal-scene-geometry.mjs')).href);
const geographyModule=await import(pathToFileURL(join(ROOT,'characters/gratitude-geography.adapter.mjs')).href);

const storyState={
  storyReceiptId:'TASK19_FROZEN_CARDINAL_DISCOVERY_PUBLIC_COMPOSITION_v1',
  chronologyState:'TASK18_FROZEN_ARCHITECTURE_PUBLIC_COMPOSITION',
  discoveryAvailabilityById:Object.fromEntries(dataModule.CARDINAL_DISCOVERIES.map(discovery=>[discovery.id,{
    state:'AVAILABLE',
    predicateReceiptId:`TASK19_FROZEN_DISCOVERY_AVAILABLE:${discovery.id}`,
    chronologyState:'TASK18_FROZEN_ARCHITECTURE_PUBLIC_COMPOSITION'
  }]))
};

const cardinalEvidence={};
for(const {destinationId,siteId,characterId} of CARDINALS){
  assert(stateModule.CARDINAL_CHARACTER_BY_SITE[siteId]===characterId,`SOURCE_CHARACTER_SITE_BINDING_MISMATCH:${siteId}`);
  const discoveries=dataModule.CARDINAL_DISCOVERIES.filter(discovery=>discovery.siteId===siteId);
  assert(discoveries.length>0,`NO_SOURCE_DISCOVERIES_FOR_SITE:${siteId}`);
  const route=phaseRoute(stateModule,storyState,siteId);
  const expected=['SURVEY_HUB','ENCOUNTER_PREVIEW','SCENE_TRANSITION','CHARACTER_SCENE','LOCAL_INSPECTION','SURVEY_HUB'];
  assert(JSON.stringify(route.phases)===JSON.stringify(expected),`CARDINAL_PHASE_ROUTE_MISMATCH:${siteId}`,{expected,actual:route.phases});
  assert(route.state.phase==='SURVEY_HUB'&&route.state.selectedSiteId===siteId&&route.state.activeSiteId===null&&route.state.pendingTravel===null&&route.state.activeDiscoveryId===null,`CARDINAL_RETURN_NOT_CLEAN:${siteId}`);
  const local=geometryModule.buildCardinalSiteGeometry(siteId,'LOCAL');
  const regional=geometryModule.buildCardinalSiteGeometry(siteId,'REGIONAL');
  const camera=geographyModule.resolveCameraSiteAnchor(siteId);
  const localVertices=local.components.reduce((n,c)=>n+c.mesh.positions.length/3,0);
  const regionalVertices=regional.components.reduce((n,c)=>n+c.mesh.positions.length/3,0);
  const localIndices=local.components.reduce((n,c)=>n+c.mesh.indices.length,0);
  const regionalIndices=regional.components.reduce((n,c)=>n+c.mesh.indices.length,0);
  assert(regionalVertices<=localVertices&&regionalIndices<=localIndices,`TABLET_REGIONAL_LOD_EXCEEDS_LOCAL:${siteId}`,{localVertices,regionalVertices,localIndices,regionalIndices});
  assert([camera.eye.x,camera.eye.y,camera.eye.z,camera.look.x,camera.look.y,camera.look.z].every(Number.isFinite),`CARDINAL_CAMERA_NONFINITE:${siteId}`);
  cardinalEvidence[siteId]={destinationId,characterId,discoveryCount:discoveries.length,phaseRoute:route.phases,geometryIdentity:local.geometryIdentity,localVertices,regionalVertices,localIndices,regionalIndices,cameraFinite:true};
}
evidence.cardinals=cardinalEvidence;

const cardinalPlaceholderList=lineFor(app,"for(const [id,className] of [['crossing'");
for(const id of ['alaric','tarian','elara','soren']) assert(!cardinalPlaceholderList?.includes(`['${id}',`),`LEGACY_CARDINAL_PLACEHOLDER_STILL_ACTIVE:${id}`);
assert(app.includes('for(const site of cardinalSites)for(const component of site.meshes)'), 'FOUR_CARDINAL_PHYSICAL_GEOMETRY_DRAW_MISSING');
assert(app.includes("if(cardinalState.phase!=='SURVEY_HUB')closeCardinalState();"),'CROSS_CARDINAL_STATE_RESET_BOUNDARY_MISSING');
assert(app.includes("if(!prepareCardinalJourney(d))return;"),'CARDINAL_TRAVEL_GATE_MISSING');
assert(app.includes("applyCardinalEvent({type:'COMPLETE_SCENE_ENTRY'})"),'CARDINAL_ARRIVAL_EVENT_MISSING');
assert(app.includes("applyCardinalEvent({type:'BEGIN_LOCAL_INSPECTION'})"),'CARDINAL_INSPECTION_EVENT_MISSING');
assert(app.includes("applyCardinalEvent({type:'RETURN_TO_HUB'})"),'CARDINAL_RETURN_EVENT_MISSING');

const receipt={
  schema:'CHARACTERS_FOUR_CARDINAL_ENVIRONMENT_PROPAGATION_QUALIFICATION_v1',
  operationId:OPERATION_ID,
  governingHead:GOVERNING_HEAD,
  candidateHead:head,
  result:issues.length===0?'PASS_CLOSED':'FAIL_CLOSED',
  issues,
  evidence,
  authorityEffect:'NONE_BY_QUALIFICATION',
  mergeAuthorized:false,
  deploymentAuthorized:false,
  publicationAuthorized:false
};
writeFileSync(OUTPUT,JSON.stringify(receipt,null,2)+'\n');
process.stdout.write(JSON.stringify(receipt,null,2)+'\n');
process.exitCode=issues.length===0?0:1;
