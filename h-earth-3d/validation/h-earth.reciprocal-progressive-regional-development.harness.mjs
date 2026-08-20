#!/usr/bin/env node
import fs from 'node:fs';
import crypto from 'node:crypto';
import { sampleHEarthWorldManifold,H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID } from '../terrain/h-earth.world-manifold-domain.js';
import { canonicalizeHEarthRun8BElevation,deriveHEarthGen311RegionalArticulation,sampleHEarthRun8BSuccessorTerrainField,H_EARTH_GEN311_REGIONAL_ARTICULATION_CONTRACT_ID } from '../terrain/h-earth.successor-terrain-field.run8b.js';
import { sampleHEarthRun8CSuccessorSurfaceMaterial,evaluateHEarthRun8CSuccessorSurfaceMaterial,H_EARTH_GEN311_REGIONAL_MATERIAL_RESPONSE_CONTRACT_ID } from '../environment/h-earth.successor-surface-material.run8c.js';
import { buildHEarthGen311SuccessorVegetation,evaluateHEarthGen311SuccessorVegetation,H_EARTH_GEN311_SUCCESSOR_VEGETATION_CONTRACT_ID } from '../environment/h-earth.successor-vegetation.run8d.js';
import { previewHEarthFunctionalLandscape,H_EARTH_GEN311_REGIONAL_RELIEF_CONTRACT_ID } from '../../showroom/globe/h-earth/render/landscape-preview.js';
import { constructHEarthRun8ESuccessorEnvironmentFrame,evaluateHEarthRun8EFrame } from '../../showroom/globe/h-earth/render/run8e-successor-environment.js';

