import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import {
  H_EARTH_PLANETARY_WORLD_FRAME,
  H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID,
  getHEarthPlanetarySag,
  getHEarthDerivedHorizonDistance
} from '../../showroom/globe/h-earth/render/planetary-world-frame.js';
import {
  H_EARTH_RUN_8B_C3C3R5_PERCEPTUAL_GRID_PROFILE,
  constructHEarthRun8BSuccessorTerrainAndMountain
} from '../../showroom/globe/h-earth/render/geometry-successor-terrain.run8b.js';
import {
  H_EARTH_RUN_8B_C3C3R5_MACRO_COMPOSITION_PROFILE,
  evaluateHEarthRun8BSuccessorTerrainField,
  sampleHEarthRun8BSuccessorTerrainField
} from '../terrain/h-earth.successor-terrain-field.run8b.js';
import { constructHEarthDistantContextGeometry } from '../../showroom/globe/h-earth/render/geometry-distant-context.js';
import { buildHEarthRun8ENeutralPackage } from '../../showroom/globe/h-earth/render/run8e-successor-environment.js';
import { getHEarthOW01CanonicalLiveRenderPackageOccurrence } from '../../showroom/globe/h-earth/render/live-render-package.run8e-r2.canonical.js';
import { createHEarthRun8ER2DCanonicalGPUUploadViews } from '../../showroom/globe/h-earth/render/gpu-upload-views.run8e-r2d.js';
import {
  H_EARTH_RUN_8C_C3C3R5_LAYERED_COLOR_PROFILE,
  sampleHEarthRun8CSuccessorSurfaceMaterial
} from '../environment/h-earth.successor-surface-material.run8c.js';
import { buildHEarthRun8ER3AWaypointPacket } from '../../showroom/globe/h-earth/render/live-renderer-contract.run8e-r3a.js';

const origin=process.env.CP3D_ORIGIN??'http://127.0.0.1:4173';
const evidenceDirectory=process.env.CP3D_EVIDENCE_DIR??'h-earth-3d/validation/evidence/cp3d';
await mkdir(evidenceDirectory,{recursive:true});

assert.equal(H_EARTH_PLANETARY_WORLD_FRAME.contractId,H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID,'R5_PLANET_FRAME_ID_MISMATCH');
assert.equal(H_EARTH_PLANETARY_WORLD_FRAME.frameClass,'LOCAL_CARTESIAN_TANGENT_PATCH_TO_TRUE_SPHERICAL_CONTINUATION','R5_PLANET_FRAME_CLASS_INVALID');
assert.equal(H_EARTH_PLANETARY_WORLD_FRAME.yOnlySagProxyProhibited,true,'R5_Y_ONLY_SAG_NOT_PROHIBITED');
assert.equal(H_EARTH_PLANETARY_WORLD_FRAME.viewportFixedCurvature,false,'R5_VIEWPORT_CURVATURE_REINTRODUCED');
assert.equal(getHEarthPlanetarySag(700,700),0,'R5_PROTECTED_TANGENT_PATCH_WARPED');
assert.ok(getHEarthPlanetarySag(0,-3000)>0,'R5_FAR_PLANETARY_CURVATURE_MISSING');
assert.ok(getHEarthDerivedHorizonDistance(12)>2500,'R5_DERIVED_HORIZON_INVALID');

assert.equal(H_EARTH_RUN_8B_C3C3R5_PERCEPTUAL_GRID_PROFILE.cellCountPerAxis,16,'R5_LIVE_GRID_NOT_16X16');
assert.ok(H_EARTH_RUN_8B_C3C3R5_PERCEPTUAL_GRID_PROFILE.seamDepthWorldUnits>=0.5,'R5_LIVE_GRID_DEPTH_TOO_WEAK');
assert.equal(H_EARTH_RUN_8B_C3C3R5_PERCEPTUAL_GRID_PROFILE.literalGridOverlayProhibited,true,'R5_LITERAL_GRID_OVERLAY_ALLOWED');
const terrain=constructHEarthRun8BSuccessorTerrainAndMountain();
assert.equal(terrain.ok,true,'R5_LIVE_SUCCESSOR_TERRAIN_FAILED');

assert.equal(H_EARTH_RUN_8C_C3C3R5_LAYERED_COLOR_PROFILE.structuralTerrainOpacity,1,'R5_STRUCTURAL_TERRAIN_NOT_OPAQUE');
assert.equal(H_EARTH_RUN_8C_C3C3R5_LAYERED_COLOR_PROFILE.backgroundLeakagePermitted,false,'R5_LAYERED_COLOR_BACKGROUND_LEAKAGE_ALLOWED');
assert.equal(H_EARTH_RUN_8C_C3C3R5_LAYERED_COLOR_PROFILE.compositionModel,'OPAQUE_STRUCTURAL_TERRAIN_PLUS_TRANSLUCENT_SPATIALLY_VARIANT_ENVIRONMENTAL_TINT_PRECOMPOSED','R5_LAYERED_COLOR_COMPOSITION_MODEL_INVALID');
const materialSamples=[[-180,-160],[-60,-150],[60,-155],[180,-170]].map(([x,z])=>sampleHEarthRun8CSuccessorSurfaceMaterial(x,z));
assert.ok(materialSamples.every(sample=>sample.valid===true),'R5_MATERIAL_SAMPLE_INVALID');
const tintStrengths=materialSamples.map(sample=>sample.environmentalTintStrength??0);
assert.ok(Math.max(...tintStrengths)-Math.min(...tintStrengths)>0.001,'R5_TINT_NOT_SPATIALLY_VARIANT');
assert.ok(materialSamples.every(sample=>sample.structuralTerrainOpaque===true&&sample.framebufferBackgroundLeakage===false),'R5_LAYERED_COLOR_LEAKS_BACKGROUND');

