import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { constructHEarthDistantContextGeometry } from '../../showroom/globe/h-earth/render/geometry-distant-context.js';
import { constructHEarthFunctionalLandscapeTerrain } from '../../showroom/globe/h-earth/render/geometry-landscape.js';
import { previewHEarthFunctionalLandscape } from '../../showroom/globe/h-earth/render/landscape-preview.js';

const origin=process.env.CP3D_ORIGIN??'http://127.0.0.1:4173';
const evidenceDirectory=process.env.CP3D_EVIDENCE_DIR??'h-earth-3d/validation/evidence/cp3d';
const route=`${origin}/showroom/globe/h-earth/`;
await mkdir(evidenceDirectory,{recursive:true});

// Objective O1: regional thresholds must have material world-space expression,
// not merely semantic metadata, while remaining far below mountain-wall scale.
const boundaryConstruction=constructHEarthDistantContextGeometry();
assert.equal(boundaryConstruction.ok,true,'C3C3R3_CONNECTED_REGION_CONSTRUCTION_FAILED');
assert.equal(boundaryConstruction.connectedRegionThresholdSystem,true,'C3C3R3_THRESHOLD_SYSTEM_MISSING');
assert.equal(boundaryConstruction.objectiveVisibleRegionalThresholds,true,'C3C3R3_OBJECTIVE_VISIBLE_THRESHOLD_FLAG_MISSING');
assert.equal(boundaryConstruction.thresholdCount,2,'C3C3R3_TWO_LANDWARD_THRESHOLDS_REQUIRED');
assert.equal(boundaryConstruction.mountainBarricadeRetired,true,'C3C3R3_MOUNTAIN_BARRICADE_NOT_RETIRED');
assert.equal(boundaryConstruction.worldVisibleBeyondThreshold,true,'C3C3R3_WORLD_CONTINUATION_MISSING');
assert.equal(boundaryConstruction.adjacentRegionTraversable,false,'C3C3R3_ADJACENT_REGION_BECAME_TRAVERSABLE');
const boundaryMetadata=boundaryConstruction.primitives?.[0]?.metadata??{};
assert.equal(boundaryMetadata.semanticBoundaryArchitecturePresent,true,'C3C3R3_BOUNDARY_SEMANTICS_MISSING');
assert.equal(boundaryMetadata.oceanFacingLandmassCreated,false,'C3C3R3_OCEAN_LANDMASS_CREATED');
assert.equal(boundaryMetadata.navigationAddressIds?.length,0,'C3C3R3_NAVIGATION_AUTHORITY_EXPANDED');
assert.equal(boundaryMetadata.collisionAuthority,false,'C3C3R3_COLLISION_AUTHORITY_EXPANDED');
assert.ok(Number(boundaryMetadata.minimumThresholdUplift)>=3,'C3C3R3_THRESHOLD_TOO_WEAK_TO_BE_OBJECTIVELY_LEGIBLE');
assert.ok(Number(boundaryMetadata.maximumThresholdUplift)>=8,'C3C3R3_THRESHOLD_OBJECTIVE_DELTA_TOO_SMALL');
assert.ok(Number(boundaryMetadata.maximumThresholdUplift)<=12,'C3C3R3_THRESHOLD_REVERTED_TO_MOUNTAIN_SCALE');

// Objective O3: subtropical color is preserved but terrain topology must remain
// perceptible through actual world-space cell relief. No screen-space grid overlay.
const terrain=constructHEarthFunctionalLandscapeTerrain();
assert.equal(terrain.ok,true,'C3C3R3_TERRAIN_CONSTRUCTION_FAILED');
assert.equal(terrain.perceptualCellGridRestoration,true,'C3C3R3_GRID_DEPTH_RESTORATION_MISSING');
assert.equal(terrain.perceptualGridProfile?.cellCountPerAxis,16,'C3C3R3_GRID_NOT_16_BY_16');
assert.ok(Number(terrain.perceptualGridProfile?.seamDepthWorldUnits)>=0.5,'C3C3R3_GRID_SEAM_DEPTH_TOO_WEAK');
for(const primitive of terrain.primitives??[]){
  assert.equal(primitive.metadata?.perceptualCellGridRestoration,true,`C3C3R3_GRID_RESTORATION_NOT_BOUND:${primitive.primitiveId}`);
  assert.equal(primitive.metadata?.literalGridOverlay,false,`C3C3R3_LITERAL_GRID_OVERLAY_PROHIBITED:${primitive.primitiveId}`);
  assert.equal(primitive.metadata?.colorTopologyLaw,'COLOR_MAY_DESCRIBE_REGION_BUT_MAY_NOT_ERASE_TERRAIN_TOPOLOGY',`C3C3R3_COLOR_TOPOLOGY_LAW_MISSING:${primitive.primitiveId}`);
}

