/** H_EARTH_SUCCESSOR_VEGETATION_RUN_8D_GEN311_REGIONAL_CAUSAL_v1 */
import {
  H_EARTH_RUN_8D_VEGETATION_RESOLUTION_CONTRACT_ID,
  buildHEarthRun8DVegetationResolution,
  evaluateHEarthRun8DVegetationResolution
} from './h-earth.vegetation-resolution.run8d.js';
import {
  H_EARTH_GEN311_REGIONAL_ARTICULATION_CONTRACT_ID,
  deriveHEarthGen311RegionalArticulation,
  sampleHEarthRun8BSuccessorTerrainField
} from '../terrain/h-earth.successor-terrain-field.run8b.js';
import {
  H_EARTH_GEN311_REGIONAL_MATERIAL_RESPONSE_CONTRACT_ID,
  sampleHEarthRun8CSuccessorSurfaceMaterial,
  evaluateHEarthRun8CSuccessorSurfaceMaterial
} from './h-earth.successor-surface-material.run8c.js';

const freeze=(v,s=new WeakSet())=>{if(v===null||typeof v!=='object'||Object.isFrozen(v)||s.has(v))return v;s.add(v);Object.values(v).forEach(x=>freeze(x,s));return Object.freeze(v)};
const finite=v=>typeof v==='number'&&Number.isFinite(v);
const clamp01=v=>Math.min(1,Math.max(0,v));

export const H_EARTH_GEN311_SUCCESSOR_VEGETATION_CONTRACT_ID='H_EARTH_GRATITUDE_SUCCESSOR_VEGETATION_RUN_8D_GEN311_REGIONAL_CAUSAL_v1';
export const H_EARTH_GEN311_SUCCESSOR_VEGETATION_SOURCE_FILE='/h-earth-3d/environment/h-earth.successor-vegetation.run8d.js';

export const H_EARTH_GEN311_SUCCESSOR_VEGETATION_PROFILE=freeze({
  contractId:H_EARTH_GEN311_SUCCESSOR_VEGETATION_CONTRACT_ID,
  sourceResolutionContractId:H_EARTH_RUN_8D_VEGETATION_RESOLUTION_CONTRACT_ID,
  regionalArticulationContractId:H_EARTH_GEN311_REGIONAL_ARTICULATION_CONTRACT_ID,
  regionalMaterialResponseContractId:H_EARTH_GEN311_REGIONAL_MATERIAL_RESPONSE_CONTRACT_ID,
  geographicIdentity:'GRATITUDE',
  continentalContext:'AUDRALIA',
  climateIdentity:'WARM_SUBTROPICAL_COASTAL',
  ecologicalZones:freeze([
    'COASTAL_LOWLAND',
    'SUBTROPICAL_FOOTHILL_WOODLAND',
    'SHELTERED_MOIST_VALLEY',
    'PASS_CORRIDOR_MOSAIC',
    'DRAINAGE_DIVIDE_WOODLAND',
    'MONTANE_TRANSITION',
    'WIND_EXPOSED_RIDGELINE'
  ]),
  ownership:freeze({
    populationTruth:false,
    terrainTruth:false,
    geographicTopology:false,
    semanticAddressAuthority:false,
    regionalEcologicalProjection:true,
    geometry:false,
    renderer:false,
    navigation:false,
    camera:false,
    deployment:false
  })
});

function zoneFor(landform){
  switch(landform){
    case'RIDGELINE':return'WIND_EXPOSED_RIDGELINE';
    case'PASS':return'PASS_CORRIDOR_MOSAIC';
    case'VALLEY':return'SHELTERED_MOIST_VALLEY';
    case'WATERSHED':return'DRAINAGE_DIVIDE_WOODLAND';
    case'FOOTHILL':return'SUBTROPICAL_FOOTHILL_WOODLAND';
    case'HIGHLAND_SLOPE':return'MONTANE_TRANSITION';
    default:return'COASTAL_LOWLAND';
  }
}