const distant=constructHEarthDistantContextGeometry();
assert.equal(distant.ok,true,'R5_DISTANT_CONTEXT_CONSTRUCTION_FAILED');
assert.equal(distant.rectangularTerminalGeometryPresent,false,'R5_RECTANGULAR_DISTANT_TERMINAL_PRESENT');
assert.equal(distant.adjacentRegionTraversable,false,'R5_DISTANT_CONTEXT_BECAME_TRAVERSABLE');
const distantIds=distant.primitives.map(p=>p.primitiveId);

const currentNeutral=buildHEarthRun8ENeutralPackage({compositionMode:'CONTENT_ADDRESSED_CURRENT_TERRAIN'});
assert.equal(currentNeutral.ok,true,'R5_CURRENT_NEUTRAL_PACKAGE_FAILED');
assert.equal(currentNeutral.currentPlanetaryDistantContextIncluded,true,'R5_D10_DISTANT_CONTEXT_NOT_ADMITTED_TO_CURRENT_PACKAGE');
assert.ok(currentNeutral.distantContextPrimitiveCount>=1,'R5_D10_DISTANT_CONTEXT_COUNT_ZERO');
assert.ok(distantIds.every(id=>currentNeutral.primitiveIds.includes(id)),'R5_D10_DISTANT_CONTEXT_IDS_MISSING_FROM_CURRENT_PACKAGE');

const fieldEvaluation=evaluateHEarthRun8BSuccessorTerrainField();
assert.equal(fieldEvaluation.eligible,true,`R5_D11_SUCCESSOR_FIELD_INVALID:${fieldEvaluation.issues.join(',')}`);
assert.equal(H_EARTH_RUN_8B_C3C3R5_MACRO_COMPOSITION_PROFILE.orientation,'EAST_FACING_TOWARD_OPEN_OCEAN','R5_D11_REVEAL_ORIENTATION_INVALID');
const revealSamples=[[-72,-254],[-48,-254],[-24,-254],[0,-254],[24,-254]].map(([x,z])=>sampleHEarthRun8BSuccessorTerrainField(x,z));
assert.ok(revealSamples.some(sample=>sample.macroCompositionApplied===true&&sample.macroCompositionCut>4),'R5_D11_OCEAN_REVEAL_CORRIDOR_NOT_MATERIAL');
assert.ok(revealSamples.every(sample=>sample.macroCompositionCut<=sample.preCompositionMountainContribution+1e-9),'R5_D11_REVEAL_CUT_BASE_TERRAIN');

const livePackage=getHEarthOW01CanonicalLiveRenderPackageOccurrence();
assert.equal(livePackage.eligible,true,'R5_LIVE_PACKAGE_INELIGIBLE');
assert.ok(distantIds.every(id=>livePackage.primitiveIds.includes(id)),'R5_D10_DISTANT_CONTEXT_MISSING_FROM_CANONICAL_LIVE_PACKAGE');
const distantSpans=livePackage.primitiveSpans.filter(span=>distantIds.includes(span.primitiveId));
assert.equal(distantSpans.length,distantIds.length,'R5_D10_DISTANT_CONTEXT_DRAW_SPAN_MISSING');
assert.ok(distantSpans.every(span=>span.indexCount>0&&span.vertexCount>0),'R5_D10_DISTANT_CONTEXT_DRAW_SPAN_EMPTY');

const gpu=createHEarthRun8ER2DCanonicalGPUUploadViews(livePackage);
assert.equal(gpu.deterministicTransportEncoding,true,'R5_GPU_TRANSPORT_NOT_DETERMINISTIC');
assert.equal(gpu.positions.length,livePackage.vertexCount*3,'R5_GPU_POSITION_COUNT_MISMATCH');
assert.equal(gpu.normals.length,livePackage.vertexCount*3,'R5_GPU_NORMAL_COUNT_MISMATCH');
assert.equal(gpu.baseColorsLinear.length,livePackage.vertexCount*4,'R5_GPU_COLOR_COUNT_MISMATCH');
assert.equal(gpu.materialParameters.length,livePackage.vertexCount*4,'R5_GPU_MATERIAL_COUNT_MISMATCH');

