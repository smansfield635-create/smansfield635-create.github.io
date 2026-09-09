import {
  getEnvironmentIntegratedForestTopology,
  getForestStandMetadata
} from './vegetation-representation.mjs';
import {getCanonicalVegetationPopulation} from './vegetation-population.mjs';
import {resolveCoastlinePolyline,worldToMap} from './gratitude-geography.adapter.mjs';

const freeze=(value,seen=new WeakSet())=>{
  if(value===null||typeof value!=='object'||Object.isFrozen(value)||seen.has(value))return value;
  seen.add(value);
  for(const nested of Object.values(value))freeze(nested,seen);
  return Object.freeze(value);
};
const finite=value=>typeof value==='number'&&Number.isFinite(value);
const near=(left,right,tolerance=1e-9)=>Math.abs(left-right)<=tolerance;
const quantize=(value,digits=6)=>Number(Number(value).toFixed(digits));

export const COAST_MAP_STAND_BINDING_CONTRACT=freeze({
  schema:'MIRRORLAND_COAST_MAP_FOREST_STAND_BINDING_CONTRACT_v1',
  operationId:'MIRRORLAND_COAST_MAP_FOREST_STAND_BINDING_20260909_002',
  candidateBase:'7bc4d6c3e0d8fe3a40b2262299e78514e511cf24',
  sourceMetadataSchema:'MIRRORLAND_FOREST_STAND_METADATA_v1',
  sourcePopulationCount:818,
  sourceStandCount:74,
  coordinateAuthority:'characters/gratitude-geography.adapter.mjs#worldToMap',
  shorelineAuthority:'characters/gratitude-geography.adapter.mjs#resolveCoastlinePolyline',
  presentationViewport:freeze({width:1000,height:1000,leftInset:80,rightInset:80,topInset:100,bottomInset:120}),
  readOnly:true,
  interactionIncluded:false,
  navigationMutationIncluded:false,
  destinationCoordinateMutationIncluded:false,
  sourceAuthorityMutationIncluded:false,
  cardRedesignIncluded:false,
  finalVisualAcceptanceIncluded:false
});

function presentMapPoint(map){
  if(!map||![map.u,map.v].every(finite))throw new TypeError('COAST_MAP_PRESENTATION_REQUIRES_FINITE_MAP_POINT');
  const v=COAST_MAP_STAND_BINDING_CONTRACT.presentationViewport;
  const usableWidth=v.width-v.leftInset-v.rightInset;
  const usableHeight=v.height-v.topInset-v.bottomInset;
  return freeze({
    x:quantize(v.leftInset+map.u*usableWidth),
    y:quantize(v.topInset+map.v*usableHeight)
  });
}

function projectWorld(world){
  if(!world||![world.x,world.z].every(finite))throw new TypeError('COAST_MAP_STAND_WORLD_POINT_REQUIRED');
  const map=worldToMap({x:world.x,z:world.z});
  return freeze({map,presentation:presentMapPoint(map)});
}

function projectBounds(bounds){
  if(!bounds)throw new TypeError('COAST_MAP_STAND_BOUNDS_REQUIRED');
  const corners=[
    {x:bounds.xMinimum,z:bounds.zMinimum},
    {x:bounds.xMinimum,z:bounds.zMaximum},
    {x:bounds.xMaximum,z:bounds.zMinimum},
    {x:bounds.xMaximum,z:bounds.zMaximum}
  ].map(projectWorld);
  const xs=corners.map(item=>item.presentation.x);
  const ys=corners.map(item=>item.presentation.y);
  return freeze({
    xMinimum:quantize(Math.min(...xs)),
    xMaximum:quantize(Math.max(...xs)),
    yMinimum:quantize(Math.min(...ys)),
    yMaximum:quantize(Math.max(...ys)),
    width:quantize(Math.max(...xs)-Math.min(...xs)),
    height:quantize(Math.max(...ys)-Math.min(...ys)),
    corners:freeze(corners)
  });
}

export function buildCoastMapStandBinding(){
  const metadata=getForestStandMetadata();
  const shorelineSource=resolveCoastlinePolyline({sampleCount:65});
  const stands=metadata.stands.map(stand=>freeze({
    id:stand.id,
    treeCount:stand.treeCount,
    memberIds:stand.memberIds,
    canonicalCentroid:stand.canonicalCentroid,
    canonicalBounds:stand.canonicalBounds,
    centroid:projectWorld(stand.canonicalCentroid),
    bounds:projectBounds(stand.canonicalBounds),
    environment:stand.environment
  }));
  const shoreline=freeze({
    sampleCount:shorelineSource.sampleCount,
    points:freeze(shorelineSource.points.map(point=>freeze({
      ordinal:point.ordinal,
      canonicalWorld:point.world,
      canonicalMap:point.map,
      presentation:presentMapPoint(point.map)
    })))
  });
  return freeze({
    schema:'MIRRORLAND_COAST_MAP_FOREST_STAND_BINDING_v1',
    operationId:COAST_MAP_STAND_BINDING_CONTRACT.operationId,
    sourceMetadataSchema:metadata.schema,
    topologyDigest:metadata.topologyDigest,
    canonicalPopulationCount:metadata.canonicalPopulationCount,
    standCount:metadata.standCount,
    coordinateAuthority:COAST_MAP_STAND_BINDING_CONTRACT.coordinateAuthority,
    shorelineAuthority:COAST_MAP_STAND_BINDING_CONTRACT.shorelineAuthority,
    readOnly:true,
    interactionIncluded:false,
    navigationMutationIncluded:false,
    stands:freeze(stands),
    shoreline
  });
}

