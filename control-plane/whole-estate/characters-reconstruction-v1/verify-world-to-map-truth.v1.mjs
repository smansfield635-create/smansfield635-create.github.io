import fs from 'node:fs';
import crypto from 'node:crypto';
import childProcess from 'node:child_process';
import {
  GRATITUDE_DEVELOPMENT_ANCHOR_SPECS,
  GRATITUDE_DEVELOPMENT_FRAME,
  GRATITUDE_GEOGRAPHY_ADAPTER_ID,
  mapToWorld,
  resolveCoastlinePolyline,
  resolveMapSiteAnchor,
  worldToMap
} from '../../../characters/gratitude-geography.adapter.mjs';
import { buildWorldToMapTruthDiagnosticData } from '../../../characters/world-to-map-truth-diagnostic.mjs';

const contract=JSON.parse(fs.readFileSync('control-plane/whole-estate/characters-reconstruction-v1/world-to-map-truth-contract.v1.json','utf8'));
const near=(a,b,t=contract.transform.roundTripTolerance)=>Math.abs(a-b)<=t;
const issues=[];
const checks=[];
const pass=(id,condition,detail={})=>{checks.push({id,pass:Boolean(condition),...detail});if(!condition)issues.push(id);};

const changed=childProcess.execFileSync('git',['diff','--name-only',contract.exactGoverningHead,'HEAD'],{encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);
const disallowed=changed.filter((path)=>!contract.allowedPaths.includes(path));
pass('UPSTREAM_GEOGRAPHY_UNCHANGED',disallowed.length===0,{changedPaths:changed,disallowedPaths:disallowed});

const markerIds=Object.keys(GRATITUDE_DEVELOPMENT_ANCHOR_SPECS);
pass('CANONICAL_MARKER_SET_EXACT',JSON.stringify(markerIds)===JSON.stringify(contract.canonicalMarkerIds),{markerIds});

let maxRoundTripError=0;
const markers=markerIds.map((siteId)=>{
  const resolved=resolveMapSiteAnchor(siteId);
  const direct=worldToMap(resolved.world);
  const inverse=mapToWorld(direct);
  const error=Math.max(Math.abs(inverse.x-resolved.world.x),Math.abs(inverse.z-resolved.world.z));
  maxRoundTripError=Math.max(maxRoundTripError,error);
  const exact=near(resolved.map.u,direct.u)&&near(resolved.map.v,direct.v)&&near(inverse.x,resolved.world.x)&&near(inverse.z,resolved.world.z);
  if(!exact)issues.push(`MARKER_PROJECTION_DIVERGENCE:${siteId}`);
  return {siteId,world:resolved.world,map:resolved.map,inverse:{x:inverse.x,z:inverse.z},exact};
});
pass('ONE_INVERTIBLE_WORLD_TO_MAP_TRANSFORM',maxRoundTripError<=contract.transform.roundTripTolerance,{maxRoundTripError});
pass('CANONICAL_MARKER_PROJECTION',markers.every((marker)=>marker.exact),{markerCount:markers.length});

const coastline=resolveCoastlinePolyline({sampleCount:contract.shorelineSampleCount});
const shoreline=coastline.points.map((point)=>{
  const direct=worldToMap(point.world);
  const exact=near(point.map.u,direct.u)&&near(point.map.v,direct.v);
  if(!exact)issues.push(`SHORELINE_PROJECTION_DIVERGENCE:${point.ordinal}`);
  return {ordinal:point.ordinal,world:point.world,map:point.map,exact};
});
pass('CANONICAL_SHORELINE_PROJECTION',shoreline.every((point)=>point.exact),{sampleCount:shoreline.length});

const origin=worldToMap({x:0,z:0});
const east=worldToMap({x:1,z:0});
const north=worldToMap({x:0,z:-1});
const orientationExact=GRATITUDE_DEVELOPMENT_FRAME.mapFrame.worldEast==='POSITIVE_X'
  && GRATITUDE_DEVELOPMENT_FRAME.mapFrame.worldNorth==='NEGATIVE_Z'
  && east.u>origin.u
  && near(east.v,origin.v)
  && north.v<origin.v
  && near(north.u,origin.u);
pass('ORIENTATION_NOT_MIRRORED_OR_ROTATED',orientationExact,{origin,east,north,mapFrame:GRATITUDE_DEVELOPMENT_FRAME.mapFrame});

const diagnosticSource=fs.readFileSync('characters/world-to-map-truth-diagnostic.mjs','utf8');
const noHandPositioned=diagnosticSource.includes('resolveMapSiteAnchor(siteId)')
  && diagnosticSource.includes('resolveCoastlinePolyline')
  && !/map\s*:\s*\{\s*u\s*:\s*[-+]?\d/.test(diagnosticSource)
  && !/\bu\s*:\s*[-+]?\d+(?:\.\d+)?\s*,\s*v\s*:\s*[-+]?\d/.test(diagnosticSource);
pass('NO_HAND_POSITIONED_MARKERS',noHandPositioned);

const diagnostic=buildWorldToMapTruthDiagnosticData({shorelineSampleCount:contract.shorelineSampleCount});
const diagnosticMarkersExact=diagnostic.markers.length===markers.length&&diagnostic.markers.every((marker,index)=>{
  const proof=markers[index];return marker.siteId===proof.siteId&&near(marker.map.u,proof.map.u)&&near(marker.map.v,proof.map.v)&&near(marker.world.x,proof.world.x)&&near(marker.world.z,proof.world.z);
});
const diagnosticShorelineExact=diagnostic.shoreline.length===shoreline.length&&diagnostic.shoreline.every((point,index)=>{
  const proof=shoreline[index];return point.ordinal===proof.ordinal&&near(point.map.u,proof.map.u)&&near(point.map.v,proof.map.v)&&near(point.world.x,proof.world.x)&&near(point.world.z,proof.world.z);
});
pass('VISUAL_DIAGNOSTIC_DATA_IDENTITY',diagnosticMarkersExact&&diagnosticShorelineExact,{diagnosticMarkersExact,diagnosticShorelineExact});

const diagnosticPayload=JSON.stringify(diagnostic);
const diagnosticDataSha256=crypto.createHash('sha256').update(diagnosticPayload).digest('hex');
const receipt={
  schema:'MIRRORLAND_WORLD_TO_MAP_TRUTH_RECEIPT_v1',
  operationId:contract.operationId,
  targetBoundary:contract.targetBoundary,
  exactGoverningHead:contract.exactGoverningHead,
  candidateHead:childProcess.execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),
  adapterId:GRATITUDE_GEOGRAPHY_ADAPTER_ID,
  frameId:GRATITUDE_DEVELOPMENT_FRAME.frameId,
  markerCount:markers.length,
  shorelineSampleCount:shoreline.length,
  diagnosticDataSha256,
  checks,
  issues:[...new Set(issues)],
  result:issues.length?'FAIL_CLOSED':'PASS_CLOSED'
};
receipt.receiptSha256=crypto.createHash('sha256').update(JSON.stringify(receipt)).digest('hex');
fs.writeFileSync('world-to-map-truth-receipt.json',JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt,null,2));
if(issues.length)process.exit(1);