// Objective O2: the exact OPEN_WATER primitive in the assembled landscape must
// carry a large enough vertical range to be a material planetary limb, while
// the near shoreline remains undeformed and non-traversable.
const assembled=previewHEarthFunctionalLandscape();
assert.equal(assembled.ok,true,'C3C3R3_LANDSCAPE_ASSEMBLY_FAILED');
const renderedOpenWater=assembled.primitives?.find((primitive)=>primitive?.metadata?.bandId==='OPEN_WATER')??null;
assert.ok(renderedOpenWater,'C3C3R3_RENDERED_OPEN_WATER_PRIMITIVE_MISSING');
assert.equal(renderedOpenWater.metadata?.renderedLandscapeMemberRequired,true,'C3C3R3_OPEN_WATER_NOT_BOUND_TO_RENDERED_LANDSCAPE');
assert.equal(renderedOpenWater.metadata?.planetaryOceanLimb,true,'C3C3R3_RENDERED_PLANETARY_LIMB_MISSING');
assert.equal(renderedOpenWater.metadata?.objectiveVisiblePlanetaryLimb,true,'C3C3R3_OBJECTIVE_VISIBLE_PLANETARY_LIMB_MISSING');
assert.equal(renderedOpenWater.metadata?.worldSpaceCurvature,true,'C3C3R3_RENDERED_WORLD_SPACE_CURVATURE_MISSING');
assert.equal(renderedOpenWater.metadata?.viewportFixedArc,false,'C3C3R3_RENDERED_VIEWPORT_ARC_PROHIBITED');
assert.equal(renderedOpenWater.metadata?.localShorelineDeformation,false,'C3C3R3_RENDERED_NEAR_SHORE_DEFORMATION');
assert.equal(renderedOpenWater.metadata?.accessibleRegionExpansion,false,'C3C3R3_RENDERED_WATER_EXPANDED_PLAYABLE_REGION');
assert.equal(renderedOpenWater.metadata?.collisionAuthority,false,'C3C3R3_RENDERED_WATER_COLLISION_AUTHORITY_EXPANDED');
assert.ok(Number(renderedOpenWater.metadata?.planetaryMaximumDrop)>=200,'C3C3R3_PLANETARY_MAX_DROP_TOO_SMALL');
assert.ok(Number(renderedOpenWater.metadata?.planetaryRadius)<=15000,'C3C3R3_PLANETARY_RADIUS_TOO_FLAT_FOR_OBJECTIVE');
const waterVertices=renderedOpenWater.geometry?.vertices??[];
const waterY=waterVertices.map((vertex)=>vertex.y).filter(Number.isFinite);
const waterVerticalRange=Math.max(...waterY)-Math.min(...waterY);
assert.ok(waterVertices.length>1500,'C3C3R3_RENDERED_OPEN_WATER_NOT_SUFFICIENTLY_SEGMENTED');
assert.ok(waterY.length===waterVertices.length,'C3C3R3_RENDERED_OPEN_WATER_VERTEX_INVALID');
assert.ok(waterVerticalRange>=160,`C3C3R3_PLANETARY_FALLOFF_NOT_OBJECTIVELY_MATERIAL:${waterVerticalRange}`);

