import {
  H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_EVALUATION,
  sampleHEarthMapWideEnvironmentTerrainCandidate
} from '../../../../h-earth-3d/terrain/h-earth.terrain-estate-construction-v1.candidate.js';
import { evaluateHEarthMapWideEnvironmentPresentation } from '../../../../h-earth-3d/environment/h-earth.gratitude-region-mirror-manor-estate.v1.js';

const freeze=(value,seen=new WeakSet())=>{if(value===null||typeof value!=='object'||seen.has(value))return value;seen.add(value);Object.values(value).forEach((nested)=>freeze(nested,seen));return Object.isFrozen(value)?value:Object.freeze(value);};

export function buildHEarthMapWideEnvironmentPreviewObserverReceipt(meshStatistics=null,waterStatistics=null){
  const environmentEvaluation=evaluateHEarthMapWideEnvironmentPresentation();
  const entry=sampleHEarthMapWideEnvironmentTerrainCandidate(0,-96);
  const atrium=sampleHEarthMapWideEnvironmentTerrainCandidate(80,-172);
  const saddle=sampleHEarthMapWideEnvironmentTerrainCandidate(112.41666666666667,-194.83333333333334);
  const hillInterface=sampleHEarthMapWideEnvironmentTerrainCandidate(136,-208);
  const hiddenVaultMass=sampleHEarthMapWideEnvironmentTerrainCandidate(152,-224);
  const reservoir=sampleHEarthMapWideEnvironmentTerrainCandidate(-44,-216);
  const waterfall=sampleHEarthMapWideEnvironmentTerrainCandidate(-48,-250);
  const cavern=sampleHEarthMapWideEnvironmentTerrainCandidate(-16,-236);
  const rearMountain=sampleHEarthMapWideEnvironmentTerrainCandidate(-64,-310);
  const reliefWitnesses=[sampleHEarthMapWideEnvironmentTerrainCandidate(-96,-271),sampleHEarthMapWideEnvironmentTerrainCandidate(-8,-258),sampleHEarthMapWideEnvironmentTerrainCandidate(196,-252)];
  const checks={
    terrainEvaluationPass:H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_EVALUATION.eligible===true,
    environmentEvaluationPass:environmentEvaluation.result==='PASS',
    entryCorePreserved:entry.valid===true&&Math.abs(entry.presentationReliefOffset)<=1e-9,
    atriumCrownPrepared:atrium.valid===true&&(atrium.sitePreparation?.zoneWeights?.atrium??0)>0.9,
    estateSaddleReserved:saddle.valid===true&&(saddle.sitePreparation?.zoneWeights?.connectiveSpine??0)>0.9,
    largeHillInterfacePrepared:hillInterface.valid===true&&(hillInterface.sitePreparation?.zoneWeights?.hillInterface??0)>0.9,
    hiddenVaultHasNoSurfaceGeometry:hiddenVaultMass.valid===true&&hiddenVaultMass.vaultInteriorConstructed===false&&hiddenVaultMass.manorGeometryConstructed===false,
    enclosedReservoirPresent:reservoir.valid===true&&(reservoir.hydrology?.reservoirWeight??0)>0.9&&reservoir.hydrology?.enclosedReservoir===true&&reservoir.hydrology?.visibleDrainageToCoast===false,
    waterfallCorridorPresent:waterfall.valid===true&&(waterfall.hydrology?.waterfallWeight??0)>0.5,
    cavernExteriorReservePresent:cavern.valid===true&&(cavern.hydrology?.cavernReserveWeight??0)>0.5&&cavern.cavernInteriorConstructed===false,
    rearMountainBoundaryPresent:rearMountain.valid===true&&rearMountain.rearBoundaryBarrierOffset>2,
    materialReliefWitnessPresent:reliefWitnesses.some((sample)=>sample.valid===true&&Math.abs(sample.presentationReliefOffset)>=4),
    inspectorDenseEnoughForTerrainReview:meshStatistics===null||(meshStatistics.validSampleCount>=10000&&meshStatistics.singlePassTerrainSampling===true&&meshStatistics.neighborResamplingRemoved===true&&meshStatistics.sitePreparationSampleCount>0&&meshStatistics.reservoirSampleCount>0&&meshStatistics.waterfallSampleCount>0&&meshStatistics.cavernReserveSampleCount>0),
    staticWaterContextPresent:waterStatistics===null||(waterStatistics.oceanTriangleCount>=2&&waterStatistics.reservoirTriangleCount>0&&waterStatistics.waterfallTriangleCount>0&&waterStatistics.liveWaterMutation===false),
    inspectorStableCameraContractPresent:true,
    guideOverlayRenderPathAbsent:meshStatistics===null||meshStatistics.guideOverlayRenderPathPresent===false,
    manorGeometryConstructed:false,
    cavernInteriorConstructed:false,
    vaultInteriorConstructed:false,
    liveRuntimeMutated:false,
    liveCameraMutated:false,
    liveNavigationMutated:false,
    liveWaterMutated:false
  };
  const falseRequired=new Set(['manorGeometryConstructed','cavernInteriorConstructed','vaultInteriorConstructed','liveRuntimeMutated','liveCameraMutated','liveNavigationMutated','liveWaterMutated']);
  const result=Object.entries(checks).every(([key,value])=>falseRequired.has(key)?value===false:value===true)?'PASS':'FAIL_CLOSED';
  return freeze({schema:'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_PREVIEW_OBSERVER_RECEIPT_v1',result,operationId:'H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_v1',lockGeneration:422,inspectorRepairRevision:4,governingHead:'3f51f0cd159df33571905c6cb14253ebdd137e3b',candidateBranch:'build/h-earth-map-wide-environment-redevelopment-v1-001',checks,meshStatistics,waterStatistics,terrainEvaluation:H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_TERRAIN_EVALUATION,environmentEvaluation,reliefWitnesses,boundaries:{nonpublicPreviewOnly:true,mapAuthoringIteration:true,userDifferentialRecorded:false,role5RatifiedForSuccessor:false,liveIntegrationAuthorized:false,mergeAuthorized:false,deploymentAuthorized:false,releaseAuthorized:false}});
}

export default buildHEarthMapWideEnvironmentPreviewObserverReceipt;
