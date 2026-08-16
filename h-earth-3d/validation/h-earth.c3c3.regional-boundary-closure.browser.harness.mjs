import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { constructHEarthDistantContextGeometry } from '../../showroom/globe/h-earth/render/geometry-distant-context.js';
import { previewHEarthFunctionalLandscape } from '../../showroom/globe/h-earth/render/landscape-preview.js';

const origin=process.env.CP3D_ORIGIN??'http://127.0.0.1:4173';
const evidenceDirectory=process.env.CP3D_EVIDENCE_DIR??'h-earth-3d/validation/evidence/cp3d';
const route=`${origin}/showroom/globe/h-earth/`;
await mkdir(evidenceDirectory,{recursive:true});

const boundaryConstruction=constructHEarthDistantContextGeometry();
assert.equal(boundaryConstruction.ok,true,'C3C3R2_CONNECTED_REGION_CONSTRUCTION_FAILED');
assert.equal(boundaryConstruction.connectedRegionThresholdSystem,true,'C3C3R2_THRESHOLD_SYSTEM_MISSING');
assert.equal(boundaryConstruction.thresholdCount,2,'C3C3R2_TWO_LANDWARD_THRESHOLDS_REQUIRED');
assert.equal(boundaryConstruction.mountainBarricadeRetired,true,'C3C3R2_MOUNTAIN_BARRICADE_NOT_RETIRED');
assert.equal(boundaryConstruction.highlandMaterialIdentityRetired,true,'C3C3R2_HIGHLAND_MATERIAL_IDENTITY_NOT_RETIRED');
assert.equal(boundaryConstruction.highlandFormationAuthorityRetired,true,'C3C3R2_HIGHLAND_FORMATION_AUTHORITY_NOT_RETIRED');
assert.equal(boundaryConstruction.worldVisibleBeyondThreshold,true,'C3C3R2_WORLD_CONTINUATION_MISSING');
assert.equal(boundaryConstruction.adjacentRegionTraversable,false,'C3C3R2_ADJACENT_REGION_BECAME_TRAVERSABLE');
assert.equal(boundaryConstruction.accessibleRegionExpansion,false,'C3C3R2_ACCESSIBLE_REGION_EXPANDED');
const boundaryMetadata=boundaryConstruction.primitives?.[0]?.metadata??{};
assert.equal(boundaryMetadata.semanticBoundaryArchitecturePresent,true,'C3C3R2_BOUNDARY_SEMANTICS_MISSING');
assert.equal(boundaryMetadata.oceanFacingLandmassCreated,false,'C3C3R2_OCEAN_LANDMASS_CREATED');
assert.equal(boundaryMetadata.navigationAddressIds?.length,0,'C3C3R2_NAVIGATION_AUTHORITY_EXPANDED');
assert.equal(boundaryMetadata.collisionAuthority,false,'C3C3R2_COLLISION_AUTHORITY_EXPANDED');
assert.ok(Number(boundaryMetadata.maximumThresholdUplift)<=6,'C3C3R2_THRESHOLD_REVERTED_TO_MOUNTAIN_SCALE');

const assembled=previewHEarthFunctionalLandscape();
assert.equal(assembled.ok,true,'C3C3R2_LANDSCAPE_ASSEMBLY_FAILED');
const renderedOpenWater=assembled.primitives?.find((primitive)=>primitive?.metadata?.bandId==='OPEN_WATER')??null;
assert.ok(renderedOpenWater,'C3C3R2_RENDERED_OPEN_WATER_PRIMITIVE_MISSING');
assert.equal(renderedOpenWater.metadata?.renderedLandscapeMemberRequired,true,'C3C3R2_OPEN_WATER_NOT_BOUND_TO_RENDERED_LANDSCAPE');
assert.equal(renderedOpenWater.metadata?.planetaryOceanLimb,true,'C3C3R2_RENDERED_PLANETARY_LIMB_MISSING');
assert.equal(renderedOpenWater.metadata?.worldSpaceCurvature,true,'C3C3R2_RENDERED_WORLD_SPACE_CURVATURE_MISSING');
assert.equal(renderedOpenWater.metadata?.viewportFixedArc,false,'C3C3R2_RENDERED_VIEWPORT_ARC_PROHIBITED');
assert.equal(renderedOpenWater.metadata?.localShorelineDeformation,false,'C3C3R2_RENDERED_NEAR_SHORE_DEFORMATION');
assert.equal(renderedOpenWater.metadata?.accessibleRegionExpansion,false,'C3C3R2_RENDERED_WATER_EXPANDED_PLAYABLE_REGION');
assert.equal(renderedOpenWater.metadata?.collisionAuthority,false,'C3C3R2_RENDERED_WATER_COLLISION_AUTHORITY_EXPANDED');
assert.equal(renderedOpenWater.metadata?.primaryOceanExposure,'+Z_NORTH','C3C3R2_NORTH_OCEAN_EXPOSURE_LOST');
assert.equal(renderedOpenWater.metadata?.secondaryOceanExposure,'+X_EAST','C3C3R2_EAST_OCEAN_EXPOSURE_LOST');
const waterVertices=renderedOpenWater.geometry?.vertices??[];
assert.ok(waterVertices.length>1000,'C3C3R2_RENDERED_OPEN_WATER_NOT_SEGMENTED');
const waterY=waterVertices.map((vertex)=>vertex.y).filter(Number.isFinite);
assert.ok(waterY.length===waterVertices.length,'C3C3R2_RENDERED_OPEN_WATER_VERTEX_INVALID');
assert.ok(Math.max(...waterY)-Math.min(...waterY)>10,'C3C3R2_RENDERED_PLANETARY_FALLOFF_NOT_GEOMETRICALLY_MATERIAL');

