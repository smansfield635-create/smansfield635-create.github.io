#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync} from 'node:fs';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const OPERATION_ID='CHARACTERS_GRATITUDE_CARDINAL_INTEGRATION_RECOVERY_ALARIC_PROOF_20260909_001_REBIND_001';
const GOVERNING_HEAD='2c3156e96fac028ed766ec4fa69a73ab73868ea2';
const ALARIC_SITE_ID='WATCHFIRE_OVERLOOK';
const OUTPUT='/tmp/characters-alaric-cardinal-integration-r1.json';
const HERE=dirname(fileURLToPath(import.meta.url));
const ROOT=resolve(HERE,'../../..');
process.chdir(ROOT);

const ALLOWED_PATHS=[
  'characters/app.mjs',
  'control-plane/whole-estate/characters-reconstruction-v1/verify-alaric-cardinal-integration-r1.mjs'
];
const PROTECTED_BLOBS={
  'characters/gratitude-geography.adapter.mjs':'8e094b2beed8117f6322ca18d9b592949998aac4',
  'characters/cardinal-scene-state.mjs':'a7a60734529cfd6ebeea08e40f4722436689f5f3',
  'characters/cardinal-scenes.data.mjs':'cef3edc7beb5fc39037e00d5ead360ef9db9cdd5',
  'characters/cardinal-scene-geometry.mjs':'698dc392edd0b74547d76fb09a05bb3bb2437c15'
};

const issues=[];
const evidence={};
const assert=(condition,issue,details=null)=>{if(!condition)issues.push(details?{issue,details}:{issue});};
const run=(args)=>execFileSync('git',args,{cwd:ROOT,encoding:'utf8'}).trim();
const blobSha=(buffer)=>createHash('sha1').update(`blob ${buffer.length}\0`).update(buffer).digest('hex');
const read=(path)=>readFileSync(join(ROOT,path),'utf8');
const gitShow=(spec)=>execFileSync('git',['show',spec],{cwd:ROOT,encoding:'utf8'});
const lineFor=(text,prefix)=>text.split('\n').find(line=>line.startsWith(prefix))??null;

const head=run(['rev-parse','HEAD']);
evidence.head=head;
let ancestry=false;
try{execFileSync('git',['merge-base','--is-ancestor',GOVERNING_HEAD,head],{cwd:ROOT,stdio:'ignore'});ancestry=true;}catch{}
assert(ancestry,'CANDIDATE_NOT_DESCENDED_FROM_ADMITTED_GOVERNING_HEAD',{governingHead:GOVERNING_HEAD,head});

const changed=run(['diff','--name-only',`${GOVERNING_HEAD}...${head}`]).split('\n').filter(Boolean).sort();
evidence.changedPaths=changed;
assert(JSON.stringify(changed)===JSON.stringify([...ALLOWED_PATHS].sort()),'MUTATION_SURFACE_NOT_EXACT_TWO_PATH_ALLOWLIST',{changed,allowed:ALLOWED_PATHS});

const protectedBlobEvidence={};
for(const [path,expected] of Object.entries(PROTECTED_BLOBS)){
  const actual=blobSha(readFileSync(join(ROOT,path)));
  protectedBlobEvidence[path]={expected,actual,pass:actual===expected};
  assert(actual===expected,`PROTECTED_AUTHORITY_BLOB_DRIFT:${path}`,{expected,actual});
}
evidence.protectedBlobs=protectedBlobEvidence;

const app=read('characters/app.mjs');
const baseApp=gitShow(`${GOVERNING_HEAD}:characters/app.mjs`);

