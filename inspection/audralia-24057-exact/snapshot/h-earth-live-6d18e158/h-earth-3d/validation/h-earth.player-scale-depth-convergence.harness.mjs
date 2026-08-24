import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {
  H_EARTH_RUN_8C_SUCCESSOR_SURFACE_MATERIAL_PROFILE,
  sampleHEarthRun8CSuccessorSurfaceMaterial,
  evaluateHEarthRun8CSuccessorSurfaceMaterial
} from '../environment/h-earth.successor-surface-material.run8c.js';
import {
  sampleHEarthAtmosphereState,
  evaluateHEarthAtmosphereStateSample
} from '../environment/h-earth.atmosphere-state.js';
import {
  H_EARTH_ATMOSPHERE_PRESENTATION,
  H_EARTH_PLAYER_SCALE_ATMOSPHERE_PRESENTATION_PROFILE,
  buildHEarthAtmospherePresentation,
  evaluateHEarthAtmospherePresentation,
  computeHEarthAtmosphericFogFactor,
  getHEarthPlayerScaleFogStartDistance
} from '../../showroom/globe/h-earth/render/environment-atmosphere.js';
import {
  H_EARTH_RUN_8C_NORMAL_LIGHT_MATERIAL_PROFILE,
  H_EARTH_PLAYER_SCALE_FORM_LIGHTING_PROFILE,
  projectHEarthRun8CVertexMaterialLighting
} from '../../showroom/globe/h-earth/render/lighting-material-successor-terrain.run8c.js';

const checks=[];
const pass=(id,detail={})=>checks.push({id,result:'PASS',detail});
const check=(id,predicate,detail={})=>{assert.ok(predicate,id);pass(id,detail);};
const stable=(value)=>JSON.stringify(value,Object.keys(value??{}).sort());

check('MATERIAL_PROFILE_NO_GEOMETRY_AUTHORITY',H_EARTH_RUN_8C_SUCCESSOR_SURFACE_MATERIAL_PROFILE.owns.geometry===false);
check('MATERIAL_PROFILE_NO_CAMERA_AUTHORITY',H_EARTH_RUN_8C_SUCCESSOR_SURFACE_MATERIAL_PROFILE.owns.camera===false);
check('LIGHTING_PROFILE_NO_GEOMETRY_AUTHORITY',H_EARTH_RUN_8C_NORMAL_LIGHT_MATERIAL_PROFILE.owns.geometry===false);
check('LIGHTING_PROFILE_NO_CAMERA_AUTHORITY',H_EARTH_RUN_8C_NORMAL_LIGHT_MATERIAL_PROFILE.owns.cameraAuthority===false);
check('ATMOSPHERE_PRESENTATION_NO_CAMERA_AUTHORITY',H_EARTH_ATMOSPHERE_PRESENTATION.ownership.ownsCamera===false);
check('ATMOSPHERE_PRESENTATION_NO_GEOMETRY_AUTHORITY',H_EARTH_ATMOSPHERE_PRESENTATION.ownership.ownsGeometry===false);

const samples=[];
for(let z=-200;z<=-48;z+=16){
  for(let x=-144;x<=144;x+=16){
    const sample=sampleHEarthRun8CSuccessorSurfaceMaterial(x,z);
    if(sample?.valid===true && evaluateHEarthRun8CSuccessorSurfaceMaterial(sample).eligible===true && !sample.surfaceClass.includes('WATER')) samples.push(sample);
  }
}
check('PLAYER_SCALE_LAND_SAMPLE_COVERAGE',samples.length>=80,{count:samples.length});
const variations=samples.map(s=>s.nonperiodicSurfaceVariation);
const variationRange=Math.max(...variations)-Math.min(...variations);
check('NONPERIODIC_SURFACE_VARIATION_RANGE',variationRange>=0.18,{variationRange});
check('MESO_VARIATION_CHANNEL_PRESENT',samples.every(s=>Number.isFinite(s.mesoMaterialVariation)&&s.mesoMaterialVariation>=0&&s.mesoMaterialVariation<=1));
check('LOCAL_VARIATION_CHANNEL_PRESENT',samples.every(s=>Number.isFinite(s.localMaterialVariation)&&s.localMaterialVariation>=0&&s.localMaterialVariation<=1));

const xAxis=[];
const zAxis=[];
for(let x=-128;x<=128;x+=16){const s=sampleHEarthRun8CSuccessorSurfaceMaterial(x,-112);if(s?.valid===true&&!s.surfaceClass.includes('WATER'))xAxis.push(s.nonperiodicSurfaceVariation);}
for(let z=-192;z<=-48;z+=16){const s=sampleHEarthRun8CSuccessorSurfaceMaterial(32,z);if(s?.valid===true&&!s.surfaceClass.includes('WATER'))zAxis.push(s.nonperiodicSurfaceVariation);}
const axisRange=a=>a.length?Math.max(...a)-Math.min(...a):0;
check('TWO_DIMENSIONAL_VARIATION_X',xAxis.length>=6&&axisRange(xAxis)>=0.08,{count:xAxis.length,range:axisRange(xAxis)});
check('TWO_DIMENSIONAL_VARIATION_Z',zAxis.length>=6&&axisRange(zAxis)>=0.08,{count:zAxis.length,range:axisRange(zAxis)});

const deterministicPoints=[[-91,-151],[-37,-103],[19,-87],[73,-167],[121,-71]];
for(const [x,z] of deterministicPoints){
  const a=sampleHEarthRun8CSuccessorSurfaceMaterial(x,z);
  const b=sampleHEarthRun8CSuccessorSurfaceMaterial(x,z);
  check(`DETERMINISTIC_MATERIAL_${x}_${z}`,JSON.stringify(a)===JSON.stringify(b));
}

