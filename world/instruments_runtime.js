(function(){
"use strict";

const INSTRUMENTS_RUNTIME_VERSION="OPENWORLD_INSTRUMENTS_RUNTIME_v1";

function isNum(v){
return typeof v==="number"&&isFinite(v);
}

function safeNum(v,fallback){
return isNum(v)?v:fallback;
}

function normalizeDeg(v){
let out=v%360;
if(out<0)out+=360;
return out;
}

function classifyNeedle(deltaDeg){
const a=Math.abs(deltaDeg);
if(a<3)return"steady";
if(a<12)return"correcting";
return"aggressive";
}

function buildAstrolabeSurface(mathOutput){
const p=mathOutput.positional_truth||{};
const r=mathOutput.route_truth||{};
const c=mathOutput.correction_truth||{};
const cel=mathOutput.celestial_truth||{};

return{
device_id:"astrolabe_surface",
target_available:!!p.target_available,
bearing_to_target_deg:safeNum(p.bearing_to_target_deg,0),
distance_to_target:safeNum(p.distance_to_target,0),
cross_track_error:safeNum(p.cross_track_error,0),
route_deviation_class:String(p.route_deviation_class||"unavailable"),
recommended_course_deg:safeNum(r.recommended_course_deg,0),
course_correction_deg:safeNum(c.course_correction_deg,0),
celestial_alignment_state:String(cel.celestial_alignment_state||"unavailable")
};
}

function buildHelmCompassSurface(mathOutput,interactionState){
const p=mathOutput.positional_truth||{};
const c=mathOutput.correction_truth||{};
const helm=interactionState&&interactionState.helm_input?interactionState.helm_input:{};

return{
device_id:"helm_compass_surface",
commanded_heading_deg:safeNum(helm.commanded_heading_deg,safeNum(p.heading_deg,0)),
track_deg:safeNum(p.track_deg,0),
heading_track_delta_deg:safeNum(p.heading_track_delta_deg,0),
course_correction_deg:safeNum(c.course_correction_deg,0),
needle_state:classifyNeedle(safeNum(c.course_correction_deg,0)),
recommended_turn_state:String(c.recommended_turn_state||"hold")
};
}

function buildChartSurface(mathOutput,interactionState){
const p=mathOutput.positional_truth||{};
const r=mathOutput.route_truth||{};
const target=interactionState&&interactionState.target_selection?interactionState.target_selection:{};

return{
device_id:"chart_surface",
target_id:target.target_id||p.target_id||null,
target_lock_state:String(target.target_lock_state||"unlocked"),
route_id:r.route_id||null,
route_available:!!r.route_available,
distance_remaining:safeNum(r.distance_remaining,0),
cross_track_error:safeNum(p.cross_track_error,0),
route_deviation_class:String(p.route_deviation_class||"unavailable")
};
}

function buildCourseSurface(mathOutput,interactionState){
const r=mathOutput.route_truth||{};
const c=mathOutput.correction_truth||{};
const course=interactionState&&interactionState.course_selection?interactionState.course_selection:{};

return{
device_id:"course_surface",
selected_course_deg:normalizeDeg(safeNum(course.selected_course_deg,safeNum(r.selected_course_deg,0))),
recommended_course_deg:normalizeDeg(safeNum(r.recommended_course_deg,0)),
course_correction_deg:safeNum(c.course_correction_deg,0),
correction_direction:String(c.correction_direction||"hold"),
correction_class:String(c.correction_class||"minor"),
lock_state:String(course.lock_state||"unlocked")
};
}

function buildEnvironmentSurface(mathOutput){
const env=mathOutput.environment_truth||{};
const cel=mathOutput.celestial_truth||{};

return{
device_id:"environment_surface",
time_of_day_class:String(env.time_of_day_class||"unknown"),
visibility_class:String(env.visibility_class||"clear"),
wind_direction_deg:safeNum(env.wind_direction_deg,0),
wind_speed:safeNum(env.wind_speed,0),
current_direction_deg:safeNum(env.current_direction_deg,0),
current_speed:safeNum(env.current_speed,0),
apparent_wind_direction_deg:safeNum(env.apparent_wind_direction_deg,0),
apparent_wind_speed:safeNum(env.apparent_wind_speed,0),
apparent_wind_consistency:String(env.apparent_wind_consistency||"unknown"),
celestial_alignment_state:String(cel.celestial_alignment_state||"unavailable")
};
}

function buildState(mathOutput,interactionState){
const astrolabeSurface=buildAstrolabeSurface(mathOutput);
const helmCompassSurface=buildHelmCompassSurface(mathOutput,interactionState);
const chartSurface=buildChartSurface(mathOutput,interactionState);
const courseSurface=buildCourseSurface(mathOutput,interactionState);
const environmentSurface=buildEnvironmentSurface(mathOutput);

return{
runtime_name:"INSTRUMENT_RUNTIME",
runtime_version:INSTRUMENTS_RUNTIME_VERSION,
astrolabe_surface:astrolabeSurface,
helm_compass_surface:helmCompassSurface,
chart_surface:chartSurface,
course_surface:courseSurface,
environment_surface:environmentSurface
};
}

function buildSurfaces(instrumentState){
return{
astrolabe_surface:instrumentState.astrolabe_surface,
helm_compass_surface:instrumentState.helm_compass_surface,
chart_surface:instrumentState.chart_surface,
course_surface:instrumentState.course_surface,
environment_surface:instrumentState.environment_surface
};
}

window.OPENWORLD_INSTRUMENTS_RUNTIME=Object.freeze({
version:INSTRUMENTS_RUNTIME_VERSION,
buildState:buildState,
buildSurfaces:buildSurfaces
});
})();
