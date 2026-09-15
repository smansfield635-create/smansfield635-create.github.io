#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ANCHOR_FRAMES,
  SPARSE_FRAMES,
  SHARDS,
  FRAME_START,
  FRAME_END,
  FPS,
  VIEWPORT,
  LOCAL_LOOK_DISTANCE,
  VERTICAL_FOV_DEGREES,
  NEAR_PLANE,
  MINIMUM_PLANETARY_FAR_PLANE,
  MINIMUM_CANONICAL_TERRAIN_CLEARANCE,
  NUMERIC_TOLERANCE,
  PROGRESS_TOLERANCE,
  C1_TOLERANCE,
  WORLD_IDENTITY_ID,
  RENDERER_IDENTITY_ID,
  AUTHORED_POSES,
  buildManifest,
  createPchipModel,
  evaluatePchipDerivative,
  sha256Canonical,
  stableStringify
} from './manifest.mjs';
import { sampleHEarthTerrainElevation } from '../terrain/h-earth.terrain-field.js';
import {
  regionToHEarthPlanetPoint,
  getHEarthPlanetRelativeUp,
  getHEarthDerivedHorizonDistance
} from '../../showroom/globe/h-earth/render/planetary-world-frame.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const manifestPath = path.join(here, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const issues = [];
const approx = (a, b, tolerance = NUMERIC_TOLERANCE) =>
  Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= tolerance;
const vecApprox = (a, b, tolerance = NUMERIC_TOLERANCE) =>
  approx(a?.x,b?.x,tolerance)&&approx(a?.y,b?.y,tolerance)&&approx(a?.z,b?.z,tolerance);
const sub=(a,b)=>({x:a.x-b.x,y:a.y-b.y,z:a.z-b.z});
const dot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;
const len=(a)=>Math.hypot(a.x,a.y,a.z);
const norm=(a)=>{const n=len(a);return {x:a.x/n,y:a.y/n,z:a.z/n}};
const coreFromCheckedIn = (() => {
  const copy = structuredClone(manifest);
  delete copy.manifestDigest;
  return copy;
})();
if (manifest.schema !== 'H_EARTH_CINEMATIC_CAMERA_MANIFEST_v1') issues.push('SCHEMA_MISMATCH');
if (manifest.exactGoverningHead !== '3c5b7ece95bb6d642e527737bb60647c032e29dd') issues.push('GOVERNING_HEAD_MISMATCH');
if (manifest.masterCoordinateSystem?.fps !== FPS) issues.push('FPS_MISMATCH');
if (manifest.masterCoordinateSystem?.startFrame !== FRAME_START ||
    manifest.masterCoordinateSystem?.endFrame !== FRAME_END) issues.push('FRAME_RANGE_MISMATCH');
if (manifest.masterCoordinateSystem?.frameCount !== 240 || manifest.frames?.length !== 240) issues.push('FRAME_COUNT_MISMATCH');
if (stableStringify(manifest.anchorFrames) !== stableStringify([...ANCHOR_FRAMES])) issues.push('ANCHOR_SET_MISMATCH');
if (stableStringify(manifest.sparseFrames) !== stableStringify([...SPARSE_FRAMES])) issues.push('SPARSE_SET_MISMATCH');
if (stableStringify(manifest.shards) !== stableStringify(SHARDS.map(x=>({...x})))) issues.push('SHARD_SET_MISMATCH');
if (stableStringify(manifest.masterCoordinateSystem?.viewport) !== stableStringify(VIEWPORT)) issues.push('VIEWPORT_MISMATCH');
const digest = sha256Canonical(coreFromCheckedIn);
if (manifest.manifestDigest?.sha256 !== digest) issues.push('MANIFEST_DIGEST_MISMATCH');

const regenerated = buildManifest();
if (stableStringify(regenerated) !== stableStringify(manifest)) issues.push('CHECKED_IN_MANIFEST_NOT_REGENERABLE');