function ecologicalResponse(instance,terrain,material){
  const r=terrain.regionalArticulation;
  const exposure=clamp01(material.orographicExposure??0);
  const moisture=clamp01((material.shelterMoisture??0)*.45+(material.drainageRetention??0)*.35+(material.waterSaturation??0)*.2);
  const ridge=clamp01(r.ridgeSignal??0),valley=clamp01(r.valleySignal??0),foothill=clamp01(r.foothillSignal??0),pass=clamp01(r.passSignal??0),watershed=clamp01(r.watershedSignal??0);
  const densityModifier=clamp01(.48+moisture*.42+valley*.18+foothill*.12+pass*.05-ridge*.28-exposure*.14);
  const canopyModifier=clamp01(.44+moisture*.36+foothill*.18+valley*.14-watershed*.08-ridge*.24);
  const groundcoverModifier=clamp01(.5+moisture*.26+pass*.18+valley*.12-ridge*.12);
  const scaleModifier=.82+canopyModifier*.26-exposure*.08;
  return freeze({
    ecologicalZone:zoneFor(r.landformClass),
    landformClass:r.landformClass,
    densityModifier,
    canopyModifier,
    groundcoverModifier,
    scaleModifier,
    moistureAvailability:moisture,
    windExposure:exposure,
    drainageRetention:material.drainageRetention,
    ridgePressure:material.ridgePressure,
    passMoistureCorridor:material.passMoistureCorridor,
    valleyMoistureRetention:material.valleyMoistureRetention,
    watershedExposure:material.watershedExposure,
    foothillTransition:material.foothillTransition,
    sourceArchetypeId:instance.archetypeId,
    sourceSpeciesId:instance.speciesId,
    sourceSemanticAddressId:instance.semanticAddressId,
    sourcePopulationInstanceId:instance.sourcePopulationInstanceId,
    populationIdentityPreserved:true,
    semanticAddressPreserved:true,
    worldAnchorPreserved:true
  });
}

export function buildHEarthGen311SuccessorVegetation(options={}){
  const base=buildHEarthRun8DVegetationResolution(options);
  const baseEvaluation=evaluateHEarthRun8DVegetationResolution(base);
  if(baseEvaluation.eligible!==true)return freeze({eligible:false,status:'GEN311_SUCCESSOR_VEGETATION_FAILED',contractId:H_EARTH_GEN311_SUCCESSOR_VEGETATION_CONTRACT_ID,sourceResolution:base,instances:[],zoneCounts:{},issues:['RUN_8D_BASE_RESOLUTION_INVALID',...baseEvaluation.issues]});
  const issues=[],instances=[],zoneCounts={};
  for(const instance of base.instances){
    const x=instance.worldAnchor.x,z=instance.worldAnchor.z;
    const terrain=sampleHEarthRun8BSuccessorTerrainField(x,z),material=sampleHEarthRun8CSuccessorSurfaceMaterial(x,z);
    if(terrain?.regionalArticulation?.valid!==true){issues.push(`GEN311_REGIONAL_ARTICULATION_INVALID:${instance.instanceId}`);continue;}
    const materialEvaluation=evaluateHEarthRun8CSuccessorSurfaceMaterial(material);
    if(materialEvaluation.eligible!==true){issues.push(`GEN311_REGIONAL_MATERIAL_INVALID:${instance.instanceId}`);continue;}
    const response=ecologicalResponse(instance,terrain,material),zone=response.ecologicalZone;
    zoneCounts[zone]=(zoneCounts[zone]??0)+1;
    instances.push(freeze({
      ...instance,
      regionalEcology:response,
      displayScale:instance.uniformScale*response.scaleModifier,
      regionalDensityWeight:response.densityModifier,
      regionalCanopyWeight:response.canopyModifier,
      regionalGroundcoverWeight:response.groundcoverModifier,
      sourceIdentities:freeze({...instance.sourceIdentities,regionalArticulationContractId:H_EARTH_GEN311_REGIONAL_ARTICULATION_CONTRACT_ID,regionalMaterialResponseContractId:H_EARTH_GEN311_REGIONAL_MATERIAL_RESPONSE_CONTRACT_ID,successorVegetationContractId:H_EARTH_GEN311_SUCCESSOR_VEGETATION_CONTRACT_ID})
    }));
  }
  return freeze({
    eligible:issues.length===0&&instances.length===base.instanceCount,
    status:issues.length===0&&instances.length===base.instanceCount?'GEN311_SUCCESSOR_VEGETATION_COMPLETE':'GEN311_SUCCESSOR_VEGETATION_FAILED',
    contractId:H_EARTH_GEN311_SUCCESSOR_VEGETATION_CONTRACT_ID,
    sourceResolutionContractId:H_EARTH_RUN_8D_VEGETATION_RESOLUTION_CONTRACT_ID,
    regionalArticulationContractId:H_EARTH_GEN311_REGIONAL_ARTICULATION_CONTRACT_ID,
    regionalMaterialResponseContractId:H_EARTH_GEN311_REGIONAL_MATERIAL_RESPONSE_CONTRACT_ID,
    sourceResolution:base,
    instanceCount:instances.length,
    instances:freeze(instances),
    zoneCounts:freeze(zoneCounts),
    ecologicalZoneCount:Object.keys(zoneCounts).length,
    populationIdentityPreserved:true,
    semanticAddressesPreserved:true,
    worldAnchorsPreserved:true,
    independentGeographyAuthority:false,
    cameraAuthorityCreated:false,
    navigationAuthorityCreated:false,
    rendererMutation:false,
    issues:freeze(issues)
  });
}

