import fs from 'node:fs';
import crypto from 'node:crypto';
import {evaluateStep9RegionalBridge,STEP9_SCALE_CONTRACT,STEP9_DESTINATION_BINDINGS} from '../../../characters/step9-regional-geography.mjs';

const sha256=value=>crypto.createHash('sha256').update(value).digest('hex');
const appPath='characters/app.mjs';
const bridgePath='characters/step9-regional-geography.mjs';
const app=fs.readFileSync(appPath,'utf8');
const bridge=fs.readFileSync(bridgePath,'utf8');
const issues=[];
const check=(condition,code)=>{if(!condition)issues.push(code);};

const bridgeReceipt=evaluateStep9RegionalBridge();
check(bridgeReceipt.status==='PASS','REGIONAL_BRIDGE_EXECUTABLE_FAIL');
check(bridgeReceipt.issues.length===0,'REGIONAL_BRIDGE_ISSUES_PRESENT');
check(STEP9_SCALE_CONTRACT.regional==='CHARACTERS_NIGHTTIME_GRATITUDE_HARBOR','REGIONAL_SCALE_IDENTITY_DRIFT');
check(STEP9_SCALE_CONTRACT.ground==='H_EARTH','GROUND_SCALE_IDENTITY_DRIFT');
check(STEP9_SCALE_CONTRACT.regionalDiscoveryMayExceedPlayableGroundDomain===true,'DISCOVERY_EXTENT_BOUNDARY_DRIFT');
check(STEP9_SCALE_CONTRACT.regionalContinuationGrantsTraversalAuthority===false,'TRAVERSAL_AUTHORITY_LEAK');
check(STEP9_SCALE_CONTRACT.accessibilityStatusDeferredToCharacterCardBoundary===true,'CARD_ACCESSIBILITY_BOUNDARY_DRIFT');
check(STEP9_SCALE_CONTRACT.scenesConstructed===false,'SCENE_SCOPE_LEAK');
check(STEP9_SCALE_CONTRACT.gameplayConstructed===false,'GAMEPLAY_SCOPE_LEAK');
check(Object.keys(STEP9_DESTINATION_BINDINGS).length===11,'DESTINATION_BINDING_COUNT_DRIFT');

check(app.includes("from './step9-regional-geography.mjs'"),'APP_NOT_BOUND_TO_STEP9_BRIDGE');
check(app.includes('step9TerrainHeight'),'APP_TERRAIN_NOT_DERIVED');
check(app.includes('step9ShorelineZ'),'APP_SHORELINE_NOT_DERIVED');
check(app.includes('resolveStep9Site'),'APP_DESTINATIONS_NOT_DERIVED');
check(app.includes('step9MapPosition'),'APP_MAP_NOT_DERIVED');
check(!app.includes('const COAST='),'INDEPENDENT_COASTLINE_RETAINED');
check(!app.includes('function shorelineZ('),'INDEPENDENT_SHORELINE_FUNCTION_RETAINED');
check(!app.includes('function terrainHeight('),'INDEPENDENT_TERRAIN_FUNCTION_RETAINED');
check(!/D\('[^']+',\s*-?\d+\s*,\s*-?\d+/.test(app),'DUPLICATED_DESTINATION_XZ_RETAINED');
check(app.includes("import {GRATITUDE_COAST_NIGHT,NIGHT_FRAGMENT_SHADER,nightUniforms,discoveryStarStyle} from './night-renderer.mjs';"),'NIGHT_RENDERER_BINDING_LOST');
check(app.includes("import {deriveNarrativeWorldState} from './narrative-world-state.mjs';"),'NARRATIVE_STATE_BINDING_LOST');
check(app.includes("const moonProgram=makeProgram(MOON_VS,MOON_FS);"),'MOON_PRESENTATION_LOST');
check(app.includes('function meshWater()'),'WATER_PRESENTATION_LOST');
check(app.includes("const ORBIT={eye:[0,365,590],look:[70,24,-660]};"),'ORBIT_TRAVEL_GRAMMAR_DRIFT');
check(app.includes("const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;"),'REDUCED_MOTION_BOUNDARY_LOST');

const forbidden=['gameLoop','playerController','combat','inventorySystem','questRuntime','enterScene(','sceneRuntime'];
for(const token of forbidden)check(!bridge.includes(token),`FORBIDDEN_STEP9_SCOPE_TOKEN:${token}`);

const receipt={
  schema:'CHARACTERS_STEP9_REGIONAL_BRIDGE_VERIFICATION_RECEIPT_v1',
  result:issues.length?'FAIL':'PASS',
  geographyAuthority:'AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_AUTHORITY_v1',
  regionalDiscoveryMayExceedPlayableGroundDomain:true,
  traversalAuthorityGranted:false,
  accessibilityStatusDeferredToCharacterCardBoundary:true,
  destinationBindingCount:Object.keys(STEP9_DESTINATION_BINDINGS).length,
  independentCoastlineRetained:false,
  independentTerrainEquationRetained:false,
  duplicatedDestinationCoordinatesRetained:false,
  nighttimePresentationPreserved:true,
  scenesConstructed:false,
  gameplayConstructed:false,
  sourceFingerprint:sha256(`${appPath}:${sha256(app)}\n${bridgePath}:${sha256(bridge)}`),
  bridgeReceipt,
  issues
};
receipt.receiptSha256=sha256(JSON.stringify(receipt));
console.log(JSON.stringify(receipt,null,2));
if(issues.length)process.exitCode=1;
