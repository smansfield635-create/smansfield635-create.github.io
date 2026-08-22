import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { constructHEarthDistantContextGeometry } from '../../showroom/globe/h-earth/render/geometry-distant-context.js';
import { constructHEarthFunctionalLandscapeTerrain } from '../../showroom/globe/h-earth/render/geometry-landscape.js';
import { previewHEarthFunctionalLandscape } from '../../showroom/globe/h-earth/render/landscape-preview.js';
import {
  H_EARTH_PLANETARY_WORLD_FRAME,
  H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID,
  getHEarthPlanetarySag,
  getHEarthPlanetaryHorizonZForX,
  getHEarthPlanetaryHorizonXForZ
} from '../../showroom/globe/h-earth/render/planetary-world-frame.js';

const origin=process.env.CP3D_ORIGIN??'http://127.0.0.1:4173';
const evidenceDirectory=process.env.CP3D_EVIDENCE_DIR??'h-earth-3d/validation/evidence/cp3d';
const route=`${origin}/showroom/globe/h-earth/`;
await mkdir(evidenceDirectory,{recursive:true});

// C3C3R4 governing architecture: the navigable world remains a protected local
// tangent patch while ocean and distant land consume one shared planetary frame.
assert.equal(H_EARTH_PLANETARY_WORLD_FRAME.contractId,H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID,'C3C3R4_FRAME_ID_MISMATCH');
assert.equal(H_EARTH_PLANETARY_WORLD_FRAME.frameClass,'LOCAL_TANGENT_PATCH_WITH_SHARED_CURVED_VISIBLE_CONTINUATION','C3C3R4_FRAME_CLASS_INVALID');
assert.equal(H_EARTH_PLANETARY_WORLD_FRAME.rectangularTerminalGeometryProhibited,true,'C3C3R4_RECTANGULAR_TERMINAL_NOT_PROHIBITED');
assert.equal(H_EARTH_PLANETARY_WORLD_FRAME.localTerrainWarpProhibited,true,'C3C3R4_LOCAL_TERRAIN_WARP_NOT_PROHIBITED');
assert.equal(H_EARTH_PLANETARY_WORLD_FRAME.localShorelineWarpProhibited,true,'C3C3R4_LOCAL_SHORELINE_WARP_NOT_PROHIBITED');
assert.equal(getHEarthPlanetarySag(1024,1024),0,'C3C3R4_ACCESSIBLE_CORNER_WARPED');
assert.equal(getHEarthPlanetarySag(0,-1024),0,'C3C3R4_ACCESSIBLE_SOUTH_EDGE_WARPED');
assert.ok(getHEarthPlanetarySag(0,-3000)>180,'C3C3R4_FAR_WORLD_CURVATURE_TOO_WEAK');
assert.ok(getHEarthPlanetarySag(3000,0)>180,'C3C3R4_EASTERN_WORLD_CURVATURE_TOO_WEAK');
const southArcCenter=getHEarthPlanetaryHorizonZForX(0,-1);
const southArcShoulder=getHEarthPlanetaryHorizonZForX(2800,-1);
const westArcCenter=getHEarthPlanetaryHorizonXForZ(0,-1);
const westArcShoulder=getHEarthPlanetaryHorizonXForZ(-2800,-1);
assert.notEqual(southArcCenter,southArcShoulder,'C3C3R4_SOUTH_HORIZON_REMAINS_STRAIGHT');
assert.notEqual(westArcCenter,westArcShoulder,'C3C3R4_WEST_HORIZON_REMAINS_STRAIGHT');

