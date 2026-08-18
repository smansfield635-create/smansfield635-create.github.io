#!/usr/bin/env node
import { previewHEarthFunctionalLandscape } from '../../showroom/globe/h-earth/render/landscape-preview.js';
import { constructHEarthDistantContextGeometry } from '../../showroom/globe/h-earth/render/geometry-distant-context.js';
import { constructHEarthRun8ESuccessorEnvironmentFrame,evaluateHEarthRun8EFrame,prepareHEarthRun8ERenderPlan,rasterizeHEarthRun8ERenderPlan } from '../../showroom/globe/h-earth/render/run8e-successor-environment.js';
import { sampleHEarthRun8CSuccessorSurfaceMaterial,evaluateHEarthRun8CSuccessorSurfaceMaterial } from '../environment/h-earth.successor-surface-material.run8c.js';
const camera={position:{x:0,y:26,z:48},target:{x:0,y:8,z:-96},up:{x:0,y:1,z:0},fieldOfViewDegrees:58,nearPlane:0.1,farPlane:3328};
const viewport={width:320,height:180,pixelRatio:1};
const preview=previewHEarthFunctionalLandscape({cameraWorld:camera.position});
const far=constructHEarthDistantContextGeometry({cameraWorld:camera.position});
const samples=[[-80,-80],[0,-96],[80,-112],[0,-180]].map(([x,z])=>sampleHEarthRun8CSuccessorSurfaceMaterial(x,z));
const frame=constructHEarthRun8ESuccessorEnvironmentFrame({camera,viewport});
const evaluation=evaluateHEarthRun8EFrame(frame);
const plan=frame.ok?prepareHEarthRun8ERenderPlan(frame,viewport):null;
const raster=plan?.eligible?rasterizeHEarthRun8ERenderPlan(plan,frame):null;
const farLand=far.primitives.find(p=>p.metadata?.farSurfaceClass==='LAND'),farOcean=far.primitives.find(p=>p.metadata?.farSurfaceClass==='OCEAN');
const maxRing=Math.max(...(far.representationPlan?.rings??[0]));
const checks={
previewEligible:preview.ok===true,
gratitudeIdentity:preview.geographicIdentity?.playableRegion==='GRATITUDE',
audraliaIdentity:preview.geographicIdentity?.continentalContext==='AUDRALIA',
subtropicalIdentity:preview.geographicIdentity?.climate==='WARM_SUBTROPICAL_COASTAL',
worldManifoldContinuous:preview.continuousWorldManifold===true,
oceanFacingEmptiness:preview.oceanFacingEmptinessPreserved===true,
oceanVisualContinuation:preview.oceanVisualContinuationMaterialized===true,
reciprocalFarClasses:Array.isArray(preview.reciprocalFarSurfaceClasses)&&preview.reciprocalFarSurfaceClasses.join(',')==='LAND,OCEAN',
oppositeShoreProhibited:preview.oppositeShoreFabricationProhibited===true,
accessibleExtentFrozen:preview.accessibleRegionExpansion===false,
farContextEligible:far.ok===true,
farContextAudralia:far.geographicIdentity==='AUDRALIA',
farContextDerivedOnly:far.independentGeographyAuthority===false,
farContextLandAndOcean:far.primitives.length===2&&!!farLand&&!!farOcean,
farContextNoNavigation:far.primitives.every(p=>p.metadata?.navigable===false&&p.metadata?.collisionAuthority===false&&p.metadata?.accessibleRegionExpansion===false),
farOceanNoLandmass:farOcean?.metadata?.oceanFacingLandmassCreated===false&&farOcean?.metadata?.oceanFacingWaterContinuation===true,
horizonBeyondCamera:maxRing>camera.farPlane,
surfaceSamplesEligible:samples.every(s=>evaluateHEarthRun8CSuccessorSurfaceMaterial(s).eligible===true),
surfaceSamplesSubtropical:samples.every(s=>s.climateIdentity==='WARM_SUBTROPICAL_COASTAL'),
surfaceCausalityExpanded:samples.every(s=>Number.isFinite(s.lowlandMoistureRetention)&&Number.isFinite(s.shelterMoisture)&&Number.isFinite(s.exposureDrying)),
frameEligible:evaluation.eligible===true,
frameIdentity:frame.geographicIdentity?.playableRegion==='GRATITUDE'&&frame.geographicIdentity?.continentalContext==='AUDRALIA',
frameReciprocalContinuation:frame.oceanVisualContinuationMaterialized===true&&frame.farOceanPrimitiveCount===1&&frame.farLandPrimitiveCount===1,
singleDepthDomain:frame.singlePhysicalDepthDomain===true,
skyClosed:raster?.alphaClosed===true,
worldEnvelopeVisible:raster?.skyPixelCount>0,
rasterOceanContinuation:raster?.oceanVisualContinuationMaterialized===true,
noRendererAuthority:frame.rendererAuthorityCreated===false,
noCameraAuthority:frame.cameraAuthorityCreated===false,
noDeployment:frame.deployment===false
};
const deficiencyDisposition={D01:checks.oceanVisualContinuation&&checks.horizonBeyondCamera?'MACHINE_ADDRESSED_PENDING_OWNER_VISUAL':'UNRESOLVED',D02:checks.reciprocalFarClasses&&checks.frameReciprocalContinuation?'MACHINE_ADDRESSED_PENDING_OWNER_VISUAL':'UNRESOLVED',D03:checks.surfaceSamplesSubtropical&&checks.surfaceCausalityExpanded?'MACHINE_ADDRESSED_PENDING_OWNER_VISUAL':'UNRESOLVED',D04:checks.surfaceCausalityExpanded?'MACHINE_ADDRESSED_PENDING_OWNER_VISUAL':'UNRESOLVED',D05:'PRESERVED_FOR_LATER_REGIONAL_BELIEVABILITY_RECONCILIATION',D06:checks.accessibleExtentFrozen?'ARCHITECTURALLY_PRESERVED':'UNRESOLVED',D07:checks.gratitudeIdentity&&checks.audraliaIdentity&&checks.subtropicalIdentity?'RECIPROCAL_IDENTITY_EXPLICIT':'UNRESOLVED',D08:'PENDING_OWNER_BELIEVABILITY_DISPOSITION'};
const issues=Object.entries(checks).filter(([,pass])=>!pass).map(([name])=>name);
const receipt={schema:'H_EARTH_GRATITUDE_AUDRALIA_RECIPROCAL_REGIONAL_REPAIR_QUALIFICATION_RECEIPT_v1',result:issues.length?'FAIL':'PASS',baselineHead:'e7259d40726a7890b34140a9d4154232bf2d91f6',checks,deficiencyDisposition,issues,diagnostics:{primitiveCount:frame?.primitiveCount??0,farTriangleCount:far?.meshDiagnostics?.triangleCount??0,retainedLandCellCount:far?.meshDiagnostics?.retainedLandCellCount??0,retainedOceanCellCount:far?.meshDiagnostics?.retainedOceanCellCount??0,maxFarRing:maxRing,skyPixelCount:raster?.skyPixelCount??0}};
console.log(JSON.stringify(receipt,null,2));
if(issues.length)process.exitCode=1;