export function evaluateHEarthGen311SuccessorVegetation(result){
  const issues=[];
  if(result?.eligible!==true)issues.push('GEN311_SUCCESSOR_VEGETATION_NOT_ELIGIBLE');
  if(result?.contractId!==H_EARTH_GEN311_SUCCESSOR_VEGETATION_CONTRACT_ID)issues.push('GEN311_SUCCESSOR_VEGETATION_CONTRACT_MISMATCH');
  if(result?.sourceResolutionContractId!==H_EARTH_RUN_8D_VEGETATION_RESOLUTION_CONTRACT_ID)issues.push('RUN_8D_SOURCE_RESOLUTION_IDENTITY_MISMATCH');
  if(result?.regionalArticulationContractId!==H_EARTH_GEN311_REGIONAL_ARTICULATION_CONTRACT_ID)issues.push('REGIONAL_ARTICULATION_IDENTITY_MISMATCH');
  if(result?.regionalMaterialResponseContractId!==H_EARTH_GEN311_REGIONAL_MATERIAL_RESPONSE_CONTRACT_ID)issues.push('REGIONAL_MATERIAL_IDENTITY_MISMATCH');
  if(result?.populationIdentityPreserved!==true||result?.semanticAddressesPreserved!==true||result?.worldAnchorsPreserved!==true)issues.push('GEN310_VEGETATION_IDENTITY_PRESERVATION_FAIL');
  if(!Array.isArray(result?.instances)||result.instances.length!==result.instanceCount||result.instanceCount<=0)issues.push('GEN311_SUCCESSOR_VEGETATION_INSTANCE_SET_INVALID');
  for(const instance of result?.instances??[]){
    const e=instance.regionalEcology;
    if(!H_EARTH_GEN311_SUCCESSOR_VEGETATION_PROFILE.ecologicalZones.includes(e?.ecologicalZone))issues.push(`GEN311_ECOLOGICAL_ZONE_INVALID:${instance.instanceId}`);
    for(const k of['densityModifier','canopyModifier','groundcoverModifier','moistureAvailability','windExposure'])if(!finite(e?.[k])||e[k]<0||e[k]>1)issues.push(`GEN311_ECOLOGICAL_CHANNEL_INVALID:${instance.instanceId}:${k}`);
    if(e?.populationIdentityPreserved!==true||e?.semanticAddressPreserved!==true||e?.worldAnchorPreserved!==true)issues.push(`GEN311_INSTANCE_IDENTITY_DRIFT:${instance.instanceId}`);
  }
  return freeze({eligible:issues.length===0,status:issues.length?'GEN311_SUCCESSOR_VEGETATION_FAIL':'GEN311_SUCCESSOR_VEGETATION_PASS',issues:freeze(issues)});
}