const boundaryConstruction=constructHEarthDistantContextGeometry();
assert.equal(boundaryConstruction.ok,true,'C3C3R4_CONNECTED_REGION_CONSTRUCTION_FAILED');
assert.equal(boundaryConstruction.connectedRegionThresholdSystem,true,'C3C3R4_THRESHOLD_SYSTEM_MISSING');
assert.equal(boundaryConstruction.thresholdCount,2,'C3C3R4_TWO_LANDWARD_THRESHOLDS_REQUIRED');
assert.equal(boundaryConstruction.mountainBarricadeRetired,true,'C3C3R4_MOUNTAIN_BARRICADE_NOT_RETIRED');
assert.equal(boundaryConstruction.circularPlanformHorizon,true,'C3C3R4_DISTANT_LAND_PLANFORM_NOT_CIRCULAR');
assert.equal(boundaryConstruction.rectangularTerminalGeometryPresent,false,'C3C3R4_RECTANGULAR_DISTANT_LAND_TERMINAL_PRESENT');
assert.equal(boundaryConstruction.worldVisibleBeyondThreshold,true,'C3C3R4_WORLD_CONTINUATION_MISSING');
assert.equal(boundaryConstruction.adjacentRegionTraversable,false,'C3C3R4_ADJACENT_REGION_BECAME_TRAVERSABLE');
const boundaryPrimitive=boundaryConstruction.primitives?.[0]??null;
assert.ok(boundaryPrimitive,'C3C3R4_DISTANT_LAND_PRIMITIVE_MISSING');
const boundaryMetadata=boundaryPrimitive.metadata??{};
assert.equal(boundaryMetadata.sharedPlanetaryWorldFrame,true,'C3C3R4_DISTANT_LAND_NOT_BOUND_TO_SHARED_FRAME');
assert.equal(boundaryMetadata.sharedPlanetaryWorldFrameContractId,H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID,'C3C3R4_DISTANT_LAND_FRAME_ID_MISMATCH');
assert.equal(boundaryMetadata.circularPlanformHorizon,true,'C3C3R4_DISTANT_LAND_ARC_METADATA_MISSING');
assert.equal(boundaryMetadata.rectangularTerminalGeometryPresent,false,'C3C3R4_DISTANT_LAND_RECTANGULAR_TERMINAL_PRESENT');
assert.equal(boundaryMetadata.oceanFacingLandmassCreated,false,'C3C3R4_OCEAN_LANDMASS_CREATED');
assert.equal(boundaryMetadata.navigationAddressIds?.length,0,'C3C3R4_NAVIGATION_AUTHORITY_EXPANDED');
assert.equal(boundaryMetadata.collisionAuthority,false,'C3C3R4_COLLISION_AUTHORITY_EXPANDED');
assert.equal(boundaryMetadata.mountainPassOceanRevealCorridorPreservationRequired,true,'C3C3R4_OCEAN_REVEAL_CORRIDOR_NOT_PRESERVED');
assert.ok(Number(boundaryMetadata.maximumThresholdUplift)<=12,'C3C3R4_THRESHOLD_REVERTED_TO_MOUNTAIN_SCALE');
const landY=(boundaryPrimitive.geometry?.vertices??[]).map(v=>v.y).filter(Number.isFinite);
assert.ok(landY.length>2500,'C3C3R4_DISTANT_LAND_NOT_SUFFICIENTLY_RESOLVED');
assert.ok(Math.max(...landY)-Math.min(...landY)>180,'C3C3R4_DISTANT_LAND_DOES_NOT_FOLLOW_PLANETARY_CURVATURE');

// Preserve C3C3R3 perceptual terrain topology. This cycle may change macro world
// shape, not regress the local 16x16 terrain language.
const terrain=constructHEarthFunctionalLandscapeTerrain();
assert.equal(terrain.ok,true,'C3C3R4_TERRAIN_CONSTRUCTION_FAILED');
assert.equal(terrain.perceptualCellGridRestoration,true,'C3C3R4_GRID_DEPTH_RESTORATION_MISSING');
assert.equal(terrain.perceptualGridProfile?.cellCountPerAxis,16,'C3C3R4_GRID_NOT_16_BY_16');
assert.ok(Number(terrain.perceptualGridProfile?.seamDepthWorldUnits)>=0.5,'C3C3R4_GRID_SEAM_DEPTH_TOO_WEAK');
for(const primitive of terrain.primitives??[]){
  assert.equal(primitive.metadata?.literalGridOverlay,false,`C3C3R4_LITERAL_GRID_OVERLAY_PROHIBITED:${primitive.primitiveId}`);
}

