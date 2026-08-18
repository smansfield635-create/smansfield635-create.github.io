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
const checks={previewEligible:preview.ok===true,gratitudeIdentity:preview.geographicIdentity?.playableRegion==='GRATITUDE',audraliaIdentity:preview.geographicIdentity?.continentalContext==='AUDRALIA',subtropicalIdentity:preview.geographicIdentity?.climate==='WARM_SUBTROPICAL_COASTAL',worldManifoldContinuous:preview.continuousWorldManifold===true,oceanFacingEmptiness:preview.oceanFacingEmptinessPreserved===true,oppositeShoreProhibited:preview.oppositeShoreFabricationProhibited===true,farContextEligible:far.ok===true,farContextAudralia:far.geographicIdentity==='AUDRALIA',farContextDerivedOnly:far.independentGeographyAuthority===false,farContextNoNavigation:far.primitives.every(p=>p.metadata?.navigable===false),surfaceSamplesEligible:samples.every(s=>evaluateHEarthRun8CSuccessorSurfaceMaterial(s).eligible===true),surfaceSamplesSubtropical:samples.every(s=>s.climateIdentity==='WARM_SUBTROPICAL_COASTAL'),frameEligible:evaluation.eligible===true,frameIdentity:frame.geographicIdentity?.playableRegion==='GRATITUDE'&&frame.geographicIdentity?.continentalContext==='AUDRALIA',singleDepthDomain:frame.singlePhysicalDepthDomain===true,skyClosed:raster?.alphaClosed===true,worldEnvelopeVisible:raster?.skyPixelCount>0,noRendererAuthority:frame.rendererAuthorityCreated===false,noCameraAuthority:frame.cameraAuthorityCreated===false,noDeployment:frame.deployment===false};
const issues=Object.entries(checks).filter(([,pass])=>!pass).map(([name])=>name);
const receipt={schema:'H_EARTH_GRATITUDE_AUDRALIA_FINAL_EXPRESSION_QUALIFICATION_RECEIPT_v1',result:issues.length?'FAIL':'PASS',checks,issues,diagnostics:{primitiveCount:frame?.primitiveCount??0,farTriangleCount:far?.meshDiagnostics?.triangleCount??0,suppressedOceanCellCount:far?.meshDiagnostics?.suppressedOceanCellCount??0,retainedLandCellCount:far?.meshDiagnostics?.retainedLandCellCount??0,skyPixelCount:raster?.skyPixelCount??0}};
console.log(JSON.stringify(receipt,null,2));
if(issues.length)process.exitCode=1;