const cameraPacket=buildHEarthRun8ER3AWaypointPacket('COAST',{width:709,height:1536,pixelRatio:1},1);
assert.equal(cameraPacket.status,'RUN_8E_R3A_FRAME_UNIFORM_PACKET_COMPLETE','R5_CAMERA_PACKET_FAILED');
assert.equal(cameraPacket.planetRelativeCameraConsumed,true,'R5_PLANET_RELATIVE_CAMERA_NOT_CONSUMED');
assert.equal(cameraPacket.planetaryWorldFrameContractId,H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID,'R5_CAMERA_PLANET_FRAME_ID_MISMATCH');
assert.ok(Math.hypot(cameraPacket.camera.up.x,cameraPacket.camera.up.y,cameraPacket.camera.up.z)>0.99,'R5_CAMERA_UP_INVALID');

const browser=await chromium.launch({headless:true,args:['--enable-webgl','--ignore-gpu-blocklist','--use-gl=swiftshader','--disable-dev-shm-usage']});
const screenshotPath=`${evidenceDirectory}/c3c3r5-deep-layer-qualified-view.png`;
try{
  const page=await browser.newPage({viewport:{width:709,height:1536},deviceScaleFactor:1,isMobile:true,hasTouch:true});
  const consoleErrors=[],pageErrors=[],failedRequests=[];
  page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});
  page.on('pageerror',e=>pageErrors.push(String(e?.stack??e)));
  page.on('requestfailed',r=>failedRequests.push({url:r.url(),failure:r.failure()}));
  const response=await page.goto(`${origin}/showroom/globe/h-earth/`,{waitUntil:'domcontentloaded',timeout:60000});
  assert.ok(response&&response.status()>=200&&response.status()<400,`R5_HTTP_${response?.status()}`);
  await page.waitForTimeout(7000);
  const snapshot=await page.evaluate(()=>globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE?.getSnapshot?.()??null);
  assert.equal(Boolean(snapshot),true,'R5_PUBLIC_SNAPSHOT_MISSING');
  assert.equal(snapshot?.eligible,true,'R5_PUBLIC_RECEIPT_INELIGIBLE');
  assert.equal(snapshot?.liveGpu?.eligible,true,'R5_LIVE_GPU_RECEIPT_INELIGIBLE');
  assert.equal(snapshot?.liveGpu?.status,'RUN_8E_R3D3_LIVE_GPU_CAMERA_RESPONSE_ACTIVE','R5_LIVE_GPU_NOT_ACTIVE');
  assert.ok((snapshot?.liveGpu?.counters?.gpuFramebufferPresentationCount??0)>0,'R5_LIVE_GPU_NO_PRESENTED_FRAME');
  assert.ok((snapshot?.liveGpu?.resources?.counters?.contextCreationCount??0)>0,'R5_WEBGL2_CONTEXT_NOT_CREATED');
  assert.equal(consoleErrors.length,0,`R5_CONSOLE_ERRORS:${JSON.stringify(consoleErrors)}`);
  assert.equal(pageErrors.length,0,`R5_PAGE_ERRORS:${JSON.stringify(pageErrors)}`);
  assert.equal(failedRequests.length,0,`R5_REQUEST_FAILURES:${JSON.stringify(failedRequests)}`);
  await page.screenshot({path:screenshotPath,fullPage:true});
} finally { await browser.close(); }

const receipt={
  receiptType:'H_EARTH_C3C3R5_DEEP_LAYER_CLOSURE_QUALIFICATION_v1',
  status:'PASS_CLOSED',
  perspectiveChangeCountsAsImprovement:false,
  layers:{D5:'PASS',D6:'PASS',D7:'SOURCE_PATH_PROVEN',D8:'SOURCE_PATH_PROVEN',D9:'PASS',D10:'PASS',D11:'MACHINE_PASS'},
  planetaryWorldFrameContractId:H_EARTH_PLANETARY_WORLD_FRAME_CONTRACT_ID,
  liveGridProfile:H_EARTH_RUN_8B_C3C3R5_PERCEPTUAL_GRID_PROFILE,
  layeredColorProfile:H_EARTH_RUN_8C_C3C3R5_LAYERED_COLOR_PROFILE,
  macroCompositionProfile:H_EARTH_RUN_8B_C3C3R5_MACRO_COMPOSITION_PROFILE,
  currentNeutralPrimitiveCount:currentNeutral.primitiveCount,
  distantContextPrimitiveIds:distantIds,
  canonicalLivePackageIdentity:livePackage.packageIdentity,
  canonicalLivePackageDigest:livePackage.contentDigest,
  distantContextDrawSpanCount:distantSpans.length,
  maximumObservedRevealCut:Math.max(...revealSamples.map(sample=>sample.macroCompositionCut)),
  gpuTransportProven:true,
  planetRelativeCameraProven:true,
  ownerVisualInspectionNotYetAuthorized:true,
  remainingLayer:'D12_SEPARATE_VISUAL_EXPERIENTIAL_AUDIT'
};
await writeFile(`${evidenceDirectory}/c3c3r5-deep-layer-closure.receipt.json`,`${JSON.stringify(receipt,null,2)}\n`);
console.log(JSON.stringify(receipt,null,2));