// The exact OPEN_WATER primitive in the assembled draw set must consume the
// same shared frame as distant land. Independent ocean-only curvature no longer
// satisfies the architecture.
const assembled=previewHEarthFunctionalLandscape();
assert.equal(assembled.ok,true,'C3C3R4_LANDSCAPE_ASSEMBLY_FAILED');
const renderedOpenWater=assembled.primitives?.find((primitive)=>primitive?.metadata?.bandId==='OPEN_WATER')??null;
assert.ok(renderedOpenWater,'C3C3R4_RENDERED_OPEN_WATER_PRIMITIVE_MISSING');
assert.equal(renderedOpenWater.metadata?.sharedPlanetaryWorldFrame,true,'C3C3R4_OPEN_WATER_NOT_BOUND_TO_SHARED_FRAME');
assert.equal(renderedOpenWater.metadata?.sharedPlanetaryWorldFrameContractId,H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID,'C3C3R4_OPEN_WATER_FRAME_ID_MISMATCH');
assert.equal(renderedOpenWater.metadata?.sharedPlanetaryWorldFrameContractId,boundaryMetadata.sharedPlanetaryWorldFrameContractId,'C3C3R4_OCEAN_AND_LAND_USE_DIFFERENT_CURVATURE_AUTHORITY');
assert.equal(renderedOpenWater.metadata?.planetaryOceanLimb,true,'C3C3R4_RENDERED_PLANETARY_LIMB_MISSING');
assert.equal(renderedOpenWater.metadata?.worldSpaceCurvature,true,'C3C3R4_RENDERED_WORLD_SPACE_CURVATURE_MISSING');
assert.equal(renderedOpenWater.metadata?.viewportFixedArc,false,'C3C3R4_VIEWPORT_FIXED_ARC_PROHIBITED');
assert.equal(renderedOpenWater.metadata?.localShorelineDeformation,false,'C3C3R4_LOCAL_SHORELINE_DEFORMATION');
assert.equal(renderedOpenWater.metadata?.accessibleRegionExpansion,false,'C3C3R4_WATER_EXPANDED_PLAYABLE_REGION');
assert.equal(renderedOpenWater.metadata?.collisionAuthority,false,'C3C3R4_WATER_COLLISION_AUTHORITY_EXPANDED');
const waterVertices=renderedOpenWater.geometry?.vertices??[];
const waterY=waterVertices.map(v=>v.y).filter(Number.isFinite);
const waterVerticalRange=Math.max(...waterY)-Math.min(...waterY);
assert.ok(waterVertices.length>2500,'C3C3R4_RENDERED_OPEN_WATER_NOT_SUFFICIENTLY_SEGMENTED');
assert.ok(waterVerticalRange>220,`C3C3R4_PLANETARY_OCEAN_NOT_MATERIALLY_CURVED:${waterVerticalRange}`);