export function verifyCoastMapStandBinding(){
  const issues=[];
  const metadata=getForestStandMetadata();
  const topology=getEnvironmentIntegratedForestTopology();
  const population=getCanonicalVegetationPopulation();
  const binding=buildCoastMapStandBinding();

  if(metadata.schema!==COAST_MAP_STAND_BINDING_CONTRACT.sourceMetadataSchema||metadata.consumerMutationIncluded!==false||!Object.isFrozen(metadata)||!Object.isFrozen(metadata.stands))issues.push('V7_METADATA_NOT_FROZEN_READ_ONLY_SOURCE');
  if(metadata.topologyDigest!==topology.topologyDigest||binding.topologyDigest!==metadata.topologyDigest)issues.push('V7_TOPOLOGY_DIGEST_DRIFT');
  if(metadata.standCount!==74||binding.standCount!==74||binding.stands.length!==74)issues.push('STAND_COUNT_NOT_74');

  const standIds=binding.stands.map(stand=>stand.id);
  if(new Set(standIds).size!==standIds.length)issues.push('DUPLICATE_STAND_ID');
  const memberIds=binding.stands.flatMap(stand=>stand.memberIds);
  const canonicalIds=population.instances.map(instance=>instance.id).sort();
  const observedIds=[...memberIds].sort();
  if(memberIds.length!==818||new Set(memberIds).size!==818||population.instanceCount!==818||JSON.stringify(observedIds)!==JSON.stringify(canonicalIds))issues.push('CANONICAL_818_MEMBERSHIP_MISMATCH');
  if(binding.stands.some(stand=>stand.treeCount!==stand.memberIds.length))issues.push('STAND_TREE_COUNT_MEMBERSHIP_MISMATCH');

  for(const stand of binding.stands){
    const expectedCentroid=projectWorld(stand.canonicalCentroid);
    if(!near(stand.centroid.map.u,expectedCentroid.map.u)||!near(stand.centroid.map.v,expectedCentroid.map.v)||!near(stand.centroid.presentation.x,expectedCentroid.presentation.x)||!near(stand.centroid.presentation.y,expectedCentroid.presentation.y))issues.push(`STAND_CENTROID_PROJECTION_DRIFT:${stand.id}`);
    const expectedBounds=projectBounds(stand.canonicalBounds);
    for(const key of ['xMinimum','xMaximum','yMinimum','yMaximum','width','height'])if(!near(stand.bounds[key],expectedBounds[key]))issues.push(`STAND_BOUND_PROJECTION_DRIFT:${stand.id}:${key}`);
  }

  const shorelineSource=resolveCoastlinePolyline({sampleCount:binding.shoreline.sampleCount});
  if(binding.shoreline.points.length!==shorelineSource.points.length)issues.push('SHORELINE_SAMPLE_COUNT_DRIFT');
  for(let index=0;index<Math.min(binding.shoreline.points.length,shorelineSource.points.length);index+=1){
    const actual=binding.shoreline.points[index];
    const source=shorelineSource.points[index];
    const expectedPresentation=presentMapPoint(source.map);
    if(actual.ordinal!==source.ordinal||!near(actual.canonicalWorld.x,source.world.x)||!near(actual.canonicalWorld.z,source.world.z)||!near(actual.canonicalMap.u,source.map.u)||!near(actual.canonicalMap.v,source.map.v)||!near(actual.presentation.x,expectedPresentation.x)||!near(actual.presentation.y,expectedPresentation.y))issues.push(`SHORELINE_PROJECTION_DRIFT:${index}`);
  }
  if(binding.readOnly!==true||binding.interactionIncluded!==false||binding.navigationMutationIncluded!==false)issues.push('BINDING_PRESENTATION_BOUNDARY_DRIFT');

  const checks=freeze([
    freeze({id:'V7_METADATA_FROZEN_READ_ONLY',ok:!issues.includes('V7_METADATA_NOT_FROZEN_READ_ONLY_SOURCE')}),
    freeze({id:'V7_TOPOLOGY_DIGEST_PRESERVED',ok:!issues.includes('V7_TOPOLOGY_DIGEST_DRIFT')}),
    freeze({id:'EXACT_74_STANDS',ok:!issues.includes('STAND_COUNT_NOT_74')&&!issues.includes('DUPLICATE_STAND_ID')}),
    freeze({id:'EXACT_818_CANONICAL_TREE_MEMBERSHIPS',ok:!issues.includes('CANONICAL_818_MEMBERSHIP_MISMATCH')&&!issues.includes('STAND_TREE_COUNT_MEMBERSHIP_MISMATCH')}),
    freeze({id:'CANONICAL_WORLD_TO_MAP_STAND_PROJECTION',ok:!issues.some(issue=>issue.startsWith('STAND_CENTROID_PROJECTION_DRIFT:')||issue.startsWith('STAND_BOUND_PROJECTION_DRIFT:'))}),
    freeze({id:'CANONICAL_SHORELINE_SOURCE_PROJECTION',ok:!issues.some(issue=>issue.startsWith('SHORELINE_'))}),
    freeze({id:'READ_ONLY_NONINTERACTIVE_NAVIGATION_NEUTRAL',ok:!issues.includes('BINDING_PRESENTATION_BOUNDARY_DRIFT')})
  ]);
  return freeze({
    schema:'MIRRORLAND_COAST_MAP_FOREST_STAND_BINDING_RECEIPT_v1',
    operationId:COAST_MAP_STAND_BINDING_CONTRACT.operationId,
    result:issues.length===0?'PASS':'FAIL',
    checkCount:checks.length,
    checks,
    topologyDigest:metadata.topologyDigest,
    standCount:binding.standCount,
    canonicalPopulationCount:binding.canonicalPopulationCount,
    shorelineSampleCount:binding.shoreline.sampleCount,
    issues:freeze(issues)
  });
}
