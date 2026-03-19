import { WORLD_KERNEL } from "./world_kernel.js";

function clamp(v, min, max){ return Math.max(min, Math.min(max, v)); }
function wrap(a){ return Math.atan2(Math.sin(a), Math.cos(a)); }
function isNum(v){ return typeof v==="number" && Number.isFinite(v); }
function obj(v){ return v && typeof v==="object" && !Array.isArray(v) ? v : {}; }

function K(){
  const c = obj(WORLD_KERNEL?.constants);
  return Object.freeze({
    worldRadiusFactor: isNum(c.worldRadiusFactor)?c.worldRadiusFactor:0.36,
    minPitch: isNum(c.minPitch)?c.minPitch:-(Math.PI/2.2),
    maxPitch: isNum(c.maxPitch)?c.maxPitch:(Math.PI/2.2),
    initialYaw: isNum(c.initialYaw)?c.initialYaw:0,
    initialPitch: isNum(c.initialPitch)?c.initialPitch:0,
    dragSensitivity: isNum(c.dragSensitivity)?c.dragSensitivity:0.0025,
    inertiaDecay: isNum(c.inertiaDecay)?c.inertiaDecay:0.92
  });
}

export function createControlSystem(){
  const k = K();

  let yaw = k.initialYaw;
  let pitch = k.initialPitch;
  let yawV = 0;
  let pitchV = 0;

  let orbitPhase = 0;

  let zoom = 1;
  let zoomT = 1;
  let zoomMin = 1;
  let zoomMax = 1;

  let mode = "round";

  const cam = { w:0,h:0,cx:0,cy:0,r:0 };

  function clampPitch(){ pitch = clamp(pitch,k.minPitch,k.maxPitch); }
  function r(){ return Math.max(1, cam.r * zoom); }

  function resize(w,h){
    cam.w=w; cam.h=h;
    cam.cx=w*0.5; cam.cy=h*0.5;
    cam.r=Math.min(w,h)*k.worldRadiusFactor;
  }

  function setPresentationMode(m){
    mode = (m==="flat"||m==="observe")?m:"round";
  }

  function setZoomBounds(min,max){
    if(!isNum(min)||!isNum(max)) return;
    zoomMin=Math.min(min,max);
    zoomMax=Math.max(min,max);
    zoom=clamp(zoom,zoomMin,zoomMax);
    zoomT=clamp(zoomT,zoomMin,zoomMax);
  }

  function setZoomAbsolute(v){
    if(!isNum(v)) return;
    zoomT=clamp(v,zoomMin,zoomMax);
  }

  function adjustZoomBy(d){
    if(!isNum(d)) return;
    setZoomAbsolute(zoomT+d);
  }

  function applyDrag(dx,dy){
    yaw = wrap(yaw + dx*k.dragSensitivity);
    pitch += dy*k.dragSensitivity;

    yawV = dx*k.dragSensitivity*0.45;
    pitchV = dy*k.dragSensitivity*0.45;

    clampPitch();
  }

  function stepZoom(){
    zoom += (zoomT-zoom)*0.12;
    if(Math.abs(zoomT-zoom)<0.0005) zoom=zoomT;
  }

  function stepInertia(dt=16.6){
    const s = clamp(dt/16.6,0.25,4);

    yaw = wrap(yaw + yawV*s);
    pitch += pitchV*s;

    const d = Math.pow(k.inertiaDecay,s);
    yawV*=d;
    pitchV*=d;

    clampPitch();
    stepZoom();
  }

  function advanceOrbit(dt=16.6, vel=0){
    if(!isNum(vel)) vel=0;
    orbitPhase = wrap(orbitPhase + vel*dt);
  }

  function projectSphere(latDeg,lonDeg,offset=0){
    const lat = latDeg*Math.PI/180;
    const lon = lonDeg*Math.PI/180;

    const cosLat=Math.cos(lat);
    const sinLat=Math.sin(lat);
    const cosLon=Math.cos(lon+yaw);
    const sinLon=Math.sin(lon+yaw);

    const cp=Math.cos(pitch);
    const sp=Math.sin(pitch);

    const x = cosLat*sinLon;
    const y0 = sinLat;
    const z0 = cosLat*cosLon;

    const y = y0*cp - z0*sp;
    const z = y0*sp + z0*cp;

    const rr = Math.max(1, r()+offset);

    return Object.freeze({
      x: cam.cx + x*rr,
      y: cam.cy - y*rr,
      z,
      visible: z>=0,
      resolvedRadius: rr
    });
  }

  function getCameraState(){
    return Object.freeze({
      width:cam.w,
      height:cam.h,
      centerX:cam.cx,
      centerY:cam.cy,
      radius:r(),
      yaw,pitch,
      yawVelocity:yawV,
      pitchVelocity:pitchV,
      zoomCurrent:zoom,
      zoomTarget:zoomT,
      mode
    });
  }

  function getProjectionSummary(){
    return Object.freeze({
      latDeg:0,
      lonDeg:0,
      sampleX:0,
      sampleY:0,
      mode
    });
  }

  function getOrbitalState(){
    return Object.freeze({ orbitPhase });
  }

  function getMotionState(){
    return Object.freeze({
      yaw,pitch,
      yawVelocity:yawV,
      pitchVelocity:pitchV,
      orbitPhase,
      zoomCurrent:zoom,
      zoomTarget:zoomT,
      mode
    });
  }

  function restoreMotionState(input={}){
    const n=obj(input);

    if(isNum(n.yaw)) yaw=wrap(n.yaw);
    if(isNum(n.pitch)){ pitch=n.pitch; clampPitch(); }
    if(isNum(n.yawVelocity)) yawV=n.yawVelocity;
    if(isNum(n.pitchVelocity)) pitchV=n.pitchVelocity;
    if(isNum(n.orbitPhase)) orbitPhase=wrap(n.orbitPhase);
    if(isNum(n.zoomCurrent)) zoom=clamp(n.zoomCurrent,zoomMin,zoomMax);
    if(isNum(n.zoomTarget)) zoomT=clamp(n.zoomTarget,zoomMin,zoomMax);
  }

  return Object.freeze({
    resize,
    setPresentationMode,
    setZoomBounds,
    setZoomAbsolute,
    adjustZoomBy,
    applyDrag,
    stepInertia,
    advanceOrbit,
    restoreMotionState,
    projectSphere,
    getCameraState,
    getProjectionSummary,
    getOrbitalState,
    getMotionState
  });
}