export const H_EARTH_GEN311_VEGETATION_SUITABILITY_MAP_CONTRACT_ID='H_EARTH_GEN311_VEGETATION_SUITABILITY_MAP_v1';
export const H_EARTH_GEN311_VEGETATION_SUITABILITY_MAP_PROFILE=freeze({
  contractId:H_EARTH_GEN311_VEGETATION_SUITABILITY_MAP_CONTRACT_ID,
  worldDomain:freeze({xMinimum:-1024,xMaximum:1024,zMinimum:-1024,zMaximum:768}),
  sampleStepWorldUnits:8,
  sampleCount:57825,
  sourceAuthority:'RUN8B_TERRAIN_PLUS_RUN8C_SURFACE_MATERIAL_PLUS_GEN311_ECOLOGICAL_RESPONSE',
  geometry:false,renderer:false,populationMutation:false,terrainMutation:false
});
function ecologicalResponseAt(worldX,worldZ){
  const terrain=sampleHEarthRun8BSuccessorTerrainField(worldX,worldZ),material=sampleHEarthRun8CSuccessorSurfaceMaterial(worldX,worldZ);
  const materialEvaluation=evaluateHEarthRun8CSuccessorSurfaceMaterial(material);
  if(terrain?.valid!==true||terrain?.regionalArticulation?.valid!==true||materialEvaluation.eligible!==true)return null;
  const r=terrain.regionalArticulation,exposure=clamp01(material.orographicExposure??0);
  const moisture=clamp01((material.shelterMoisture??0)*.45+(material.drainageRetention??0)*.35+(material.waterSaturation??0)*.2);
  const ridge=clamp01(r.ridgeSignal??0),valley=clamp01(r.valleySignal??0),foothill=clamp01(r.foothillSignal??0),pass=clamp01(r.passSignal??0),watershed=clamp01(r.watershedSignal??0);
  return freeze({ecologicalZone:zoneFor(r.landformClass),landformClass:r.landformClass,densityModifier:clamp01(.48+moisture*.42+valley*.18+foothill*.12+pass*.05-ridge*.28-exposure*.14),canopyModifier:clamp01(.44+moisture*.36+foothill*.18+valley*.14-watershed*.08-ridge*.24),groundcoverModifier:clamp01(.5+moisture*.26+pass*.18+valley*.12-ridge*.12),scaleModifier:.82+clamp01(.44+moisture*.36+foothill*.18+valley*.14-watershed*.08-ridge*.24)*.26-exposure*.08,moistureAvailability:moisture,windExposure:exposure,drainageRetention:material.drainageRetention,surfaceClass:material.surfaceClass??null});
}
export function buildHEarthGen311VegetationSuitabilityMap(){
  const p=H_EARTH_GEN311_VEGETATION_SUITABILITY_MAP_PROFILE,d=p.worldDomain,step=p.sampleStepWorldUnits,zoneCounts=Object.fromEntries(H_EARTH_GEN311_SUCCESSOR_VEGETATION_PROFILE.ecologicalZones.map(z=>[z,0]));
  const ranges={density:[1,0],canopy:[1,0],groundcover:[1,0],scale:[Infinity,-Infinity],moisture:[1,0],exposure:[1,0]},surfaceCounts={},samples=[];let excludedWater=0,invalid=0,eligible=0;
  const range=(k,v)=>{if(!finite(v))return;ranges[k][0]=Math.min(ranges[k][0],v);ranges[k][1]=Math.max(ranges[k][1],v);};
  for(let z=d.zMinimum;z<=d.zMaximum;z+=step)for(let x=d.xMinimum;x<=d.xMaximum;x+=step){
    const terrain=sampleHEarthRun8BSuccessorTerrainField(x,z);
    if(terrain?.valid!==true){invalid++;continue;}
    const material=sampleHEarthRun8CSuccessorSurfaceMaterial(x,z),surface=material?.surfaceClass??(terrain.elevation<0?'WATER':'LAND');
    surfaceCounts[surface]=(surfaceCounts[surface]??0)+1;
    if(surface==='WATER'||terrain.elevation<0){excludedWater++;continue;}
    const e=ecologicalResponseAt(x,z);if(!e){invalid++;continue;}eligible++;zoneCounts[e.ecologicalZone]=(zoneCounts[e.ecologicalZone]??0)+1;
    range('density',e.densityModifier);range('canopy',e.canopyModifier);range('groundcover',e.groundcoverModifier);range('scale',e.scaleModifier);range('moisture',e.moistureAvailability);range('exposure',e.windExposure);
    samples.push(freeze({x,z,elevation:terrain.elevation,slope:terrain.slope,normal:terrain.normal,landformClass:e.landformClass,ecologicalZone:e.ecologicalZone,densitySuitability:e.densityModifier,canopySuitability:e.canopyModifier,groundcoverSuitability:e.groundcoverModifier,scaleSuitability:e.scaleModifier,moistureAvailability:e.moistureAvailability,windExposure:e.windExposure,drainageRetention:e.drainageRetention,surfaceClass:surface,excluded:false}));
  }
  const measured=eligible+excludedWater+invalid;
  return freeze({eligible:invalid===0&&measured===p.sampleCount,status:invalid===0&&measured===p.sampleCount?'GEN311_VEGETATION_SUITABILITY_MAP_COMPLETE':'GEN311_VEGETATION_SUITABILITY_MAP_FAILED',contractId:p.contractId,worldDomain:p.worldDomain,sampleStepWorldUnits:step,expectedSampleCount:p.sampleCount,measuredSampleCount:measured,vegetationEligibleSampleCount:eligible,excludedWaterSampleCount:excludedWater,invalidSampleCount:invalid,zoneCounts:freeze(zoneCounts),surfaceCounts:freeze(surfaceCounts),ranges:freeze(ranges),samples:freeze(samples),geometryCreated:false,rendererMutation:false,populationMutation:false,terrainMutation:false});
}
export function evaluateHEarthGen311VegetationSuitabilityMap(result){
  const issues=[];if(result?.eligible!==true)issues.push('GEN311_SUITABILITY_MAP_NOT_ELIGIBLE');if(result?.contractId!==H_EARTH_GEN311_VEGETATION_SUITABILITY_MAP_CONTRACT_ID)issues.push('GEN311_SUITABILITY_MAP_CONTRACT_MISMATCH');if(result?.measuredSampleCount!==H_EARTH_GEN311_VEGETATION_SUITABILITY_MAP_PROFILE.sampleCount)issues.push('GEN311_SUITABILITY_SAMPLE_COUNT_MISMATCH');if(result?.invalidSampleCount!==0)issues.push('GEN311_SUITABILITY_INVALID_SAMPLES');if(result?.geometryCreated!==false||result?.rendererMutation!==false||result?.populationMutation!==false||result?.terrainMutation!==false)issues.push('GEN311_SUITABILITY_BOUNDARY_VIOLATION');return freeze({eligible:issues.length===0,status:issues.length?'GEN311_VEGETATION_SUITABILITY_MAP_FAIL':'GEN311_VEGETATION_SUITABILITY_MAP_PASS',issues:freeze(issues)});
}

