(function(){
"use strict";

const DEFAULT_EPSILON=1e-6;

function finiteOr(v,fallback){
return Number.isFinite(v)?v:fallback;
}

function clamp(v,min,max){
return Math.max(min,Math.min(max,v));
}

function normalizeAngle360(deg){
let a=finiteOr(deg,0)%360;
if(a<0)a+=360;
return a;
}

function epsilonOf(input){
return Math.max(DEFAULT_EPSILON,finiteOr(input&&input.epsilon,DEFAULT_EPSILON));
}

function normalizeInstrumentInput(input){
input=input||{};
const nav=input.navigationState||null;
const interactionState=input.interactionState&&typeof input.interactionState==="object"?input.interactionState:{};
const instrumentConfig=input.instrumentConfig&&typeof input.instrumentConfig==="object"?input.instrumentConfig:{};

return{
navigationState:nav,
timeUTC:input.timeUTC||null,
interactionState:interactionState,
instrumentConfig:instrumentConfig,
epsilon:epsilonOf(input)
};
}

function buildHelmCompassSurface(input){
const nav=input.navigationState||{};
const headingTrue=nav.headingTrue===undefined?null:normalizeAngle360(nav.headingTrue);
const courseOverGround=nav.courseOverGround===undefined?null:normalizeAngle360(nav.courseOverGround);
const courseToSteer=nav.courseToSteer===undefined?null:normalizeAngle360(nav.courseToSteer);
const targetBearing=nav.targetBearing===undefined?null:normalizeAngle360(nav.targetBearing);
const driftAngle=nav.driftAngle===undefined?null:finiteOr(nav.driftAngle,null);
const driftCorrection=nav.driftCorrection===undefined?null:finiteOr(nav.driftCorrection,null);

const headingBugSelection=input.interactionState.headingBugSelection;
const bearingBugAngle=Number.isFinite(headingBugSelection)?normalizeAngle360(headingBugSelection):(targetBearing===null?null:targetBearing);

return{
headingTrue:headingTrue,
courseOverGround:courseOverGround,
courseToSteer:courseToSteer,
targetBearing:targetBearing,
driftAngle:driftAngle,
driftCorrection:driftCorrection,
bearingBugAngle:bearingBugAngle,
driftArcStart:headingTrue,
driftArcEnd:courseOverGround
};
}

function buildAstrolabeSurface(input){
const nav=input.navigationState||{};
const celestialAzimuth=nav.celestialAzimuth===undefined?null:finiteOr(nav.celestialAzimuth,null);
const celestialAltitude=nav.celestialAltitude===undefined?null:finiteOr(nav.celestialAltitude,null);
const visibility=clamp(finiteOr(nav.visibility,input.instrumentConfig.visibilityDefault??1),0,1);
const activeBodyType=input.interactionState.activeBodyType||null;

return{
celestialAzimuth:celestialAzimuth,
celestialAltitude:celestialAltitude,
activeBodyType:activeBodyType,
visibility:visibility,
observationConfidence:visibility,
azimuthRingAngle:celestialAzimuth,
altitudeArcAngle:celestialAltitude
};
}

function buildChartTableSurface(input){
const nav=input.navigationState||{};
const interaction=input.interactionState||{};
const route=interaction.plannedRouteSegment||null;
const vesselPosition=interaction.position||null;
const waypointPosition=interaction.waypointPosition||null;
const crossTrackError=nav.crossTrackError===undefined?null:finiteOr(nav.crossTrackError,null);
const corridorError=nav.corridorError===undefined?null:finiteOr(nav.corridorError,null);
const hazardBias=clamp(finiteOr(interaction.hazardBias,input.instrumentConfig.hazardBiasDefault??0),0,1);

const corridorWidth=route&&Number.isFinite(route.corridorWidth)?route.corridorWidth:null;
const routeStart=route&&route.start?route.start:null;
const routeEnd=route&&route.end?route.end:null;
const offRouteState=(crossTrackError===null||corridorWidth===null)?null:(Math.abs(crossTrackError)>corridorWidth);

return{
vesselPosition:vesselPosition,
waypointPosition:waypointPosition,
routeStart:routeStart,
routeEnd:routeEnd,
corridorWidth:corridorWidth,
crossTrackError:crossTrackError,
corridorError:corridorError,
hazardBias:hazardBias,
offRouteState:offRouteState
};
}

function classifyStatus(corridorError,driftCorrection){
if(corridorError===null&&driftCorrection===null)return null;
const ce=Math.abs(finiteOr(corridorError,0));
const dc=Math.abs(finiteOr(driftCorrection,0));
if(ce<=0.5&&dc<=5)return"GREEN";
if(ce<=2.0&&dc<=20)return"YELLOW";
return"RED";
}

function buildCourseIndicatorSurface(input){
const nav=input.navigationState||{};
const targetBearing=nav.targetBearing===undefined?null:finiteOr(nav.targetBearing,null);
const targetDistance=nav.targetDistance===undefined?null:finiteOr(nav.targetDistance,null);
const speedOverGround=nav.speedOverGround===undefined?null:finiteOr(nav.speedOverGround,null);
const eta=nav.eta===undefined?null:nav.eta;
const driftCorrection=nav.driftCorrection===undefined?null:finiteOr(nav.driftCorrection,null);
const corridorError=nav.corridorError===undefined?null:finiteOr(nav.corridorError,null);

return{
targetBearing:targetBearing,
targetDistance:targetDistance,
speedOverGround:speedOverGround,
eta:eta,
driftCorrection:driftCorrection,
corridorError:corridorError,
statusClass:classifyStatus(corridorError,driftCorrection)
};
}

function applySurfaceDegradation(surface,input,surfaceName){
const nav=input.navigationState||{};
if(surfaceName==="helmCompassSurface"){
if(nav.targetBearing===null){
surface.targetBearing=null;
surface.courseToSteer=null;
surface.bearingBugAngle=null;
}
return surface;
}

if(surfaceName==="astrolabeSurface"){
if(nav.celestialAzimuth===null||nav.celestialAltitude===null){
surface.celestialAzimuth=null;
surface.celestialAltitude=null;
surface.azimuthRingAngle=null;
surface.altitudeArcAngle=null;
surface.observationConfidence=0;
}
return surface;
}

if(surfaceName==="chartTableSurface"){
const route=input.interactionState.plannedRouteSegment||null;
if(!route){
surface.routeStart=null;
surface.routeEnd=null;
surface.corridorWidth=null;
surface.crossTrackError=null;
surface.offRouteState=null;
}
return surface;
}

if(surfaceName==="courseIndicatorSurface"){
if(nav.targetBearing===null){
surface.targetBearing=null;
surface.targetDistance=null;
surface.eta=null;
}
return surface;
}

return surface;
}

function validateSurface(surface){
const out={};
for(const k in surface){
const v=surface[k];
if(v===undefined){
out[k]=null;
continue;
}
if(typeof v==="number"&&!Number.isFinite(v)){
out[k]=null;
continue;
}
out[k]=v;
}
return out;
}

function assembleInstrumentRuntimeState(surfaces){
return{
helmCompassSurface:surfaces.helmCompassSurface,
astrolabeSurface:surfaces.astrolabeSurface,
chartTableSurface:surfaces.chartTableSurface,
courseIndicatorSurface:surfaces.courseIndicatorSurface
};
}

function computeInstrumentRuntimeState(input){
const normalized=normalizeInstrumentInput(input);

const helmCompassSurface=validateSurface(
applySurfaceDegradation(
buildHelmCompassSurface(normalized),
normalized,
"helmCompassSurface"
)
);

const astrolabeSurface=validateSurface(
applySurfaceDegradation(
buildAstrolabeSurface(normalized),
normalized,
"astrolabeSurface"
)
);

const chartTableSurface=validateSurface(
applySurfaceDegradation(
buildChartTableSurface(normalized),
normalized,
"chartTableSurface"
)
);

const courseIndicatorSurface=validateSurface(
applySurfaceDegradation(
buildCourseIndicatorSurface(normalized),
normalized,
"courseIndicatorSurface"
)
);

return assembleInstrumentRuntimeState({
helmCompassSurface:helmCompassSurface,
astrolabeSurface:astrolabeSurface,
chartTableSurface:chartTableSurface,
courseIndicatorSurface:courseIndicatorSurface
});
}

window.INSTRUMENT_RUNTIME_KERNEL=Object.freeze({
version:"INSTRUMENT_RUNTIME_KERNEL_v1",
computeInstrumentRuntimeState:computeInstrumentRuntimeState
});
})();
