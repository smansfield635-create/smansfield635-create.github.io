#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ANCHOR_FRAMES,SPARSE_FRAMES,SHARDS,FRAME_START,FRAME_END,FPS,VIEWPORT,
  LOCAL_LOOK_DISTANCE,VERTICAL_FOV_DEGREES,NEAR_PLANE,MINIMUM_PLANETARY_FAR_PLANE,
  MINIMUM_CANONICAL_TERRAIN_CLEARANCE,NUMERIC_TOLERANCE,PROGRESS_TOLERANCE,C1_TOLERANCE,
  WORLD_IDENTITY_ID,RENDERER_IDENTITY_ID,AUTHORED_POSES,buildManifest,createPchipModel,
  evaluatePchipDerivative,sha256Canonical,stableStringify
} from './manifest.mjs';
import { sampleHEarthTerrainElevation } from '../terrain/h-earth.terrain-field.js';
import { regionToHEarthPlanetPoint,getHEarthPlanetRelativeUp,getHEarthDerivedHorizonDistance } from '../../showroom/globe/h-earth/render/planetary-world-frame.js';

const manifest=JSON.parse(fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)),'manifest.json'),'utf8'));
const issues=[];
const approx=(a,b,t=NUMERIC_TOLERANCE)=>Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=t;
const vec=(r,i)=>({x:r[i],y:r[i+1],z:r[i+2]});
const vecApprox=(a,b,t=NUMERIC_TOLERANCE)=>approx(a?.x,b?.x,t)&&approx(a?.y,b?.y,t)&&approx(a?.z,b?.z,t);
const sub=(a,b)=>({x:a.x-b.x,y:a.y-b.y,z:a.z-b.z});
const dot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;
const len=a=>Math.hypot(a.x,a.y,a.z);
const norm=a=>{const n=len(a);return{x:a.x/n,y:a.y/n,z:a.z/n}};
const core=structuredClone(manifest);delete core.manifestDigest;
if(manifest.schema!=='H_EARTH_CINEMATIC_CAMERA_MANIFEST_v1')issues.push('SCHEMA_MISMATCH');
if(manifest.exactGoverningHead!=='3c5b7ece95bb6d642e527737bb60647c032e29dd')issues.push('GOVERNING_HEAD_MISMATCH');
if(manifest.masterCoordinateSystem?.fps!==FPS||manifest.masterCoordinateSystem?.startFrame!==FRAME_START||manifest.masterCoordinateSystem?.endFrame!==FRAME_END)issues.push('MASTER_COORDINATE_MISMATCH');
if(manifest.masterCoordinateSystem?.frameCount!==240||manifest.frames?.length!==240)issues.push('FRAME_COUNT_MISMATCH');
if(stableStringify(manifest.anchorFrames)!==stableStringify([...ANCHOR_FRAMES]))issues.push('ANCHOR_SET_MISMATCH');
if(stableStringify(manifest.sparseFrames)!==stableStringify([...SPARSE_FRAMES]))issues.push('SPARSE_SET_MISMATCH');
if(stableStringify(manifest.shards)!==stableStringify(SHARDS.map(x=>({...x}))))issues.push('SHARD_SET_MISMATCH');
if(stableStringify(manifest.masterCoordinateSystem?.viewport)!==stableStringify(VIEWPORT))issues.push('VIEWPORT_MISMATCH');
if(manifest.frameRecordSchema?.identityCodes?.W!==WORLD_IDENTITY_ID||manifest.frameRecordSchema?.identityCodes?.R!==RENDERER_IDENTITY_ID)issues.push('IDENTITY_CODE_MAP_MISMATCH');
if(manifest.manifestDigest?.sha256!==sha256Canonical(core))issues.push('MANIFEST_DIGEST_MISMATCH');
if(stableStringify(buildManifest())!==stableStringify(manifest))issues.push('CHECKED_IN_MANIFEST_NOT_REGENERABLE');

