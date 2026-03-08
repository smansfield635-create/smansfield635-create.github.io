(function(){
"use strict";

const NAVIGATION_MATH_VERSION="OPENWORLD_NAVIGATION_MATH_v1";

function clamp(v,min,max){
return Math.max(min,Math.min(max,v));
}

function isNum(v){
return typeof v==="number"&&isFinite(v);
}

function safeNum(v,fallback){
return isNum(v)?v:fallback;
}

function deg(rad){
return rad*(180/Math.PI);
}

function normalizeDeg(v){
let out=v%360;
if(out<0)out+=360;
return out;
}

function shortestSignedDeltaDeg(fromDeg,toDeg){
let d=normalizeDeg(toDeg)-normalizeDeg(fromDeg);
if(d>180)d-=360;
if(d<-180)d+=360;
return d;
}

function magnitude2D(x,z){
return Math.sqrt((x*x)+(z*z));
}

function bearingFromXZ(dx,dz){
const raw=deg(Math.atan2(dx,dz));
return normalizeDeg(raw);
}

function signedCrossTrackError(start,end,point){
const ax=safeNum(start.x,0);
const az=safeNum(start.z,0);
const bx=safeNum(end.x,ax);
const bz=safeNum(end.z,az);
const px=safeNum(point.x,ax);
const pz=safeNum(point.z,az);

const abx=bx-ax;
const abz=bz-az;
const apx=px-ax;
const apz=pz-az;

const denom=Math.sqrt((abx*abx)+(abz*abz));
if(denom<=1e-9)return 0;

return ((abx*apz)-(abz*apx))/denom;
}

function classifyDeviation(absErr){
if(absErr<5)return"on_track";
if(absErr<20)return"minor";
if(absErr<50)return"moderate";
return"major";
}

function classifyEtaStability(distance,speed){
if(speed<=1e-6)return"unavailable";
const eta=distance/speed;
if(eta<60)return"high";
if(eta<300)return"medium";
return"low";
}

function classifyCelestialAvailability(environmentState){
const celestial=environmentState&&environmentState.celestial_state?environmentState.celestial_state:null;
const visibility=String(environmentState&&environmentState.visibility_class?environmentState.visibility_class:"clear").toLowerCase();

if(!celestial)return"unavailable";
if(visibility==="obstructed"||visibility==="blocked")return"degraded";
if(visibility==="low"||visibility==="poor"||visibility==="fog"||visibility==="storm")return"degraded";

const hasSun=!!(celestial.sun);
const hasMoon=!!(celestial.moon);
const hasStars=Array.isArray(celestial.stars)&&celestial.stars.length>0;

if(hasSun||hasMoon||hasStars)return"available";
return"unavailable";
}

function classifyApparentWindConsistency(inputWind,truthWind){
const dirKnown=isNum(inputWind.direction_deg)&&isNum(truthWind.apparent_wind_direction_deg);
const spdKnown=isNum(inputWind.speed)&&isNum(truthWind.apparent_wind_speed);

if(!dirKnown&&!spdKnown)return"unknown";

const dirErr=dirKnown?Math.abs(shortestSignedDeltaDeg(inputWind.direction_deg,truthWind.apparent_wind_direction_deg)):0;
const spdErr=spdKnown?Math.abs(inputWind.speed-truthWind.apparent_wind_speed):0;

if(dirErr<=2&&spdErr<=0.25)return"exact";
if(dirErr<=10&&spdErr<=1.0)return"consistent";
return"inconsistent";
}

function getRouteNodes(worldState){
const graph=worldState&&worldState.route_graph?worldState.route_graph:null;
return graph&&Array.isArray(graph.nodes)?graph.nodes:[];
}

function getCurrentPosition(worldState){
const p=worldState&&worldState.vessel_position?worldState.vessel_position:null;
return{
x:safeNum(p&&p.x,0),
y:safeNum(p&&p.y,0),
z:safeNum(p&&p.z,0)
};
}

function getHeadingDeg(worldState,interactionState){
const fromTrack=worldState&&worldState.vessel_track_ref&&isNum(worldState.vessel_track_ref.heading_ref)
?deg(worldState.vessel_track_ref.heading_ref)
:null;

const fromInteraction=interactionState&&interactionState.helm_input&&isNum(interactionState.helm_input.commanded_heading_deg)
?interactionState.helm_input.commanded_heading_deg
:null;

return normalizeDeg(fromInteraction!==null?fromInteraction:(fromTrack!==null?fromTrack:0));
}

function getTrackDeg(worldState){
const raw=worldState&&worldState.vessel_track_ref&&isNum(worldState.vessel_track_ref.track_ref)
?deg(worldState.vessel_track_ref.track_ref)
:null;
return normalizeDeg(raw!==null?raw:0);
}

function resolveTarget(worldState,interactionState){
const explicitWaypoint=worldState&&worldState.active_waypoint?worldState.active_waypoint:null;
if(explicitWaypoint&&explicitWaypoint.coordinate){
return{
id:String(explicitWaypoint.waypoint_id||"active_waypoint"),
coordinate:{
x:safeNum(explicitWaypoint.coordinate.x,0),
y:safeNum(explicitWaypoint.coordinate.y,0),
z:safeNum(explicitWaypoint.coordinate.z,0)
},
source:"active_waypoint"
};
}

const targetId=interactionState&&interactionState.target_selection?interactionState.target_selection.target_id:null;
const nodes=getRouteNodes(worldState);
if(targetId&&nodes.length){
for(let i=0;i<nodes.length;i++){
const n=nodes[i];
if(String(n.id)===String(targetId)){
const a=n.anchor||{};
return{
id:String(n.id),
coordinate:{
x:safeNum(a.x,0),
y:safeNum(a.y,0),
z:safeNum(a.z,0)
},
source:"route_graph"
};
}
}
}

return null;
}

function resolveRouteEndpoints(worldState,target){
const nodes=getRouteNodes(worldState);
const currentRegionId=worldState?worldState.region_id:null;
let start=null;
let end=null;

if(nodes.length){
for(let i=0;i<nodes.length;i++){
const n=nodes[i];
if(currentRegionId!==null&&String(n.id)===String(currentRegionId)){
const a=n.anchor||{};
start={x:safeNum(a.x,0),y:safeNum(a.y,0),z:safeNum(a.z,0)};
}
if(target&&String(n.id)===String(target.id)){
const a=n.anchor||{};
end={x:safeNum(a.x,0),y:safeNum(a.y,0),z:safeNum(a.z,0)};
}
}
}

if(!start){
const pos=getCurrentPosition(worldState);
start={x:pos.x,y:pos.y,z:pos.z};
}

if(!end&&target){
end=target.coordinate;
}

return{start,end};
}

function computePositionalTruth(worldState,interactionState){
const pos=getCurrentPosition(worldState);
const target=resolveTarget(worldState,interactionState);
const headingDeg=getHeadingDeg(worldState,interactionState);
const trackDeg=getTrackDeg(worldState);

let bearingToTargetDeg=headingDeg;
let distanceToTarget=0;
let targetAvailable=false;

if(target){
const dx=target.coordinate.x-pos.x;
const dz=target.coordinate.z-pos.z;
bearingToTargetDeg=bearingFromXZ(dx,dz);
distanceToTarget=magnitude2D(dx,dz);
targetAvailable=true;
}

const headingTrackDeltaDeg=shortestSignedDeltaDeg(headingDeg,trackDeg);

let crossTrackError=0;
let routeDeviationClass="unavailable";

if(targetAvailable){
const endpoints=resolveRouteEndpoints(worldState,target);
if(endpoints.start&&endpoints.end){
crossTrackError=signedCrossTrackError(endpoints.start,endpoints.end,pos);
routeDeviationClass=classifyDeviation(Math.abs(crossTrackError));
}
}

return{
position_world:{x:pos.x,y:pos.y,z:pos.z},
heading_deg:headingDeg,
track_deg:trackDeg,
bearing_to_target_deg:bearingToTargetDeg,
distance_to_target:distanceToTarget,
heading_track_delta_deg:headingTrackDeltaDeg,
cross_track_error:crossTrackError,
route_deviation_class:routeDeviationClass,
target_available:targetAvailable,
target_id:target?target.id:null
};
}

function computeRouteTruth(worldState,positionalTruth,interactionState){
const targetLocked=!!(interactionState&&interactionState.target_selection&&String(interactionState.target_selection.target_lock_state||"").toLowerCase()==="locked");
const selectedCourseDeg=interactionState&&interactionState.course_selection&&isNum(interactionState.course_selection.selected_course_deg)
?normalizeDeg(interactionState.course_selection.selected_course_deg)
:positionalTruth.bearing_to_target_deg;

const distance=positionalTruth.distance_to_target;
const throttleClass=String(interactionState&&interactionState.helm_input&&interactionState.helm_input.throttle_class?interactionState.helm_input.throttle_class:"cruise").toLowerCase();

let nominalSpeed;
if(throttleClass==="stop"||throttleClass==="hold")nominalSpeed=0;
else if(throttleClass==="slow")nominalSpeed=4;
else if(throttleClass==="cruise")nominalSpeed=8;
else if(throttleClass==="fast")nominalSpeed=12;
else nominalSpeed=8;

const etaSeconds=nominalSpeed>0?(distance/nominalSpeed):null;

return{
route_id:positionalTruth.target_id,
target_lock_state:targetLocked?"locked":"unlocked",
selected_course_deg:selectedCourseDeg,
recommended_course_deg:positionalTruth.target_available?positionalTruth.bearing_to_target_deg:selectedCourseDeg,
distance_remaining:distance,
eta_seconds:etaSeconds,
eta_stability_class:classifyEtaStability(distance,nominalSpeed),
route_available:!!positionalTruth.target_available
};
}

function computeCorrectionTruth(positionalTruth,routeTruth,interactionState){
const steeringDelta=safeNum(interactionState&&interactionState.helm_input&&interactionState.helm_input.steering_delta,0);
const noTarget=!routeTruth.route_available;

if(noTarget){
return{
course_correction_deg:0,
correction_direction:"hold",
correction_class:"degraded_safe",
recommended_turn_state:"hold",
degradation_state:"no_target_safe_degradation"
};
}

const targetCourse=routeTruth.recommended_course_deg;
const currentHeading=positionalTruth.heading_deg;
const headingCorrection=shortestSignedDeltaDeg(currentHeading,targetCourse);
const crossTrackCorrection=clamp((-positionalTruth.cross_track_error)*0.35,-20,20);
const correction=clamp(headingCorrection+crossTrackCorrection+steeringDelta,-45,45);

let direction="hold";
if(correction>1)direction="starboard";
else if(correction<-1)direction="port";

let correctionClass="minor";
const absCorrection=Math.abs(correction);
if(absCorrection<3)correctionClass="minor";
else if(absCorrection<12)correctionClass="moderate";
else correctionClass="major";

return{
course_correction_deg:correction,
correction_direction:direction,
correction_class:correctionClass,
recommended_turn_state:direction,
degradation_state:"nominal"
};
}

function computeEnvironmentTruth(environmentState,worldState){
const wind=environmentState&&environmentState.wind?environmentState.wind:{};
const current=environmentState&&environmentState.current?environmentState.current:{};
const vesselTrackDeg=worldState&&worldState.vessel_track_ref&&isNum(worldState.vessel_track_ref.track_ref)
?normalizeDeg(deg(worldState.vessel_track_ref.track_ref))
:0;

const windDir=safeNum(wind.direction_deg,0);
const windSpeed=safeNum(wind.speed,0);
const currentDir=safeNum(current.direction_deg,0);
const currentSpeed=safeNum(current.speed,0);

const apparentWindDirectionDeg=normalizeDeg(windDir-vesselTrackDeg);
const apparentWindSpeed=Math.max(0,windSpeed-(currentSpeed*0.15));

const truth={
time_of_day_class:String(environmentState&&environmentState.time_of_day_class?environmentState.time_of_day_class:"unknown"),
visibility_class:String(environmentState&&environmentState.visibility_class?environmentState.visibility_class:"clear"),
wind_direction_deg:windDir,
wind_speed:windSpeed,
current_direction_deg:currentDir,
current_speed:currentSpeed,
apparent_wind_direction_deg:apparentWindDirectionDeg,
apparent_wind_speed:apparentWindSpeed
};

truth.apparent_wind_consistency=classifyApparentWindConsistency(wind,truth);

return truth;
}

function computeCelestialTruth(environmentState){
const celestial=environmentState&&environmentState.celestial_state?environmentState.celestial_state:{};
const state=classifyCelestialAvailability(environmentState);

return{
celestial_alignment_state:state,
sun_available:!!celestial.sun,
moon_available:!!celestial.moon,
star_field_available:Array.isArray(celestial.stars)&&celestial.stars.length>0,
observer_frame:String(celestial.observer_frame||"world_frame")
};
}

function compute(input){
const worldState=input&&input.world_state?input.world_state:{};
const environmentState=input&&input.environment_state?input.environment_state:{};
const interactionState=input&&input.interaction_state?input.interaction_state:{};

const positionalTruth=computePositionalTruth(worldState,interactionState);
const routeTruth=computeRouteTruth(worldState,positionalTruth,interactionState);
const correctionTruth=computeCorrectionTruth(positionalTruth,routeTruth,interactionState);
const environmentTruth=computeEnvironmentTruth(environmentState,worldState);
const celestialTruth=computeCelestialTruth(environmentState);

return{
meta:{
kernel_name:"NAVIGATION_MATH_KERNEL",
kernel_version:NAVIGATION_MATH_VERSION,
derivation_request:String(input&&input.derivation_request?input.derivation_request:"full"),
frame_id:String(worldState&&worldState.vessel_track_ref&&worldState.vessel_track_ref.frame_id?worldState.vessel_track_ref.frame_id:"world_frame")
},
positional_truth:positionalTruth,
route_truth:routeTruth,
correction_truth:correctionTruth,
environment_truth:environmentTruth,
celestial_truth:celestialTruth
};
}

window.OPENWORLD_NAVIGATION_MATH=Object.freeze({
version:NAVIGATION_MATH_VERSION,
compute:compute
});
})();