const browser=await chromium.launch({headless:true,args:['--enable-webgl','--ignore-gpu-blocklist','--use-gl=swiftshader','--disable-dev-shm-usage']});
try{
  const page=await browser.newPage({viewport:{width:709,height:1536},deviceScaleFactor:1,isMobile:true,hasTouch:true});
  const consoleErrors=[],pageErrors=[],failedRequests=[];
  page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});
  page.on('pageerror',e=>pageErrors.push(String(e?.stack??e)));
  page.on('requestfailed',r=>failedRequests.push({url:r.url(),failure:r.failure()}));
  const response=await page.goto(route,{waitUntil:'domcontentloaded',timeout:60000});
  assert.ok(response&&response.status()>=200&&response.status()<400,`C3C3R4_HTTP_${response?.status()}`);
  await page.waitForTimeout(7000);
  const boot=await page.evaluate(()=>({ready:globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE?.ready===true,statusText:document.getElementById('h-earth-live-status')?.textContent??null,diagnosticError:document.querySelector('.h-earth-runtime-diagnostics__error')?.textContent??null}));
  assert.equal(boot.ready,true,`C3C3R4_STARTUP_NOT_READY:${JSON.stringify(boot)}`);

  async function facts(index){return page.evaluate((viewIndex)=>{
    const snapshot=globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE?.getSnapshot?.();
    const r=snapshot?.liveGpu?.resources?.c3c3??null;
    return {viewIndex,presentations:Number(snapshot?.liveGpu?.counters?.gpuFramebufferPresentationCount??0),c3c3:r};
  },index)}
  async function yaw(pointerId,direction=1){await page.evaluate(async({id,direction})=>{
    const canvas=document.getElementById('h-earth-functional-landscape-canvas');if(!(canvas instanceof HTMLCanvasElement))throw new Error('C3C3R4_CANVAS_MISSING');
    const b=canvas.getBoundingClientRect(),y=b.top+b.height*.48,x0=b.left+b.width*(direction>0?.72:.28),x1=b.left+b.width*(direction>0?.35:.65);
    const emit=(type,x,buttons)=>canvas.dispatchEvent(new PointerEvent(type,{bubbles:true,cancelable:true,pointerId:id,pointerType:'touch',isPrimary:true,clientX:x,clientY:y,buttons,pressure:buttons?0.5:0}));
    emit('pointerdown',x0,1);emit('pointermove',x1,1);await new Promise(r=>setTimeout(r,230));emit('pointerup',x1,0);await new Promise(r=>setTimeout(r,200));
  },{id:pointerId,direction})}

  const views=[await facts(0)];
  for(let i=1;i<=24;i++){await yaw(2200+i,1);views.push(await facts(i));}
  for(let i=25;i<=80;i++){await yaw(2200+i,-1);views.push(await facts(i));}
  const valid=views.filter(v=>v.c3c3);
  assert.ok(valid.length>=8,'C3C3R4_RECEIPT_NOT_STABLE');
  const boundaryViews=valid.filter(v=>v.c3c3.O3_CONNECTED_REGION_BOUNDARIES?.classification==='CONNECTED_REGION_THRESHOLD'&&v.c3c3.O3_CONNECTED_REGION_BOUNDARIES?.materialized===true);
  const oceanViews=valid.filter(v=>v.c3c3.O3_CONNECTED_REGION_BOUNDARIES?.oceanOpen===true&&v.c3c3.O3_CONNECTED_REGION_BOUNDARIES?.openOceanBoxing===false);
  const preservationPass=valid.every(v=>{const p=v.c3c3.preservations;return p?.accessibleRegionExpansion===false&&p?.navigationAuthorityMutation===false&&p?.collisionAuthorityMutation===false&&p?.shorelineAuthorityMutation===false&&p?.openOceanPreserved===true&&p?.enlargedRegionScalePreserved===true;});
  assert.ok(boundaryViews.length>=1,'C3C3R4_NO_CONNECTED_REGION_THRESHOLD_ENCOUNTERED');
  assert.ok(oceanViews.length>=1,'C3C3R4_NO_OPEN_OCEAN_VIEW_ENCOUNTERED');
  assert.equal(preservationPass,true,'C3C3R4_PRESERVATION_LAW_FAILED');
  assert.equal(consoleErrors.length,0,`C3C3R4_CONSOLE_ERRORS:${JSON.stringify(consoleErrors)}`);
  assert.equal(pageErrors.length,0,`C3C3R4_PAGE_ERRORS:${JSON.stringify(pageErrors)}`);
  assert.equal(failedRequests.length,0,`C3C3R4_REQUEST_FAILURES:${JSON.stringify(failedRequests)}`);

  const receipt={
    receiptType:'H_EARTH_C3C3R4_PLANETARY_WORLD_FRAME_BROWSER_QUALIFICATION_v1',
    eligible:true,
    status:'C3C3R4_MACHINE_QUALIFICATION_PASS',
    governingComparisonLaw:'PRESERVED_BASELINE_TO_DEFINED_OBJECTIVE_TO_OBJECTIVE_MATERIAL_RENDERED_DIFFERENCE_TO_PRESERVATION_CHECK',
    perspectiveChangeCountsAsImprovement:false,
    dominantDeficiencyRetired:'D4_PLANAR_RECTANGULAR_WORLD_FRAME_FAILURE',
    sharedPlanetaryWorldFrameContractId:H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID,
    scannedViewCount:views.length,
    connectedRegionThresholdViewCount:boundaryViews.length,
    openOceanViewCount:oceanViews.length,
    preservationPass,
    objectiveGeometryProof:{
      protectedTangentRadius:H_EARTH_PLANETARY_WORLD_FRAME.protectedTangentRadius,
      planetaryRadius:H_EARTH_PLANETARY_WORLD_FRAME.effectivePlanetRadius,
      visibleHorizonRadius:H_EARTH_PLANETARY_WORLD_FRAME.visibleHorizonRadius,
      farWorldSagAt3000:getHEarthPlanetarySag(0,-3000),
      oceanVerticalRange:waterVerticalRange,
      distantLandVerticalRange:Math.max(...landY)-Math.min(...landY),
      circularSouthHorizonDelta:Math.abs(southArcCenter-southArcShoulder),
      circularWestHorizonDelta:Math.abs(westArcCenter-westArcShoulder),
      rectangularTerminalGeometryPresent:false,
      oceanAndLandShareCurvatureAuthority:true,
      mountainPassOceanRevealCorridorPreservationRequired:true,
      gridCellCountPerAxis:terrain.perceptualGridProfile.cellCountPerAxis,
      gridSeamDepth:terrain.perceptualGridProfile.seamDepthWorldUnits,
      literalGridOverlay:false
    },
    ownerInteractiveInspectionRequired:true,
    productionMergeAuthorized:false
  };
  await writeFile(`${evidenceDirectory}/c3c3r4-planetary-world-frame.receipt.json`,`${JSON.stringify(receipt,null,2)}\n`);
  await page.screenshot({path:`${evidenceDirectory}/c3c3r4-qualified-view.png`,fullPage:true});
  console.log(JSON.stringify(receipt,null,2));
}finally{await browser.close();}