for (let index = 0; index < manifest.frames.length; index += 1) {
  const frame = manifest.frames[index];
  const expectedFrame = FRAME_START + index;
  if (frame.frame !== expectedFrame) issues.push(`FRAME_IDENTITY_MISMATCH:${index}`);
  if (!approx(frame.timeSeconds, frame.frame / FPS, 1e-9)) issues.push(`FRAME_TIME_MISMATCH:${frame.frame}`);
  const local = frame.localAuthoring;
  const numeric = [
    local?.position?.x,local?.position?.y,local?.position?.z,
    local?.focusPoint?.x,local?.focusPoint?.y,local?.focusPoint?.z,
    local?.target?.x,local?.target?.y,local?.target?.z,
    local?.yawDegrees,local?.pitchDegrees,local?.verticalFovDegrees,
    local?.nearPlane,local?.farPlane,
    frame?.position?.x,frame?.position?.y,frame?.position?.z,
    frame?.target?.x,frame?.target?.y,frame?.target?.z,
    frame?.up?.x,frame?.up?.y,frame?.up?.z,
    frame?.verticalFovDegrees,frame?.nearPlane,frame?.farPlane
  ];
  if (numeric.some((v)=>!Number.isFinite(v))) issues.push(`NONFINITE_CAMERA:${frame.frame}`);
  if (!vecApprox(local.up,{x:0,y:1,z:0})) issues.push(`LOCAL_ROLL_NOT_ZERO:${frame.frame}`);
  if (!approx(len(sub(local.target,local.position)),LOCAL_LOOK_DISTANCE,1e-7)) issues.push(`LOCAL_LOOK_DISTANCE_MISMATCH:${frame.frame}`);
  if (local.verticalFovDegrees !== VERTICAL_FOV_DEGREES || frame.verticalFovDegrees !== VERTICAL_FOV_DEGREES) issues.push(`FOV_ANIMATED:${frame.frame}`);
  if (local.nearPlane !== NEAR_PLANE || frame.nearPlane !== NEAR_PLANE) issues.push(`NEAR_PLANE_MISMATCH:${frame.frame}`);
  if (frame.farPlane < MINIMUM_PLANETARY_FAR_PLANE) issues.push(`FAR_PLANE_TOO_SMALL:${frame.frame}`);
  if (frame.worldIdentityId !== WORLD_IDENTITY_ID || frame.rendererIdentityId !== RENDERER_IDENTITY_ID) issues.push(`IDENTITY_MISMATCH:${frame.frame}`);
  const terrain = sampleHEarthTerrainElevation(local.position.x,local.position.z);
  const clearance = local.position.y-terrain;
  if (!approx(local.canonicalTerrainElevationAtCamera,terrain,1e-8)) issues.push(`TERRAIN_ELEVATION_MISMATCH:${frame.frame}`);
  if (clearance < MINIMUM_CANONICAL_TERRAIN_CLEARANCE-PROGRESS_TOLERANCE) issues.push(`TERRAIN_CLEARANCE_FAIL:${frame.frame}`);
  if (!approx(local.terrainClearance,clearance,1e-8)) issues.push(`TERRAIN_CLEARANCE_RECORD_MISMATCH:${frame.frame}`);
  const resolvedPosition=regionToHEarthPlanetPoint(local.position);
  const resolvedTarget=regionToHEarthPlanetPoint(local.target);
  const resolvedUp=getHEarthPlanetRelativeUp(local.position);
  if(!vecApprox(frame.position,resolvedPosition,2e-8))issues.push(`PLANETARY_POSITION_MISMATCH:${frame.frame}`);
  if(!vecApprox(frame.target,resolvedTarget,2e-8))issues.push(`PLANETARY_TARGET_MISMATCH:${frame.frame}`);
  if(!vecApprox(frame.up,resolvedUp,2e-8))issues.push(`PLANETARY_UP_MISMATCH:${frame.frame}`);
  const horizon=getHEarthDerivedHorizonDistance(Math.max(0,local.position.y));
  const expectedFar=Math.max(512,MINIMUM_PLANETARY_FAR_PLANE,horizon+1800);
  if(!approx(frame.farPlane,expectedFar,1e-8))issues.push(`PLANETARY_FAR_MISMATCH:${frame.frame}`);
}

const localPositions=manifest.frames.map(f=>f.localAuthoring.position);
const localTargets=manifest.frames.map(f=>f.localAuthoring.target);
function checkProgress(points,label){
  const axis=norm(sub(points.at(-1),points[0]));
  let prior=-Infinity;
  for(let i=0;i<points.length;i+=1){
    const progress=dot(sub(points[i],points[0]),axis);
    if(progress+PROGRESS_TOLERANCE<prior)issues.push(`${label}_BACKWARDS_PROGRESS:${FRAME_START+i}`);
    if(i>0){
      const step=dot(sub(points[i],points[i-1]),axis);
      if(step<-PROGRESS_TOLERANCE)issues.push(`${label}_DIRECTION_REVERSAL:${FRAME_START+i}`);
    }
    prior=progress;
  }
}
checkProgress(localPositions,'POSITION');
checkProgress(localTargets,'TARGET');

function checkC1(key,axis){
  const xs=AUTHORED_POSES.map(p=>p.frame);
  const ys=AUTHORED_POSES.map(p=>p[key][axis]);
  const model=createPchipModel(xs,ys);
  for(let i=1;i<xs.length-1;i+=1){
    const x=xs[i];
    const left=evaluatePchipDerivative(model,x,i-1);
    const right=evaluatePchipDerivative(model,x,i);
    if(Math.abs(left-right)>C1_TOLERANCE)issues.push(`C1_FAIL:${key}:${axis}:${x}`);
  }
}
for(const key of ['position','focusPoint'])for(const axis of ['x','y','z'])checkC1(key,axis);

for(const anchor of ANCHOR_FRAMES)if(!manifest.frames.some(f=>f.frame===anchor))issues.push(`ANCHOR_MISSING:${anchor}`);
for(const sparse of SPARSE_FRAMES)if(!manifest.frames.some(f=>f.frame===sparse))issues.push(`SPARSE_MISSING:${sparse}`);
for(const shard of SHARDS){
  if(shard.endFrame-shard.startFrame+1!==30)issues.push(`SHARD_LENGTH_INVALID:${shard.index}`);
  if(shard.startFrame<FRAME_START||shard.endFrame>FRAME_END)issues.push(`SHARD_RANGE_INVALID:${shard.index}`);
}

const receipt={
  schema:'H_EARTH_CINEMATIC_CAMERA_MANIFEST_VERIFICATION_RECEIPT_v1',
  operationId:manifest.operationId,
  exactGoverningHead:manifest.exactGoverningHead,
  manifestSha256:manifest.manifestDigest?.sha256??null,
  frameCount:manifest.frames?.length??0,
  anchorFrameCount:manifest.anchorFrames?.length??0,
  sparseFrameCount:manifest.sparseFrames?.length??0,
  shardCount:manifest.shards?.length??0,
  minimumTerrainClearance:Math.min(...manifest.frames.map(f=>f.localAuthoring.terrainClearance)),
  result:issues.length===0?'PASS':'FAIL',
  issues
};
process.stdout.write(`${JSON.stringify(receipt,null,2)}\n`);
if(issues.length)process.exitCode=1;