for(let i=0;i<manifest.frames.length;i+=1){
  const r=manifest.frames[i],frame=FRAME_START+i;
  if(!Array.isArray(r)||r.length!==25)issues.push(`FRAME_RECORD_SHAPE:${frame}`);
  if(r[0]!==frame)issues.push(`FRAME_IDENTITY_MISMATCH:${i}`);
  if(r.slice(0,23).some(v=>!Number.isFinite(v)))issues.push(`NONFINITE_CAMERA:${frame}`);
  const pp=vec(r,1),pt=vec(r,4),pu=vec(r,7),lp=vec(r,13),lt=vec(r,16);
  if(!approx(len(sub(lt,lp)),LOCAL_LOOK_DISTANCE,1e-7))issues.push(`LOCAL_LOOK_DISTANCE_MISMATCH:${frame}`);
  if(r[10]!==VERTICAL_FOV_DEGREES)issues.push(`FOV_ANIMATED:${frame}`);
  if(r[11]!==NEAR_PLANE)issues.push(`NEAR_PLANE_MISMATCH:${frame}`);
  if(r[12]<MINIMUM_PLANETARY_FAR_PLANE)issues.push(`FAR_PLANE_TOO_SMALL:${frame}`);
  if(r[23]!=='W'||r[24]!=='R')issues.push(`IDENTITY_CODE_MISMATCH:${frame}`);
  const terrain=sampleHEarthTerrainElevation(lp.x,lp.z),clearance=lp.y-terrain;
  if(!approx(r[21],terrain,1e-8))issues.push(`TERRAIN_ELEVATION_MISMATCH:${frame}`);
  if(clearance<MINIMUM_CANONICAL_TERRAIN_CLEARANCE-PROGRESS_TOLERANCE)issues.push(`TERRAIN_CLEARANCE_FAIL:${frame}`);
  if(!approx(r[22],clearance,1e-8))issues.push(`TERRAIN_CLEARANCE_RECORD_MISMATCH:${frame}`);
  const rp=regionToHEarthPlanetPoint(lp),rt=regionToHEarthPlanetPoint(lt),ru=getHEarthPlanetRelativeUp(lp);
  if(!vecApprox(pp,rp,2e-8))issues.push(`PLANETARY_POSITION_MISMATCH:${frame}`);
  if(!vecApprox(pt,rt,2e-8))issues.push(`PLANETARY_TARGET_MISMATCH:${frame}`);
  if(!vecApprox(pu,ru,2e-8)||!approx(len(pu),1,2e-8))issues.push(`PLANETARY_UP_MISMATCH:${frame}`);
  const far=Math.max(512,MINIMUM_PLANETARY_FAR_PLANE,getHEarthDerivedHorizonDistance(Math.max(0,lp.y))+1800);
  if(!approx(r[12],far,1e-8))issues.push(`PLANETARY_FAR_MISMATCH:${frame}`);
}
function checkProgress(points,label){const axis=norm(sub(points.at(-1),points[0]));let prior=-Infinity;for(let i=0;i<points.length;i+=1){const p=dot(sub(points[i],points[0]),axis);if(p+PROGRESS_TOLERANCE<prior)issues.push(`${label}_BACKWARDS_PROGRESS:${FRAME_START+i}`);if(i&&dot(sub(points[i],points[i-1]),axis)<-PROGRESS_TOLERANCE)issues.push(`${label}_DIRECTION_REVERSAL:${FRAME_START+i}`);prior=p}}
checkProgress(manifest.frames.map(r=>vec(r,13)),'POSITION');checkProgress(manifest.frames.map(r=>vec(r,16)),'TARGET');
function checkC1(key,axis){const xs=AUTHORED_POSES.map(p=>p.frame),ys=AUTHORED_POSES.map(p=>p[key][axis]),m=createPchipModel(xs,ys);for(let i=1;i<xs.length-1;i+=1){const left=evaluatePchipDerivative(m,xs[i],i-1),right=evaluatePchipDerivative(m,xs[i],i);if(Math.abs(left-right)>C1_TOLERANCE)issues.push(`C1_FAIL:${key}:${axis}:${xs[i]}`)}}
for(const key of ['position','focusPoint'])for(const axis of ['x','y','z'])checkC1(key,axis);
for(const shard of SHARDS)if(shard.endFrame-shard.startFrame+1!==30)issues.push(`SHARD_LENGTH_INVALID:${shard.index}`);
const receipt={schema:'H_EARTH_CINEMATIC_CAMERA_MANIFEST_VERIFICATION_RECEIPT_v1',operationId:manifest.operationId,exactGoverningHead:manifest.exactGoverningHead,manifestSha256:manifest.manifestDigest?.sha256??null,frameCount:manifest.frames.length,anchorFrameCount:manifest.anchorFrames.length,sparseFrameCount:manifest.sparseFrames.length,shardCount:manifest.shards.length,minimumTerrainClearance:Math.min(...manifest.frames.map(r=>r[22])),result:issues.length?'FAIL':'PASS',issues};
process.stdout.write(`${JSON.stringify(receipt,null,2)}\n`);if(issues.length)process.exitCode=1;
