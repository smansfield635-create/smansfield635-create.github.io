#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync} from 'node:fs';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const OPERATION_ID='CHARACTERS_ENVIRONMENT_MANOR_MOON_TRAVERSAL_COMPOSITION_SUCCESSOR_20260911_001';
const GOVERNING_HEAD='08161cae4f9ed2e0f6bcb6b9ea56110a04be695f';
const QUALIFIED_G3='06d7b7b34fe87055e649119a57d6a59df7efb69c';
const QUALIFIED_G3_APP_BLOB='ce9c10fc48ee483264eeb3efd1327f7e496d7689';
const G3_RECEIPT_SHA256='d64b8e70125f733469dabd42efa6cfcac10174da8f86bcb2f0b537ae83903e6b';
const CYCLE5A_COMMENT=5640253344;
const OUTPUT='/tmp/characters-manor-moon-traversal-composition-v1.json';
const HERE=dirname(fileURLToPath(import.meta.url));
const ROOT=resolve(HERE,'../../..');
process.chdir(ROOT);

const ALLOWED_PATHS=[
  'characters/app.mjs',
  'characters/cloud-traversal.mjs',
  'characters/manor-world-geometry.mjs',
  'control-plane/whole-estate/characters-reconstruction-v1/verify-manor-moon-traversal-composition-v1.mjs'
];
const PROTECTED_BLOBS={
  'characters/cloud-system.mjs':'3d608b9940211be0c13c2c2ce83ecedd9ccda2d9',
  'characters/gratitude-geography.adapter.mjs':'8e094b2beed8117f6322ca18d9b592949998aac4',
  'characters/step9-regional-geography.mjs':'e3c4f837b7a4c30ce118a88ec8475b6fab542a57',
  'characters/cardinal-scene-state.mjs':'a7a60734529cfd6ebeea08e40f4722436689f5f3',
  'characters/cardinal-scenes.data.mjs':'cef3edc7beb5fc39037e00d5ead360ef9db9cdd5',
  'characters/cardinal-scene-geometry.mjs':'698dc392edd0b74547d76fb09a05bb3bb2437c15',
  'characters/narrative-world-state.mjs':'9e7cd457898ee7cf112aff9062b245d62f5b8d19',
  'characters/night-renderer.mjs':'066973f039a6439cf24264984243271942126b4d',
  'characters/index.html':'6bebd977905ec9c9d7b717a4ea4305688e82aa03',
  'characters/legacy-dossiers.html':'abafc0bc1f4b6538028833c47103596411ff3f3a',
  'assets/compass/compass.house-scene.js':'a82e3c963a10808b9f8f1922faab45155ea4a62b',
  'assets/manor-blueprint/manor.estate.neutral-blockout.mjs':'0377cb8b28907e3c10e6193dff3e720b8623f089',
  'assets/manor-blueprint/manor.estate.gothic-detail-phase1.mjs':'c7bf5ccd2587e1a6087bb469a00bdae7c0a96f94',
  'assets/manor-blueprint/manor.estate.gothic-detail-phase1b.mjs':'577503fd4b1cca1d17828672071409eaa0a300b2',
  'assets/manor-blueprint/manor.estate.gothic-detail-phase2.mjs':'96702c6471ad2df893847f4f997b235cfaec6ee1',
  'assets/manor-blueprint/manor.estate.gothic-detail-phase3.mjs':'38bc8fa60a251681cb5484926409290f66460ad0'
};
const DESTINATION_IDS=['crossing','dextrion','alaric','tarian','manor','elara','soren','auren','jeeves','clock','remote'];
const CARDINALS=[
  {destinationId:'alaric',siteId:'WATCHFIRE_OVERLOOK',characterId:'ALARIC_AXION',discoveryId:'ALARIC_ROUTE_TABLE'},
  {destinationId:'tarian',siteId:'WATERLINE_STATION',characterId:'TARIAN_MERROW',discoveryId:'TARIAN_TIDE_STAFF'},
  {destinationId:'elara',siteId:'SIGNAL_LANTERN_FIELD',characterId:'ELARA_SYLENE',discoveryId:'ELARA_FAINT_LANTERN'},
  {destinationId:'soren',siteId:'RESTORATION_BOUNDARY',characterId:'SOREN_SEVRIN',discoveryId:'SOREN_FINISHED_SURFACE'}
];
const TRAVERSAL_STATES=['ORBIT','ASCENT','CLOUD_ENTRY','CLOUD_TRANSIT','DESCENT','ARRIVAL'];