export const H_EARTH_GEN311_RARE_SIGNAL_REFINEMENT_CONTRACT_ID='H_EARTH_GEN311_RARE_SIGNAL_REFINEMENT_DIAGNOSTIC_v1';
const RARE_SIGNAL_RULES=freeze({
  ridge:freeze({key:'ridgeSignal',threshold:.58,candidateFloor:.48,label:'RIDGELINE'}),
  pass:freeze({key:'passSignal',threshold:.55,candidateFloor:.45,label:'PASS'}),
  valley:freeze({key:'valleySignal',threshold:.52,candidateFloor:.42,label:'VALLEY'}),
  watershed:freeze({key:'watershedSignal',threshold:.50,candidateFloor:.40,label:'WATERSHED'})
});
function connectedComponentSizes(points,spacing){
  const keys=new Set(points.map(p=>`${p.x},${p.z}`)),seen=new Set(),sizes=[];
  for(const key of keys){if(seen.has(key))continue;let count=0,stack=[key];seen.add(key);while(stack.length){const k=stack.pop(),[x,z]=k.split(',').map(Number);count++;for(const [nx,nz] of [[x+spacing,z],[x-spacing,z],[x,z+spacing],[x,z-spacing]]){const nk=`${nx},${nz}`;if(keys.has(nk)&&!seen.has(nk)){seen.add(nk);stack.push(nk)}}}sizes.push(count)}
  return sizes.sort((a,b)=>b-a);
}
export function buildHEarthGen311RareSignalRefinementDiagnostic(){
  const domain=H_EARTH_GEN311_VEGETATION_SUITABILITY_MAP_PROFILE.worldDomain,coarse=8,candidates=[];
  for(let z=domain.zMinimum;z<=domain.zMaximum;z+=coarse)for(let x=domain.xMinimum;x<=domain.xMaximum;x+=coarse){
    const a=deriveHEarthGen311RegionalArticulation(x,z,{step:coarse});if(a?.valid!==true)continue;
    const selected=Object.entries(RARE_SIGNAL_RULES).filter(([,r])=>(a[r.key]??0)>=r.candidateFloor).map(([name])=>name);
    if(selected.length)candidates.push({x,z,selected});
  }
  const levels={};
  for(const spacing of [8,4,2,1]){
    const pointsBySignal=Object.fromEntries(Object.keys(RARE_SIGNAL_RULES).map(k=>[k,[]])),suppressed=Object.fromEntries(Object.keys(RARE_SIGNAL_RULES).map(k=>[k,0])),peaks=Object.fromEntries(Object.keys(RARE_SIGNAL_RULES).map(k=>[k,0]));
    const visited=new Set();
    for(const c of candidates)for(let z=c.z-coarse;z<=c.z+coarse;z+=spacing)for(let x=c.x-coarse;x<=c.x+coarse;x+=spacing){
      const vk=`${x},${z}`;if(visited.has(vk))continue;visited.add(vk);
      const derivativeScaleWorldUnits=8,a=deriveHEarthGen311RegionalArticulation(x,z,{step:derivativeScaleWorldUnits});if(a?.valid!==true)continue;
      for(const [name,r] of Object.entries(RARE_SIGNAL_RULES)){const v=a[r.key]??0;peaks[name]=Math.max(peaks[name],v);if(v>=r.threshold){pointsBySignal[name].push({x,z,value:v,label:a.landformClass});if(a.landformClass!==r.label)suppressed[name]++;}}
    }
    const signals={};for(const [name,r] of Object.entries(RARE_SIGNAL_RULES)){const pts=pointsBySignal[name],components=connectedComponentSizes(pts,spacing);signals[name]=freeze({threshold:r.threshold,crossingPointCount:pts.length,approximateCrossingAreaSquareMeters:pts.length*spacing*spacing,componentCount:components.length,largestComponentPointCount:components[0]??0,approximateLargestComponentAreaSquareMeters:(components[0]??0)*spacing*spacing,peakSignal:peaks[name],labelSuppressedPointCount:suppressed[name]})}
    levels[spacing]=freeze({sampleSpacingWorldUnits:spacing,derivativeScaleWorldUnits:8,uniqueSampleCount:visited.size,signals:freeze(signals)});
  }
  return freeze({eligible:true,status:'GEN311_RARE_SIGNAL_REFINEMENT_DIAGNOSTIC_COMPLETE',contractId:H_EARTH_GEN311_RARE_SIGNAL_REFINEMENT_CONTRACT_ID,candidateCoarseCellCount:candidates.length,candidateRule:RARE_SIGNAL_RULES,levels:freeze(levels),classificationThresholdsMutated:false,terrainMutation:false,ecologyEquationMutation:false,geometryCreated:false});
}
export function evaluateHEarthGen311RareSignalRefinementDiagnostic(result){
  const issues=[];if(result?.eligible!==true||result?.contractId!==H_EARTH_GEN311_RARE_SIGNAL_REFINEMENT_CONTRACT_ID)issues.push('GEN311_RARE_SIGNAL_DIAGNOSTIC_INVALID');for(const spacing of [8,4,2,1])if(!result?.levels?.[spacing])issues.push(`GEN311_RARE_SIGNAL_LEVEL_MISSING:${spacing}`);if(result?.classificationThresholdsMutated!==false||result?.terrainMutation!==false||result?.ecologyEquationMutation!==false||result?.geometryCreated!==false)issues.push('GEN311_RARE_SIGNAL_DIAGNOSTIC_BOUNDARY_VIOLATION');return freeze({eligible:issues.length===0,status:issues.length?'GEN311_RARE_SIGNAL_REFINEMENT_FAIL':'GEN311_RARE_SIGNAL_REFINEMENT_PASS',issues:freeze(issues)});
}