const browser=await chromium.launch({headless:true,args:['--enable-webgl','--ignore-gpu-blocklist','--use-gl=swiftshader','--disable-dev-shm-usage']});
try{
  const page=await browser.newPage({viewport:{width:709,height:1536},deviceScaleFactor:1,isMobile:true,hasTouch:true});
  const consoleErrors=[],pageErrors=[],failedRequests=[];
  page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});
  page.on('pageerror',e=>pageErrors.push(String(e?.stack??e)));
  page.on('requestfailed',r=>failedRequests.push({url:r.url(),failure:r.failure()}));
  const response=await page.goto(route,{waitUntil:'domcontentloaded',timeout:60000});
  assert.ok(response&&response.status()>=200&&response.status()<400,`C3C3R3_HTTP_${response?.status()}`);
  await page.waitForTimeout(7000);
  const boot=await page.evaluate(()=>({
    ready:globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE?.ready===true,
    routeApiPresent:!!globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE,
    routeDataset:{...document.getElementById('h-earth-functional-landscape-route')?.dataset},
    statusText:document.getElementById('h-earth-live-status')?.textContent??null,
    diagnosticError:document.querySelector('.h-earth-runtime-diagnostics__error')?.textContent??null
  }));
  assert.equal(boot.ready,true,`C3C3R3_STARTUP_NOT_READY:${JSON.stringify(boot)}`);

  async function facts(index){return page.evaluate((viewIndex)=>{
    const snapshot=globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE?.getSnapshot?.();
    const r=snapshot?.liveGpu?.resources?.c3c3??null;
    const canvas=document.getElementById('h-earth-functional-landscape-canvas');
    return {viewIndex,canvas:canvas instanceof HTMLCanvasElement,presentations:Number(snapshot?.liveGpu?.counters?.gpuFramebufferPresentationCount??0),c3c3:r};
  },index)}
  async function yaw(pointerId,direction=1){await page.evaluate(async({id,direction})=>{
    const canvas=document.getElementById('h-earth-functional-landscape-canvas');if(!(canvas instanceof HTMLCanvasElement))throw new Error('C3C3R3_CANVAS_MISSING');
    const b=canvas.getBoundingClientRect(),y=b.top+b.height*.48,x0=b.left+b.width*(direction>0?.72:.28),x1=b.left+b.width*(direction>0?.35:.65);
    const emit=(type,x,buttons)=>canvas.dispatchEvent(new PointerEvent(type,{bubbles:true,cancelable:true,pointerId:id,pointerType:'touch',isPrimary:true,clientX:x,clientY:y,buttons,pressure:buttons?0.5:0}));
    emit('pointerdown',x0,1);emit('pointermove',x1,1);await new Promise(r=>setTimeout(r,230));emit('pointerup',x1,0);await new Promise(r=>setTimeout(r,200));
  },{id:pointerId,direction})}

  const views=[await facts(0)];
  for(let i=1;i<=20;i++){await yaw(1200+i,1);views.push(await facts(i));}
  for(let i=21;i<=68;i++){await yaw(1200+i,-1);views.push(await facts(i));}
  const valid=views.filter(v=>v.c3c3);
  assert.ok(valid.length>=8,'C3C3R3_RECEIPT_NOT_STABLE');
  const boundaryViews=valid.filter(v=>v.c3c3.O3_CONNECTED_REGION_BOUNDARIES?.classification==='CONNECTED_REGION_THRESHOLD'&&v.c3c3.O3_CONNECTED_REGION_BOUNDARIES?.materialized===true);
  const oceanViews=valid.filter(v=>v.c3c3.O3_CONNECTED_REGION_BOUNDARIES?.oceanOpen===true&&v.c3c3.O3_CONNECTED_REGION_BOUNDARIES?.openOceanBoxing===false);
  const preservationPass=valid.every(v=>{const p=v.c3c3.preservations;return p?.accessibleRegionExpansion===false&&p?.navigationAuthorityMutation===false&&p?.collisionAuthorityMutation===false&&p?.shorelineAuthorityMutation===false&&p?.openOceanPreserved===true&&p?.enlargedRegionScalePreserved===true;});
  assert.ok(boundaryViews.length>=1,'C3C3R3_NO_CONNECTED_REGION_THRESHOLD_ENCOUNTERED');
  assert.ok(oceanViews.length>=1,'C3C3R3_NO_OPEN_OCEAN_VIEW_ENCOUNTERED');
  assert.equal(preservationPass,true,'C3C3R3_PRESERVATION_LAW_FAILED');
  assert.equal(consoleErrors.length,0,`C3C3R3_CONSOLE_ERRORS:${JSON.stringify(consoleErrors)}`);
  assert.equal(pageErrors.length,0,`C3C3R3_PAGE_ERRORS:${JSON.stringify(pageErrors)}`);
  assert.equal(failedRequests.length,0,`C3C3R3_REQUEST_FAILURES:${JSON.stringify(failedRequests)}`);

  const receipt={
    receiptType:'H_EARTH_C3C3R3_OBJECTIVE_VISIBLE_REPAIR_BROWSER_QUALIFICATION_v1',
    eligible:true,
    status:'C3C3R3_MACHINE_QUALIFICATION_PASS',
    governingComparisonLaw:'BASELINE_TO_DEFINED_OBJECTIVE_TO_VISIBLE_MATERIAL_DIFFERENCE_TO_PRESERVATION_CHECK',
    perspectiveChangeCountsAsImprovement:false,
    scannedViewCount:views.length,
    connectedRegionThresholdViewCount:boundaryViews.length,
    openOceanViewCount:oceanViews.length,
    preservationPass,
    objectiveGeometryProof:{
      thresholdMinimumUplift:boundaryMetadata.minimumThresholdUplift,
      thresholdMaximumUplift:boundaryMetadata.maximumThresholdUplift,
      thresholdVisualClass:boundaryMetadata.thresholdVisualClass,
      oceanVerticalRange:waterVerticalRange,
      oceanPlanetaryRadius:renderedOpenWater.metadata.planetaryRadius,
      oceanMaximumDrop:renderedOpenWater.metadata.planetaryMaximumDrop,
      gridCellCountPerAxis:terrain.perceptualGridProfile.cellCountPerAxis,
      gridSeamDepth:terrain.perceptualGridProfile.seamDepthWorldUnits,
      literalGridOverlay:false
    },
    ownerInteractiveInspectionRequired:true,
    productionMergeAuthorized:false
  };
  await writeFile(`${evidenceDirectory}/c3c3r3-objective-visible-repair.receipt.json`,`${JSON.stringify(receipt,null,2)}\n`);
  await page.screenshot({path:`${evidenceDirectory}/c3c3r3-qualified-view.png`,fullPage:true});
  console.log(JSON.stringify(receipt,null,2));
}finally{await browser.close();}