const issues=[];
const evidence={operationId:OPERATION_ID,governingHead:GOVERNING_HEAD,qualifiedG3:QUALIFIED_G3,qualifiedG3AppBlob:QUALIFIED_G3_APP_BLOB,g3ReceiptSha256:G3_RECEIPT_SHA256,cycle5AComment:CYCLE5A_COMMENT};
const assert=(condition,issue,details=null)=>{if(!condition)issues.push(details?{issue,details}:{issue});};
const run=args=>execFileSync('git',args,{cwd:ROOT,encoding:'utf8'}).trim();
const read=path=>readFileSync(join(ROOT,path),'utf8');
const gitShow=spec=>execFileSync('git',['show',spec],{cwd:ROOT,encoding:'utf8'});
const blobSha=buffer=>createHash('sha1').update(`blob ${buffer.length}\0`).update(buffer).digest('hex');
const lineFor=(text,prefix)=>text.split('\n').find(line=>line.startsWith(prefix))??null;
const syntaxCheck=path=>{try{execFileSync(process.execPath,['--check',path],{cwd:ROOT,stdio:'pipe'});return 'PASS';}catch(error){assert(false,`SYNTAX_FAILURE:${path}`,{stderr:String(error.stderr||error.message)});return 'FAIL';}};

const head=run(['rev-parse','HEAD']);
evidence.head=head;
let ancestry=false;
try{execFileSync('git',['merge-base','--is-ancestor',GOVERNING_HEAD,head],{cwd:ROOT,stdio:'ignore'});ancestry=true;}catch{}
assert(ancestry,'CANDIDATE_NOT_DESCENDED_FROM_ADMITTED_GOVERNING_HEAD',{governingHead:GOVERNING_HEAD,head});
const changed=run(['diff','--name-only',`${GOVERNING_HEAD}...${head}`]).split('\n').filter(Boolean).sort();
evidence.changedPaths=changed;
assert(JSON.stringify(changed)===JSON.stringify([...ALLOWED_PATHS].sort()),'MUTATION_SURFACE_NOT_EXACT_FOUR_PATH_ALLOWLIST',{changed,allowed:ALLOWED_PATHS});

const protectedEvidence={};
for(const [path,expected] of Object.entries(PROTECTED_BLOBS)){
  const actual=blobSha(readFileSync(join(ROOT,path)));
  protectedEvidence[path]={expected,actual,pass:actual===expected};
  assert(actual===expected,`PROTECTED_OR_DONOR_BLOB_DRIFT:${path}`,{expected,actual});
}
evidence.protectedBlobs=protectedEvidence;

const app=read('characters/app.mjs');
const traversal=read('characters/cloud-traversal.mjs');
const manor=read('characters/manor-world-geometry.mjs');
const baseApp=gitShow(`${GOVERNING_HEAD}:characters/app.mjs`);
evidence.syntax={
  app:syntaxCheck('characters/app.mjs'),
  traversal:syntaxCheck('characters/cloud-traversal.mjs'),
  manor:syntaxCheck('characters/manor-world-geometry.mjs')
};

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
  assert(Boolean(before)&&before===after,`HOST_BEHAVIOR_CHANGED_OUTSIDE_G4_SEAM:${functionName}`);
}
const baseControls=lineFor(baseApp,'for(const d of DESTINATIONS){const b=document.createElement');
const candidateControls=lineFor(app,'for(const d of DESTINATIONS){const b=document.createElement');
assert(Boolean(baseControls)&&baseControls===candidateControls,'MAP_OR_SIGNAL_CONTROL_CONSTRUCTION_DRIFT');
assert(app.includes('const visited=new Set();')&&!app.includes('visited.clear('),'SESSION_VISITED_HISTORY_REGRESSION');

