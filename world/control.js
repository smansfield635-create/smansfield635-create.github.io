import { WORLD_KERNEL } from "./world_kernel.js";

function clamp(v, min, max){return Math.max(min,Math.min(max,v));}
function wrapAngle(v){return Math.atan2(Math.sin(v),Math.cos(v));}
function isNum(v){return typeof v==="number"&&Number.isFinite(v);}

export function createControlSystem(){

  const K = WORLD_KERNEL?.constants || {};

  // ===== STATE AUTHORITY =====
  let yaw = 0;
  let pitch = 0;
  let yawVel = 0;
  let pitchVel = 0;
  let orbitPhase = 0;

  let zoomCurrent = 1;
  let zoomTarget = 1;

  let width = 0;
  let height = 0;
  let centerX = 0;
  let centerY = 0;
  let baseRadius = 0;

  const DRAG = 0.0025;
  const DECAY = 0.92;
  const MIN_PITCH = -(Math.PI/2.2);
  const MAX_PITCH = (Math.PI/2.2);

  function resize(w,h){
    width = w;
    height = h;
    centerX = w*0.5;
    centerY = h*0.5;
    baseRadius = Math.min(w,h)*(K.worldRadiusFactor||0.36);
  }

  function getRadius(){
    return Math.max(1, baseRadius*zoomCurrent);
  }

  // ===== MOTION =====
  function applyDrag(dx,dy){
    yaw = wrapAngle(yaw + dx*DRAG);
    pitch += dy*DRAG;

    yawVel = dx*DRAG*0.45;
    pitchVel = dy*DRAG*0.45;

    pitch = clamp(pitch,MIN_PITCH,MAX_PITCH);
  }

  function stepInertia(dt=16.7){
    const s = clamp(dt/16.7,0.25,4);

    yaw = wrapAngle(yaw + yawVel*s);
    pitch += pitchVel*s;

    const decay = Math.pow(DECAY,s);
    yawVel *= decay;
    pitchVel *= decay;

    pitch = clamp(pitch,MIN_PITCH,MAX_PITCH);

    zoomCurrent += (zoomTarget - zoomCurrent)*0.12;
  }

  function advanceOrbit(dt=16.7, vel=0){
    orbitPhase = wrapAngle(orbitPhase + vel*dt);
  }

  // ===== PROJECTION (CORE) =====
  function projectSphere(latDeg,lonDeg,offset=0){

    const lat = latDeg*Math.PI/180;
    const lon = lonDeg*Math.PI/180;

    const cosLat = Math.cos(lat);
    const sinLat = Math.sin(lat);

    const cosLon = Math.cos(lon + yaw);
    const sinLon = Math.sin(lon + yaw);

    const cosPitch = Math.cos(pitch);
    const sinPitch = Math.sin(pitch);

    const x = cosLat*sinLon;
    const y0 = sinLat;
    const z0 = cosLat*cosLon;

    const y = y0*cosPitch - z0*sinPitch;
    const z = y0*sinPitch + z0*cosPitch;

    const r = getRadius()+offset;

    return Object.freeze({
      x: centerX + x*r,
      y: centerY - y*r,
      z,
      visible: z>=0,
      resolvedRadius:r
    });
  }

  // ===== READ API =====
  function getCameraState(){
    return Object.freeze({
      width,height,centerX,centerY,
      radius:getRadius(),
      yaw,pitch
    });
  }

  function getOrbitalState(){
    return Object.freeze({orbitPhase});
  }

  function getMotionState(){
    return Object.freeze({
      yaw,pitch,yawVelocity:yawVel,pitchVelocity:pitchVel,
      orbitPhase,zoomCurrent,zoomTarget
    });
  }

  function getProjectionSummary(){
    return Object.freeze({
      latDeg:0,
      lonDeg:0,
      sampleX:0,
      sampleY:0
    });
  }

  // ===== MODE =====
  function setPresentationMode(){}

  function restoreMotionState(s={}){
    if(isNum(s.yaw)) yaw=s.yaw;
    if(isNum(s.pitch)) pitch=s.pitch;
    if(isNum(s.orbitPhase)) orbitPhase=s.orbitPhase;
  }

  return Object.freeze({
    resize,
    applyDrag,
    stepInertia,
    advanceOrbit,
    projectSphere,
    getCameraState,
    getMotionState,
    getOrbitalState,
    getProjectionSummary,
    setPresentationMode,
    restoreMotionState
  });
}
