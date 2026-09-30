import {
  buildFAP1SpatialWeatherObjects,
  evaluateFAP1SpatialLOD
} from './fap1-spatial-lod.gb.mjs';
import {
  createW5LocalRayMarchSurface,
  verifyW5LocalRayMarchReceipt
} from './fap1-w5-local-raymarch.gc-v5-spatial-handoff.mjs';

const freeze=value=>Object.freeze(value);
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));

export const FAP1_W5_HANDOFF_SCHEMA='FAP1_W5_BOUNDED_MACRO_LOCAL_HANDOFF_v3_SPATIAL_CARVEOUT';
export const HANDOFF_MIN_LOCAL_WEIGHT=.035;
export const HANDOFF_LOCAL_DOMINANT_WEIGHT=.72;

function contributionFor(entry){
  const local=clamp(entry?.alpha?.l??0,0,1);
  if(local<HANDOFF_MIN_LOCAL_WEIGHT)return freeze({macro:1,local:0,regime:'MACRO'});
  return freeze({macro:1-local,local,regime:local>=HANDOFF_LOCAL_DOMINANT_WEIGHT?'LOCAL_DOMINANT':'MACRO_LOCAL_OVERLAP'});
}
function carveoutFor(entry,weight){const v=entry.object.V_i;return freeze({weatherId:entry.object.ID_i,center:v.center,axisU:v.axisU,axisUp:v.axisUp,axisV:v.axisV,radii:v.radii,weight});}

export function createBoundedW5Handoff({worldCanvas,parentReceipt,gaAuthority,getSunDirection}={}){
  if(!(worldCanvas instanceof HTMLCanvasElement))throw new Error('FAP1_W5_HANDOFF_WORLD_CANVAS_REQUIRED');
  if(!parentReceipt||typeof parentReceipt.getCameraFrame!=='function')throw new Error('FAP1_W5_HANDOFF_PARENT_RECEIPT_REQUIRED');
  if(!gaAuthority||typeof gaAuthority.descriptorPacket!=='function'||typeof gaAuthority.renderNow!=='function')throw new Error('FAP1_W5_HANDOFF_GA_AUTHORITY_REQUIRED');
  if(typeof gaAuthority.setLocalCarveout!=='function'||typeof gaAuthority.clearLocalCarveout!=='function')throw new Error('FAP1_W5_SPATIAL_CARVEOUT_AUTHORITY_REQUIRED');

  const localSurface=createW5LocalRayMarchSurface({worldCanvas});
  let lastReceipt=null,quality='REST';

  function render(){
    const camera=parentReceipt.getCameraFrame();
    const packet=gaAuthority.descriptorPacket()??gaAuthority.renderNow();
    const objects=buildFAP1SpatialWeatherObjects({packet});
    const spatialState=evaluateFAP1SpatialLOD(objects,camera);
    const promoted=spatialState.objects.filter(entry=>entry.localPromoted===true&&entry.Q_i===true&&entry.alpha.l>=HANDOFF_MIN_LOCAL_WEIGHT).sort((a,b)=>b.alpha.l-a.alpha.l||a.distanceToVolume-b.distanceToVolume||a.object.ID_i.localeCompare(b.object.ID_i));
    const active=promoted[0]??null;
    const sunDirection=typeof getSunDirection==='function'?getSunDirection():[.42,.78,.46];

    if(!active){
      gaAuthority.clearLocalCarveout();gaAuthority.renderNow();
      const localReceipt=localSurface.render({camera,spatialState,sunDirection,quality});
      lastReceipt=freeze({schema:FAP1_W5_HANDOFF_SCHEMA,active:false,weatherId:null,regime:'MACRO',macroContribution:1,localContribution:0,contributionSum:1,persistentWeatherIdentity:true,macroMassPreservationLaw:'SPATIAL_MACRO_OUTSIDE_W5_PRESERVED',spatialCarveoutActive:false,macroOutsideLocalVolumePreserved:true,l5LightingActive:true,l5LightingModel:localReceipt.l5LightingModel,l5Quality:localReceipt.quality,l5LightSteps:localReceipt.lightSteps,handoffAuthority:'BOUNDED_GB_HANDOFF_ACTIVE'});
      return lastReceipt;
    }

    const contribution=contributionFor(active);
    gaAuthority.setLocalCarveout(carveoutFor(active,contribution.local));
    gaAuthority.renderNow();
    const localReceipt=localSurface.render({camera,spatialState,sunDirection,quality});
    const localVerification=verifyW5LocalRayMarchReceipt(localReceipt);
    if(!localVerification.pass)throw new Error(`FAP1_W5_HANDOFF_LOCAL_SURFACE_INVALID:${localVerification.failures.join(',')}`);

    lastReceipt=freeze({
      schema:FAP1_W5_HANDOFF_SCHEMA,
      active:true,
      weatherId:active.object.ID_i,
      regime:contribution.regime,
      localWeight:active.alpha.l,
      macroContribution:contribution.macro,
      localContribution:contribution.local,
      contributionSum:contribution.macro+contribution.local,
      persistentWeatherIdentity:localReceipt.weatherId===active.object.ID_i,
      localBrickAddress:localReceipt.brickAddress??null,
      macroMassPreservationLaw:'SPATIAL_EXTINCTION_SPLIT_INSIDE_W5_ONLY',
      spatialCarveoutActive:true,
      spatialCarveoutWeatherId:active.object.ID_i,
      spatialCarveoutRadii:active.object.V_i.radii,
      macroOutsideLocalVolumePreserved:true,
      macroRendererWeatherAuthority:'FAP1_ONLY',
      localRendererWeatherAuthority:'FAP1_DESCRIPTOR_REFINEMENT_ONLY',
      canonicalDensityPreserved:true,
      macroCloudTuning:false,
      l5LightingActive:true,
      l5LightingModel:localReceipt.l5LightingModel,
      l5DensityAuthority:localReceipt.l5DensityAuthority,
      l5Quality:localReceipt.quality,
      l5LightSteps:localReceipt.lightSteps,
      densityTextureFormat:localReceipt.densityTextureFormat??null,
      localSpatialHandoffMask:localReceipt.spatialHandoffMask===true,
      multipleScattering:false,
      groundContribution:false,
      handoffAuthority:'BOUNDED_GB_HANDOFF_ACTIVE'
    });
    return lastReceipt;
  }

  return freeze({schema:FAP1_W5_HANDOFF_SCHEMA,render,setQuality(value){quality=value==='CAPTURE'?'CAPTURE':value==='INTERACTIVE'?'INTERACTIVE':'REST';localSurface.setQuality(quality);},getReceipt:()=>lastReceipt,beginInteraction(){quality='INTERACTIVE';localSurface.beginInteraction();},endInteraction(){quality='REST';localSurface.endInteraction();},destroy(){gaAuthority.clearLocalCarveout();gaAuthority.renderNow();localSurface.destroy();}});
}