for(const token of [
  "from './cardinal-scene-state.mjs'",
  "from './cardinal-scenes.data.mjs'",
  "from './cardinal-scene-geometry.mjs'",
  "from './gratitude-geography.adapter.mjs'",
  'CARDINAL_SITE_CONFIGS=Object.freeze([',
  "destinationId:'alaric',siteId:'WATCHFIRE_OVERLOOK',characterId:'ALARIC_AXION'",
  "destinationId:'tarian',siteId:'WATERLINE_STATION',characterId:'TARIAN_MERROW'",
  "destinationId:'elara',siteId:'SIGNAL_LANTERN_FIELD',characterId:'ELARA_SYLENE'",
  "destinationId:'soren',siteId:'RESTORATION_BOUNDARY',characterId:'SOREN_SEVRIN'",
  "tabletProfile?'REGIONAL':'LOCAL'",
  'drawCardinalSites(vp)',
  '__DGB_CARDINAL_PROPAGATION__'
])assert(app.includes(token),`QUALIFIED_G3_SEAM_TOKEN_MISSING:${token}`);

const expectedMoon="const WORLD_MOON_POSITION=Object.freeze([frame.xMinimum+200,frame.seaLevelY+780,frame.zMinimum-1400]);";
assert(app.includes(expectedMoon),'WORLD_SPACE_MOON_CONSTANT_DRIFT');
assert(app.includes("moonFrame:'WORLD_SPACE_CONSTANT'"),'WORLD_SPACE_MOON_RUNTIME_RECEIPT_MISSING');

for(const token of [
  "import {buildMirrorManorWorldGeometry} from './manor-world-geometry.mjs';",
  "buildMirrorManorWorldGeometry(tabletProfile?'REGIONAL':'LOCAL')",
  "resolveCameraSiteAnchor('MIRROR_MANOR')",
  'manorGeometry.geography.canonicalWorldReference',
  'drawMirrorManor(vp)',
  '__DGB_MANOR_MOON_TRAVERSAL__'
])assert(app.includes(token),`MANOR_RUNTIME_BINDING_MISSING:${token}`);
const proofList=lineFor(app,"for(const [id,className] of [['crossing'");
assert(!proofList?.includes("['manor','manor-mass']"),'LEGACY_MANOR_SILHOUETTE_PLACEHOLDER_STILL_ACTIVE');
for(const id of ['alaric','tarian','elara','soren'])assert(!proofList?.includes(`['${id}',`),`LEGACY_CARDINAL_PLACEHOLDER_REINTRODUCED:${id}`);

for(const token of [
  "sceneBlob:'a82e3c963a10808b9f8f1922faab45155ea4a62b'",
  "sceneVersion:'mirror-manor-gothic-phase3-carousel-v6-material-detail-final'",
  "authority:'PHYSICAL_EXPRESSION_ONLY_NO_GEOGRAPHY_OR_NARRATIVE_AUTHORITY'",
  "from '../assets/manor-blueprint/manor.estate.neutral-blockout.mjs'",
  "from '../assets/manor-blueprint/manor.estate.gothic-detail-phase1.mjs'",
  "from '../assets/manor-blueprint/manor.estate.gothic-detail-phase1b.mjs'",
  "from '../assets/manor-blueprint/manor.estate.gothic-detail-phase2.mjs'",
  "from '../assets/manor-blueprint/manor.estate.gothic-detail-phase3.mjs'",
  "resolveLodSiteAnchor('MIRROR_MANOR',lod)",
  "if(lod==='LOCAL')",
  "omittedGatehouse:true",
  "omittedFormalGardenPlinth:true",
  "geographyAuthorityCreated:false",
  "narrativeAuthorityCreated:false",
  "navigationAuthorityCreated:false"
])assert(manor.includes(token),`MANOR_DONOR_OR_AUTHORITY_BOUNDARY_MISSING:${token}`);
const geography=read('characters/gratitude-geography.adapter.mjs');
assert(geography.includes("MIRROR_MANOR: anchor({ id: 'MIRROR_MANOR', kind: 'MAJOR_PLACE_CONTEXT', x: 430, z: -820"),'CANONICAL_MIRROR_MANOR_ANCHOR_DRIFT');
assert(geography.includes("REGIONAL: { samplingDensity: 0.5, landmarkScale: 0.62 }")&&geography.includes("LOCAL: { samplingDensity: 1, landmarkScale: 1 }"),'MANOR_LOD_PROFILE_SOURCE_DRIFT');

