(function(){
"use strict";

const RAD=Math.PI/180;
const DEG=180/Math.PI;
const DEFAULT_EPSILON=1e-6;
const DEFAULT_RECOVERY_GAIN=0.10;
const DEFAULT_BEARING_WEIGHT=0.35;
const DEFAULT_DRIFT_WEIGHT=0.20;

function finiteOr(v,fallback){
return Number.isFinite(v)?v:fallback;
}

function clamp(v,min,max){
return Math.max(min,Math.min(max,v));
}

function epsilonOf(input){
return Math.max(DEFAULT_EPSILON,finiteOr(input&&input.epsilon,DEFAULT_EPSILON));
}

function normalizeAngle360(deg){
let a=finiteOr(deg,0)%360;
if(a<0)a+=360;
return a;
}

function normalizeAngle180(deg){
let a=finiteOr(deg,0)%360;
if(a>180)a-=360;
if(a<=-180)a+=360;
return a;
}

function signedDelta(target,current){
return normalizeAngle180(finiteOr(target,0)-finiteOr(current,0));
}

function vec(x,y){
return{
x:finiteOr(x,0),
y:finiteOr(y,0)
};
}

function add(a,b){
return{x:a.x+b.x,y:a.y+b.y};
}

function sub(a,b){
return{x:a.x-b.x,y:a.y-b.y};
}

function scale(v,s){
return{x:v.x*s,y:v.y*s};
}

function mag(v){
return Math.hypot(v.x,v.y);
}

function dot(a,b){
return a.x*b.x+a.y*b.y;
}

function cross2(a,b){
return a.x*b.y-a.y*b.x;
}

function norm(v,eps){
const m=mag(v);
if(m<=eps)return{x:0,y:0};
return{x:v.x/m,y:v.y/m};
}

function headingToUnit(headingTrue){
const r=normalizeAngle360(headingTrue)*RAD;
return{
x:Math.sin(r),
y:Math.cos(r)
};
}

function vectorToBearing(v,eps){
if(mag(v)<=eps)return 0;
return normalizeAngle360(Math.atan2(v.x,v.y)*DEG);
}

function computeTargetVector(position,waypointPosition){
if(!waypointPosition)return null;
return sub(waypointPosition,position);
}

function computeTargetBearing(targetVector,eps){
if(!targetVector)return null;
return vectorToBearing(targetVector,eps);
}

function computeTargetDistance(targetVector){
if(!targetVector)return null;
return mag(targetVector);
}

function computeSpeedOverWater(velocityWater){
return mag(velocityWater);
}

function computeGroundVector(velocityWater,currentVector){
return add(velocityWater,currentVector);
}

function computeCourseOverGround(groundVector,eps){
return vectorToBearing(groundVector,eps);
}

function computeSpeedOverGround(groundVector){
return mag(groundVector);
}

function projectPointToSegment(point,start,end,eps){
const ab=sub(end,start);
const ap=sub(point,start);
const denom=Math.max(dot(ab,ab),eps);
const t=clamp(dot(ap,ab)/denom,0,1);
const closest=add(start,scale(ab,t));
return{
t:t,
closest:closest,
errorVector:sub(point,closest),
routeVector:ab
};
}

function computeCrossTrackError(position,plannedRouteSegment,eps){
if(
!plannedRouteSegment||
!plannedRouteSegment.start||
!plannedRouteSegment.end
){
return null;
}

const start=vec(plannedRouteSegment.start.x,plannedRouteSegment.start.y);
const end=vec(plannedRouteSegment.end.x,plannedRouteSegment.end.y);
const proj=projectPointToSegment(position,start,end,eps);
const sign=Math.sign(cross2(proj.routeVector,sub(position,proj.closest)))||0;
return mag(proj.errorVector)*sign;
}

function computeDriftAngle(headingTrue,courseOverGround){
return signedDelta(courseOverGround,headingTrue);
}

function computeRouteRecoveryTerm(crossTrackError,recoveryGain){
if(crossTrackError===null)return 0;
return -crossTrackError*recoveryGain;
}

function computeWeightedBearingTerm(targetBearing,courseOverGround,bearingWeight){
if(targetBearing===null)return 0;
return signedDelta(targetBearing,courseOverGround)*bearingWeight;
}

function computeWeightedDriftTerm(driftAngle,driftWeight){
if(driftAngle===null)return 0;
return (-driftAngle)*driftWeight;
}

function computeDriftCorrection(terms){
return normalizeAngle180(
finiteOr(terms.routeRecoveryTerm,0)+
finiteOr(terms.weightedBearingTerm,0)+
finiteOr(terms.weightedDriftTerm,0)
);
}

function computeCourseToSteer(targetBearing,driftCorrection){
if(targetBearing===null)return null;
return normalizeAngle360(targetBearing+driftCorrection);
}

function computeEta(targetDistance,speedOverGround,eps){
if(targetDistance===null)return null;
if(speedOverGround<=eps)return Infinity;
return targetDistance/speedOverGround;
}

function computeWindApparentVector(windTrueVector,groundVector){
return sub(windTrueVector,groundVector);
}

function computeWindApparentDirection(windApparentVector,eps){
if(mag(windApparentVector)<=eps)return 0;
return vectorToBearing(windApparentVector,eps);
}

function computeWindApparentSpeed(windApparentVector){
return mag(windApparentVector);
}

function getPrimaryCelestialBody(celestialBodies){
if(!Array.isArray(celestialBodies)||celestialBodies.length===0)return null;
return celestialBodies[0]||null;
}

function computeCelestialAzimuth(position,body,eps){
if(!body)return null;
if(Number.isFinite(body.azimuth))return normalizeAngle360(body.azimuth);
if(!body.position)return null;
const bodyPos=vec(body.position.x,body.position.y);
const rel=sub(bodyPos,position);
if(mag(rel)<=eps)return 0;
return vectorToBearing(rel,eps);
}

function computeCelestialAltitude(position,body,eps){
if(!body)return null;
if(Number.isFinite(body.altitude))return body.altitude;
if(!body.position)return null;
const observerZ=finiteOr(position&&position.z,0);
const bodyZ=finiteOr(body.position.z,0);
const rel=sub(vec(body.position.x,body.position.y),vec(position.x,position.y));
const planar=Math.max(mag(rel),eps);
return Math.atan2(bodyZ-observerZ,planar)*DEG;
}

function computeCorridorError(crossTrackError,targetDistance,visibility,hazardBias){
if(crossTrackError===null&&targetDistance===null)return null;
const xte=Math.abs(finiteOr(crossTrackError,0));
const td=Math.max(finiteOr(targetDistance,0),0);
return xte*(1+hazardBias)+((1-visibility)*td*0.05);
}

function assembleNavigationState(fields){
return{
targetBearing:fields.targetBearing,
targetDistance:fields.targetDistance,
courseOverGround:fields.courseOverGround,
speedOverWater:fields.speedOverWater,
speedOverGround:fields.speedOverGround,
driftAngle:fields.driftAngle,
driftCorrection:fields.driftCorrection,
courseToSteer:fields.courseToSteer,
crossTrackError:fields.crossTrackError,
eta:fields.eta,
windApparentVector:fields.windApparentVector,
windApparentDirection:fields.windApparentDirection,
windApparentSpeed:fields.windApparentSpeed,
celestialAzimuth:fields.celestialAzimuth,
celestialAltitude:fields.celestialAltitude,
corridorError:fields.corridorError
};
}

function computeNavigationState(input){
input=input||{};
const eps=epsilonOf(input);

const position={
x:finiteOr(input.position&&input.position.x,0),
y:finiteOr(input.position&&input.position.y,0),
z:finiteOr(input.position&&input.position.z,0)
};

const velocityWater=vec(
input.velocityWater&&input.velocityWater.x,
input.velocityWater&&input.velocityWater.y
);

const currentVector=vec(
input.currentVector&&input.currentVector.x,
input.currentVector&&input.currentVector.y
);

const waypointPosition=input.waypointPosition?vec(
input.waypointPosition.x,
input.waypointPosition.y
):null;

const windTrueVector=vec(
input.windTrueVector&&input.windTrueVector.x,
input.windTrueVector&&input.windTrueVector.y
);

const headingTrue=normalizeAngle360(input.headingTrue);
const visibility=clamp(finiteOr(input.visibility,1),0,1);
const hazardBias=clamp(finiteOr(input.hazardBias,0),0,1);

const plannedRouteSegment=input.plannedRouteSegment&&
input.plannedRouteSegment.start&&
input.plannedRouteSegment.end
?{
start:vec(input.plannedRouteSegment.start.x,input.plannedRouteSegment.start.y),
end:vec(input.plannedRouteSegment.end.x,input.plannedRouteSegment.end.y),
corridorWidth:finiteOr(input.plannedRouteSegment.corridorWidth,0),
recoveryGain:finiteOr(input.plannedRouteSegment.recoveryGain,DEFAULT_RECOVERY_GAIN),
bearingWeight:finiteOr(input.plannedRouteSegment.bearingWeight,DEFAULT_BEARING_WEIGHT),
driftWeight:finiteOr(input.plannedRouteSegment.driftWeight,DEFAULT_DRIFT_WEIGHT)
}
:null;

const speedOverWater=computeSpeedOverWater(velocityWater);
const groundVector=computeGroundVector(velocityWater,currentVector);
const courseOverGround=computeCourseOverGround(groundVector,eps);
const speedOverGround=computeSpeedOverGround(groundVector);

const targetVector=computeTargetVector(position,waypointPosition);
const targetBearing=computeTargetBearing(targetVector,eps);
const targetDistance=computeTargetDistance(targetVector);

const crossTrackError=computeCrossTrackError(position,plannedRouteSegment,eps);

const driftAngle=computeDriftAngle(headingTrue,courseOverGround);

const routeRecoveryTerm=computeRouteRecoveryTerm(
crossTrackError,
plannedRouteSegment?plannedRouteSegment.recoveryGain:DEFAULT_RECOVERY_GAIN
);

const weightedBearingTerm=computeWeightedBearingTerm(
targetBearing,
courseOverGround,
plannedRouteSegment?plannedRouteSegment.bearingWeight:DEFAULT_BEARING_WEIGHT
);

const weightedDriftTerm=computeWeightedDriftTerm(
driftAngle,
plannedRouteSegment?plannedRouteSegment.driftWeight:DEFAULT_DRIFT_WEIGHT
);

const driftCorrection=computeDriftCorrection({
routeRecoveryTerm:routeRecoveryTerm,
weightedBearingTerm:weightedBearingTerm,
weightedDriftTerm:weightedDriftTerm
});

const courseToSteer=computeCourseToSteer(targetBearing,driftCorrection);

const eta=computeEta(targetDistance,speedOverGround,eps);

const windApparentVector=computeWindApparentVector(windTrueVector,groundVector);
const windApparentDirection=computeWindApparentDirection(windApparentVector,eps);
const windApparentSpeed=computeWindApparentSpeed(windApparentVector);

const body=getPrimaryCelestialBody(input.celestialBodies);
const celestialAzimuth=computeCelestialAzimuth(position,body,eps);
const celestialAltitude=computeCelestialAltitude(position,body,eps);

const corridorError=computeCorridorError(
crossTrackError,
targetDistance,
visibility,
hazardBias
);

return assembleNavigationState({
targetBearing:targetBearing,
targetDistance:targetDistance,
courseOverGround:courseOverGround,
speedOverWater:speedOverWater,
speedOverGround:speedOverGround,
driftAngle:driftAngle,
driftCorrection:driftCorrection,
courseToSteer:courseToSteer,
crossTrackError:crossTrackError,
eta:eta,
windApparentVector:windApparentVector,
windApparentDirection:windApparentDirection,
windApparentSpeed:windApparentSpeed,
celestialAzimuth:celestialAzimuth,
celestialAltitude:celestialAltitude,
corridorError:corridorError
});
}

window.NAVIGATION_MATH_KERNEL=Object.freeze({
version:"NAVIGATION_MATH_KERNEL_v1",
computeNavigationState:computeNavigationState
});
})();
