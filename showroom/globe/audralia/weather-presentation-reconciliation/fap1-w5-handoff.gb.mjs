import {
  buildFAP1SpatialWeatherObjects,
  evaluateFAP1SpatialLOD
} from './fap1-spatial-lod.gb.mjs';
import {
  createW5LocalRayMarchSurface,
  verifyW5LocalRayMarchReceipt
} from './fap1-w5-local-raymarch.gb.mjs';

const freeze=value=>Object.freeze(value);
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));

export const FAP1_W5_HANDOFF_SCHEMA='FAP1_W5_BOUNDED_MACRO_LOCAL_HANDOFF_v1';
export const HANDOFF_MIN_LOCAL_WEIGHT=.035;
export const HANDOFF_LOCAL_DOMINANT_WEIGHT=.72;

function contributionFor(entry){
  const local=clamp(entry?.alpha?.l??0,0,1);
  if(local<HANDOFF_MIN_LOCAL_WEIGHT)return freeze({macro:1,local:0,regime:'MACRO'});
  return freeze({
    macro:1-local,
    local,
    regime:local>=HANDOFF_LOCAL_DOMINANT_WEIGHT?'LOCAL_DOMINANT':'MACRO_LOCAL_OVERLAP'
  });
}

export function createBoundedW5Handoff({worldCanvas,parentReceipt,gaAuthority}={}){
  if(!(worldCanvas instanceof HTMLCanvasElement))throw new Error('FAP1_W5_HANDOFF_WORLD_CANVAS_REQUIRED');
  if(!parentReceipt||typeof parentReceipt.getCameraFrame!=='function')throw new Error('FAP1_W5_HANDOFF_PARENT_RECEIPT_REQUIRED');
  if(!gaAuthority||typeof gaAuthority.descriptorPacket!=='function'||typeof gaAuthority.renderNow!=='function')throw new Error('FAP1_W5_HANDOFF_GA_AUTHORITY_REQUIRED');
  if(typeof gaAuthority.setSystemContribution!=='function'||typeof gaAuthority.clearSystemContributions!=='function')throw new Error('FAP1_W5_HANDOFF_MACRO_CONTRIBUTION_CONTROL_REQUIRED');

  const localSurface=createW5LocalRayMarchSurface({worldCanvas});
  let lastReceipt=null;

  function render(){
    const camera=parentReceipt.getCameraFrame();
    const packet=gaAuthority.descriptorPacket()??gaAuthority.renderNow();
    const objects=buildFAP1SpatialWeatherObjects({packet});
    const spatialState=evaluateFAP1SpatialLOD(objects,camera);
    const promoted=spatialState.objects
      .filter(entry=>entry.localPromoted===true&&entry.Q_i===true&&entry.alpha.l>=HANDOFF_MIN_LOCAL_WEIGHT)
      .sort((a,b)=>b.alpha.l-a.alpha.l||a.distanceToVolume-b.distanceToVolume||a.object.ID_i.localeCompare(b.object.ID_i));
    const active=promoted[0]??null;

    gaAuthority.clearSystemContributions();
    if(!active){
      gaAuthority.renderNow();
      localSurface.render({camera,spatialState});
      lastReceipt=freeze({
        schema:FAP1_W5_HANDOFF_SCHEMA,
        active:false,
        weatherId:null,
        regime:'MACRO',
        macroContribution:1,
        localContribution:0,
        contributionSum:1,
        persistentWeatherIdentity:true,
        macroMassPreservationLaw:'MACRO_PLUS_LOCAL_EQUALS_ONE',
        l5LightingActive:false,
        handoffAuthority:'BOUNDED_GB_HANDOFF_ACTIVE'
      });
      return lastReceipt;
    }

    const contribution=contributionFor(active);
    gaAuthority.setSystemContribution(active.object.ID_i,contribution.macro);
    gaAuthority.renderNow();
    const localReceipt=localSurface.render({camera,spatialState});
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
      macroMassPreservationLaw:'MACRO_PLUS_LOCAL_EQUALS_ONE',
      macroRendererWeatherAuthority:'FAP1_ONLY',
      localRendererWeatherAuthority:'FAP1_DESCRIPTOR_REFINEMENT_ONLY',
      macroCloudTuning:false,
      l5LightingActive:false,
      handoffAuthority:'BOUNDED_GB_HANDOFF_ACTIVE'
    });
    return lastReceipt;
  }

  return freeze({
    schema:FAP1_W5_HANDOFF_SCHEMA,
    render,
    getReceipt:()=>lastReceipt,
    beginInteraction(){localSurface.beginInteraction();},
    endInteraction(){localSurface.endInteraction();},
    destroy(){gaAuthority.clearSystemContributions();gaAuthority.renderNow();localSurface.destroy();}
  });
}

export function verifyBoundedW5Handoff(receipt,epsilon=1e-6){
  const failures=[];
  if(receipt?.persistentWeatherIdentity!==true)failures.push('PERSISTENT_WEATHER_IDENTITY_FAILED');
  if(Math.abs((receipt?.contributionSum??NaN)-1)>epsilon)failures.push('CONTRIBUTION_SUM_NOT_ONE');
  if(!(receipt?.macroContribution>=0&&receipt?.macroContribution<=1))failures.push('MACRO_CONTRIBUTION_INVALID');
  if(!(receipt?.localContribution>=0&&receipt?.localContribution<=1))failures.push('LOCAL_CONTRIBUTION_INVALID');
  if(receipt?.macroCloudTuning===true)failures.push('MACRO_TUNING_FORBIDDEN');
  if(receipt?.l5LightingActive!==false)failures.push('L5_PREMATURE_ACTIVATION');
  if(receipt?.handoffAuthority!=='BOUNDED_GB_HANDOFF_ACTIVE')failures.push('HANDOFF_AUTHORITY_MISSING');
  return freeze({schema:'FAP1_W5_BOUNDED_HANDOFF_INVARIANTS_v1',pass:failures.length===0,failures:freeze(failures),weatherId:receipt?.weatherId??null});
}