const stateModule=await import(pathToFileURL(join(ROOT,'characters/cardinal-scene-state.mjs')).href);
for(const {siteId,characterId,discoveryId} of CARDINALS){
  assert(stateModule.CARDINAL_CHARACTER_BY_SITE[siteId]===characterId,`CARDINAL_SOURCE_BINDING_DRIFT:${siteId}`);
  const storyState={storyReceiptId:'G4_VERIFIER_CYCLE5A',chronologyState:'FROZEN',discoveryAvailabilityById:{[discoveryId]:{state:'AVAILABLE',predicateReceiptId:`G4:${discoveryId}`,chronologyState:'FROZEN'}}};
  let state=stateModule.createCardinalSceneState({storyState});
  const select=stateModule.applyCardinalSceneEvent(state,{type:'SELECT_SITE_SIGNAL',siteId});
  assert(select.receipt.accepted&&select.state.phase==='ENCOUNTER_PREVIEW'&&select.state.activeSiteId===null,`CYCLE5A_SELECT_DID_NOT_STOP_AT_ENCOUNTER_PREVIEW:${siteId}`);
  const continueSurvey=stateModule.applyCardinalSceneEvent(select.state,{type:'CONTINUE_SURVEYING'});
  assert(continueSurvey.receipt.accepted&&continueSurvey.state.phase==='SURVEY_HUB',`CYCLE5A_CONTINUE_SURVEYING_FAILURE:${siteId}`);
  const selectedAgain=stateModule.applyCardinalSceneEvent(continueSurvey.state,{type:'SELECT_SITE_SIGNAL',siteId});
  const enter=stateModule.applyCardinalSceneEvent(selectedAgain.state,{type:'ENTER_CHARACTER_SCENE'});
  assert(enter.receipt.accepted&&enter.state.phase==='SCENE_TRANSITION',`CYCLE5A_EXPLICIT_SCENE_ENTRY_FAILURE:${siteId}`);
  const arrive=stateModule.applyCardinalSceneEvent(enter.state,{type:'COMPLETE_SCENE_ENTRY'});
  const inspect=stateModule.applyCardinalSceneEvent(arrive.state,{type:'BEGIN_LOCAL_INSPECTION'});
  assert(inspect.receipt.accepted&&inspect.state.phase==='LOCAL_INSPECTION',`CYCLE5A_LOCAL_INSPECTION_FAILURE:${siteId}`);
  const card=stateModule.applyCardinalSceneEvent(inspect.state,{type:'OPEN_DISCOVERY_CARD',discoveryId});
  assert(card.receipt.accepted&&card.state.phase==='KNOWLEDGE_CARD'&&card.state.discoveredIds.includes(discoveryId),`CYCLE5A_KNOWLEDGE_CARD_LOCALITY_FAILURE:${siteId}`);
  const returned=stateModule.applyCardinalSceneEvent(card.state,{type:'RETURN_TO_HUB'});
  assert(returned.receipt.accepted&&returned.state.phase==='SURVEY_HUB'&&returned.state.activeSiteId===null&&returned.state.discoveredIds.includes(discoveryId),`CYCLE5A_RETURN_OR_HISTORY_FAILURE:${siteId}`);
}
const beginEncounterLine=lineFor(app,'function beginCardinalEncounter(')||'';
assert(beginEncounterLine.includes("SELECT_SITE_SIGNAL")&&!beginEncounterLine.includes('ENTER_CHARACTER_SCENE'),'APP_SIGNAL_SELECTION_SILENTLY_ENTERS_SCENE');
assert(app.includes("enter.textContent='Enter scene'")&&app.includes("continueSurvey.textContent='Continue surveying'"),'CONTEXTUAL_ENCOUNTER_ACTIONS_MISSING');
assert(app.includes("applyCardinalEvent({type:'CONTINUE_SURVEYING'})"),'CONTINUE_SURVEYING_APP_BINDING_MISSING');
assert(app.includes("applyCardinalEvent({type:'ENTER_CHARACTER_SCENE'})"),'EXPLICIT_ENTER_CHARACTER_SCENE_APP_BINDING_MISSING');