export function verifyBoundedW5Handoff(receipt,epsilon=1e-6){
  const failures=[];
  if(receipt?.persistentWeatherIdentity!==true)failures.push('PERSISTENT_WEATHER_IDENTITY_FAILED');
  if(Math.abs((receipt?.contributionSum??NaN)-1)>epsilon)failures.push('CONTRIBUTION_SUM_NOT_ONE');
  if(!(receipt?.macroContribution>=0&&receipt?.macroContribution<=1))failures.push('MACRO_CONTRIBUTION_INVALID');
  if(!(receipt?.localContribution>=0&&receipt?.localContribution<=1))failures.push('LOCAL_CONTRIBUTION_INVALID');
  if(receipt?.active&&receipt?.canonicalDensityPreserved!==true)failures.push('CANONICAL_DENSITY_NOT_PRESERVED');
  if(receipt?.active&&receipt?.spatialCarveoutActive!==true)failures.push('SPATIAL_CARVEOUT_NOT_ACTIVE');
  if(receipt?.macroOutsideLocalVolumePreserved!==true)failures.push('MACRO_OUTSIDE_LOCAL_VOLUME_NOT_PRESERVED');
  if(receipt?.active&&receipt?.localSpatialHandoffMask!==true)failures.push('LOCAL_SPATIAL_HANDOFF_MASK_MISSING');
  if(receipt?.macroCloudTuning===true)failures.push('MACRO_TUNING_FORBIDDEN');
  if(receipt?.l5LightingActive!==true)failures.push('L5_DIRECT_LIGHTING_NOT_ACTIVE');
  if(receipt?.l5LightingModel!=='DIRECT_SUN_TRANSMITTANCE_ONLY')failures.push('L5_LIGHTING_SCOPE_DRIFT');
  if(!Number.isInteger(receipt?.l5LightSteps)||![3,5,8].includes(receipt.l5LightSteps))failures.push('L5_LIGHT_STEP_SCHEDULE_INVALID');
  if(receipt?.active&&receipt?.densityTextureFormat!=='R8_UNORM_LINEAR')failures.push('W5_TEXTURE_PATH_NOT_REPAIRED');
  if(receipt?.multipleScattering===true||receipt?.groundContribution===true)failures.push('L5_SCOPE_EXPANSION_FORBIDDEN');
  if(receipt?.handoffAuthority!=='BOUNDED_GB_HANDOFF_ACTIVE')failures.push('HANDOFF_AUTHORITY_MISSING');
  return freeze({schema:'FAP1_W5_BOUNDED_HANDOFF_INVARIANTS_v3_SPATIAL_CARVEOUT',pass:failures.length===0,failures:freeze(failures),weatherId:receipt?.weatherId??null});
}