export const H_EARTH_GEN311_HABITAT_ADMISSION_DIAGNOSTIC_CONTRACT_ID='H_EARTH_GEN311_HABITAT_ADMISSION_DIAGNOSTIC_v1';
function habitatDisposition(surfaceClass){
  if(surfaceClass==='OPEN_WATER'||surfaceClass==='NEARSHORE_WATER')return'EXCLUDED_WATER';
  if(surfaceClass==='WET_SAND')return'EXCLUDED_BARE_WET_BEACH';
  if(surfaceClass==='DRY_SAND')return'HELD_DRY_SAND_COASTAL_HABITAT';
  if(surfaceClass==='STONE_AND_SPARSE_SOIL')return'HELD_STONE_SPARSE_SOIL_ROOTING';
  if(surfaceClass==='LOWLAND_SOIL'||surfaceClass==='COASTAL_SOIL')return'ADMITTED_SOIL_HABITAT_CANDIDATE';
  return'HELD_UNKNOWN_SURFACE';
}
export function buildHEarthGen311HabitatAdmissionDiagnostic(){
  const p=H_EARTH_GEN311_VEGETATION_SUITABILITY_MAP_PROFILE,d=p.worldDomain,step=p.sampleStepWorldUnits,counts={},samples=[];let invalid=0;
  for(let z=d.zMinimum;z<=d.zMaximum;z+=step)for(let x=d.xMinimum;x<=d.xMaximum;x+=step){
    const terrain=sampleHEarthRun8BSuccessorTerrainField(x,z),material=sampleHEarthRun8CSuccessorSurfaceMaterial(x,z);
    if(terrain?.valid!==true||evaluateHEarthRun8CSuccessorSurfaceMaterial(material).eligible!==true){invalid++;continue}
    const disposition=habitatDisposition(material.surfaceClass),a=terrain.regionalArticulation;counts[disposition]=(counts[disposition]??0)+1;
    samples.push(freeze({x,z,surfaceClass:material.surfaceClass,disposition,vegetationSupport:material.vegetationSupport,soilDepth:material.soilDepth,rockExposure:material.rockExposure,moistureAvailability:clamp01((material.shelterMoisture??0)*.45+(material.drainageRetention??0)*.35+(material.waterSaturation??0)*.2),windExposure:clamp01(material.orographicExposure??0),drainageRetention:material.drainageRetention,ridgeSignal:a.ridgeSignal,passSignal:a.passSignal,valleySignal:a.valleySignal,watershedSignal:a.watershedSignal,foothillSignal:a.foothillSignal,ecologicalZone:zoneFor(a.landformClass),zoneIsDescriptiveOnly:true,watershedPatchAuthority:false,passPatchAuthority:false}));
  }
  return freeze({eligible:invalid===0&&samples.length===p.sampleCount,status:invalid===0&&samples.length===p.sampleCount?'GEN311_HABITAT_ADMISSION_DIAGNOSTIC_COMPLETE':'GEN311_HABITAT_ADMISSION_DIAGNOSTIC_FAILED',contractId:H_EARTH_GEN311_HABITAT_ADMISSION_DIAGNOSTIC_CONTRACT_ID,measuredSampleCount:samples.length,invalidSampleCount:invalid,dispositionCounts:freeze(counts),samples:freeze(samples),plantGeometryCreated:false,populationMutation:false,terrainMutation:false,ecologyEquationMutation:false,classificationThresholdMutation:false});
}
export function evaluateHEarthGen311HabitatAdmissionDiagnostic(result){
  const issues=[];if(result?.eligible!==true||result?.contractId!==H_EARTH_GEN311_HABITAT_ADMISSION_DIAGNOSTIC_CONTRACT_ID)issues.push('GEN311_HABITAT_ADMISSION_DIAGNOSTIC_INVALID');if(result?.measuredSampleCount!==H_EARTH_GEN311_VEGETATION_SUITABILITY_MAP_PROFILE.sampleCount||result?.invalidSampleCount!==0)issues.push('GEN311_HABITAT_ADMISSION_SAMPLE_SET_INVALID');if(result?.plantGeometryCreated!==false||result?.populationMutation!==false||result?.terrainMutation!==false||result?.ecologyEquationMutation!==false||result?.classificationThresholdMutation!==false)issues.push('GEN311_HABITAT_ADMISSION_BOUNDARY_VIOLATION');return freeze({eligible:issues.length===0,status:issues.length?'GEN311_HABITAT_ADMISSION_DIAGNOSTIC_FAIL':'GEN311_HABITAT_ADMISSION_DIAGNOSTIC_PASS',issues:freeze(issues)});
}

export default H_EARTH_GEN311_SUCCESSOR_VEGETATION_PROFILE;