const traversalModule=await import(pathToFileURL(join(ROOT,'characters/cloud-traversal.mjs')).href);
assert(JSON.stringify(traversalModule.CLOUD_TRAVEL_STATES)===JSON.stringify(TRAVERSAL_STATES),'CLOUD_TRAVERSAL_STATE_SEQUENCE_DRIFT');
const outside={x:5000,y:12,z:-5000};
const safe=traversalModule.safeInteriorPoint(outside);
assert(traversalModule.isSafeInteriorPoint(safe),'SAFE_INTERIOR_CLAMP_FAILURE',{outside,safe});
const expectedTravel=TRAVERSAL_STATES.slice(1);
for(const reducedMotion of [false,true]){
  const timeline=traversalModule.buildCloudTraversalTimeline({durationMs:2460,reducedMotion});
  assert(JSON.stringify(timeline.map(entry=>entry.state))===JSON.stringify(expectedTravel),`TRAVERSAL_TIMELINE_STATE_DRIFT:${reducedMotion?'REDUCED':'STANDARD'}`,timeline);
  assert(timeline[0].atMs===0&&timeline.at(-1).state==='ARRIVAL'&&timeline.at(-1).atMs>0,`TRAVERSAL_TIMELINE_BOUNDARY_FAILURE:${reducedMotion?'REDUCED':'STANDARD'}`,timeline);
}
assert(traversal.includes('autoBindSignals=false'),'GLOBAL_SIGNAL_INTERCEPTION_NOT_DISABLED_BY_DEFAULT');
assert(app.includes("createCloudTraversalController({root:document.body,reducedMotion,autoBindSignals:false})"),'APP_TRAVERSAL_CONTROLLER_NOT_EXPLICIT');
assert(app.includes('cloudTraversal.begin({destinationId:d.id')&&app.includes("cloudTraversal.begin({destinationId:'ORBIT'"),'TRAVERSAL_NOT_BOUND_TO_ACTUAL_TRAVEL');
assert(app.includes('cloudTraversal.clear();'),'RETURN_DOES_NOT_CLEAR_TRAVERSAL_TO_ORBIT');

const cloudSystem=read('characters/cloud-system.mjs');
assert(cloudSystem.includes("CLOUD_RENDERING_DISABLED")||cloudSystem.includes("disabled"),'CURRENT_DISABLED_CLOUD_SYSTEM_MARKER_MISSING');
assert(app.includes("cloudSystem.draw({vp,time:sceneTime,state:document.documentElement.dataset.cloudTravel||'ORBIT'});"),'CURRENT_CLOUD_SYSTEM_CALL_REGRESSION');

const receipt={
  schema:'CHARACTERS_MANOR_MOON_TRAVERSAL_COMPOSITION_QUALIFICATION_v1',
  operationId:OPERATION_ID,
  governingHead:GOVERNING_HEAD,
  qualifiedG3:QUALIFIED_G3,
  candidateHead:head,
  result:issues.length===0?'PASS_CLOSED':'FAIL_CLOSED',
  issues,
  evidence,
  authorityEffect:'NONE_BY_QUALIFICATION',
  mergeAuthorized:false,
  deploymentAuthorized:false,
  publicationAuthorized:false,
  g5Authorized:false,
  g6Authorized:false
};
writeFileSync(OUTPUT,JSON.stringify(receipt,null,2)+'\n');
process.stdout.write(JSON.stringify(receipt,null,2)+'\n');
process.exitCode=issues.length===0?0:1;