const browser=await chromium.launch({headless:true,args:['--enable-webgl','--ignore-gpu-blocklist','--use-gl=swiftshader','--disable-dev-shm-usage']});

try{
  const page=await browser.newPage({viewport:{width:709,height:1536},deviceScaleFactor:1,isMobile:true,hasTouch:true});
  const consoleErrors=[],pageErrors=[],failedRequests=[];
  page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});
  page.on('pageerror',e=>pageErrors.push(String(e?.stack??e)));
  page.on('requestfailed',r=>failedRequests.push({url:r.url(),failure:r.failure()}));
  const response=await page.goto(route,{waitUntil:'domcontentloaded',timeout:60000});
  assert.ok(response&&response.status()>=200&&response.status()<400,`C3C3R2_HTTP_${response?.status()}`);
  await page.waitForTimeout(7000);
  const boot=await page.evaluate(()=>({
    ready:globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE?.ready===true,
    routeApiPresent:!!globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE,
    routeDataset:{...document.getElementById('h-earth-functional-landscape-route')?.dataset},
    statusText:document.getElementById('h-earth-live-status')?.textContent??null,
    diagnosticError:document.querySelector('.h-earth-runtime-diagnostics__error')?.textContent??null,
    bodyText:document.body?.innerText?.slice(-3000)??null
  }));
  if(!boot.ready){
    const diagnostic={status:'C3C3R2_STARTUP_NOT_READY',boot,consoleErrors,pageErrors,failedRequests};
    await writeFile(`${evidenceDirectory}/c3c3r2-startup-failure.json`,`${JSON.stringify(diagnostic,null,2)}\n`);
    console.log(JSON.stringify(diagnostic,null,2));
    throw new Error(`C3C3R2_STARTUP_NOT_READY:${JSON.stringify({consoleErrors,pageErrors,diagnosticError:boot.diagnosticError,statusText:boot.statusText})}`);
  }

  async function facts(index){return page.evaluate((viewIndex)=>{
    const snapshot=globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE?.getSnapshot?.();
    const r=snapshot?.liveGpu?.resources?.c3c3??null;
    const canvas=document.getElementById('h-earth-functional-landscape-canvas');
    return {viewIndex,href:location.href,canvas:canvas instanceof HTMLCanvasElement,presentations:Number(snapshot?.liveGpu?.counters?.gpuFramebufferPresentationCount??0),selected:snapshot?.liveGpu?.selectedRendererPath??snapshot?.liveGpu?.liveDifferential?.selectedRendererPath??null,c3c3:r};
  },index)}
  async function yaw(pointerId,direction=1){await page.evaluate(async({id,direction})=>{
    const canvas=document.getElementById('h-earth-functional-landscape-canvas');if(!(canvas instanceof HTMLCanvasElement))throw new Error('C3C3R2_CANVAS_MISSING');
    const b=canvas.getBoundingClientRect(),y=b.top+b.height*.48,x0=b.left+b.width*(direction>0?.72:.28),x1=b.left+b.width*(direction>0?.35:.65);
    const emit=(type,x,buttons)=>canvas.dispatchEvent(new PointerEvent(type,{bubbles:true,cancelable:true,pointerId:id,pointerType:'touch',isPrimary:true,clientX:x,clientY:y,buttons,pressure:buttons?0.5:0}));
    emit('pointerdown',x0,1);emit('pointermove',x1,1);await new Promise(r=>setTimeout(r,230));emit('pointerup',x1,0);await new Promise(r=>setTimeout(r,200));
  },{id:pointerId,direction})}

  const views=[await facts(0)];
  for(let i=1;i<=20;i++){await yaw(900+i,1);views.push(await facts(i));}
  for(let i=21;i<=68;i++){await yaw(900+i,-1);views.push(await facts(i));}

  const valid=views.filter(v=>v.c3c3);
  assert.ok(valid.length>=8,'C3C3R2_RECEIPT_NOT_STABLE');
  const o1=valid.map(v=>v.c3c3.O1_WORLD_LOCKED_SUN);
  const projected=o1.map(v=>v?.projection).filter(p=>p?.projected&&Number.isFinite(p.x)&&Number.isFinite(p.y));
  const projectedKeys=new Set(projected.map(p=>`${p.x.toFixed(3)}:${p.y.toFixed(3)}`));
  const visibilityStates=new Set(o1.map(v=>String(v?.projection?.visible)));
  const boundaryViews=valid.filter(v=>v.c3c3.O3_CONNECTED_REGION_BOUNDARIES?.classification==='CONNECTED_REGION_THRESHOLD'&&v.c3c3.O3_CONNECTED_REGION_BOUNDARIES?.materialized===true);
  const oceanViews=valid.filter(v=>v.c3c3.O3_CONNECTED_REGION_BOUNDARIES?.oceanOpen===true&&v.c3c3.O3_CONNECTED_REGION_BOUNDARIES?.openOceanBoxing===false);
  const depthPass=valid.every(v=>v.c3c3.O2_DEPTH_HIERARCHY?.pass===true&&v.c3c3.O2_DEPTH_HIERARCHY?.nearContrastPreserved===true&&v.c3c3.O2_DEPTH_HIERARCHY?.midgroundAerialPerspective===true&&v.c3c3.O2_DEPTH_HIERARCHY?.farAerialPerspective===true);
  const preservationPass=valid.every(v=>{const p=v.c3c3.preservations;return p?.accessibleRegionExpansion===false&&p?.navigationAuthorityMutation===false&&p?.collisionAuthorityMutation===false&&p?.shorelineAuthorityMutation===false&&p?.openOceanPreserved===true&&p?.enlargedRegionScalePreserved===true;});

  assert.ok(o1.every(v=>v?.pass===true&&v?.cameraRelativeFallback===false),'C3C3R2_WORLD_SUN_LOCK_FAILED');
  assert.ok(projectedKeys.size>=2||visibilityStates.size>=2,`C3C3R2_SUN_DID_NOT_MOVE_WITH_CAMERA:${[...projectedKeys]}`);
  assert.equal(depthPass,true,'C3C3R2_DEPTH_HIERARCHY_FAILED');
  assert.ok(boundaryViews.length>=1,'C3C3R2_NO_CONNECTED_REGION_THRESHOLD_ENCOUNTERED');
  assert.ok(oceanViews.length>=1,'C3C3R2_NO_OPEN_OCEAN_VIEW_ENCOUNTERED');
  assert.equal(preservationPass,true,'C3C3R2_PRESERVATION_LAW_FAILED');
  assert.equal(consoleErrors.length,0,`C3C3R2_CONSOLE_ERRORS:${JSON.stringify(consoleErrors)}`);
  assert.equal(pageErrors.length,0,`C3C3R2_PAGE_ERRORS:${JSON.stringify(pageErrors)}`);
  assert.equal(failedRequests.length,0,`C3C3R2_REQUEST_FAILURES:${JSON.stringify(failedRequests)}`);

  const receipt={
    receiptType:'H_EARTH_C3C3R2_RENDERED_PATH_REPAIR_BROWSER_QUALIFICATION_v1',
    eligible:true,
    status:'C3C3R2_MACHINE_QUALIFICATION_PASS',
    route,
    scannedViewCount:views.length,
    projectedSunPositionCount:projectedKeys.size,
    sunVisibilityStates:[...visibilityStates],
    connectedRegionThresholdViewCount:boundaryViews.length,
    openOceanViewCount:oceanViews.length,
    depthHierarchyPass:depthPass,
    preservationPass,
    renderedDrawSetProof:{
      openWaterPrimitiveId:renderedOpenWater.primitiveId,
      planetaryOceanLimb:renderedOpenWater.metadata.planetaryOceanLimb,
      worldSpaceCurvature:renderedOpenWater.metadata.worldSpaceCurvature,
      vertexCount:waterVertices.length,
      verticalRange:Math.max(...waterY)-Math.min(...waterY),
      northOceanExposure:renderedOpenWater.metadata.primaryOceanExposure,
      eastOceanExposure:renderedOpenWater.metadata.secondaryOceanExposure
    },
    sourceConstruction:{
      connectedRegionThresholdSystem:true,
      thresholdCount:boundaryConstruction.thresholdCount,
      mountainBarricadeRetired:boundaryConstruction.mountainBarricadeRetired,
      highlandMaterialIdentityRetired:boundaryConstruction.highlandMaterialIdentityRetired,
      highlandFormationAuthorityRetired:boundaryConstruction.highlandFormationAuthorityRetired,
      worldVisibleBeyondThreshold:boundaryConstruction.worldVisibleBeyondThreshold,
      adjacentRegionTraversable:boundaryConstruction.adjacentRegionTraversable
    },
    consoleErrors,pageErrors,failedRequests,
    ownerInteractiveInspectionRequired:true,
    productionMergeAuthorized:false
  };
  await writeFile(`${evidenceDirectory}/c3c3r2-rendered-path-repair.receipt.json`,`${JSON.stringify(receipt,null,2)}\n`);
  await page.screenshot({path:`${evidenceDirectory}/c3c3r2-qualified-view.png`,fullPage:true});
  console.log(JSON.stringify(receipt,null,2));
}finally{await browser.close();}