const PROTECTED_BASELINE='87b982314a149b6fd88d3552360697d798af3e08';
const PROTECTED_CANONICAL_TERRAIN_BLOB='f4f65b05ab303a11fb1d9c4e25de211fde73722a';
const canonicalTerrainPath=new URL('../terrain/h-earth.terrain-field.js',import.meta.url);
const terrainBytes=fs.readFileSync(canonicalTerrainPath);
const gitBlobSha=crypto.createHash('sha1').update(`blob ${terrainBytes.length}\0`).update(terrainBytes).digest('hex');
const points=[];
for(let z=-224;z<=-48;z+=16)for(let x=-160;x<=160;x+=20)points.push([x,z]);
const samples=points.map(([x,z])=>{
  const world=sampleHEarthWorldManifold(x,z);
  const terrain=sampleHEarthRun8BSuccessorTerrainField(x,z);
  const articulation=deriveHEarthGen311RegionalArticulation(x,z);
  const material=sampleHEarthRun8CSuccessorSurfaceMaterial(x,z);
  return {x,z,world,terrain,articulation,material};
});
const valid=samples.filter(s=>s.world?.valid===true&&s.terrain?.valid===true&&s.articulation?.valid===true&&s.material?.valid===true);
const classes=[...new Set(valid.map(s=>s.articulation.landformClass))].sort();
const maxima={ridge:0,pass:0,valley:0,watershed:0,foothill:0};
const minima={ridge:1,pass:1,valley:1,watershed:1,foothill:1};
for(const s of valid){
  const values={ridge:s.articulation.ridgeSignal,pass:s.articulation.passSignal,valley:s.articulation.valleySignal,watershed:s.articulation.watershedSignal,foothill:s.articulation.foothillSignal};
  for(const [k,v] of Object.entries(values)){maxima[k]=Math.max(maxima[k],v);minima[k]=Math.min(minima[k],v);}
}
const signalSpread=Object.fromEntries(Object.keys(maxima).map(k=>[k,maxima[k]-minima[k]]));
const materialClasses=[...new Set(valid.map(s=>s.material.landformClass))].sort();
const materialProfiles=[...new Set(valid.map(s=>`${s.material.surfaceClass}:${s.material.landformClass}:${Math.round(s.material.wetness*10)}:${Math.round(s.material.rockExposure*10)}`))];
const vegetation=buildHEarthGen311SuccessorVegetation();
const vegetationEval=evaluateHEarthGen311SuccessorVegetation(vegetation);
const ecologicalZones=Object.keys(vegetation.zoneCounts??{}).filter(k=>(vegetation.zoneCounts[k]??0)>0).sort();
const preview=previewHEarthFunctionalLandscape({cameraWorld:{x:0,y:26,z:48}});
const relief=preview.regionalRelief;
const camera={position:{x:0,y:26,z:48},target:{x:0,y:8,z:-96},up:{x:0,y:1,z:0},fieldOfViewDegrees:58,nearPlane:.1,farPlane:3328};
const frame=constructHEarthRun8ESuccessorEnvironmentFrame({camera,viewport:{width:320,height:180,pixelRatio:1}});
const frameEval=evaluateHEarthRun8EFrame(frame);
const elevationDrift=valid.map(s=>Math.abs(s.terrain.elevation-canonicalizeHEarthRun8BElevation(s.world.elevation)));
const maxElevationDrift=elevationDrift.length?Math.max(...elevationDrift):Infinity;
const materialEvaluations=valid.map(s=>evaluateHEarthRun8CSuccessorSurfaceMaterial(s.material));
const checks={
  protectedBaselineDeclared:PROTECTED_BASELINE==='87b982314a149b6fd88d3552360697d798af3e08',
  canonicalTerrainBlobPreserved:gitBlobSha===PROTECTED_CANONICAL_TERRAIN_BLOB,
  sampleCoverage:valid.length>=150&&valid.length===samples.length,
  topologyIdentityPreserved:valid.every(s=>s.world.topologySourceId===H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID&&s.terrain.topologySourceId===H_EARTH_WORLD_MANIFOLD_TOPOLOGY_SOURCE_ID),
  canonicalElevationPreserved:maxElevationDrift<=1/16777216,
  articulationContractBound:valid.every(s=>s.articulation.contractId===H_EARTH_GEN311_REGIONAL_ARTICULATION_CONTRACT_ID&&s.articulation.independentGeographyAuthority===false&&s.articulation.elevationMutated===false&&s.articulation.topologyMutated===false),
  regionalClassDiversity:classes.length>=4,
  ridgelineSignalMaterial:maxima.ridge>.12&&signalSpread.ridge>.06,
  passSignalMaterial:maxima.pass>.12&&signalSpread.pass>.06,
  valleySignalMaterial:maxima.valley>.12&&signalSpread.valley>.06,
  watershedSignalMaterial:maxima.watershed>.12&&signalSpread.watershed>.06,
  foothillSignalMaterial:maxima.foothill>.12&&signalSpread.foothill>.06,
  materialContractBound:valid.every(s=>s.material.regionalMaterialResponseContractId===H_EARTH_GEN311_REGIONAL_MATERIAL_RESPONSE_CONTRACT_ID),
  materialSamplesEligible:materialEvaluations.every(e=>e.eligible===true),
  materialRegionalDiversity:materialClasses.length>=4&&materialProfiles.length>=8,
  materialCausality:valid.every(s=>Number.isFinite(s.material.drainageRetention)&&Number.isFinite(s.material.orographicExposure)&&Number.isFinite(s.material.foothillTransition)&&Number.isFinite(s.material.valleyMoistureRetention)),
  vegetationContractBound:vegetation.contractId===H_EARTH_GEN311_SUCCESSOR_VEGETATION_CONTRACT_ID,
  vegetationEligible:vegetationEval.eligible===true,
  vegetationIdentityPreserved:vegetation.populationIdentityPreserved===true&&vegetation.semanticAddressesPreserved===true&&vegetation.worldAnchorsPreserved===true,
  vegetationRegionalDiversity:ecologicalZones.length>=3,
  previewEligible:preview.ok===true,
  previewRegionalWitnesses:preview.regionalDevelopment?.sampleCount>=20&&preview.regionalDevelopment?.derivedFromCanonicalWorldManifold===true,
  physicalRegionalReliefMaterialized:relief?.ok===true&&relief?.contractId===H_EARTH_GEN311_REGIONAL_RELIEF_CONTRACT_ID&&preview.regionalReliefMaterialized===true,
  physicalRegionalReliefCoverage:(relief?.nonzeroVertexCount??0)>=100,
  physicalRidgelineDepth:(relief?.maximumPositiveDelta??0)>=8,
  physicalValleyDepth:(relief?.maximumNegativeDelta??0)<=-2,
  physicalReliefIsNonAuthoritative:relief?.canonicalWorldFieldMutated===false&&relief?.canonicalElevationValuesPreservedAtSource===true&&relief?.independentGeographyAuthority===false&&relief?.topologyMutation===false&&relief?.accessibleRegionExpansion===false,
  semanticProvenancePreserved:preview.semanticAddressCount===256&&preview.terrainAddressCount===124&&preview.shorelineWaterAddressCount===96&&preview.proxySummarizedAddressCount===36,
  worldManifoldPreserved:preview.continuousWorldManifold===true&&preview.canonicalWorldFieldProtected===true&&preview.accessibleRegionExpansion===false,
  frameEligible:frameEval.eligible===true,
  frameRegionalEnvironment:frame.regionalEnvironmentMaterialized===true&&frame.regionalEcologyPrimitiveCount>0,
  noCameraNavigationScaleFaking:frame.cameraAuthorityCreated===false&&frame.rendererAuthorityCreated===false&&frame.deployment===false&&frame.canonicalWorldFieldProtected===true,
  reciprocalFarContinuationPreserved:frame.farOceanPrimitiveCount===1&&frame.farLandPrimitiveCount===1&&frame.oceanFacingEmptinessPreserved===true&&frame.oppositeShoreFabricationProhibited===true
};
const issues=Object.entries(checks).filter(([,v])=>!v).map(([k])=>k);
const receipt={
  schema:'H_EARTH_RECIPROCAL_PROGRESSIVE_REGIONAL_DEVELOPMENT_QUALIFICATION_RECEIPT_v2_VISIBLE_RELIEF',
  operationId:'H_EARTH_RECIPROCAL_PROGRESSIVE_REGIONAL_DEVELOPMENT_GEN311_20260818_001',
  protectedBaseline:PROTECTED_BASELINE,
  result:issues.length?'FAIL':'PASS',
  checks,
  issues,
  diagnostics:{
    sampleCount:samples.length,
    validSampleCount:valid.length,
    landformClasses:classes,
    signalMaxima:maxima,
    signalSpread,
    materialLandformClasses:materialClasses,
    materialProfileCount:materialProfiles.length,
    vegetationInstanceCount:vegetation.instanceCount??0,
    ecologicalZones,
    ecologicalZoneCounts:vegetation.zoneCounts??{},
    regionalEcologyPrimitiveCount:frame.regionalEcologyPrimitiveCount??0,
    regionalReliefNonzeroVertexCount:relief?.nonzeroVertexCount??0,
    regionalReliefMaximumPositiveDelta:relief?.maximumPositiveDelta??null,
    regionalReliefMaximumNegativeDelta:relief?.maximumNegativeDelta??null,
    maxElevationDrift,
    canonicalTerrainBlobObserved:gitBlobSha,
    canonicalTerrainBlobExpected:PROTECTED_CANONICAL_TERRAIN_BLOB
  },
  acceptance:{
    materiallyNewRegionalEnvironmentalDepth:checks.regionalClassDiversity&&checks.materialRegionalDiversity&&checks.vegetationRegionalDiversity&&checks.physicalRegionalReliefMaterialized,
    mountainToCoastGeographicArticulation:checks.ridgelineSignalMaterial&&checks.passSignalMaterial&&checks.valleySignalMaterial&&checks.watershedSignalMaterial&&checks.foothillSignalMaterial&&checks.physicalRidgelineDepth&&checks.physicalValleyDepth,
    subtropicalCausalMaterialAndVegetationResponse:checks.materialCausality&&checks.vegetationEligible,
    sameFootprintCosmeticOnlySuccessRejected:checks.physicalRegionalReliefMaterialized&&checks.physicalRegionalReliefCoverage,
    worldManifoldRegressionRejected:checks.canonicalTerrainBlobPreserved&&checks.canonicalElevationPreserved&&checks.semanticProvenancePreserved&&checks.physicalReliefIsNonAuthoritative,
    comparativeVisualEvidenceRequiredForOwnerAcceptance:true,
    acceptedPriorEvidenceSha256:'fcad2f87e1370683e6f16ffbf5092cfa435ab5a8453771bc3e8819173e049dbf',
    rejectedCurrentEvidenceSha256:'c43150e2ffb6e8ff31a8d6a4664f0a4b8c9e252f6c3015d6ed73a70295cb9e92',
    ownerInspectionAuthorized:false
  }
};
console.log(JSON.stringify(receipt,null,2));
if(issues.length)process.exitCode=1;