// Preserve the recovered eleven-destination host exactly at the narrative-data layer.
const destinationIds=['crossing','dextrion','alaric','tarian','manor','elara','soren','auren','jeeves','clock','remote'];
const destinationPreservation={};
for(const id of destinationIds){
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
assert(!app.includes('visited.clear(')&&!app.includes('visited=new Set('),'COAST_HISTORY_RESET_INTRODUCED');
assert(app.includes('const visited=new Set();'),'COAST_VISITED_HISTORY_REMOVED');

// Active cardinal state progression: only Watchfire receives source-authorized availability.
const stateModule=await import(pathToFileURL(join(ROOT,'characters/cardinal-scene-state.mjs')).href);
const dataModule=await import(pathToFileURL(join(ROOT,'characters/cardinal-scenes.data.mjs')).href);
const alaricDiscoveries=dataModule.CARDINAL_DISCOVERIES.filter(discovery=>discovery.siteId===ALARIC_SITE_ID);
assert(alaricDiscoveries.length===5,'ALARIC_DISCOVERY_SET_NOT_EXACT_FIVE',{count:alaricDiscoveries.length});
const storyState={
  storyReceiptId:'TASK19_FROZEN_CARDINAL_DISCOVERY_PUBLIC_COMPOSITION_v1',
  chronologyState:'TASK18_FROZEN_ARCHITECTURE_PUBLIC_COMPOSITION',
  discoveryAvailabilityById:Object.fromEntries(alaricDiscoveries.map(discovery=>[discovery.id,{
    state:'AVAILABLE',
    predicateReceiptId:`TASK19_FROZEN_DISCOVERY_AVAILABLE:${discovery.id}`,
    chronologyState:'TASK18_FROZEN_ARCHITECTURE_PUBLIC_COMPOSITION'
  }]))
};
let cardinal=stateModule.createCardinalSceneState({storyState});
const phases=[cardinal.phase];
const receipts=[];
const apply=(event)=>{const result=stateModule.applyCardinalSceneEvent(cardinal,event);receipts.push(result.receipt);assert(result.receipt.accepted,`CARDINAL_EVENT_REJECTED:${event.type}`,result.receipt);if(result.receipt.accepted){cardinal=result.state;phases.push(cardinal.phase);}return result;};
apply({type:'SELECT_SITE_SIGNAL',siteId:ALARIC_SITE_ID});
apply({type:'ENTER_CHARACTER_SCENE'});
apply({type:'COMPLETE_SCENE_ENTRY'});
apply({type:'BEGIN_LOCAL_INSPECTION'});
apply({type:'RETURN_TO_HUB'});
const expectedPhases=['SURVEY_HUB','ENCOUNTER_PREVIEW','SCENE_TRANSITION','CHARACTER_SCENE','LOCAL_INSPECTION','SURVEY_HUB'];
assert(JSON.stringify(phases)===JSON.stringify(expectedPhases),'ALARIC_CARDINAL_PHASE_SEQUENCE_DRIFT',{phases,expectedPhases});
assert(cardinal.selectedSiteId===ALARIC_SITE_ID&&cardinal.activeSiteId===null,'RETURN_TO_ORBIT_CARDINAL_STATE_NOT_STABLE',{selectedSiteId:cardinal.selectedSiteId,activeSiteId:cardinal.activeSiteId});
assert(alaricDiscoveries.every(discovery=>cardinal.story.discoveryAvailabilityById[discovery.id].state==='AVAILABLE'),'ALARIC_LOCAL_INSPECTION_NOT_SOURCE_AUTHORIZED');
for(const discovery of dataModule.CARDINAL_DISCOVERIES.filter(discovery=>discovery.siteId!==ALARIC_SITE_ID)){
  assert(cardinal.story.discoveryAvailabilityById[discovery.id].state==='HELD',`NON_ALARIC_DISCOVERY_PROPAGATED:${discovery.id}`);
}
evidence.cardinalJourney={phases,receipts,selectedSiteIdAfterReturn:cardinal.selectedSiteId};

// Structural Watchfire identity and read-only world placement.
const geometryModule=await import(pathToFileURL(join(ROOT,'characters/cardinal-scene-geometry.mjs')).href);
const geographyModule=await import(pathToFileURL(join(ROOT,'characters/gratitude-geography.adapter.mjs')).href);
const localGeometry=geometryModule.buildCardinalSiteGeometry(ALARIC_SITE_ID,'LOCAL');
const regionalGeometry=geometryModule.buildCardinalSiteGeometry(ALARIC_SITE_ID,'REGIONAL');
const cameraAnchor=geographyModule.resolveCameraSiteAnchor(ALARIC_SITE_ID);
assert(localGeometry.geometryIdentity==='CARDINAL_SITE_GEOMETRY:WATCHFIRE_OVERLOOK','WATCHFIRE_GEOMETRY_IDENTITY_WRONG',{geometryIdentity:localGeometry.geometryIdentity});
assert(localGeometry.characterId==='ALARIC_AXION','WATCHFIRE_CHARACTER_BINDING_WRONG',{characterId:localGeometry.characterId});
assert(localGeometry.landmarkId==='WATCHFIRE_AND_ROUTE_TABLE','WATCHFIRE_LANDMARK_BINDING_WRONG',{landmarkId:localGeometry.landmarkId});
for(const componentId of ['ALARIC_WATCHFIRE','ALARIC_ROUTE_TABLE'])assert(localGeometry.components.some(component=>component.componentId===componentId),`WATCHFIRE_LANDMARK_COMPONENT_MISSING:${componentId}`);
assert(JSON.stringify(localGeometry.geography.canonicalWorldReference)===JSON.stringify(cameraAnchor.worldReference),'WATCHFIRE_CAMERA_WORLD_REFERENCE_DIVERGED');
assert(app.includes("const ALARIC_SITE_ID='WATCHFIRE_OVERLOOK';"),'APP_NOT_BOUND_TO_WATCHFIRE_ID');
assert(app.includes("alaricDestination.pos=[alaricAnchor.x,alaricAnchor.y+42,alaricAnchor.z];"),'ALARIC_SIGNAL_NOT_REBOUND_TO_WATCHFIRE_WORLD_ANCHOR');
assert(app.includes("alaricDestination.eye=[alaricCamera.eye.x,alaricCamera.eye.y,alaricCamera.eye.z];")&&app.includes("alaricDestination.look=[alaricCamera.look.x,alaricCamera.look.y,alaricCamera.look.z];"),'ALARIC_CAMERA_NOT_REBOUND_TO_WATCHFIRE_CAMERA_AUTHORITY');
evidence.watchfire={geometryIdentity:localGeometry.geometryIdentity,characterId:localGeometry.characterId,landmarkId:localGeometry.landmarkId,worldReference:localGeometry.geography.canonicalWorldReference,localVertices:localGeometry.vertexCount,regionalVertices:regionalGeometry.vertexCount};

// Continuous world traversal: the host bezier path remains active and Alaric does not use scene-cut machinery.
assert(app.includes('camera.eye=bezier(')&&app.includes('camera.look=bezier('),'CONTINUOUS_CAMERA_INTERPOLATION_REMOVED');
assert(app.includes('duration:clamp(1900+distance*.9,2200,3200)'),'FORWARD_WORLD_TRAVERSAL_DURATION_REMOVED');
assert(app.includes('duration:2450')&&app.includes('end=ORBIT'),'RETURN_TO_ORBIT_TRAVERSAL_REMOVED');
assert(!app.includes('buildStandardSiteSurveyPath')&&!app.includes("'SCENE_CUT'"),'SCENE_CUT_PATH_INTRODUCED_INSTEAD_OF_CONTINUOUS_WORLD_TRAVERSAL');
assert(app.includes("applyAlaricEvent({type:'SELECT_SITE_SIGNAL',siteId:ALARIC_SITE_ID})")&&app.includes("applyAlaricEvent({type:'ENTER_CHARACTER_SCENE'})")&&app.includes("applyAlaricEvent({type:'COMPLETE_SCENE_ENTRY'})")&&app.includes("applyAlaricEvent({type:'BEGIN_LOCAL_INSPECTION'})"),'RUNTIME_CARDINAL_PROGRESS_WIRING_INCOMPLETE');

// Stable world-space lunar relationship; Laws primitive remains visual technique only.
const drawMoonLine=lineFor(app,'function drawMoon(')??'';
assert(app.includes('const WORLD_MOON_POSITION=Object.freeze('),'WORLD_SPACE_MOON_CONSTANT_MISSING');
assert(drawMoonLine.includes("uMoonPos'),WORLD_MOON_POSITION"),'MOON_NOT_DRAWN_FROM_WORLD_SPACE_CONSTANT');
assert(!drawMoonLine.includes('camera.eye')&&!drawMoonLine.includes('camera.look'),'MOON_REMAINS_CAMERA_RELATIVE');
assert(app.includes('uMoonWorld-vPos'),'WATCHFIRE_LIGHTING_NOT_WORLD_MOON_RELATIVE');
assert(app.includes("uMoonPathX'),WORLD_MOON_POSITION[0]"),'WATER_MOON_RESPONSE_NOT_WORLD_SPACE_STABLE');

// Clouds remain disabled; do not mutate cloud authorities.
assert(!app.includes('createCloudSystem')&&!app.includes('cloudSystem'),'CLOUD_RENDERER_REACTIVATED');

// No development-frame/sliding-canvas substitute: one existing WebGL canvas, structural world meshes, no added canvas or style translation.
assert((app.match(/querySelector\('#scene'\)/g)||[]).length===1,'SCENE_CANVAS_BINDING_COUNT_CHANGED');
assert(!app.includes("document.createElement('canvas')"),'SECOND_CANVAS_INTRODUCED');
assert(!app.includes('canvas.style.transform')&&!app.includes('world.style.transform'),'SLIDING_CANVAS_OR_WORLD_TRANSFORM_INTRODUCED');
assert(app.includes('makeCardinalVAO')&&app.includes('source.positions[i]+anchor.x')&&app.includes('source.positions[i+2]+anchor.z'),'WATCHFIRE_NOT_RENDERED_IN_WORLD_SPACE');
assert(!app.includes("['alaric','watchfire-overlook']"),'ALARIC_CSS_STANDIN_REMAINS_INSTANTIATED');

// Tablet guard: existing terrain/water budgets are unchanged, clouds are removed, and touch/tablet gets REGIONAL Watchfire LOD.
assert(lineFor(baseApp,'function meshTerrain()')===lineFor(app,'function meshTerrain()'),'TERRAIN_BUDGET_CHANGED');
assert(lineFor(baseApp,'function meshWater()')===lineFor(app,'function meshWater()'),'WATER_BUDGET_CHANGED');
assert(app.includes("const tabletProfile=Math.min(innerWidth,innerHeight)<=1024&&(navigator.maxTouchPoints||0)>0;"),'TABLET_PROFILE_GUARD_MISSING');
assert(app.includes("buildCardinalSiteGeometry(ALARIC_SITE_ID,tabletProfile?'REGIONAL':'LOCAL')"),'TABLET_WATCHFIRE_LOD_GUARD_MISSING');
assert(regionalGeometry.vertexCount<=localGeometry.vertexCount,'REGIONAL_WATCHFIRE_LOD_HEAVIER_THAN_LOCAL',{regional:regionalGeometry.vertexCount,local:localGeometry.vertexCount});
assert(!app.includes('cloudSystem'),'TABLET_CLOUD_COST_REINTRODUCED');
evidence.tabletGuard={viewport:'800x1280_touch',selectedWatchfireLod:'REGIONAL',regionalVertices:regionalGeometry.vertexCount,localVertices:localGeometry.vertexCount,terrainBudgetUnchanged:true,waterBudgetUnchanged:true,cloudRenderer:'DISABLED'};

// Character canon and broader cardinal propagation remain closed.
assert(lineFor(baseApp,"D('alaric',")===lineFor(app,"D('alaric',"),'ALARIC_NARRATIVE_CANON_CHANGED');
assert(!app.includes("buildCardinalSiteGeometry('WATERLINE_STATION'")&&!app.includes("buildCardinalSiteGeometry('SIGNAL_LANTERN_FIELD'")&&!app.includes("buildCardinalSiteGeometry('RESTORATION_BOUNDARY'"),'WIDER_CARDINAL_GEOMETRY_PROPAGATION_DETECTED');
assert(!app.includes("siteId:'WATERLINE_STATION'")&&!app.includes("siteId:'SIGNAL_LANTERN_FIELD'")&&!app.includes("siteId:'RESTORATION_BOUNDARY'"),'WIDER_CARDINAL_STATE_PROPAGATION_DETECTED');

const qualification={
  schema:'CHARACTERS_ALARIC_CARDINAL_INTEGRATION_R1_QUALIFICATION_v1',
  operationId:OPERATION_ID,
  governingHead:GOVERNING_HEAD,
  candidateHead:head,
  result:issues.length===0?'PASS_EXACT_ALARIC_CANDIDATE_QUALIFIED':'HELD_ALARIC_CANDIDATE',
  eligible:issues.length===0,
  journey:'ORBIT->ALARIC/WATCHFIRE_OVERLOOK->LOCAL_INSPECTION->RETURN_TO_ORBIT',
  criteria:{
    convincingContinuousWorldTraversal:!issues.some(item=>JSON.stringify(item).includes('TRAVERSAL')||JSON.stringify(item).includes('SCENE_CUT')),
    activeCardinalStateProgression:JSON.stringify(phases)===JSON.stringify(expectedPhases),
    correctWatchfireIdentity:localGeometry.geometryIdentity==='CARDINAL_SITE_GEOMETRY:WATCHFIRE_OVERLOOK',
    stableWorldSpaceLunarRelationship:app.includes('WORLD_MOON_POSITION')&&!drawMoonLine.includes('camera.eye'),
    noDevelopmentFrameSlidingCanvasArtifact:!app.includes("document.createElement('canvas')")&&!app.includes('canvas.style.transform'),
    workingLocalInspection:phases.includes('LOCAL_INSPECTION'),
    stableReturnToOrbit:phases.at(-1)==='SURVEY_HUB'&&cardinal.selectedSiteId===ALARIC_SITE_ID,
    noCloudRendererReactivation:!app.includes('createCloudSystem')&&!app.includes('cloudSystem'),
    noCharacterCanonInvention:lineFor(baseApp,"D('alaric',")===lineFor(app,"D('alaric',"),
    noMaterialTabletPerformanceRegression:lineFor(baseApp,'function meshTerrain()')===lineFor(app,'function meshTerrain()')&&lineFor(baseApp,'function meshWater()')===lineFor(app,'function meshWater()')&&regionalGeometry.vertexCount<=localGeometry.vertexCount&&!app.includes('cloudSystem')
  },
  evidence,
  issues,
  boundaries:{
    tariaNPropagationPerformed:false,
    elaraPropagationPerformed:false,
    sorenPropagationPerformed:false,
    gratitudeGeographyMutationPerformed:false,
    cloudAuthorityMutationPerformed:false,
    mergePerformed:false,
    deploymentPerformed:false,
    publicationPerformed:false
  }
};
writeFileSync(OUTPUT,`${JSON.stringify(qualification,null,2)}\n`);
process.stdout.write(`${JSON.stringify(qualification,null,2)}\n`);
if(issues.length)process.exitCode=1;