const atmosphere=sampleHEarthAtmosphereState({timeOfDayHours:15.25,observerElevation:2.25,viewDistance:3328});
check('ATMOSPHERE_STATE_VALID',evaluateHEarthAtmosphereStateSample(atmosphere).eligible===true);
const protectedStart=getHEarthPlayerScaleFogStartDistance(atmosphere);
check('FOG_START_DELAYED_BEYOND_CANONICAL',protectedStart>=atmosphere.fogStartDistance*1.25,{canonical:atmosphere.fogStartDistance,protectedStart});
const fog400=computeHEarthAtmosphericFogFactor(400,atmosphere);
const fog768=computeHEarthAtmosphericFogFactor(768,atmosphere);
const fog1200=computeHEarthAtmosphericFogFactor(1200,atmosphere);
const fog3000=computeHEarthAtmosphericFogFactor(3000,atmosphere);
check('NEAR_FIELD_FOG_ZERO',fog400===0,{fog400});
check('MIDGROUND_FOG_PROTECTED',fog768<=0.01,{fog768});
check('REGIONAL_FOG_GRADED',fog1200>fog768&&fog1200<0.30,{fog1200});
check('DISTANT_FOG_RETAINS_DEPTH',fog3000>0.55&&fog3000<=atmosphere.maximumFogFactor,{fog3000});
const atmospherePresentation=buildHEarthAtmospherePresentation(atmosphere,{viewportWidth:720,viewportHeight:1280,cameraFarPlane:3328});
check('ATMOSPHERE_PRESENTATION_VALID',evaluateHEarthAtmospherePresentation(atmospherePresentation).eligible===true);
check('HORIZON_HAZE_REDUCED_FOR_PLAYER_SCALE',atmospherePresentation.horizonHaze.opacity<0.40,{opacity:atmospherePresentation.horizonHaze.opacity});
check('DISTANCE_DESATURATION_REDUCED',atmospherePresentation.terrainDistanceDesaturation.strength<atmosphere.distanceDesaturationStrength,{source:atmosphere.distanceDesaturationStrength,presentation:atmospherePresentation.terrainDistanceDesaturation.strength});

const land=samples.find(s=>s.surfaceClass==='COASTAL_SOIL')??samples.find(s=>s.surfaceClass==='LOWLAND_SOIL')??samples[0];
check('LIGHTING_TEST_LAND_SAMPLE_AVAILABLE',!!land,{surfaceClass:land?.surfaceClass});
const world={...land.world};
const cameraWorld={x:world.x+6,y:world.y+4,z:world.z+8};
const sunFacing={...atmosphere.sunDirection};
const transverse={x:-atmosphere.sunDirection.z,y:Math.max(0.18,atmosphere.sunDirection.y*0.35),z:atmosphere.sunDirection.x};
const len=Math.hypot(transverse.x,transverse.y,transverse.z);transverse.x/=len;transverse.y/=len;transverse.z/=len;
const facing=projectHEarthRun8CVertexMaterialLighting({world,normal:sunFacing,surfaceMaterial:land,atmosphereState:atmosphere,cameraWorld});
const side=projectHEarthRun8CVertexMaterialLighting({world,normal:transverse,surfaceMaterial:land,atmosphereState:atmosphere,cameraWorld});
check('NORMAL_LIGHT_FACING_SAMPLE_VALID',facing.eligible===true);
check('NORMAL_LIGHT_TRANSVERSE_SAMPLE_VALID',side.eligible===true);
check('NORMAL_LIGHT_FORM_SEPARATION',Math.abs(facing.luminance-side.luminance)>=8,{facing:facing.luminance,side:side.luminance});
check('PLAYER_SCALE_DIFFUSE_WEIGHT_STRENGTHENED',H_EARTH_PLAYER_SCALE_FORM_LIGHTING_PROFILE.diffuseWeight>=0.90,{weight:H_EARTH_PLAYER_SCALE_FORM_LIGHTING_PROFILE.diffuseWeight});
check('PLAYER_SCALE_SLOPE_FORM_STRENGTHENED',H_EARTH_PLAYER_SCALE_FORM_LIGHTING_PROFILE.slopeBase<=0.63,{slopeBase:H_EARTH_PLAYER_SCALE_FORM_LIGHTING_PROFILE.slopeBase});

const receipt={
  schema:'H_EARTH_PLAYER_SCALE_DEPTH_CONVERGENCE_RECEIPT_v1',
  operationId:'H_EARTH_PLAYER_SCALE_ENVIRONMENT_DEPTH_CONVERGENCE_20260820_002',
  status:'PASS_CLOSED',
  checkCount:checks.length,
  passCount:checks.filter(c=>c.result==='PASS').length,
  metrics:{sampleCount:samples.length,variationRange,xAxisRange:axisRange(xAxis),zAxisRange:axisRange(zAxis),protectedFogStart:protectedStart,fog400,fog768,fog1200,fog3000,normalLightLuminanceDelta:Math.abs(facing.luminance-side.luminance)},
  boundaries:{geometryMutation:false,cameraMutation:false,navigationMutation:false,oceanMutation:false,mirrorManorConstruction:false,placeTransitionConstruction:false,ownerVisualAcceptance:false},
  checks
};
const canonical=JSON.stringify(receipt);
receipt.receiptSha256=crypto.createHash('sha256').update(canonical).digest('hex');
console.log(JSON.stringify(receipt,null,2));
